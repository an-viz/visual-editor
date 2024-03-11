import React, { ChangeEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { Canvas } from './components/Canvas';
import { Panel } from './components/Panel';

interface Rect {
  x: number,
  y: number,
  h: number,
  w: number,
  clr: string,
  d: number,
}

const SAMPLE_RECTS: Rect[] = [
    // {x: 0, y: 0, w: 50, h: 50, clr:'red', d: 45},
    {x: 150, y: 30, w: 100, h: 100, clr: 'black', d: 0},
    {x: 300, y: 250, w: 200, h: 75, clr: 'black', d: 0},
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
const [seconds, setSeconds] = useState<string>('1')
const [isPlaying, setIsPlaying] = useState<boolean>(false)

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


const paintRects = (rectangles: Rect[], canvas: HTMLCanvasElement, isRotate?: boolean) => {

  if(canvas && canvas.getContext && rectangles){
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if(ctx){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      rectangles.forEach(rect => {
        ctx.save();
        ctx.translate(rect.x+rect.w/2,rect.y+rect.h/2);
        ctx.rotate(rect.d);
        ctx.fillStyle=rect.clr;
        ctx.fillRect(-rect.w/2,-rect.h/2,rect.w,rect.h);
        ctx.restore();
      });

      if(isRotate){
        const prevRects = rects
        const rotation = setInterval(() => {
          ctx.clearRect(0,0,canvas.width, canvas.height);
          for(var i=0;i<prevRects.length;i++){
            // draw this rect at its specified angle
            var rect=prevRects[i];
            ctx.save();
            ctx.translate(rect.x+rect.w/2,rect.y+rect.h/2);
            ctx.rotate(rect.d);
            ctx.fillStyle=rect.clr;
            ctx.fillRect(-rect.w/2,-rect.h/2,rect.w,rect.h);
            ctx.restore();

            // increase this rect's angle for next time
            rect.d+=(Math.PI*2)/60;
            prevRects[i] = rect;
            setRects(prevRects)

          }
        }, 25)

        const ms = Number(seconds) * 1000
        setTimeout(() => {
          clearInterval(rotation);
          setIsPlaying(false)
        } , ms)
        
      }
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

const rotateRects = () => {
  setIsPlaying(true);
  if(canvasRef.current){
    paintRects(rects, canvasRef.current, true)
  }
}

useEffect(() => {
  if(canvasRef && canvasRef.current){
    paintRects(rects, canvasRef.current)
  }

  if(canvasRef && canvasRef.current){
    canvasRef.current.addEventListener('mouseup', (e) => changeRectClr(e))
  }

  return () => {
  if(canvasRef && canvasRef.current){
    canvasRef.current.removeEventListener('mouseup', (e) => changeRectClr(e))
  }
  }
}, [rects, changeRectClr])


const downloadJson = () => {
    // create file in browser
  const fileName = "project_data";
  const json = JSON.stringify({rects}, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const href = URL.createObjectURL(blob);

  // create "a" HTML element with href to file
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName + ".json";
  document.body.appendChild(link);
  link.click();

  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}

const importProject = (e: ChangeEvent<HTMLInputElement>) => {
  if(e && e.target && e.target.files){
    const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = e => {
        let blob:any;
        if(e && e.target && e.target.result){
          blob = JSON.parse(e.target.result as string)
          setRects(blob['rects'])
        }
      };
  }
}

return (
    <div className="App">
      <Canvas ref={canvasRef}/>

      <Panel 
        addRect={addRect}
        seconds={seconds}
        setSeconds={setSeconds}
        rotateRects={rotateRects}
        isPlaying={isPlaying}
        downloadJson={downloadJson}
        importProject={importProject}
      />
    </div>
  );
}

export default App;
