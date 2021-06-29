import { useChat } from 'context';
import { useDebounce } from 'hooks';
import { Search } from 'semantic-ui-react';
import { useEffect, useRef, useState } from 'react';
import { addPerson, getOtherPeople } from 'react-chat-engine';
import * as emailjs from "emailjs-com";
import firebase from 'firebase/app';
import { fb } from 'service';

export const SearchUsers = ({ visible, closeFn }) => {
  let searchRef = useRef();

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // null -> not searching for results
  // [] -> No results
  // [...] -> Results
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    if (visible && searchRef) {
      searchRef.focus();
    }
  }, [visible]);

  const {
    myChats,
    setMyChats,
    chatConfig,
    selectedChat,
    setSelectedChat,
  } = useChat();

  const selectUser = username => {
    addPerson(chatConfig, selectedChat.id, username, () => {
      const filteredChats = myChats.filter(c => c.id !== selectedChat.id);
      const updatedChat = {
        ...selectedChat,
        people: [...selectedChat.people, { person: { username } }],
        
      };
      
    


      setSelectedChat(updatedChat);
      setMyChats([...filteredChats, updatedChat]);

       fb.firestore
      .collection("chatRooms")
      .doc(selectedChat.id.toString())
      .set({admin:chatConfig.userName,members:firebase.firestore.FieldValue.arrayUnion(username)},{merge:true})
   
      
      var email;
      fb.firestore.collection('chatUsers').get().then(querySnapshot => {
        if (!querySnapshot.empty) {
          for (var i in querySnapshot.docs) {
            const doc = querySnapshot.docs[i]
            console.log(doc.id);
            if(doc.data()['userName'] === username){
              
              email = doc.data()['email'];
               var data = {
      to_email:email,
    };
      var SERVICE_ID = "default_service";
      var TEMPLATE_ID = "template_9vgu1ll";
      var USER_ID = "user_idltYjGCryh1sQulGJhOH";
    emailjs.send(SERVICE_ID, TEMPLATE_ID, data, USER_ID).then(
      function (response) {
        console.log(response.status, response.text);
      },
      function (err) {
        console.log(err);
      }
    );
              
            }
          }
        }
    }
)

closeFn();
    });
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true);
      getOtherPeople(chatConfig, selectedChat.id, (chatId, data) => {
        const userNames = Object.keys(data)
          .map(key => data[key].username)
          .filter(u =>
            u.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
          );
        setSearchResults(userNames.map(u => ({ title: u })));
        setLoading(false);
      });
    } else {
      setSearchResults(null);
    }
  }, [debouncedSearchTerm, chatConfig, selectedChat]);

  return (
    <div
      className="user-search"
      style={{ display: visible ? 'block' : 'none' }}
    >
      <Search
        fluid
        onBlur={closeFn}
        loading={loading}
        value={searchTerm}
        placeholder="Search For Users"
        open={!!searchResults && !loading}
        input={{ ref: r => (searchRef = r) }}
        onSearchChange={e => setSearchTerm(e.target.value)}
        results={searchResults}
        onResultSelect={(e, data) => {
          if (data.result?.title) {
      
            selectUser(data.result.title);
          }
        }}
      />
    </div>
  );
};