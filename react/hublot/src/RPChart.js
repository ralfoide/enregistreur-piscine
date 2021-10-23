import React, { useRef, useEffect } from 'react'
import RPConstants from "./RPConstants"

const RPChart = props => {
  
  const canvasRef = useRef(null)

  const resize = canvas => {
      const { w, h } = canvas.getBoundingClientRect()
      RPConstants.log("@@ canvas cur size: " + JSON.stringify( [canvas.width, canvas.height] ))
      RPConstants.log("@@ canvas new size: " + JSON.stringify( [w, h, canvas === null] ))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        return true
      }
      return false
  }
  
  const draw = ctx => {
      const cw = ctx.canvas.width
      const ch = ctx.canvas.height
      ctx.clearRect(0, 0, cw, ch)
      ctx.fillStyle = '#000000'
      ctx.strokeRect(0, 0, cw, ch)
      ctx.beginPath()
      ctx.moveTo(0,ch)

      props.data.data.map( ({x,y}) => {
        const lx = cw / 24.0 * x
        const ly = y == 0 ? ch - 1 : 1
        ctx.lineTo(lx,ly)
        })

        ctx.lineTo(cw, ch)
      ctx.closePath()
      ctx.fill()
  }
  
  useEffect(() => {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      //resize(canvas)
      draw(context)
  }, [draw])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default RPChart
