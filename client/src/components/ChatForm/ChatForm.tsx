import React, { ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import style from "./ChatForm.module.scss";
import { authSelector } from "../../redux/auth";

type Option = {
  _id: string;
  name: string;
  message: string;
  time: string;
  username: string;
  createdAt: string;
};

interface Props {
  messages: Option[];
  msg: string;
  onSubmit: () => void;
  onChange: (value: string) => void;
}

function ChatForm({ messages, onSubmit, onChange, msg }: Props) {
  // function ChatForm({ messages, msg }: Props) {
  const isMute = useSelector(authSelector.isMuted);
  const scrollRef = useRef(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  const handleOnchange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    onChange(e.target.value);
  };

  useEffect(() => {
    // @ts-ignore
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <div className={style.main}>
      <ul className={style.listMessage}>
        {messages &&
          messages.map((mess) => (
            // eslint-disable-next-line no-underscore-dangle
            <li className={style.messageBox} key={mess._id}>
              <span className={style.name}>{mess.name || mess.username}</span>
              <span className={style.message}>{mess.message}</span>
              <span className={style.time}>{mess.time || mess.createdAt}</span>
            </li>
          ))}
        <li className="scroll" ref={scrollRef}>
          &nbsp;
        </li>
      </ul>
      <Form className={style.formMessage} onSubmit={handleSubmit}>
        <Form.Group className={style.inputMessage} controlId="formBasicEmail">
          <Form.Label>Message</Form.Label>
          <Form.Control
            type="text"
            placeholder="Type message..."
            onChange={handleOnchange}
            value={msg}
            // pattern="[0-9a-zA-Z!@#$%^&*~'`]{1,200}"
          />
        </Form.Group>
        <Button
          className={style.buttonMessage}
          variant="primary"
          type="submit"
          disabled={isMute}
        >
          Send
        </Button>
      </Form>
    </div>
  );
}

export default ChatForm;
