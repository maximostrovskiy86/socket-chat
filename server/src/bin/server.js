import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "../app.js";
import { connectMongo } from "../db/connection.js";
import {
  changeUserById,
  getAllUsersController,
} from "../controllers/authController.js";

import {
  createMessage,
  getMessages,
  getLastMessage,
} from "../services/authService.js";
import { decodeJwt } from "../helpers/decodeJwt.js";
import User from "../model/userModel.js";

const server = http.createServer(app);

// eslint-disable-next-line import/prefer-default-export
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

dotenv.config();
const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectMongo();
    server.listen(PORT, () => console.log(`start server on ${PORT}`));

    io.use(async (socket, next) => {
      const verifyToken = socket.handshake.auth.token;

      if (!verifyToken) {
        socket.disconnect();
      }

      const user = decodeJwt(verifyToken);

      if (!user || user.isBanned) {
        socket.disconnect(true);
        return;
      }

      // get user from db by id and test for ban status
      const sockets = await io.fetchSockets();
      const exists = sockets.find((s) => s.user.id === user.id);

      if (exists) {
        exists.disconnect();
      }

      // await changeUserById(user.id, { isOnline: true });
      socket.user = user;
      next();
    });

    io.on("connection", async (socket) => {
      console.log("a user connected");

      const sockets = await io.fetchSockets();

      const usersOnline = sockets.map(
        (elem) =>
          // console.log("elem.user", elem.user);
          elem.user
      );

      const allUsers = await getAllUsersController(usersOnline);

      sockets.map((socket) => {
        if (socket.user.isAdmin) {
          socket.emit("GET_ALL_USERS", allUsers);
        }
      });

      io.emit("GET_ONLINE_USERS", usersOnline);

      socket.emit("GET_MESSAGES", await getMessages());

      socket.on("CHAT_MESSAGE", async (message) => {
        const { isMuted } = await User.findById(socket.user.id);

        const last = await getLastMessage(message.username);

        const dateNow = new Date().getTime();
        const timeLastMessage = last
          ? last.createdAt.getTime()
          : new Date("1970-01-11").getTime();
        const isSuccessMessage = dateNow - timeLastMessage;

        if (
          isMuted ||
          isSuccessMessage < 5000 ||
          message.message.trim() > 200
        ) {
          return false;
        }

        const newMsg = await createMessage(message);

        io.emit("CHAT_UPDATE", { message: newMsg });
      });
      console.log("socket.user.isAdmin", socket.user.isAdmin);

      // if (socket.user.isAdmin) {
      socket.on("BAN_USER", async ({ id, isBanned }) => {
        const sock = await io.fetchSockets();
        const exists = sock.find((s) => s.user.id === id);

        if (exists) {
          exists.disconnect();
        }

        // const s = await io.fetchSockets();
        // const uOn = s.map(
        //   (elem) =>
        //     // console.log("elem.user", elem.user);
        //     elem.user
        // );

        await changeUserById(id, { isBanned: !isBanned });
        try {
          const users = await getAllUsersController(usersOnline);
          socket.emit("GET_ALL_USERS", users);
        } catch (e) {
          socket.emit("GET_ALL_USERS_ERROR", e.message);
        }
        // socket.emit("GET_ALL_USERS", await getAllUsersController(usersOnline));
      });

      socket.on("ON_MUTE", async ({ id, isMuted }) => {
        const user = await changeUserById(id, { isMuted: !isMuted });
        const s = await io.fetchSockets();
        const uOn = s.map(
          (elem) =>
            // console.log("elem.user", elem.user);
            elem.user
        );
        socket.emit("GET_ALL_USERS", await getAllUsersController(uOn));

        const sock = await io.fetchSockets();
        const exists = sock.find((s) => s.user.id === id);

        if (exists) {
          console.log("USER_UPDATE", user);
          exists.emit("USER_UPDATE", user);
        }
      });
      // }

      socket.on("disconnect", async () => {
        const socks = await io.fetchSockets();
        const uOnline = socks.map(
          (elem) =>
            // console.log("elem.user", elem.user);
            elem.user
        );

        // await changeUserById(socket.user.id, { isOnline: false });

        // send all list for admins
        io.emit("GET_ALL_USERS", await getAllUsersController(uOnline));

        io.emit(
          "GET_ONLINE_USERS",
          socks.map((s) => s.user)
        );
      });
    });
  } catch (error) {
    console.log(error);
  }
};

start();
