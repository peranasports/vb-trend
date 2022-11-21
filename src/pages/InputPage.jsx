import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import InputScreen from '../components/screens/InputScreen'
import MatchReport from '../components/screens/MatchReport';
import TrendLine from '../components/screens/TrendLine'

function InputPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [matchData, setMatchData] = useState(JSON.parse(localStorage.getItem('savedMatchData')) || state)
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

    function saveMatchData() {
        var setData = { setNumber: matchData.currentSet, events: events }
        matchData.sets[matchData.currentSet - 1] = setData
        localStorage.setItem('savedMatchData', JSON.stringify(matchData))
        setMatchData(matchData)
        console.log(matchData)
    }

    const doNewSet = () => {
        saveMatchData()
        matchData.currentSet = matchData.currentSet + 1
        var evx = []
        setEvents(evx)
        localStorage.setItem('savedEvents', JSON.stringify(evx))
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
            teamA: 'Home Team',
            teamB: 'Away Team',
            matchDate: new Date(),
            currentSet: 1,
            sets: [[], [], [], [], [], [], [], [], [], []]
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

    useEffect(() => {
        // setMatchData(state)
        // setEvents([])
        // setMatchData(state)
    }, [])

    if (matchData === null) {
        return <></>
    }

    return (
        <div>
            <p className='text-md font-medium mt-1 mr-4'>SET {matchData.currentSet.toString()}</p>
            <div className='flex mt-2'>
                <button
                    type="button"
                    onClick={() => {
                        doNewSet()
                    }}
                    className="flex mr-4 justify-end rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                    NEW SET
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
                        doNewMatch()
                    }}
                    className="flex mr-4 justify-end rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                    NEW MATCH
                </button>
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

            <InputScreen team={0} teamname={matchData.teamA} eventAdded={(ev) => addEvent(0, ev)} />
            <div className="carousel w-screen overflow-y-hidden">
                <div className="carousel-item w-80 h-64 my-2 bg-blue-100">
                    <TrendLine events={events} order={0} />
                </div>
                <div className="carousel-item w-80 h-64 my-2 bg-blue-100">
                    <TrendLine events={events} order={1} />
                </div>
                <div className="carousel-item w-80 h-64 my-2 bg-blue-100">
                    <TrendLine events={events} order={2} />
                </div>
                <div className="carousel-item w-80 h-64 my-2 bg-blue-100">
                    <TrendLine events={events} order={3} />
                </div>
            </div>
            <InputScreen team={1} teamname={matchData.teamB} eventAdded={(ev) => addEvent(1, ev)} />
        </div>
    )
}

export default InputPage