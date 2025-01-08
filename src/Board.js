import { Stage, Layer, Line, Text } from 'react-konva';
import io from 'socket.io-client';

import React, { useEffect,useState } from 'react';
import { Rect, Circle} from 'react-konva';


const socket = io('http://localhost:4000');
const Board = () => {
    const [rectangles, setRectangles] = useState([]);
    const addRectangle = () => {
      const newRectangle = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        width: 100,
        height: 100,
        fill: 'blue',
      };
      const newrect = [...rectangles, newRectangle]
      setRectangles(newrect);
      sendshape(newrect)
    };

    const handleDragEnd = (index, e) => {
      const updatedRects = [...rectangles];
      updatedRects[index] = {
        ...updatedRects[index],
        x: e.target.x(),
        y: e.target.y(),
      };
      setRectangles(updatedRects);
      sendshape(updatedRects);
    };


    const [state, setState] = useState({
      isDragging: false,
      x: 50,
      y: 50,
    });
  
    const sendlines = () => {
      socket.emit("send_message", {lines})
    }
    const sendshape = (s) => {
      socket.emit("send_state", {s})
    }
    
    // const handleDragEnd = (e) => {
    //   const current = {
    //     isDragging: false,
    //     x: e.target.x(),
    //     y: e.target.y(),
    //   }
    //   setState(current);
    //   sendshape(current)
    // }


    useEffect(()=>{
      socket.on("receive_message", (data) => {
        setLines(lines.concat(data.lines));
      })
      socket.on("receive_state", (data) => {
        setRectangles(data.s)
      })
    },[socket])


    const [tool, setTool] = React.useState('pen');
    const [lines, setLines] = React.useState([]);
    const isDrawing = React.useRef(false);
  
    const handleMouseDown = (e) => {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    };
  
    const handleMouseMove = (e) => {
      // no drawing - skipping
      if (!isDrawing.current) {
        return;
      }
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      let lastLine = lines[lines.length - 1];
      // add point
      lastLine.points = lastLine.points.concat([point.x, point.y]);
  
      // replace last
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
      sendlines()
    };
  
    const handleMouseUp = () => {
      isDrawing.current = false;
    };
  
    return (
      <div>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            <Text text="Just start drawing" x={5} y={30} />
            {/* <Rect
              id='rect'
              x={state.x}
              y={state.y}
              width={100}
              height={100}
              fill="red"
              shadowBlur={10}
              draggable
              onDragStart={() => {
                setState({
                  isDragging: true,
                });
              }}
              onDragEnd={handleDragEnd}
              /> */}
          {rectangles.map((rect, index) => (
            <Rect
              key={index}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              fill={rect.fill}
              draggable
              onDragEnd={(e) => handleDragEnd(index, e)}
            />
          ))}

            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#df4b26"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === 'eraser' ? 'destination-out' : 'source-over'
                }
              />
            ))}
          </Layer>
        </Stage>
        <select
          value={tool}
          onChange={(e) => {
            setTool(e.target.value);
          }}
        >
          <option value="pen">Pen</option>
          <option value="eraser">Eraser</option>
        </select>

        <button onClick={addRectangle}>Add Rectangle</button>

      </div>
    );
  };
  export default Board;