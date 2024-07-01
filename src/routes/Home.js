import { dbService } from "fbase";
import { collection, addDoc, onSnapshot } from 'firebase/firestore'
import { useState, useEffect } from "react";
import Nweet from "components/Nweet";


const Home = ({ userObj }) => {
  const [nweet,setNweet] = useState("");
  const [nweets, setNweets] = useState([]);


    useEffect(() =>{
        onSnapshot(collection(dbService, "nweets"), (Snapshot) =>{
          const newArray = Snapshot.docs.map((document) => ({
            id: document.id,
            ...document.data()
          }));
          setNweets(newArray);
        })
    }, [])

    const onChange = (event) => {
      event.preventDefault();
      const {
        target: { value },
      } = event;
    setNweet(value);
  }
  const onSubmit = async(event) => {
    event.preventDefault();
    await addDoc(collection(dbService, "nweets"), {
      text: nweet,
      created: Date.now(),
      creatorId: userObj.uid,

  });
  }
  return (
    <>
    <form onSubmit={onSubmit}>
      <input
      value={nweet}
      onChange={onChange}
      type="text"
      placeholder="What's on your mind?"
      maxLength={120}
      />
      <input type="submit" value="Nweet" />
    </form>
    
    <div>
      {
       nweets.map((nweet) => (
        <Nweet 
        key={nweet.id} 
        nweetObj={nweet} 
        isOwner={nweet.creatorId === userObj.uid}
          />
       ))
      }
    </div>
    </>
  );
};
export default Home;