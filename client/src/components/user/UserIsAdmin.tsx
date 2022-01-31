import React from "react";
import { Button } from "react-bootstrap";
import style from "./User.module.scss";

interface Props {
  username: string;
  id: string;
  isBanned: boolean;
  isOnline: boolean;
  isMuted: boolean;
  onBannedUser: (id: string, isBanned: boolean) => void;
  onMutedUser: (id: string, isMuted: boolean) => void;
}

function UserIsAdmin({
  username,
  id,
  isBanned,
  isOnline,
  isMuted,
  onBannedUser,
  onMutedUser,
}: Props) {
  return (
    <li className={style.userAdmin} data-id={id}>
      <span className={style.admin}>{username}</span>
      <Button
        size="sm"
        variant="danger"
        className={style.button}
        onClick={() => onBannedUser(id, isBanned)}
      >
        {isBanned ? "Unban" : "Ban"}
      </Button>
      <Button
        size="sm"
        variant="warning"
        className={style.button}
        onClick={() => onMutedUser(id, isMuted)}
      >
        {isMuted ? "UnMute" : "Mute"}
      </Button>
      <span className={isOnline ? style.online : style.offline}>
        {isOnline ? "Online" : "Offline"}
      </span>
    </li>
  );
}

export default UserIsAdmin;
