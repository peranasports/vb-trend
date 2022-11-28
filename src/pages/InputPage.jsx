import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import InputScreen from '../components/screens/InputScreen'
import MatchReport from '../components/screens/MatchReport';
import TrendLine from '../components/screens/TrendLine'

function InputPage() {
    const refTeamAServing = useRef(null)
    const refTeamBServing = useRef(null)
    const refTeamASetterPos = useRef(null)
    const refTeamBSetterPos = useRef(null)
    const navigate = useNavigate();
    const { state } = useLocation();
    const [matchData, setMatchData] = useState(JSON.parse(localStorage.getItem('savedMatchData')) || state)
    const [teamAServing, setTeamAServing] = useState(matchData.teamAServing || false)
    const [teamBServing, setTeamBServing] = useState(matchData.teamBServing || false)
    const [teamASetterPos, setTeamASetterPos] = useState(matchData.teamASetterPos || 'NA')
    const [teamBSetterPos, setTeamBSetterPos] = useState(matchData.teamBSetterPos || 'NA')
    const [, forceUpdate] = useState(0);
    const [events, setEvents] = useState(JSON.parse(localStorage.getItem('savedEvents')) || [])

    const addEvent = (team, ev) => {
        var evo = { team: team, event: ev }
        var evx = events
        evx.push(evo)
        setEvents(evx)
        localStorage.setItem('savedEvents', JSON.stringify(evx))
        forceUpdate(n => !n)
    }

    const addPlayer = (team, pn) => {
        var evx = events
        var evo = evx[events.length - 1]
        evo.player = pn
        localStorage.setItem('savedEvents', JSON.stringify(evx))
        forceUpdate(n => !n)
    }

    function saveMatchData() {
        var setData = matchData.sets[matchData.currentSet - 1] // { setNumber: matchData.currentSet, events: events }
        setData.setNumber = matchData.currentSet
        setData.teamAServing = teamAServing
        setData.teamBServing = teamBServing
        setData.events = events
        matchData.sets[matchData.currentSet - 1] = setData
        localStorage.setItem('savedMatchData', JSON.stringify(matchData))
        setMatchData(matchData)
        console.log(matchData)
    }

    const doNewSet = () => {
        matchData.sets[matchData.currentSet].teamAServing = refTeamAServing.current.checked
        matchData.sets[matchData.currentSet].teamBServing = refTeamBServing.current.checked
        matchData.sets[matchData.currentSet].teamASetterPos = teamASetterPos
        matchData.sets[matchData.currentSet].teamBSetterPos = teamBSetterPos
        if (refTeamAServing.current.checked || refTeamBServing.current.checked) {
            setTeamAServing(refTeamAServing.current.checked)
            setTeamBServing(refTeamBServing.current.checked)
            refTeamAServing.current.checked = !refTeamAServing.current.checked
            refTeamBServing.current.checked = !refTeamBServing.current.checked
        }
        saveMatchData()
        matchData.currentSet = matchData.currentSet + 1
        var evx = []
        setEvents(evx)
        localStorage.setItem('savedEvents', JSON.stringify(evx))
        forceUpdate(n => !n)
    }

    const doUndo = () => {
        if (events.length > 0) {
            events.splice(events.length - 1, 1);
            localStorage.setItem('savedEvents', JSON.stringify(events))
            forceUpdate(n => !n)
        }
    }

    const doShowMatch = () => {
        saveMatchData()
        localStorage.setItem('savedEvents', JSON.stringify(events))
        navigate('/matchreport', { state: matchData })
    }

    const doNewMatch = () => {
        var md = {
            teamA: matchData.teamA,
            teamB: matchData.teamB,
            teamASetterPos: matchData.teamASetterPos,
            teamBSetterPos: matchData.teamBSetterPos,
            matchDate: new Date(),
            currentSet: 1,
            sets: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        }
        var evs = []
        localStorage.setItem('savedMatchData', JSON.stringify(md))
        localStorage.setItem('savedEvents', JSON.stringify(evs))
        setMatchData(md)
        setEvents([])
        navigate('/')
    }

    const doRandom = () => {
        var evx = []
        var hsc = 0
        var asc = 0
        do {
            var tm = Math.floor(Math.random() * 2)
            if (tm >= 0 && tm < 2) {
                const buttons = ['A', 'B', 'K', 'SE', 'BH', 'F', 'HE', 'BE']
                var btn = Math.floor(Math.random() * buttons.length)
                if (btn < buttons.length) {
                    hsc += tm === 0 ? 1 : 0
                    asc += tm === 1 ? 1 : 0
                    var tp = matchData.currentSet == 5 ? 15 : 25
                    var evo = { team: tm, event: buttons[btn] }
                    evx.push(evo)
                    if ((hsc >= tp || asc >= tp) && Math.abs(hsc - asc) >= 2) {
                        break
                    }
                }
            }
        } while (1);
        setEvents(evx)
        localStorage.setItem('savedEvents', JSON.stringify(evx))
        saveMatchData()
    }

    function handleServingChange(e) {
        const value = e.target.value;
        var md = matchData
        if (e.target.name === 'teamAServing') {
            if (refTeamAServing.current.checked === false) {
                refTeamAServing.current.checked = false
                refTeamBServing.current.checked = false
            }
            else {
                refTeamAServing.current.checked = true
                refTeamBServing.current.checked = false
            }
        }
        else if (e.target.name === 'teamBServing') {
            if (refTeamBServing.current.checked === false) {
                refTeamAServing.current.checked = false
                refTeamBServing.current.checked = false
            }
            else {
                refTeamAServing.current.checked = false
                refTeamBServing.current.checked = true
            }
        }

        setTeamAServing(refTeamAServing.current.checked)
        setTeamBServing(refTeamBServing.current.checked)

        setMatchData(md)
        // setTeamAServing(md.teamAServing)
        // setTeamBServing(md.teamBServing)
        forceUpdate(n => !n)
    }

    function handleSelectChange(e) {
        const value = e.target.value;

        if (e.target.name === "teamASetterPos") {
            setTeamASetterPos(value)
        }
        else {
            setTeamBSetterPos(value)
        }

        // setMatchData({
        //     ...matchData,
        //     [e.target.name]: value
        // });
    }

    useEffect(() => {
    }, [])

    if (matchData === null) {
        return <></>
    }

    return (
        <div>
            <p className='text-md font-medium mt-1 mr-4'>SET {matchData.currentSet.toString()}</p>
            <div className='flex mt-2'>
                {
                    matchData && matchData.teamASetterPos !== 'NA' ?
                        <div>
                            <label htmlFor="my-modal" className="btn mr-4 justify-end rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">NEW SET</label>
                            <input type="checkbox" id="my-modal" className="modal-toggle" />
                            <div className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">SET {matchData.currentSet + 1}</h3>
                                    <div className="form-control w-full max-w-xs">
                                        <label className="label">
                                            <span className="label-text">{matchData.teamA} - Setter in Position</span>
                                        </label>
                                        <div className="flex justify-between">
                                            <select ref={refTeamASetterPos} className="select select-bordered select-base-300 select-md"
                                                value={teamASetterPos}
                                                name='teamASetterPos'
                                                onChange={handleSelectChange}
                                            >
                                                <option disabled selected>Setter in Position</option>
                                                <option>NA</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                                <option>6</option>
                                            </select>
                                            <div className="form-control">
                                                <label className="label cursor-pointer">
                                                    <span className="mr-6 label-text">Serving</span>
                                                    <input ref={refTeamAServing} type="checkbox" defaultChecked={matchData.sets[matchData.currentSet].teamAServing} key="1" id="cbteamA" name="teamAServing" className="checkbox checkbox-success" onChange={handleServingChange} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-control mt-6 w-full max-w-xs">
                                        <label className="label">
                                            <span className="label-text">{matchData.teamB} - Setter in Position</span>
                                        </label>
                                        <div className="flex justify-between">
                                            <select ref={refTeamBSetterPos} className="select select-bordered select-base-300 select-md"
                                                value={teamBSetterPos}
                                                name='teamBSetterPos'
                                                onChange={handleSelectChange}
                                            >
                                                <option disabled selected>Setter in Position</option>
                                                <option>NA</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                                <option>6</option>
                                            </select>
                                            <div className="form-control">
                                                <label className="label cursor-pointer">
                                                    <span className="mr-6 label-text">Serving</span>
                                                    <input ref={refTeamBServing} type="checkbox" defaultChecked={matchData.sets[matchData.currentSet].teamBServing} key="2" id="cbteamB" name="teamBServing" className="checkbox checkbox-error" onChange={handleServingChange} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-action">
                                        <label htmlFor="my-modal"
                                            onClick={() => {
                                                doNewSet()
                                            }}
                                            className="btn"
                                        >DONE</label>
                                        <label htmlFor="my-modal"
                                            // onClick={() => {
                                            //     doNewSet()
                                            // }}
                                            className="btn"
                                        >CANCEL</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <button
                            type="button"
                            onClick={() => {
                                doNewSet()
                            }}
                            className="flex mr-4 justify-end rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                        >
                            NEW SET
                        </button>
                }
                {/* <button
                type="button"
                onClick={() => {
                    doNewSet()
                }}
                className="flex mr-4 justify-end rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
                NEW SET
            </button> */}
                <button
                    type="button"
                    onClick={() => {
                        doShowMatch()
                    }}
                    className="flex mr-4 justify-end rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                    MATCH REPORT
                </button>
                <button
                    type="button"
                    onClick={() => {
                        doUndo()
                    }}
                    className="flex mr-4 justify-end rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                    UNDO
                </button>
                {/* <button
                    type="button"
                    onClick={() => {
                        doNewMatch()
                    }}
                    className="flex mr-4 justify-end rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                    NEW MATCH
                </button> */}
                <button
                    type="button"
                    onClick={() => {
                        doRandom()
                    }}
                    className="flex mr-4 justify-end rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                    RANDOM SCORING
                </button>

            </div>

            <InputScreen team={0} teamData={matchData} eventAdded={(ev) => addEvent(0, ev)} playerAdded={(pn) => addPlayer(0, pn)} />
            <div className="carousel w-screen overflow-y-hidden">
                <div className="carousel-item w-80 h-64 my-2 bg-blue-100">
                    <TrendLine matchData={matchData} events={events} order={0} />
                </div>
                <div className="carousel-item w-80 h-64 my-2 bg-blue-100">
                    <TrendLine matchData={matchData} events={events} order={1} />
                </div>
                <div className="carousel-item w-80 h-64 my-2 bg-blue-100">
                    <TrendLine matchData={matchData} events={events} order={2} />
                </div>
                <div className="carousel-item w-80 h-64 my-2 bg-blue-100">
                    <TrendLine matchData={matchData} events={events} order={3} />
                </div>
                <div className="carousel-item w-80 h-64 my-2 bg-blue-100">
                    <TrendLine matchData={matchData} events={events} order={4} />
                </div>
            </div>
            <InputScreen team={1} teamData={matchData} eventAdded={(ev) => addEvent(1, ev)} playerAdded={(pn) => addPlayer(0, pn)} />
        </div>
    )
}

export default InputPage