import { useChat } from 'context';
import { ChatAvatar } from 'components';
import { groupMessages } from 'helpers';
import { useScrollToBottom } from 'hooks';
import { Icon } from 'semantic-ui-react';
import AutoLinkText from 'react-autolink-text2';
import { editMessage, deleteMessage } from 'react-chat-engine'; 

export const MessageList = () => {
  const { selectedChat, chatConfig } = useChat();
  useScrollToBottom(selectedChat, 'chat-messages');
 
  const deleteMymessage = (individualMessage) => {
    console.log(individualMessage.text);
    console.log(individualMessage.id);
    deleteMessage(chatConfig, selectedChat.id, individualMessage.id);
 
  }

  return (
    <div className="chat-messages">
      {!!selectedChat.messages.length ? (
        groupMessages(selectedChat.messages).map((m, index) => (
          <div key={index} className="chat-message">
            <div className="chat-message-header">
              <ChatAvatar
                className="message-avatar"
                username={m[0].sender.username}
                chat={selectedChat}
              />
              <div className="message-author">{m[0].sender.username}</div>
            </div>

            <div className="message-content">
              {m.map((individualMessage, index) => (
                <div key={index}>
                  <div className="message-text">
                    <AutoLinkText text={individualMessage.text}/>
                    
                    </div>
                  { m[0].sender.username == chatConfig.userName ? (
                      <div onClick={() => deleteMymessage(individualMessage)} className="send-message-icon">
                        <Icon name="trash alternate" color="grey" />
                      </div>
                    ): (
                      <div></div>

                    )
                  }
                  

                  {!!individualMessage.attachments.length && (
                    <img
                      className="message-image"
                      src={individualMessage.attachments[0].file}
                      alt={individualMessage.id + '-attachment'}
                    />
                  )}
                  
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="no-messages-yet">No messages yet</div>
      )}
    </div>
  );
};