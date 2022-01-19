import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { authOperations } from "../../redux/auth";
import style from "./LoginForm.module.scss";

function LoginForm({ setName, setPass }) {
  const dispatch = useDispatch();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // eslint-disable-next-line consistent-return
  const handleChange = ({ target: { name, value } }) => {
    switch (name) {
      case "username":
        setName(value);
        return setUserName(value);
      case "password":
        setPass(value);
        return setPassword(value);
      default:
    }
  };

  const resetForm = () => {
    setUserName("");
    setPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(authOperations.authLogin({ username, password }));
    resetForm();

    // socket.emit("GET_ALL_USERS_FROM_LOGIN", (data) => {
    //     console.log("GET_ALL_USERS_FROM_LOGIN", data);
    //     setAllUsers(data);
    // });
    // setAllUsers(allUsers);
  };

  return (
    <div className={style.formWrapper}>
      <form className={style.form} onSubmit={handleSubmit} autoComplete="off">
        <label className={style.formLabel} htmlFor="username">
          <input
            id="username"
            type="username"
            name="username"
            value={username}
            onChange={handleChange}
            // pattern="[a-zA-Z]"
            title="Имя может состоять из цифр, букв латинского алфавита и спецсимволов @ $ &"
            required
            placeholder="Логин *"
            className={style.field}
          />
        </label>

        <label className={style.formLabel} htmlFor="password">
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            pattern="[0-9a-zA-Z!@#$%^&*]{6,}"
            title="Пароль должен состоять минимум из 7 символов, может состоять из цифр, букв латинского алфавита и спецсимволов ! @ # $ % ^ & *"
            required
            placeholder="Пароль *"
            className={style.field}
          />
        </label>

        <div className={style.buttonBlock}>
          <Button className={style.button} type="submit">
            LOG IN
          </Button>
        </div>
      </form>
    </div>
  );
}

// LoginForm.defaultProps = {
//     socket: {},
// };

LoginForm.propTypes = {
  setName: PropTypes.func.isRequired,
  setPass: PropTypes.func.isRequired,
  // setAllUsers: PropTypes.func.isRequired,
  // allUsers: PropTypes.arrayOf.isRequired,
  // socket: PropTypes.func,
};

export default LoginForm;
