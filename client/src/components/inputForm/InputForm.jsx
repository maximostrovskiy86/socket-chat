import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Button, Form } from "react-bootstrap";
// import shortid from "shortid";
import { io } from "socket.io-client";
import style from "./InputForm.module.scss";
import {
  logOutAuthSuccess,
  updateUserSuccess,
} from "../../redux/auth/auth-actions";
import { authSelector } from "../../redux/auth";

function InputForm({ setUsers, setSocket, setAllUsers, socket }) {
  const dispatch = useDispatch();
  const token = useSelector(authSelector.isAuth);
  const userName = useSelector(authSelector.userName);
  const isMute = useSelector(authSelector.isMuted);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setSocket(
      io.connect("http://localhost:5000", {
        auth: {
          token,
        },
      })
    );

    return () => {
      io.disconnect();
      setSocket(null);
    };
  }, []);

  useEffect(async () => {
    if (token && socket) {
      socket.on("CHAT_UPDATE", ({ message }) => {
        setMessages((prev) => [...prev, message]);
      });

      socket.on("GET_ONLINE_USERS", (data) => {
        setUsers(data);
      });

      socket.on("GET_ALL_USERS", (data) => {
        console.log("GET_ALL_USERS", data);
        setAllUsers(data);
      });

      socket.on("USER_UPDATE", (user) => {
        dispatch(updateUserSuccess(user));
      });

      socket.on("GET_MESSAGES", (msgs) => {
        setMessages(msgs);
        // dispatch(updateUserSuccess(user));
      });

      socket.on("disconnect", () => {
        console.log("user disconnected");
        dispatch(logOutAuthSuccess());
      });
    }

    return () => {
      socket.off("CHAT_UPDATE");
      socket.off("GET_ONLINE_USERS");
      socket.off("GET_ALL_USERS");
    };
  }, [socket, setAllUsers]);

  const handleChange = ({ target: { value } }) => {
    setMsg(value);
  };

  const onHandleSubmit = (e) => {
    e.preventDefault();
    if (msg) {
      socket.emit("CHAT_MESSAGE", {
        message: msg.trim(),
        username: userName,
      });
      setMsg("");
    }
  };
  return (
    <div className={style.main}>
      <ul className={style.listMessage}>
        {messages &&
          messages.map((mess) => (
            // eslint-disable-next-line no-underscore-dangle
            <li className={style.messageBox} key={mess._id}>
              <span className={style.name}>{mess.name || mess.username}</span>
              <span className={style.message}>{mess.message}</span>
              <span className={style.time}>{mess.time || mess.createdAt}</span>
            </li>
          ))}
      </ul>
      <Form className={style.formMessage} onSubmit={onHandleSubmit}>
        <Form.Group className={style.inputMessage} controlId="formBasicEmail">
          <Form.Label>Message</Form.Label>
          <Form.Control
            type="text"
            placeholder="Type message..."
            onChange={handleChange}
            value={msg}
            pattern="[0-9a-zA-Z!@#$%^&*~'`]{1,200}"
          />
        </Form.Group>
        <Button
          className={style.buttonMessage}
          variant="primary"
          type="submit"
          disabled={isMute}
        >
          Send
        </Button>
      </Form>
    </div>
  );
}

InputForm.defaultProps = {
  socket: {},
};

InputForm.propTypes = {
  setUsers: PropTypes.func.isRequired,
  setSocket: PropTypes.func.isRequired,
  setAllUsers: PropTypes.func.isRequired,
  socket: PropTypes.objectOf(PropTypes.any),
};

export default InputForm;
