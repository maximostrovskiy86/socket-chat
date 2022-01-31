import React, { FormEvent, useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import { authOperations } from "../../redux/auth";
import style from "./LoginForm.module.scss";

interface Test {
  value: string;
  name: string;
  id: string;
}

function LoginForm() {
  const dispatch = useDispatch();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    // const { name, value, id } = target as Test;
    const { name, value }: Test = target;
    switch (name) {
      case "username":
        return setUserName(value);
      case "password":
        return setPassword(value);
      default:
    }
  };

  const resetForm = () => {
    setUserName("");
    setPassword("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(authOperations.authLogin({ username, password }));
    resetForm();
  };

  return (
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
  );
}

export default LoginForm;
