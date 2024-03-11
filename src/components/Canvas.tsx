import React from "react"

export const Canvas = React.forwardRef<HTMLCanvasElement>((props, ref) => {
    return (
        <canvas
            className='editor'
            id='editor'
            ref={ref}
            height={"750"}
            width={"1050"}
        ></canvas>
    );
})
