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
    // socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [socket]);

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