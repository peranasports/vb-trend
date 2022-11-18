import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { writeTextCentre, writeText } from '../../utils/Utils'

function MatchReport() {
    const { state } = useLocation();
    const canvasRef = useRef(null)
    const ref = useRef(null)

    const draw = ctx => {

        var maxevents = 0
        for (var ns = 0; ns < state.sets.length; ns++) {
            var set = state.sets[ns]
            if (set.events === undefined) {
                continue
            }
            var events = state.sets[ns].events
            maxevents = events.length > maxevents ? events.length : maxevents
        }

        var dx = 20
        var xmargin = 100
        var topmargin = 200
        const canvas = canvasRef.current
        canvas.width = maxevents * dx + 2 * xmargin //1500 //window.innerWidth
        canvas.height = canvas.width * 1.5 //window.innerHeight * 0.82
        canvas.style.width = `${canvas.width}px`
        canvas.style.height = `${canvas.height * 0.85}px`

        var scale = 1 //order === -1 ? canvas.width / (60 * 20) : 1

        var dy = 15 * scale
        var ty = 20 * scale
        var h = 200 * scale
        var hh = h + 2 * ty
        var mh = hh / 2
        var ny = h / dy
        var ny2 = ny / 2

        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        var title = state.teamA.toUpperCase() + ' vs ' + state.teamB.toUpperCase()
        writeText({ ctx: ctx, text: title, x: xmargin, y: 100, width: 600 }, { textAlign: 'left', fontSize: 20, color: 'black' });
        writeText({ ctx: ctx, text: state.matchDate, x: xmargin, y: 130, width: 600 }, { textAlign: 'left', fontSize: 20, color: 'black' });

        var by = 280
        var y = topmargin
        for (var ns = 0; ns < state.sets.length; ns++) {
            var set = state.sets[ns]
            if (set.events === undefined) {
                continue
            }
            writeText({ ctx: ctx, text: 'SET ' + set.setNumber.toString(), x: xmargin, y: y - 20, width: 600 }, { textAlign: 'left', fontSize: 14, color: 'black' });
            var events = state.sets[ns].events
            var nstart = 0
            var nend = events.length
            var total = nend - nstart

            var fontsize = 10 * scale

            x = xmargin
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

            topmax++;
            botmin--;

            if ((topmax - botmin) * dy > h) {
                dy = h / (topmax - botmin + 2)
                mh = (topmax + 1) * dy + ty
            }
            else {
                if (topmax > ny2) {
                    mh = (topmax + 1) * dy
                }
                else if (Math.abs(botmin) > ny2) {
                    mh = h - (Math.abs(botmin) + 1) * dy
                }
            }

            var ww = total * dx
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, y, xmargin * 2 + ww, hh)

            var x = xmargin
            for (var nc = 0; nc < total; nc += 2) {
                ctx.fillStyle = 'rgba(240, 240, 240, 0.8)'
                ctx.fillRect(x, y, dx, hh)
                x += dx * 2
            }

            ctx.beginPath()
            ctx.moveTo(xmargin, y + mh)
            ctx.lineTo(xmargin + ww, y + mh)
            ctx.strokeStyle = '#7f8c8d'
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(xmargin, y)
            ctx.lineTo(xmargin + ww, y)
            ctx.strokeStyle = '#bdc3c7'
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(xmargin, y + ty)
            ctx.lineTo(xmargin + ww, y + ty)
            ctx.strokeStyle = '#bdc3c7'
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(xmargin, y + hh - ty)
            ctx.lineTo(xmargin + ww, y + hh - ty)
            ctx.strokeStyle = '#bdc3c7'
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(xmargin, y + hh)
            ctx.lineTo(xmargin + ww, y + hh)
            ctx.strokeStyle = '#bdc3c7'
            ctx.stroke()

            if (events.length < nstart) {
                return
            }

            x = xmargin
            var yy = y + mh
            var lastyy = y + mh
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

                    writeTextCentre({ ctx: ctx, text: hsc.toString(), x: x, y: y + 4, width: dx }, { textAlign: 'left', fontSize: fontsize, color: '#7f8c8d' });
                    writeTextCentre({ ctx: ctx, text: asc.toString(), x: x, y: y + hh - ty + 4, width: dx }, { textAlign: 'left', fontSize: fontsize, color: '#7f8c8d' });
                    x += dx
                }
                lastyy = yy
            }
            x = xmargin

            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x, y + hh)
            ctx.strokeStyle = '#7f8c8d'
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(x + ww, y)
            ctx.lineTo(x + ww, y + hh)
            ctx.strokeStyle = '#7f8c8d'
            ctx.stroke()

            y += by
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        draw(context)
    },)

    const doDownloadImage = () => {
        var canvas = canvasRef.current
        var dataURL = canvas.toDataURL("image/jpeg", 1.0);
        downloadImage(dataURL, 'my-canvas.jpeg');
    }


    // Save | Download image
    function downloadImage(data, filename = 'untitled.jpeg') {
        var a = document.createElement('a');
        a.href = data;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
    }

    return (
        <>
            <div>
                <button
                    type="button"
                    onClick={() => {
                        doDownloadImage()
                    }}
                    className="flex mr-4 my-4 justify-end rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                    DOWNLOAD IMAGE
                </button>
            </div>
            <div ref={ref}>
                <canvas id="canvas" ref={canvasRef} />
            </div>
        </>
    )
}

export default MatchReport