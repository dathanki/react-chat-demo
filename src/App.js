import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
  apiKey: "AIzaSyABz2FUP1NlrT-tuoGWqp-DlRoh1TdZnzQ",
  authDomain: "reactchatdemo-10ce2.firebaseapp.com",
  projectId: "reactchatdemo-10ce2",
  storageBucket: "reactchatdemo-10ce2.appspot.com",
  messagingSenderId: "995871155704",
  appId: "1:995871155704:web:750a3a8ac6f192ee09620d"
})


const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}


function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef()
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');

dummy.current.scrollIntoView({ behavior: 'smooth' });

  }

  return ( <>
      <main>

        { messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>) }

        <span ref={dummy}></span>
          
      </main>

      <form onSubmit={sendMessage}>
          <input value={formValue} onChange={ (e) => setFormValue(e.target.value) } />
          <button type="submit" disabled={!formValue}> 🕊️ </button>
      </form>
    </>
  )
}

function ChatMessage(props){
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
