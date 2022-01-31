import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { io, Socket } from "socket.io-client";
// import { useSelector, useDispatch } from "react-redux";
import { useAppSelector, useAppDispatch } from "../../hooks/Hooks";
import style from "./ChatPage.module.scss";
import Section from "../../components/section/Section";
import SideBar from "../../components/sideBar/SideBar";
import ChatForm from "../../components/ChatForm/ChatForm";
import { authSelector } from "../../redux/auth";
import {
  logOutAuthSuccess,
  updateUserSuccess,
} from "../../redux/auth/auth-actions";

export interface TAllUsers {
  createdAt: string;
  isAdmin: boolean;
  isBanned: boolean;
  isMuted: boolean;
  isOnline: boolean;
  updatedAt: string;
  username: string;
  _id: string;
  id: string;
}

interface TUpdateUser {
  createdAt: string;
  isAdmin: boolean;
  isBanned: boolean;
  isMuted: boolean;
  username: string;
  _id: string;
}

interface Message {
  _id: string;
  name: string;
  message: string;
  time: string;
  username: string;
  createdAt: string;
}

function ChatPage() {
  // const dispatch = useDispatch();
  const dispatch = useAppDispatch();
  const token = useAppSelector(authSelector.isAuth);
  const userName = useAppSelector(authSelector.userName);

  const [usersOnline, setUsersOnline] = useState<TAllUsers[]>([]);
  const [allUsers, setAllUsers] = useState<TAllUsers[]>([]);
  const [socket, setSocket] = useState<Socket | null | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [msg, setMsg] = useState("");

  function getUserNameFromStorage() {
    const saveSettings: string | null = localStorage.getItem("persist:auth");
    return saveSettings ? JSON.parse(saveSettings)?.username : "";
  }

  useEffect(() => {
    setSocket(
      io("http://localhost:5000", {
        auth: {
          token,
        },
      })
    );

    return () => {
      // io.disconnect();
      socket?.disconnect();
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    if (token && socket) {
      socket.on("CHAT_UPDATE", ({ message }) => {
        setMessages((prev) => [...prev, message]);
      });

      socket.on("GET_ONLINE_USERS", (data) => {
        setUsersOnline(data);
      });

      socket.on("GET_ALL_USERS", (data) => {
        setAllUsers(data);
      });

      socket.on("USER_UPDATE", (user: TUpdateUser) => {
        console.log("USER,", user);
        // @ts-ignore
        dispatch(updateUserSuccess(user));
      });

      socket.on("GET_MESSAGES", (msgs) => {
        setMessages(msgs);
      });

      socket.on("disconnect", () => {
        console.log("user disconnected");
        dispatch(logOutAuthSuccess());
      });
    }

    return () => {
      socket?.off("CHAT_UPDATE");
      socket?.off("GET_ONLINE_USERS");
      socket?.off("GET_ALL_USERS");
    };
  }, [socket]);

  const onChange = (value: string) => {
    setMsg(value);
  };

  const onSubmit = () => {
    // e.preventDefault();
    if (msg) {
      socket?.emit("CHAT_MESSAGE", {
        message: msg.trim(),
        username: userName,
      });

      setMsg("");
    }
  };

  // useEffect(() => {
  //   if (isLogged === false) {
  //     return;
  //   }
  //   dispatch(authOperations.verify(isAuth));
  // }, [isLogged, dispatch]);

  if (!socket) {
    return <></>;
  }

  return (
    <div className={style.chat}>
      <h3 style={{ textAlign: "center" }}>
        Welcome {getUserNameFromStorage()}
      </h3>
      <Row className={style.rowBox}>
        <Col sm={8}>
          <Section title="">
            <ChatForm
              messages={messages}
              onSubmit={onSubmit}
              onChange={onChange}
              msg={msg}
            />
          </Section>
        </Col>
        <Col sm={4}>
          <Section title="">
            <SideBar
              socket={socket}
              usersOnline={usersOnline}
              allUsers={allUsers}
            />
          </Section>
        </Col>
      </Row>
    </div>
  );
}

export default ChatPage;
