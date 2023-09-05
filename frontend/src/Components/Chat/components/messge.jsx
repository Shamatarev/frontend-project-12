/* eslint-disable react/prop-types */

import React, { useState, useContext, useEffect } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import { BsSend } from "react-icons/bs";
import { socket } from "../../../contexts/ProvideAPI";
import _ from "lodash";
import AuthContext from "../../../contexts/index";
import { useTranslation } from "react-i18next";
import LeoProfanity from "leo-profanity";

const MessageForm = ({ channelId }) => {
  const [message, setMessage] = useState("");
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const uniqueId = _.uniqueId();
  const { saveUserData } = useContext(AuthContext);
  const { t } = useTranslation();

  const sendMessage = () => {
    if (message.trim() === "") {
      return;
    }
      const profanityFilter = LeoProfanity;
      profanityFilter.loadDictionary("ru");
      const censoredMessage = profanityFilter.clean(message);
      const newMessage = {
        id: uniqueId,
        channelId,
        user: saveUserData.username,
        timestamp: new Date().toISOString(),
        message: censoredMessage,
      };
      socket.emit("newMessage", newMessage, (acknowledgement) => {
        console.log("Сообщение отправлено:", acknowledgement);
      });
      setMessage("");
    
  };

  const handleSendButtonClick = () => {
    sendMessage();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Control") {
        setCtrlPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Control") {
        setCtrlPressed(false);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === "Enter" && ctrlPressed) {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
        sendMessage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [ctrlPressed]);

  return (
    <InputGroup className="mb-3">
      <Form.Control
        placeholder={t("messageFormPlaceholder")}
        aria-label="Recipient's username"
        aria-describedby="basic-addon2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button variant="outline-secondary" id="button-addon2" onClick={handleSendButtonClick}>
        <BsSend />
      </Button>
    </InputGroup>
  );
};

export default MessageForm;
