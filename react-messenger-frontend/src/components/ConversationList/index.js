import React from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';

import './ConversationList.css';

export default function ConversationList(props) {
  return (
    <div className="conversation-list">
      <Toolbar
        title="Messenger"
        leftItems={[<ToolbarButton key="cog" icon="ion-ios-cog" />]}
        rightItems={[<ToolbarButton key="add" icon="ion-ios-add-circle-outline" />]}
      />
      <ConversationSearch />
      {
        props.listMessages.map(conversation =>
          <ConversationListItem
            key={conversation.group_id}
            data={conversation}
            loadData={props.loadData}
          />
        )
      }
    </div>
  );
}