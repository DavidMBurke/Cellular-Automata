import React, {useEffect, useState, useRef} from 'react';
export default function Canvas() {

    const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1000//window.innerWidth * .5;
    canvas.height = 600//window.innerHeight * .5;
    canvas.style.width = 1000//`${window.innerWidth} * .5 px`;
    canvas.style.height = 600//`${window.innerHeight} * .5 px`;

    const context = canvas.getContext("2d");
    context.scale(1,1);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 1;
    contextRef.current = context;
  }, [])

  const startDrawing = ({nativeEvent}) => {
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  }

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  }

  const draw = ({nativeEvent}) => {
    if(!isDrawing){
      return
    }
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  }

  return (
    <canvas 
      id="learningCanvas"
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      ref={canvasRef}
    />
  )
}

