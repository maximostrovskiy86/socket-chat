import React from "react";
import PropTypes from "prop-types";
import style from "./User.module.scss";

function User({ username }) {
  return <li className={style.user}>{username}</li>;
}

User.propTypes = {
  username: PropTypes.string.isRequired,
};
export default User;
