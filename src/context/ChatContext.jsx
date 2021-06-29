import firebase from 'firebase/app';
import { fb } from 'service';
import { createContext, useContext, useEffect, useState } from 'react';
import { newChat, leaveChat, deleteChat, getMessages } from 'react-chat-engine';

export const ChatContext = createContext();

export const ChatProvider = ({ children, authUser }) => {
  const [myChats, setMyChats] = useState();
  const [myMessages, setMyMessages] = useState();
  const [chatConfig, setChatConfig] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [isChatScreen, setIsChatScreen] = useState(false);
  const [isSchedulerScreen, setIsSchedulerScreen] = useState(false);

  const createChatClick = () => {
    newChat(chatConfig, { title: '' });
  };
  const deleteChatClick = chat => {
    const isAdmin = chat.admin.username === chatConfig.userName;

    if (
      isAdmin &&
      window.confirm('Are you sure you want to delete this chat?')
    ) {
      deleteChat(chatConfig, chat.id);
      fb.firestore.collection("chatRooms").doc(chat.id.toString()).delete();
    } else if (window.confirm('Are you sure you want to leave this chat?')) {
      leaveChat(chatConfig, chat.id, chatConfig.userName);
      fb.firestore.collection("chatRooms").doc(chat.id.toString()).update({
        members:firebase.firestore.FieldValue.arrayRemove(chatConfig.userName)
      })
    }
  };
  const selectChatClick = chat => {
    getMessages(chatConfig, chat.id, messages => {
      setSelectedChat({
        ...chat,
        messages,
      });
      setMyMessages(messages);
      setIsFileUpload(false);
      setIsChatScreen(false);
      setIsSchedulerScreen(false);
    });
  };

  // Set the chat config once the
  // authUser has initialized.
  useEffect(() => {
    if (authUser) {
      fb.firestore
        .collection('chatUsers')
        .doc(authUser.uid)
        .onSnapshot(snap => {
          setChatConfig({
            userSecret: authUser.uid,
            avatar: snap.data().avatar,
            userName: snap.data().userName,
            projectID: '63d55979-2477-473d-afd9-293120abf187',
          });
        });
    }
  }, [authUser, setChatConfig]);

  return (
    <ChatContext.Provider
      value={{
        myChats,
        setMyChats,
        myMessages,
        setMyMessages,
        chatConfig,
        selectedChat,
        setChatConfig,
        setSelectedChat,
        selectChatClick,
        deleteChatClick,
        createChatClick,
        isFileUpload,
        isChatScreen,
        isSchedulerScreen,
        setIsSchedulerScreen,
        setIsFileUpload,
        setIsChatScreen,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const {
    myChats,
    setMyChats,
    myMessages,
    setMyMessages,
    chatConfig,
    selectedChat,
    setChatConfig,
    setSelectedChat,
    selectChatClick,
    deleteChatClick,
    createChatClick,
    isFileUpload,
    isChatScreen,
    setIsFileUpload,
    setIsChatScreen,
    isSchedulerScreen,
    setIsSchedulerScreen,
  } = useContext(ChatContext);

  return {
    myChats,
    setMyChats,
    myMessages,
    setMyMessages,
    chatConfig,
    selectedChat,
    setChatConfig,
    setSelectedChat,
    selectChatClick,
    deleteChatClick,
    createChatClick,
    isFileUpload,
    isChatScreen,
    setIsFileUpload,
    setIsChatScreen,
    isSchedulerScreen,
    setIsSchedulerScreen,
    
  };
};