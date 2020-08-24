import React from 'react';
import moment from 'moment';
import './Message.css';

export default function Message(props) {
  const {
    data,
    isMine,
    startsSequence,
    endsSequence,
    showTimestamp
  } = props;

  const friendlyTimestamp = moment(data.sent_at).format('LLLL');
  return (
    <div className={[
      'message',
      `${isMine ? 'mine' : ''}`,
      `${startsSequence ? 'start' : ''}`,
      `${endsSequence ? 'end' : ''}`
    ].join(' ')}>
      {
        showTimestamp &&
        <div className="timestamp">
          {friendlyTimestamp}
        </div>
      }

      <div className="bubble-container">
        <div className="bubble" title={friendlyTimestamp} data-message-id={data.id}>
          <h4 style={{ margin: '0px 0px 15px 0px', fontWeight: 'bold' }}>{data.sender_name}</h4>
          {data.contents}
        </div>
      </div>
    </div>
  );
}