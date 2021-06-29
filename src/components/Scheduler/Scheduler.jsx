import React, { useState,useEffect} from 'react';
import {fb} from 'service';
import {useChat} from 'context';
import DateTimePicker from 'react-datetime-picker';
import {GithubPicker } from 'react-color';
import {Calendar,momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import * as emailjs from "emailjs-com";



const TeamScheduler=()=> {
  const { selectedChat, chatConfig } = useChat();
  const localizer = momentLocalizer(moment);
    const [startDate, onChangeStartDate] = useState(new Date());
    const [endDate, onChangeEndDate] = useState(new Date());
    const [title,setTitle] = useState("");
    
    const [isSubmit, setIsSubmit] = useState(false);

    const [myEvents,setMyEvents] = useState([]);
    const handleChangeTitle=(e) =>{
    setTitle(e.target.value);
  }
  
  const handleSubmit=(e)=>{
    e.preventDefault();
    fb.firestore.collection("chatRooms").doc(selectedChat.id.toString()).collection("events").doc(title).set({
        title : title,
        start: startDate,
        end: endDate
        
      });
      var admin;
      var members = [];
      setIsSubmit(!isSubmit);
      fb.firestore.collection("chatRooms").doc(selectedChat.id.toString()).get().then(doc =>{
            admin = doc.data()['admin'];
            members = doc.data()['members'];
            members.push(admin);
            console.log(members[0],members[1]);
            
        var email;
      fb.firestore.collection('chatUsers').get().then(querySnapshot => {
        if (!querySnapshot.empty){
         for(var j in members){
          for (var i in querySnapshot.docs) {
            const doc = querySnapshot.docs[i]
           
            if(doc.data()['userName'] == members[j]){
              
              email = doc.data()['email'];
              console.log(email);
               var data = {
      to_email:email,
    };
      var SERVICE_ID = "default_service";
      var TEMPLATE_ID = "template_pnp10o3";
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
    }
)
      
      })
      
      
       

      
  }
   useEffect(() => {
    
    const fetchEvents = async () => {
      const fileCollection = await fb.firestore.collection("chatRooms").doc(selectedChat.id.toString()).collection("events").get();
      setMyEvents(
        fileCollection.docs.map((doc) => {
          
          return {
            title:doc.data()['title'],
            start:doc.data()['start'].toDate(),
            end:doc.data()['end'].toDate()
          };
        })
      );
    };
    fetchEvents();
  }, [isSubmit]);

  return (
      <div>
        <form>
          <div className="date-picker">
              <label className="form-label">Title</label>
              <input type = "text" onChange={handleChangeTitle}></input>
          </div>
    <div className="date-picker">
        <label className="form-label">Start Date</label>
      <DateTimePicker className='picker'
        onChange={onChangeStartDate}
        value={startDate}
      />
      
    </div>
    <div className="date-picker">
        <label className="form-label">End Date</label>
      <DateTimePicker className='picker'
        onChange={onChangeEndDate}
        value={endDate}
      />
      
    </div>
    
    <button className="calender-event-create" onClick={handleSubmit}>Add Event</button>
    
    </form>
    <Calendar localizer={localizer}
      className="calendar-event"
      events={
        myEvents
      }
      step={60}
      view='week'
      views={['week']}
       min={new Date(2021, 0, 1, 9, 0)} // 8.00 AM
       max={new Date(2021, 0, 1, 23, 0)} // Max will be 6.00 PM!
      date={new Date()}
    />
    
    </div>
    );
  }


export default TeamScheduler;
