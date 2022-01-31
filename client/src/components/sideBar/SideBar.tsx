import React from "react";
// import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import style from "./SideBar.module.scss";
import { Socket, io } from "socket.io-client";
import { logOutAuthSuccess } from "../../redux/auth/auth-actions";
import { authSelector } from "../../redux/auth";
import LogOut from "../iconSvgComponents/logOutButton/LogOut";
import User from "../user/User";
import UserIsAdmin from "../user/UserIsAdmin";
import { TAllUsers } from "../../pages/chatPage/ChatPage";

interface Props {
  usersOnline: TAllUsers[];
  allUsers: TAllUsers[];
  socket: Socket;
}

function SideBar({ usersOnline, socket, allUsers }: Props) {
  const dispatch = useDispatch();
  const isAdmin = useSelector(authSelector.isAdmin);

  const logOut = () => {
    socket.disconnect();
    dispatch(logOutAuthSuccess());
  };

  const onBannedUser = (id: string, isBanned: boolean) => {
    socket.emit("BAN_USER", { id, isBanned });
  };

  const onMutedUser = (id: string, isMuted: boolean) => {
    socket.emit("ON_MUTE", { id, isMuted });
  };

  return (
    <div className={style.sideBar}>
      <Button className={style.logOut} variant="warning" onClick={logOut}>
        <LogOut />
      </Button>
      {isAdmin ? (
        <ul className={style.listUsers}>
          {allUsers &&
            // allUsers.map(({ _id, username, isBanned, isOnline, isMuted }) => (
            allUsers.map((user) => (
              <UserIsAdmin
                /* eslint-disable-next-line no-underscore-dangle */
                key={user._id}
                username={user.username}
                /* eslint-disable-next-line no-underscore-dangle */
                id={user._id}
                isBanned={user.isBanned}
                isOnline={user.isOnline}
                isMuted={user.isMuted}
                onBannedUser={onBannedUser}
                onMutedUser={onMutedUser}
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

export default SideBar;
