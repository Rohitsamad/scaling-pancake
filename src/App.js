import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDrfd2oRXpaTumeEu-l5bO7EayIQEqBYMU",
  authDomain: "message-e8668.firebaseapp.com",
  databaseURL: "https://message-e8668-default-rtdb.firebaseio.com",
  projectId: "message-e8668",
  storageBucket: "message-e8668.appspot.com",
  messagingSenderId: "654321921638",
  appId: "1:654321921638:web:4949da5aff249122f4c7a7"
})

const auth = firebase.auth();
const firestore = firebase.firestore();




function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <Logout />
      </header>

      <section>
        {user ? <Room /> : <Login />}
      </section>

    </div>
  );
}

function Login() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>login with Google</button>
    </>
  )

}

function Logout() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Log Out</button>
  )
}


function Room() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('chat').limit(500);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, displayName } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      chat: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <Displaymsg key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="type message" />

      <button type="submit" disabled={!formValue}>send</button>

    </form>
  </>)
}


function Displaymsg(props) {
  const { text, uid, displayName } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
    <p>{text}</p>
    </div>
  </>)
}


export default App;
