import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import Message from "../model/messageModel.js";

const getToken = (candidate) =>
  jwt.sign(
    {
      // eslint-disable-next-line no-underscore-dangle
      username: candidate.username,
      id: candidate.id,
      createdAt: candidate.createdAt,
      isBanned: candidate.isBanned,
      isMuted: candidate.isMuted,
      isAdmin: candidate.isAdmin,
    },
    process.env.SECRET_KEY
  );

export const login = async (username, password) => {
  try {
    let candidate = await User.findOne({ username }).select("+password");

    if (!candidate) {
      const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      const isAdmin = await User.count();

      // console.log("isAdmin", isAdmin);

      // if (!isAdmin) {
      //   candidate = await User.create({
      //     username,
      //     password: hashPassword,
      //     isAdmin: true,
      //     isOnline: true,
      //   });
      // } else {
      candidate = await User.create({
        username,
        password: hashPassword,
        isOnline: true,
        isAdmin: !isAdmin,
        isBanned: false,
        isMuted: false,
      });

      return { user: candidate, token: getToken(candidate) };
      // }
    }

    if (candidate.isBanned) {
      console.log("USER isBanned");
      return false;
    }

    if (!(await bcrypt.compare(password, candidate.password))) {
      return false;
    }

    // const token = jwt.sign(
    //   {
    //     // eslint-disable-next-line no-underscore-dangle
    //     username: candidate.username,
    //     id: candidate._id,
    //     createdAt: candidate.createdAt,
    //     isBanned: candidate.isBanned,
    //     isMuted: candidate.isMuted,
    //   },
    //   process.env.SECRET_KEY
    // );
    const token = getToken(candidate);

    if (!candidate.isOnline) {
      candidate = await User.findByIdAndUpdate(
        candidate._id,
        { isOnline: true },
        {
          new: true,
        }
      );
      // candidate.isOnline = true;
    }

    return { user: candidate, token };
  } catch (e) {
    // console.log(e);
    // res.status(400).json({ message: "Login error" });
    console.log(e.message);
  }
};

export const updateUser = async ({ _id: id }, data) => {
  try {
    // const data = {isBanned: ! isBanned}
    // console.log("DATA", data);
    // const user = await User.findOneAndUpdate({ _id: id }, { $set: data });

    const user = await User.findByIdAndUpdate(id, data, {
      new: true,
    });

    // console.log("USER_UPADE", user);
    return user;
  } catch (e) {
    res.status(400).json({ message: "Error user update" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return users;
  } catch (e) {
    res.status(400).json({ message: "Error" });
  }
};

export const createMessage = async (message) => {
  try {
    const msg = await Message.create({
      username: message.username,
      message: message.message,
    });
    return msg;
  } catch (e) {
    console.log(e.message);
  }
};

export const getMessages = () => {
  try {
    return Message.find().limit(20);
  } catch (e) {
    console.log(e.message);
  }
};

export const getLastMessage = async (username) => {
  // console.log("username!!!!!", username);
  try {
    const lastMessage = await Message.findOne({ username }).sort({
      createdAt: -1,
    });
    // const lastMessage = await Message.find({ username });
    // console.log("LAST_MESSAGE", lastMessage);
    return lastMessage;
  } catch (e) {
    console.log(e.message);
  }
};
