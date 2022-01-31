import React from "react";
import LoginForm from "../../components/loginForm/LoginForm";
import style from "./LoginPage.module.scss";

function LoginPage() {
  return (
    <div className={style.formWrapper}>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
