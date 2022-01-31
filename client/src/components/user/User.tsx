import React from "react";
import style from "./User.module.scss";

interface Props {
  username: string;
}

function User({ username }: Props) {
  return <li className={style.user}>{username}</li>;
}

export default User;
