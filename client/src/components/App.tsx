import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import style from "./App.module.scss";
import { authSelector } from "../redux/auth";
import LoginPage from "../pages/loginPage/LoginPage";
import ChatPage from "../pages/chatPage/ChatPage";

function App() {
  const isAuth = useSelector(authSelector.isAuth);

  return (
    <Container className={style.container}>
      {!isAuth ? <LoginPage /> : <ChatPage />}
    </Container>
  );
}

export default App;
