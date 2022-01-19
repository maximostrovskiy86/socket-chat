import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import style from "./SideBar.module.scss";
import { logOutAuthSuccess } from "../../redux/auth/auth-actions";
import { authSelector } from "../../redux/auth";
import LogOut from "../iconSvgComponents/logOutButton/LogOut";
import User from "../user/User";
import UserIsAdmin from "../user/UserIsAdmin";

function SideBar({ usersOnline, socket, allUsers }) {
  const dispatch = useDispatch();
  const isAdmin = useSelector(authSelector.isAdmin);

  const logOut = () => {
    socket.disconnect();
    // socket.emit("LOG_OUT");
    dispatch(logOutAuthSuccess());
  };

  // console.log("usersOnline", usersOnline);
  console.log("allUsers", allUsers);
  return (
    <div className={style.sideBar}>
      <Button className={style.logOut} variant="warning" onClick={logOut}>
        <LogOut />
      </Button>
      {isAdmin ? (
        <ul className={style.listUsers}>
          {allUsers &&
            allUsers.map(({ _id, username, isBanned, isOnline, isMuted }) => (
              <UserIsAdmin
                key={_id}
                username={username}
                socket={socket}
                id={_id}
                isBanned={isBanned}
                isOnline={isOnline}
                isMuted={isMuted}
              />
            ))}
        </ul>
      ) : (
        <ul className={style.listUsers}>
          {usersOnline &&
            usersOnline.map((user) => (
              <User key={user.id} username={user.username} />
            ))}
        </ul>
      )}
    </div>
  );
}

SideBar.defaultProps = {
  socket: {},
  allUsers: [],
  usersOnline: [],
};

SideBar.propTypes = {
  usersOnline: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    }).isRequired
  ),
  socket: PropTypes.objectOf(PropTypes.any),
  allUsers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    }).isRequired
  ),
};

export default SideBar;
