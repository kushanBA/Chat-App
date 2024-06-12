import { doc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Chats = () => {
  const currentUser = useContext(AuthContext)
  const {dispatch} = useContext(ChatContext)
  const [chat, setChat] = useState([])

  useEffect(()=>{
    const getChats=()=>{
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChat(doc.data());
        // console.log(doc.data())
    });
    return ()=>{unsub();}
    }
  currentUser.uid && getChats();
  },[currentUser.uid]);

  // console.log(currentUser.uid + "currentuser")

  const handleSelect=(u)=>{
    dispatch({type:'CHANGE_USER',payload:u});
  }

  return (
    <div className='chats'>
      {Object.entries(chat)?.sort((a,b)=> b[1].date - a[1].date).map((chats)=>(
        <div className="userChat" key={chats[0]} onClick={()=> handleSelect(chats[1].userInfo)}>
          {/* {console.log(chats[1].userInfo?.uid + 'fuck')} */}
        <img src={chats[1].userInfo?.photoURL} alt=''/>
        <div className="userChatInfo">
          <span>{chats[1].userInfo?.displayName}</span>
          <p>{chats[1].lastMessage?.text}</p> 
        </div>
      </div>
      ))}
    </div>
 )
}

export default Chats
