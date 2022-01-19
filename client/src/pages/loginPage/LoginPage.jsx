import React from "react";
import PropTypes from "prop-types";
import LoginForm from "../../components/loginForm/LoginForm";

function LoginPage({ setPassword, setUserName }) {
  return <LoginForm setName={setUserName} setPass={setPassword} />;
}

LoginPage.propTypes = {
  setPassword: PropTypes.func.isRequired,
  setUserName: PropTypes.func.isRequired,
};

export default LoginPage;
