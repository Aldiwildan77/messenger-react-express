import React, { useEffect } from 'react';
import shave from 'shave';

import './ConversationListItem.css';

export default function ConversationListItem(props) {
  useEffect(() => shave('.conversation-snippet', 20));

  const { group_id, name, contents } = props.data;

  return (
    <div className="conversation-list-item" onClick={() => props.loadData(group_id, name)}>
      <img className="conversation-photo" src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png' alt="" />
      <div className="conversation-info">
        <h1 className="conversation-title">{name}</h1>
        <p className="conversation-snippet">{contents}</p>
      </div>
    </div>
  );
}