import React, { useContext, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, serverTimestamp,doc, setDoc, getDoc  } from "firebase/firestore";
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';


const Search = () => {
const [userName ,setUserName] = useState('');
const [user, setUser] = useState(null);
const [err, setErr] = useState(false)
const currentUser = useContext(AuthContext);

const handleSearch= async ()=>{
  const users = collection(db, "users");
  const q = query(users, where("displayName", "==", userName));

  try{const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    setUser(doc.data())
  });}
  catch(err){
    setErr(err);
  }
  
}
const handleKey =e=>{
  e.code === 'Enter' && handleSearch();
}
const handleSelect=async()=>{
  const combinedId = currentUser.uid > user.uid ?
    currentUser.uid + user.uid 
  : user.uid + currentUser.uid ;

  try{
    const res = await getDoc(doc(db, "chats", combinedId));
    console.log(!res)
    
  if (!res.exists()){
    // create a chat in chats collection
    await setDoc(doc(db, "chats", combinedId), {message :[]})
    console.log("hey");
    // create user chats
    await updateDoc(doc(db,"userChats", currentUser.uid),
    {[combinedId+ ".userInfo"]:{
      uid:user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL
    },
    [combinedId+ ".date"]: serverTimestamp()
  }); 
    await updateDoc(doc(db,"userChats", user.uid),
    {[combinedId+ ".userInfo"]:{
      uid:currentUser.uid,
      displayName:currentUser.displayName,
      photoURL: currentUser.photoURL
    },
    [combinedId+ ".date"]: serverTimestamp()
  });
  }
}
catch(err){
  setErr(true)
}
setUser(null);
setUserName('')
}
  return (
    <div className='search'>
      <div className='searchForm'>
      <input type='text' placeholder='Find chats' onKeyDown={handleKey} onChange={e=> setUserName(e.target.value)}
      value={userName}
      />
      </div>
      {err && <span>User not found</span>}
      {user && (<div className="userChat" onClick={handleSelect}>
      <img src={user.photoURL} alt=''/>
      <div className="userChatInfo">
        <span>{user.displayName}</span>
      </div>
      </div>)}
    </div>
  )
}


export default Search
