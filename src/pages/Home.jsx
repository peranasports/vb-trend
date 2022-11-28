import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputPage from './InputPage';
import MultiChoice from '../components/layout/MultiChoice'

function Home() {
  const refTeamAServing = useRef(null)
  const refTeamBServing = useRef(null)

  const navigate = useNavigate();
  const [, forceUpdate] = useState(0);
  const [teamAPlayersFilter, setTeamAPlayersFilter] = useState(null)
  const [teamBPlayersFilter, setTeamBPlayersFilter] = useState(null)
  const [teamA, setTeamA] = useState(JSON.parse(localStorage.getItem('teamA')) || 'Home Team')
  const [teamB, setTeamB] = useState(JSON.parse(localStorage.getItem('teamB')) || 'Away Team')
  const [teamAServing, setTeamAServing] = useState(true)
  const [teamBServing, setTeamBServing] = useState(false)
  const [teamAPlayers, setTeamAPlayers] = useState(JSON.parse(localStorage.getItem('teamAPlayers')) || [])
  const [teamBPlayers, setTeamBPlayers] = useState(JSON.parse(localStorage.getItem('teamBPlayers')) || [])
  const [teamASetterPos, setTeamASetterPos] = useState(JSON.parse(localStorage.getItem('teamASetterPos')) || 'NA')
  const [teamBSetterPos, setTeamBSetterPos] = useState(JSON.parse(localStorage.getItem('teamBSetterPos')) || 'NA')
  const [matchData, setMatchData] = useState
    ({
      teamA: teamA,
      teamB: teamB,
      teamASetterPos: teamASetterPos,
      teamBSetterPos: teamBSetterPos,
      teamAServing: teamAServing,
      teamBServing: teamBServing,
      matchDate: new Date(),
      currentSet: 1,
      sets: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
    })

  function handleChange(e) {
    const value = e.target.value;
    setMatchData({
      ...matchData,
      [e.target.name]: value
    });
  }

  function handleSelectChange(e) {
    const value = e.target.value;
    setMatchData({
      ...matchData,
      [e.target.name]: value
    });

    if (e.target.name === "teamASetterPos")
    {
        setTeamASetterPos(value)
    }
    else
    {
        setTeamBSetterPos(value)
    }

  }

  function handleDateChange(e) {
    const value = e
    setMatchData({
      ...matchData,
      matchDate: value
    });
  }

  const onSubmit = async (e) => {
    e.preventDefault()
  }

  const doInput = () => {
    var md = matchData
    // {
    //   teamA: 'Home Team',
    //   teamB: 'Away Team',
    //   matchDate: new Date(),
    //   currentSet: 1,
    //   sets: [[], [], [], [], [], [], [], [], [], []]
    // }
    md.sets = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
    var tapls = []
    for (var np = 0; np < teamAPlayersFilter.selectedValues.length; np++) {
      var val = teamAPlayersFilter.selectedValues[np]
      tapls.push(val)
    }
    md.teamAPlayers = tapls
    var tbpls = []
    for (var np = 0; np < teamBPlayersFilter.selectedValues.length; np++) {
      var val = teamBPlayersFilter.selectedValues[np]
      tbpls.push(val)
    }
    md.teamBPlayers = tbpls
    if (refTeamAServing.current.checked || refTeamBServing.current.checked)
    {
      for (var ns=0; ns<10; ns++)
      {
        md.sets[ns].teamAServing = ns % 2 == 0 ? refTeamAServing.current.checked : !refTeamAServing.current.checked
        md.sets[ns].teamBServing =  ns % 2 == 0 ? refTeamBServing.current.checked : !refTeamBServing.current.checked
        md.sets[ns].teamASetterPos = teamASetterPos
        md.sets[ns].teamBSetterPos = teamBSetterPos
      }
    }
    else
    {
      for (var ns=0; ns<10; ns++)
      {
        md.sets[ns].teamASetterPos = 'NA'
        md.sets[ns].teamBSetterPos = 'NA'
      }
  }
    md.teamAServing = refTeamAServing.current.checked
    md.teamBServing = refTeamBServing.current.checked
    setMatchData(md)
    var evs = []
    localStorage.setItem('savedMatchData', JSON.stringify(md))
    localStorage.setItem('savedEvents', JSON.stringify(evs))
    localStorage.setItem('teamA', JSON.stringify(md.teamA))
    localStorage.setItem('teamB', JSON.stringify(md.teamB))
    localStorage.setItem('teamAPlayers', JSON.stringify(md.teamAPlayers))
    localStorage.setItem('teamBPlayers', JSON.stringify(md.teamBPlayers))
    localStorage.setItem('teamASetterPos', JSON.stringify(md.teamASetterPos))
    localStorage.setItem('teamBSetterPos', JSON.stringify(md.teamBSetterPos))

    navigate('/inputpage', { state: md })
  }

  const doOptionChanged = (filter, item) => {
    if (filter.title === 'Team A') {
      setTeamAPlayersFilter(filter)
    }
    else {
      setTeamBPlayersFilter(filter)
    }
    forceUpdate(n => !n)
  }

  function handleServingChange(e) {
    const value = e.target.value;
    var md = matchData
    if (e.target.name === 'teamAServing') {
      if (refTeamAServing.current.checked === false)
      {
        refTeamAServing.current.checked = false
        refTeamBServing.current.checked = false    
      }
      else
      {
        refTeamAServing.current.checked = true
        refTeamBServing.current.checked = false   
      }
    }
    else if (e.target.name === 'teamBServing') {
      if (refTeamBServing.current.checked === false)
      {
        refTeamAServing.current.checked = false
        refTeamBServing.current.checked = false    
      }
      else
      {
        refTeamAServing.current.checked = false
        refTeamBServing.current.checked = true   
      }
    }
    
    setMatchData(md)
    setTeamAServing(md.teamAServing)
    setTeamBServing(md.teamBServing)
    // setMatchData({
    //   ...matchData,
    //   [e.target.name]: value
    // });
    forceUpdate(n => !n)
  }

  useEffect(() => {
    var tA =
    {
      title: "Team A",
      allselected: false,
      singleSelection: false,
    }
    tA.items = []
    tA.selectedValues = []
    var ss = ''
    for (var n = 0; n < 100; n++) {
      var item =
      {
        name: n.toString(),
        selected: teamAPlayers && teamAPlayers.filter(obj => obj === n.toString()).length > 0,
        amount: 0
      }
      if (item.selected) {
        tA.selectedValues.push(item.name)
        if (ss.length > 0) ss += ', '
        ss += item.name
      }
      tA.items.push(item)
    }
    tA.valuesString = ss
    setTeamAPlayersFilter(tA)

    var tB =
    {
      title: "Team B",
      allselected: false,
      singleSelection: false,
    }
    tB.items = []
    tB.selectedValues = teamBPlayers
    ss = ''
    tB.selectedValues = []
    for (var n = 0; n < 100; n++) {
      var item =
      {
        name: n.toString(),
        selected: teamBPlayers && teamBPlayers.filter(obj => obj === n.toString()).length > 0,
        amount: 0
      }
      if (item.selected) {
        tB.selectedValues.push(item.name)
        if (ss.length > 0) ss += ', '
        ss += item.name
      }
      tB.items.push(item)
    }
    tB.valuesString = ss
    setTeamBPlayersFilter(tB)
  }, [])

  if (teamAPlayersFilter === null || teamBPlayersFilter === null) {
    return <></>
  }

  return (
    <>
      <div className="profile">
        <main>
          <form onSubmit={onSubmit}>
            <p className='text-lg font-medium'>Team A</p>
            <input
              type='text'
              className="input input-bordered input-success w-full max-w-xs"
              placeholder='Name'
              name='teamA'
              value={matchData.teamA}
              onChange={handleChange}
            />
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Setter in Position</span>
              </label>
              <div className="flex justify-between">
                <select className="select select-bordered select-base-300 select-md"
                  value={matchData.teamASetterPos}
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
                    <input ref={refTeamAServing} type="checkbox" key="1" id="cbteamA" name="teamAServing" className="checkbox checkbox-success" onChange={handleServingChange} />
                  </label>
                </div>
              </div>
            </div>
            <div className="collapse mt-2 collapse-plus border border-base-200 bg-base-100">
              <input type="checkbox" />
              <div className="collapse-title text-sm font-medium md:text-lg">
                Roster :  {teamAPlayersFilter.valuesString}
              </div>
              <div className="collapse-content">
                <MultiChoice filter={teamAPlayersFilter}
                  handleOptionChanged={(filter, item) => doOptionChanged(filter, item)}>
                </MultiChoice>
              </div>
            </div>
            <p className='text-lg font-medium'>Team B</p>
            <input
              type='text'
              className="input input-bordered input-error w-full max-w-xs"
              placeholder='Name'
              name='teamB'
              value={matchData.teamB}
              onChange={handleChange}
            />
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Setter in Position</span>
              </label>
              <div className="flex justify-between">
                <select className="select select-bordered select-base-300 select-md"
                  value={matchData.teamBSetterPos}
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
                    <input ref={refTeamBServing} type="checkbox" key="2" id="cbteamB" name="teamBServing" className="checkbox checkbox-error" onChange={handleServingChange} />
                  </label>
                </div>
              </div>
            </div>
            <div className="collapse mt-2 collapse-plus border border-base-200 bg-base-100">
              <input type="checkbox" />
              <div className="collapse-title text-sm font-medium md:text-lg">
                Roster :  {teamBPlayersFilter.valuesString}
              </div>
              <div className="collapse-content">
                <MultiChoice filter={teamBPlayersFilter}
                  handleOptionChanged={(filter, item) => doOptionChanged(filter, item)}>
                </MultiChoice>
              </div>
            </div>
            <label className='text-lg font-medium'>Match Date</label>
            <DatePicker
              className='w-full my-2 pr-40 bg-gray-200 input input-sm text-lg font-medium text-black md:input-md'
              name='matchDate'
              selected={matchData.matchDate}
              onChange={handleDateChange} //only when value has changed
            />
            <div className='flex mt-2'>
              <button
                type="button"
                onClick={() => {
                  doInput()
                }}
                className="flex mr-4 justify-end rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-lg font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                START
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  )
}

export default Home