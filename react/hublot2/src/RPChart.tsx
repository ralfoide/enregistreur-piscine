import {type CanvasHTMLAttributes, type ReactElement, useEffect, useRef} from "react";

// Drawing data: {
//      hourNow: float representing hour for right-most edge,
//      curves: list for each curve 0..3 [ {
//          title: string,
//          color: #rgb,
//          points: list [ { x: 0..24, y: 0..1 }]
//      } ] }
// Data represents points in the last N hours (0 = right most side, most recent)

export interface ChartPoint {
    x: number;
    y: number;
}

export interface ChartCurve {
    title: string;
    color: string;
    points: ChartPoint[];
}

export interface ChartData {
    hourNow: number;
    curves: ChartCurve[];
}

interface ChartProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
    data: ChartData,
}

export function RPChart(props: ChartProps): ReactElement {
    const canvasRef = useRef<HTMLCanvasElement>(null)

//   const resize = canvas => {
//       const { w, h } = canvas.getBoundingClientRect()
//       RPConstants.log("@@ canvas cur size: " + JSON.stringify( [canvas.width, canvas.height] ))
//       RPConstants.log("@@ canvas new size: " + JSON.stringify( [w, h, canvas === null] ))
//       if (canvas.width !== w || canvas.height !== h) {
//         canvas.width = w
//         canvas.height = h
//         return true
//       }
//       return false
//   }


    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return;

        const context = canvas.getContext("2d")
        if (!context) return;
        //resize(canvas)
        draw(context, props.data)
    }, [props.data])

    function draw(ctx: CanvasRenderingContext2D, data: ChartData) {
        // WARNING: canvas pixel coordinates are "on grid". To draw pure 1-pixel stroke line, it needs
        // to be drawn with a 0.5 offset to avoid aliasing it over 2 lines.
        const ph = 0.5  // pixel half
        const cw = ctx.canvas.width
        const ch = ctx.canvas.height
        const tickH = 10
        const marginH = 10   // height between each curve
        const marginTop = 5
        const marginW = 2

        ctx.lineWidth = 1
        ctx.clearRect(0, 0, cw, ch)
        ctx.fillStyle = 'black'
        ctx.strokeStyle = 'darkgray'
        ctx.strokeRect(ph, ph, cw - ph, ch - ph)

        const hourNow = data.hourNow // correspond to right most edge (cw)
        const curves = data.curves
        const n = data.curves.length
        const hw = (cw - marginW) / 24    // width of an hour

        // Draw hour ticks... up to 24 hours
        const rightHour = Math.floor(hourNow)
        for (let t = 0; t < 24; t++) {
            let h = rightHour - t;
            const x = cw - marginW - (hourNow - h) * hw
            const ix = Math.floor(x) - ph
            ctx.beginPath()
            ctx.moveTo(ix, ch - ph)
            const height = (h % 2) === 0 ? tickH : (tickH / 2)
            ctx.lineTo(ix, ch - ph - height)
            ctx.closePath()
            ctx.stroke()

            if (h % 2 === 0) {
                // display text
                if (h < 0) {
                    h += 24
                }
                ctx.fillText(String(h), x + 2, ch - 2)
            }
        }

        if (n > 0) {
            const nh = (ch - tickH - marginTop) / n

            curves.forEach((curve, k) => {
                const title = curve.title
                const color = curve.color
                const points = curve.points

                const y1 = marginTop + nh * k
                const y0 = y1 + nh - marginH

                ctx.lineWidth = 0.25
                ctx.strokeStyle = color
                ctx.beginPath()
                ctx.moveTo(marginW, y0)
                ctx.lineTo(cw - marginW, y0)
                ctx.stroke()

                ctx.fillStyle = color
                ctx.fillText(title, 2, y0 - 6)

                if (points.length > 0) {
                    ctx.lineWidth = 2
                    ctx.beginPath()
                    ctx.moveTo(cw - marginW, points[0].y <= 0 ? y0 : y1)
                    points.forEach((p) => {
                        const x = cw - marginW - p.x * hw
                        const y = p.y <= 0 ? y0 : y1
                        ctx.lineTo(x, y)
                    })
                    ctx.stroke()
                }
            })
        }
    }

    return <canvas ref={canvasRef} {...props}/>
}
