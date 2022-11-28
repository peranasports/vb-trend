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
        var topmargin = 120
        const canvas = canvasRef.current
        canvas.width = maxevents * dx + 2 * xmargin //1500 //window.innerWidth
        canvas.height = canvas.width * 1.5 //window.innerHeight * 0.82
        canvas.style.width = `${canvas.width}px`
        canvas.style.height = `${canvas.height * 0.85}px`

        var scale = 1 //order === -1 ? canvas.width / (60 * 20) : 1

        var dy = 12 * scale
        var ty = 18 * scale
        var h = 200 * scale
        var hh = h + 4 * ty
        var mh = hh / 2
        var ny = h / dy
        var ny2 = ny / 2

        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        var title = state.teamA.toUpperCase() + ' vs ' + state.teamB.toUpperCase() + ' - ' + state.matchDate
        writeText({ ctx: ctx, text: title, x: xmargin, y: 60, width: 600 }, { textAlign: 'left', fontSize: 20, color: 'black' });
        // writeText({ ctx: ctx, text: state.matchDate, x: xmargin, y: 130, width: 600 }, { textAlign: 'left', fontSize: 20, color: 'black' });

        var by = 320
        var y = topmargin
        for (var ns = 0; ns < state.sets.length; ns++) {
            var runs = []
            var set = state.sets[ns]
            if (set.events === undefined) {
                continue
            }
            writeText({ ctx: ctx, text: 'SET ' + set.setNumber.toString(), x: xmargin - 44, y: y, width: 600 }, { textAlign: 'left', fontSize: 14, color: 'black' });
            var events = state.sets[ns].events
            var server = state.sets[ns].teamAServing ? 0 : 1
            var setterA = state.sets[ns].teamASetterPos === 'NA' ? 0 : Number(state.sets[ns].teamASetterPos)
            var setterB = state.sets[ns].teamBSetterPos === 'NA' ? 0 : Number(state.sets[ns].teamBSetterPos)
            var nstart = 0
            var nend = events.length
            var total = nend - nstart

            var fontsize = 10 * scale

            mh = hh / 2
            x = xmargin
            var topmax = 0
            var botmin = 0
            var pts = 0
            var lastsetterA = 0
            var lastsetterB = 0
            var nevents = 0
            var teamruns = -1
            var oppruns = -1
            var goodruns = 4
            for (var ne = 0; ne < events.length; ne++) {
                var evo = events[ne]
                if (evo.event === 'T.O.' || evo.event === 'TO') {
                    continue
                }
                nevents++
                if (evo.team === 0) {
                    if (server === 1) {
                        setterA--
                        if (setterA === 0) {
                            setterA = 6
                        }
                        server = 0
                    }
                    if (teamruns === -1) {
                        teamruns = 0
                        if (oppruns >= goodruns) {
                            var run = { team: 1, runs: oppruns, start: nevents - oppruns - 1 }
                            runs.push(run)
                        }
                    }
                    teamruns++
                    oppruns = -1
                    pts++
                }
                else {
                    if (server === 0) {
                        setterB--
                        if (setterB === 0) {
                            setterB = 6
                        }
                        server = 1
                    }
                    if (oppruns === -1) {
                        oppruns = 0
                        if (teamruns >= goodruns) {
                            var run = { team: 0, runs: teamruns, start: nevents - teamruns - 1 }
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

            if (oppruns >= goodruns) {
                var run = { team: 1, runs: oppruns, start: nevents - oppruns }
                runs.push(run)
            }
            else if (teamruns >= goodruns) {
                var run = { team: 0, runs: teamruns, start: nevents - teamruns }
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
                    mh = topmax * dy + ty * 2
                }
                else if (Math.abs(botmin) > ny2) {
                    mh = h - (Math.abs(botmin) * dy) + ty * 2
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

            var sna = set.teamAServing ? state.teamA + ' *' : state.teamA
            writeText({ ctx: ctx, text: sna.toUpperCase(), x: xmargin, y: y - fontsize - 4 }, { textAlign: 'left', fontSize: fontsize, color: 'black' });
            var snb= set.teamBServing ? state.teamB + ' *' : state.teamB
            writeText({ ctx: ctx, text: snb.toUpperCase(), x: xmargin, y: y + hh + 4}, { textAlign: 'left', fontSize: fontsize, color: 'black' });

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
                var col = evo.team === 0 ? '#16a085' : '#ff0000'
                if (evo.event === 'T.O.' || evo.event === 'TO') {
                    if (ne >= nstart && ne < nend) {
                        var tx = x
                        var tox = dx / 3
                        var toy = evo.team === 0 ? y + ty : y + hh - ty
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
                else {
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
                        writeTextCentre({ ctx: ctx, text: evo.event, x: x, y: yy + kk, width: dx }, { textAlign: 'left', fontSize: fontsize, color: col });
                        if (evo.player !== undefined) {
                            var pk = evo.team === 0 ? 2 : -fontsize - 2
                            writeTextCentre({ ctx: ctx, text: evo.player, x: x, y: yy + pk, width: dx }, { textAlign: 'left', fontSize: fontsize, color: col });
                        }

                        writeTextCentre({ ctx: ctx, text: hsc.toString(), x: x, y: y + 4, width: dx }, { textAlign: 'left', fontSize: fontsize, color: '#7f8c8d' });
                        writeTextCentre({ ctx: ctx, text: asc.toString(), x: x, y: y + hh - ty + 4, width: dx }, { textAlign: 'left', fontSize: fontsize, color: '#7f8c8d' });

                        if (state.sets[ns].teamASetterPos !== 'NA') {
                            if (evo.setterA !== lastsetterA) {
                                ctx.beginPath()
                                ctx.moveTo(x, y + ty)
                                ctx.lineTo(x, y + ty * 2)
                                ctx.strokeStyle = '#7f8c8d'
                                ctx.stroke()
                                writeTextCentre({ ctx: ctx, text: "S" + evo.setterA.toString(), x: x, y: y + 4 + ty, width: dx }, { textAlign: 'left', fontSize: fontsize, color: '#7f8c8d' });
                                lastsetterA = evo.setterA
                            }
                            ctx.beginPath()
                            ctx.moveTo(x, y + ty * 2)
                            ctx.lineTo(x + dx, y + ty * 2)
                            ctx.strokeStyle = '#7f8c8d'
                            ctx.stroke()

                        }
                        if (state.sets[ns].teamASetterPos !== 'NA') {
                            if (evo.setterB !== lastsetterB) {
                                ctx.beginPath()
                                ctx.moveTo(x, y + hh - ty * 2)
                                ctx.lineTo(x, y + hh - ty)
                                ctx.strokeStyle = '#7f8c8d'
                                ctx.stroke()
                                writeTextCentre({ ctx: ctx, text: "S" + evo.setterB.toString(), x: x, y: y + hh - ty * 2 + 4, width: dx }, { textAlign: 'left', fontSize: fontsize, color: '#7f8c8d' });
                                lastsetterB = evo.setterB
                            }
                            ctx.beginPath()
                            ctx.moveTo(x, y + hh - ty * 2)
                            ctx.lineTo(x + dx, y + hh - ty * 2)
                            ctx.strokeStyle = '#7f8c8d'
                            ctx.stroke()
                        }

                        x += dx
                    }
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

            for (var nr=0; nr<runs.length; nr++)
            {
                var run = runs[nr]
                var ry = run.team === 0 ? y + ty * 2 + ty / 4 : y + hh - ty * 2 - ty + 2;
                var rty = run.team === 0 ? ry + 1 : ry;
                var col = run.team === 0 ? '#16a085' : '#ff0000'
                var rx = x + dx * (run.start - nstart)
                var rw = run.runs * dx
                ctx.fillStyle = col
                ctx.fillRect(rx, ry + ty / 4, rw, 2)
                ctx.beginPath()
                ctx.arc(rx + rw / 2, ry + dx / 4, dx / 2, 0, 2 * Math.PI, false);
                ctx.closePath()
                ctx.fillStyle = 'white'
                ctx.fill()
                ctx.strokeStyle = col
                ctx.stroke()
                writeTextCentre({ ctx: ctx, text: run.runs.toString(), x: rx, y: rty, width: rw }, { textAlign: 'left', fontSize: fontsize, color: 'black' });
            }
    
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
                    DOWNLOAD REPORT
                </button>
            </div>
            <div ref={ref}>
                <canvas id="canvas" ref={canvasRef} />
            </div>
        </>
    )
}

export default MatchReport