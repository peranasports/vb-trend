import { useEffect, useRef } from 'react'
import { writeTextCentre } from '../../utils/Utils'

function TrendLine({ events, order }) {
    const canvasRef = useRef(null)
    const ref = useRef(null)

    const draw = ctx => {
        var runs = []
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

        var nevents = 0
        var topmax = 0
        var botmin = 0
        var pts = 0
        var teamruns = -1
        var oppruns = -1
        var goodruns = 4
        for (var ne = 0; ne < events.length; ne++) {
            var evo = events[ne]
            if (evo.event === 'T.O.' || evo.event === 'TO')
            {
                continue
            }
            nevents++
            if (evo.team === 0) {
                if (teamruns === -1)
                {
                    teamruns = 0
                    if (oppruns >= goodruns)
                    {
                        var run = { team:1, runs:oppruns, start:nevents - oppruns - 1}
                        runs.push(run)
                    }
                }
                teamruns++
                oppruns = -1
                pts++
            }
            else {
                if (oppruns === -1)
                {
                    oppruns = 0
                    if (teamruns >= goodruns)
                    {
                        var run = { team:0, runs:teamruns, start:nevents - teamruns - 1}
                        runs.push(run)
                    }
                }
                oppruns++
                teamruns = -1
                pts--
            }
            topmax = pts > topmax ? pts : topmax
            if (pts < 0) {
                botmin = pts < botmin ? pts : botmin
            }
        }

        if (oppruns >= goodruns)
        {
            var run = { team:1, runs:oppruns, start:nevents - oppruns}
            runs.push(run)
        }
        else if (teamruns >= goodruns)
        {
            var run = { team:0, runs:teamruns, start:nevents - teamruns}
            runs.push(run)
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

        var nstart = order === -1 ? 0 : order * 16
        var nend = order === -1 ? nevents : nstart + 16
        var total = order === -1 ? nend - nstart : 16

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
        nevents = 0
        for (var ne = 0; ne < events.length; ne++) {
            var evo = events[ne]
            var col = evo.team === 0 ? '#16a085' : '#ff0000'
            if (evo.event === 'T.O.' || evo.event === 'TO') {
                if (nevents >= nstart && nevents < nend) {
                    var tx = x
                    var tox = dx / 3
                    var toy = evo.team === 0 ? ty : hh - ty
                    var toyy = evo.team === 0 ? tox : -tox
                    ctx.beginPath()
                    ctx.moveTo(tx - tox, toy)
                    ctx.lineTo(tx + tox, toy)
                    ctx.lineTo(tx, toy + toyy)
                    ctx.lineTo(tx - tox, toy)
                    ctx.closePath()
                    ctx.fillStyle = col
                    ctx.fill()
                }
            }
            else
            {
                hsc += evo.team === 0 ? 1 : 0
                asc += evo.team === 1 ? 1 : 0
                yy += evo.team === 0 ? -dy : dy
                if (nevents >= nstart && nevents < nend) {
                    ctx.beginPath()
                    ctx.moveTo(x, lastyy)
                    ctx.lineTo(x, yy)
                    ctx.lineTo(x + dx, yy)
                    // ctx.closePath()
                    ctx.strokeStyle = '#7f8c8d'
                    ctx.stroke()
                    var kk = evo.team === 0 ? -fontsize - 2 : 2
                    writeTextCentre({ ctx: ctx, text: evo.event, x: x, y: yy + kk, width: dx }, { textAlign: 'left', fontSize: fontsize, color: col });
                    if (evo.player !== undefined)
                    {
                        var pk = evo.team === 0 ? 2 : -fontsize - 2
                        writeTextCentre({ ctx: ctx, text: evo.player, x: x, y: yy + pk, width: dx }, { textAlign: 'left', fontSize: fontsize, color: col });
                    }
                    writeTextCentre({ ctx: ctx, text: hsc.toString(), x: x, y: 4, width: dx }, { textAlign: 'left', fontSize: fontsize, color: '#7f8c8d' });
                    writeTextCentre({ ctx: ctx, text: asc.toString(), x: x, y: hh - ty + 4, width: dx }, { textAlign: 'left', fontSize: fontsize, color: '#7f8c8d' });
                    x += dx
                }
                nevents++
                lastyy = yy    
            }
        }

        for (var nr=0; nr<runs.length; nr++)
        {
            var run = runs[nr]
            var ry = run.team === 0 ? ty + ty - ty / 4 : hh - ty * 2;
            var rty = run.team === 0 ? ty + 3 : hh - ty * 2 + 5;
            var col = run.team === 0 ? '#16a085' : '#ff0000'
            var rx = dx * (run.start - nstart)
            ctx.fillStyle = col
            var rw = run.runs * dx
            ctx.fillRect(rx, ry, rw, ty / 8)
            writeTextCentre({ ctx: ctx, text: run.runs.toString(), x: rx, y: rty, width: rw }, { textAlign: 'left', fontSize: fontsize, color: 'black' });
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