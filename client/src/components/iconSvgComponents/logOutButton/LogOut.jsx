import React from "react";
import style from "./LogOut.module.scss";

const LogOut = function () {
  return (
    <svg
      className={style.logOutButton}
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 32 32"
      aria-labelledby="title"
    >
      <title id="icon-exit">DeleteButton</title>
      <path d="M24 20v-4h-10v-4h10v-4l6 6zM22 18v8h-10v6l-12-6v-26h22v10h-2v-8h-16l8 4v18h8v-6z" />
    </svg>
  );
};

export default LogOut;
