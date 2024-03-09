import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

interface Rect {
  x: number,
  y: number,
  h: number,
  w: number,
  clr: string,
  d: number,
}

const SAMPLE_RECTS: Rect[] = [
    {x: 0, y: 0, w: 50, h: 50, clr:'red', d: 45},
    {x: 75, y: 75, w: 50, h: 50, clr: 'black', d: 270},
]

const randomNumber = (limit: number) => {
  return Math.floor(Math.random() * limit);
};

const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}



function App() {

const [rects, setRects] = useState<Rect[]>([])
const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);

const getSelectedRect = (x: number, y: number) => {
  const rect: Rect | undefined = rects.find(r => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h)
  return rect && {rect, rectIdx: rects.indexOf(rect)};
};

const changeRectClr = useCallback((e:  MouseEvent) => {
  const details = getSelectedRect(e.pageX, e.pageY)
  if(details){
    const rectangle: Rect = details.rect;
    rectangle.clr = getRandomColor();
    let prevRects = [...rects]
    prevRects[details.rectIdx] = rectangle;
    if(canvasRef && canvasRef.current){
      paintRects(prevRects, canvasRef.current);
    }
    // setRects(prevRects => [...prevRects, rect])
  }
}, [rects])

const paintRects = (rectangles: Rect[], canvas: HTMLCanvasElement) => {
  if(canvas && canvas.getContext && rectangles){
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if(ctx){
      ctx.save()
      ctx.beginPath()
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      rectangles.forEach(rect => {
        // ctx.translate(rect.x + rect.w/2, rect.y+rect.h/2);
        // ctx.rotate(rect.d);
        ctx.fillStyle = rect.clr;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
      });
    }
  }
}


const addRect = () => {
  if(canvasRef && canvasRef.current){
    const canvasRect = canvasRef.current.getBoundingClientRect()
    const randW = randomNumber(canvasRect.width)
    const randH = randomNumber(canvasRect.height)
    const randX = randomNumber(canvasRect.width - randW)
    const randY = randomNumber(canvasRect.height - randH)

    //360 because max deg ; converting deg to radians;
    const randDegree = randomNumber(360)* Math.PI / 180;

    setRects(prevRects => [...prevRects, {x: randX, y: randY, w: randX, h: randY, clr: getRandomColor(), d: randDegree}])
  }
}

useEffect(() => {
  if(canvasRef && canvasRef.current){
    paintRects(rects, canvasRef.current)
  }

  if(canvasRef && canvasRef.current){
    // canvas.addEventListener('mousedown', (e) => console.log(e.pageX))
    // canvas.addEventListener('mousemove', (e) => console.log(e.pageX))
    canvasRef.current.addEventListener('mouseup', (e) => changeRectClr(e))
  }

  return () => {
  if(canvasRef && canvasRef.current){
    canvasRef.current.removeEventListener('mouseup', (e) => changeRectClr(e))
  }
  }
}, [rects, changeRectClr])


return (
    <div className="App">
      <canvas
        className='editor'
        id='editor'
        ref={canvasRef}
        height={"750"}
        width={"1050"}
      ></canvas>
      <div className='rightPanel'>
        <button
          onClick={addRect}
        >Add rectangle</button>
        <div>duration:</div>
        <input type='number' />
        <button>Play</button>
        <button>Download .json</button>
      </div>
    </div>
  );
}

export default App;
