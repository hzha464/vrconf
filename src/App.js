import './App.css';
import Board from './Board';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client';
import React, { useEffect,useState } from 'react';
import { useSocket } from ".//context/SocketProvider";

// const socket = io('http://localhost:4000');
function App() {
  const socket = useSocket()

  const[message, setMessage] = useState("")
  const[messageReceive_message, setMessageReceived] = useState("")
  
  const sendMessage = () => {
    socket.emit("send_message", {message})
  }

  useEffect(()=>{
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message)
    })
  },[socket])

  return (
    <Container>
      <Row>
        <Col>
          <Board />
        </Col>
        <Col>
          <div>
            <Row><input placeholder='Message' onChange={(event)=>{
              setMessage(event.target.value)
              }}/></Row>
            <Row><button onClick={sendMessage}>Send</button></Row>
          </div>
          <Row>{messageReceive_message}</Row>
        </Col>
       </Row>
    </Container>

  );
}

export default App;
