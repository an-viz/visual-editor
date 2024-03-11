import React, { ChangeEvent } from 'react';

interface PanelProps {
    addRect: () => void,
    seconds: string,
    setSeconds: (value: React.SetStateAction<string>) => void,
    rotateRects: () => void,
    isPlaying: boolean,
    downloadJson: () => void,
    importProject: (e: ChangeEvent<HTMLInputElement>) => void,

}
export const Panel = (props: PanelProps) => {
  return (
    <div className='rightPanel'>
        <button
          onClick={props.addRect}
        >Add rectangle</button>
        <div className='separator' />
        <div className='ip-container'>
        <div className='label'>Duration:</div>
          <input className='input' type='number' value={props.seconds} min={1} onChange={(e) => props.setSeconds(e.target.value)}/>
          <span className='ip-seconds'>s</span>
        </div>
        <button onClick={props.rotateRects} disabled={props.isPlaying}>Play</button>
        <div className='separator' />
        <button onClick={props.downloadJson}>Download .json</button>
        <label htmlFor='import' className='input-label btn'>Import Project</label>
        <input id='import' className='import-input' type='file' onChange={props.importProject} accept='.json' />
      </div>
  )
}
