import React from "react";
// import { useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import style from "./User.module.scss";
// import { logOutAuthSuccess } from "../../redux/auth/auth-actions";

function UserIsAdmin({ username, id, socket, isBanned, isOnline, isMuted }) {
  const onBannedUser = () => {
    // socket.emit("BAN_USER", ({ id }) => {
    //   console.log("user disconnected");
    // });
    console.log("ID", id);
    socket.emit("BAN_USER", { id, isBanned });

    // dispatch(logOutAuthSuccess());
  };

  const onMutedUser = () => {
    socket.emit("ON_MUTE", { id, isMuted });
  };

  return (
    <li className={style.userAdmin} data-id={id}>
      <span className={style.admin}>{username}</span>
      <Button
        size="sm"
        variant="danger"
        className={style.button}
        onClick={() => onBannedUser(id)}
      >
        {isBanned ? "Unban" : "Ban"}
      </Button>
      <Button
        size="sm"
        variant="warning"
        className={style.button}
        onClick={onMutedUser}
      >
        {isMuted ? "UnMute" : "Mute"}
      </Button>
      <span className={isOnline ? style.online : style.offline}>
        {isOnline ? "Online" : "Offline"}
      </span>
    </li>
  );
}

UserIsAdmin.defaultProps = {
  socket: {},
  isBanned: false,
  isMuted: false,
  isOnline: false,
};

UserIsAdmin.propTypes = {
  username: PropTypes.string.isRequired,
  socket: PropTypes.objectOf(PropTypes.any),
  isOnline: PropTypes.bool,
  id: PropTypes.string.isRequired,
  isBanned: PropTypes.bool,
  isMuted: PropTypes.bool,
};

export default UserIsAdmin;
