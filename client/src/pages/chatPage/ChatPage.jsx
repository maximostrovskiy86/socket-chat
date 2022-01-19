import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
// import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import style from "./ChatPage.module.scss";
import Section from "../../components/section/Section";
import SideBar from "../../components/sideBar/SideBar";
import InputForm from "../../components/inputForm/InputForm";

function ChatPage({ username }) {
  // const isAuth = useSelector(authSelector.isAuth);
  // const isLogged = useSelector(authSelector.isLoggedIn);
  // const dispatch = useDispatch();
  const [usersOnline, setUsersOnline] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  function getUserNameFromStorage() {
    const saveSettings = localStorage.getItem("persist:auth");
    const { user } = JSON.parse(saveSettings);
    return JSON.parse(user)?.username;
  }

  // useEffect(() => {
  //   if (isLogged === false) {
  //     return;
  //   }
  //   dispatch(authOperations.verify(isAuth));
  // }, [isLogged, dispatch]);

  return (
    <div className={style.chat}>
      <h3 style={{ textAlign: "center" }}>
        Welcome {username || getUserNameFromStorage()}
      </h3>
      <Row className={style.rowBox}>
        <Col sm={8}>
          <Section title="">
            <InputForm
              setSocket={setSocket}
              socket={socket}
              setUsers={setUsersOnline}
              username={username}
              setAllUsers={setAllUsers}
            />
          </Section>
        </Col>
        <Col sm={4}>
          <Section title="">
            <SideBar
              socket={socket}
              usersOnline={usersOnline}
              allUsers={allUsers}
            />
          </Section>
        </Col>
      </Row>
    </div>
  );
}

ChatPage.propTypes = {
  username: PropTypes.string.isRequired,
};

export default ChatPage;
