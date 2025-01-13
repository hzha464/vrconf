import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "./service/peer";
import { useSocket } from "./context/SocketProvider";
// import ReactPlayer from "react-player";
// import peer from "../service/peer";
// import { useSocket } from "../context/SocketProvider";

const Video = () => {
  const socket = useSocket()
  const [myStream, setMyStream] = useState();

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("call", { offer });
    setMyStream(stream);
  }, [socket]);
  
  const handleIncommingCall = useCallback(
    async ({ offer }) => {
      // setRemoteSocketId(from);
      // const stream = await navigator.mediaDevices.getUserMedia({
      //   audio: true,
      //   video: true,
      // });
      // setMyStream(stream);
      // console.log(`Incoming Call`, from, offer);
      // const ans = await peer.getAnswer(offer);
      // socket.emit("call:accepted", { to: from, ans });
      console.log("incoming call", offer);
    },
    [socket]
  );

  useEffect(() => {
    socket.on("incoming_call", handleIncommingCall);

    return () => {
      socket.off("incoming_call", handleIncommingCall);
    };
  }, [
    socket,
    handleCallUser,
    handleIncommingCall,]);

  return(
    <>
      <button onClick={handleCallUser}>call</button>
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={myStream}
          />
        </>
      )}
    </>
  )
    
};

export default Video;