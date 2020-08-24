import React, { useRef } from 'react';
import './Compose.css';

export default function Compose(props) {
  var textInput = useRef(null);
  const onClickSendMessage = (e) => props.sendMessage(e, textInput);

  return (
    <div className="compose">
      {props.isMessageOpened && <input
        ref={el => textInput = el}
        type="text"
        className="compose-input"
        placeholder="Type a message.."
        onKeyDown={onClickSendMessage}
      />}
    </div>
  );
}