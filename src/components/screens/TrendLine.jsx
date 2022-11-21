import { useEffect, useRef } from 'react'
import { writeTextCentre } from '../../utils/Utils'

function TrendLine({ events, order }) {
    const canvasRef = useRef(null)
    const ref = useRef(null)

    const draw = ctx => {

        var nstart = order === -1 ? 0 : order * 16
        var nend = order === -1 ? events.length : nstart + 16
        var total = order === -1 ? nend - nstart : 16

        var xmargin = 0
        var topmargin = 40
        const canvas = canvasRef.current
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight * 0.82
        // console.log('canvas width, height', canvas.width, canvas.height)
        canvas.style.width = `${window.innerWidth}px`
        canvas.style.height = `${window.innerHeight * 0.78}px`

        var scale = 1 //order === -1 ? canvas.width / (60 * 20) : 1

        var dx = 20 * scale
        var dy = 12 * scale
        var ty = 18 * scale
        var h = 200 * scale
        var hh = h + 4 * ty
        var mh = hh / 2
        var ny = h / dy
        var ny2 = ny / 2

        var fontsize = 10 * scale

        var topmax = 0
        var botmin = 0
        var pts = 0
        for (var ne = 0; ne < events.length; ne++) {
            var evo = events[ne]
            if (evo.team === 0) {
                pts++
            }
            else {
                pts--
            }
            topmax = pts > topmax ? pts : topmax
            if (pts < 0) {
                botmin = pts < botmin ? pts : botmin
            }
        }

        topmax += 2;
        botmin -= 2;

        if ((topmax - botmin) * dy > h) {
            dy = h / (topmax - botmin + 2)
            mh = (topmax + 1) * dy + ty * 2
        }
        else {
            if (topmax > ny2) {
                mh = (topmax * dy) + ty * 2
            }
            else if (Math.abs(botmin) > ny2) {
                mh = h - (Math.abs(botmin) * dy) + ty * 2
            }
        }

        var ww = total * dx
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, xmargin * 2 + ww, hh)

        var x = xmargin
        for (var nc = 0; nc < total; nc += 2) {
            ctx.fillStyle = 'rgba(240, 240, 240, 0.8)'
            ctx.fillRect(x, 0, dx, hh)
            x += dx * 2
        }

        ctx.beginPath()
        ctx.moveTo(xmargin, mh)
        ctx.lineTo(xmargin + ww, mh)
        ctx.strokeStyle = '#7f8c8d'
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(xmargin, 0)
        ctx.lineTo(xmargin + ww, 0)
        ctx.strokeStyle = '#bdc3c7'
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(xmargin, ty)
        ctx.lineTo(xmargin + ww, ty)
        ctx.strokeStyle = '#bdc3c7'
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(xmargin, hh - ty)
        ctx.lineTo(xmargin + ww, hh - ty)
        ctx.strokeStyle = '#bdc3c7'
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(xmargin, hh)
        ctx.lineTo(xmargin + ww, hh)
        ctx.strokeStyle = '#bdc3c7'
        ctx.stroke()

        if (events.length < nstart)
        {
            return
        }

        x = xmargin
        var yy = mh
        var lastyy = mh
        var hsc = 0
        var asc = 0
        for (var ne = 0; ne < events.length; ne++) {
            var evo = events[ne]
            hsc += evo.team === 0 ? 1 : 0
            asc += evo.team === 1 ? 1 : 0
            yy += evo.team === 0 ? -dy : dy
            if (ne >= nstart && ne < nend) {
                ctx.beginPath()
                ctx.moveTo(x, lastyy)
                ctx.lineTo(x, yy)
                ctx.lineTo(x + dx, yy)
                // ctx.closePath()
                ctx.strokeStyle = '#7f8c8d'
                ctx.stroke()
                var kk = evo.team === 0 ? -fontsize - 2 : 2
                var col = evo.team === 0 ? '#16a085' : '#ff0000'
                writeTextCentre({ ctx: ctx, text: evo.event, x: x, y: yy + kk, width: dx }, { textAlign: 'left', fontSize: fontsize, color: col });

                writeTextCentre({ ctx: ctx, text: hsc.toString(), x: x, y: 4, width: dx }, { textAlign: 'left', fontSize: fontsize, color: '#7f8c8d' });
                writeTextCentre({ ctx: ctx, text: asc.toString(), x: x, y: hh - ty + 4, width: dx }, { textAlign: 'left', fontSize: fontsize, color: '#7f8c8d' });
                x += dx
            }
            lastyy = yy
        }
        x = xmargin
        if (order === -1)
        {
            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, hh)
            ctx.strokeStyle = '#7f8c8d'
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(x + ww, 0)
            ctx.lineTo(x + ww, hh)
            ctx.strokeStyle = '#7f8c8d'
            ctx.stroke()
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        // canvas.style.width = "100%";
        // canvas.style.height = "10%";
        // canvas.width = canvas.offsetWidth;
        // canvas.height = canvas.offsetHeight;
        draw(context)
    }, [draw])

    return (
        <div ref={ref}>
            <canvas id="canvas" ref={canvasRef} />
        </div>
    )
}

export default TrendLine