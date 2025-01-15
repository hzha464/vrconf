import React, { useEffect, useCallback, useState, use } from "react";
import ReactPlayer from "react-player";
import peer from "./service/peer";
import { useSocket } from "./context/SocketProvider";
// import ReactPlayer from "react-player";
// import peer from "../service/peer";
// import { useSocket } from "../context/SocketProvider";

const Video = () => {
  const socket = useSocket()
  const [myStream, setMyStream] = useState();
  const [devices, setDevices] = useState([]); // To store available video input devices
  const [selectedDeviceId, setSelectedDeviceId] = useState(null); // Selected camera





  // Handle device selection
  const handleDeviceChange = (event) => {
    console.log(event.target.value);
    setSelectedDeviceId(event.target.value);
  };



  const handleCallUser = useCallback(async () => {
    console.log(selectedDeviceId);
    if (myStream) {
      // Stop any active stream before starting a new one
      await myStream.getTracks().forEach((track) => track.stop());
    }
    const stream = await navigator.mediaDevices
      .getUserMedia({
        video: { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined },
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
      setMyStream(stream);
      const offer = await peer.getOffer();
      socket.emit("call", { offer });
  }, [socket, myStream, selectedDeviceId]);
  
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
    navigator.mediaDevices
    .enumerateDevices()
    .then((deviceList) => {
      const videoDevices = deviceList.filter((device) => device.kind === "videoinput");
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId); // Default to the first device
      }
    }) 
  }, []);
  useEffect(() => {

    socket.on("incoming_call", handleIncommingCall);

    return () => {
      socket.off("incoming_call", handleIncommingCall);
    };
  }, [
    socket,
    handleCallUser,
    handleIncommingCall,
  ]);

  return(
    <>
      <button onClick={handleCallUser}>call</button>
      <label htmlFor="cameraSelect">Choose Camera: </label>
        <select id="cameraSelect" onChange={handleDeviceChange} value={selectedDeviceId}>
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>
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