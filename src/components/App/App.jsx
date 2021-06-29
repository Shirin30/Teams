import { useEffect,useState } from 'react';
import { ChatProvider } from 'context';
import 'semantic-ui-css/semantic.min.css';
import 'react-calendar/dist/Calendar.css';
import { useAuth, useResolved } from 'hooks';
import { Login, Signup, Chat } from 'components';
import { Switch, Route, useHistory } from 'react-router-dom';
import VideoCallPage from 'components/VideoCallPage/VideoCallPage';
import 'react-big-calendar/lib/css/react-big-calendar.css';




export const App = () => {
  const history = useHistory();
  const { authUser } = useAuth();
  const authResolved = useResolved(authUser);

  // If the user is logged in it will prevent the
  // user from seeing the login/signup screens
  // by always redirecting to chat on auth change.

 
  const unique_id = window.location.pathname;
  console.log(window.location.pathname)
  useEffect(() => {
    if (authResolved) {
      if(authUser){
        if(window.location.pathname === '/login'){
          history.push('/');
        }else{history.push(`${unique_id}`);}
        
      }else{
        history.push('/login');
      }
    }
  }, [authResolved, authUser, history]);

  return authResolved ? (
    <ChatProvider authUser={authUser}>
      <div className="app">
        <Switch>
          <Route path="/" exact component={Chat} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/:id" component={VideoCallPage} />
        </Switch>
      </div>
    </ChatProvider>
  ) : (
    <>Loading...</>
  );
};