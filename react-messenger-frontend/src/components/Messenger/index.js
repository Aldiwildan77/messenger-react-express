import React, { useState, useEffect, useRef } from 'react';
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
// import Toolbar from '../Toolbar';
// import ToolbarButton from '../ToolbarButton';
import socket from '../../providers/socket-io';
import './Messenger.css';

import { MY_USER_ID } from '../../utils/constanta';

export default function Messenger(props) {
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState('');
  const [isOpened, setIsOpened] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [listMessages, setListMessages] = useState([]);
  const [messageSend, setMessageSend] = useState(false);

  useEffect(() => {
    const listMessageDataRequest = { where: { user_id: MY_USER_ID } };

    socket.emit('list-message', listMessageDataRequest);
    socket.on('list-message', data => setListMessages(data));

    return () => socket.disconnect();
  }, []);

  const loadGroupMessages = (group_id, name) => {
    const listMessageDataOfGroup = { where: { group_id } };
    socket.emit('list-message-of-group', listMessageDataOfGroup);
    setTitle(name);
    setCurrentGroupId(group_id);
    setIsOpened(true);
  };

  const handleKeyDown = (event, target) => {
    if (event.key === 'Enter') {
      const data = {
        sender_id: MY_USER_ID,
        group_id: currentGroupId,
        contents: target.value
      };

      target.value = '';
      socket.emit('add-new-message', data);
      socket.emit('list-message-of-group', { where: { group_id: currentGroupId } });

      setMessageSend(true);
    }
  };

  useEffect(() => {
    socket.on('list-message-of-group', data => setMessages(data));
    setMessageSend(false);
  }, [messageSend]);

  return (
    <div className="messenger">
      <div className="scrollable sidebar">
        <ConversationList listMessages={listMessages} loadData={loadGroupMessages} />
      </div>
      <div className="scrollable content">
        <MessageList messages={messages} title={title} sendMessage={handleKeyDown} isMessageOpened={isOpened} />
      </div>
    </div>
  );
}