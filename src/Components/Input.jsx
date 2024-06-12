import React, { useContext, useState } from 'react'
import attach from '../img/attach.png'
import picturimg from '../img/img.png'
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
const Input = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const currentUser = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const handleSend=async()=>{
    if(image)
    {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, image);
          
      uploadTask.on(
        'state_changed',
              (snapshot) => {
                // Progress function (optional)
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');},
        (error) => {
          console.log("upload fail")
        }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
      await updateDoc(doc(db,'chats',data.chatId),{
          message : arrayUnion({
          id: uuid(),
          text,
          senderId:currentUser.uid,
          date: Timestamp.now(),
          image :downloadURL,
        }),
      })
      });  
    }
  );
  }
    else{
      await updateDoc(doc(db,'chats',data.chatId),{
          message : arrayUnion({
          id: uuid(),
          text,
          senderId:currentUser.uid,
          date: Timestamp.now()
        }),
      })
    }

    await updateDoc(doc(db,'userChats', currentUser.uid),{
      [data.chatId + ".lastMessage"]:{
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    })
    await updateDoc(doc(db,'userChats', data.user.uid),{
      [data.chatId + ".lastMessage"]:{
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    })
    setText("")
    setImage(null);
  };
  return (
    <div className='inputs'>
      <input type='text' placeholder='Type Something...' onChange={(e)=>setText(e.target.value)}
      value={text}/>
      <div className="inputIcons">
        <img src={attach} alt=''/>
        <input type='file' style={{display:'none'}} id='file' onChange={(e)=>setImage(e.target.files[0])}/>
        <label htmlFor='file'>
        <img src={picturimg} alt=''/>
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input
