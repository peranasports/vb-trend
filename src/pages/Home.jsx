import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputPage from './InputPage';
import MultiChoice from '../components/layout/MultiChoice'

function Home() {
  const [, forceUpdate] = useState(0);
  const [teamAPlayersFilter, setTeamAPlayersFilter] = useState(null)
  const [teamBPlayersFilter, setTeamBPlayersFilter] = useState(null)
  const [teamAPlayers, setTeamAPlayers] = useState(JSON.parse(localStorage.getItem('teamAPlayers')) || [])
  const [teamBPlayers, setTeamBPlayers] = useState(JSON.parse(localStorage.getItem('teamBPlayers')) || [])
  const navigate = useNavigate();
  const [matchData, setMatchData] = useState
    ({
      teamA: 'Home Team',
      teamB: 'Away Team',
      matchDate: new Date(),
      currentSet: 1,
      sets: [[], [], [], [], [], [], [], [], [], []]
    })

  function handleChange(e) {
    const value = e.target.value;
    setMatchData({
      ...matchData,
      [e.target.name]: value
    });
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
    var md = {
      teamA: 'Home Team',
      teamB: 'Away Team',
      matchDate: new Date(),
      currentSet: 1,
      sets: [[], [], [], [], [], [], [], [], [], []]
    }
    var tapls = []
    for (var np=0; np< teamAPlayersFilter.selectedValues.length; np++)
    {
      var val = teamAPlayersFilter.selectedValues[np]
      tapls.push(val)
    }
    md.teamAPlayers = tapls
    var tbpls = []
    for (var np=0; np< teamBPlayersFilter.selectedValues.length; np++)
    {
      var val = teamBPlayersFilter.selectedValues[np]
      tbpls.push(val)
    }
    md.teamBPlayers = tbpls
    setMatchData(md)
    var evs = []
    localStorage.setItem('savedMatchData', JSON.stringify(md))
    localStorage.setItem('savedEvents', JSON.stringify(evs))
    localStorage.setItem('teamAPlayers', JSON.stringify(md.teamAPlayers))
    localStorage.setItem('teamBPlayers', JSON.stringify(md.teamBPlayers))

    navigate('/inputpage', { state: md })
  }

  const doOptionChanged = (filter, item) => {
    if (filter.title === 'Team A')
    {
      setTeamAPlayersFilter(filter)
    }
    else
    {
      setTeamBPlayersFilter(filter)
    }
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
      if (item.selected)
      {
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
      if (item.selected)
      {
        tB.selectedValues.push(item.name)
        if (ss.length > 0) ss += ', '
        ss += item.name
      }
      tB.items.push(item)
    }
    tB.valuesString = ss
    setTeamBPlayersFilter(tB)
  }, [])

  if (teamAPlayersFilter === null || teamBPlayersFilter === null)
  {
    return <></>
  }

  return (
    <>
      <div className="profile">
        <header>
          <p className='text-lg font-medium'>Match Detail</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input
              type='text'
              className='w-full my-2 pr-40 bg-gray-200 input input-md text-lg font-medium text-black'
              placeholder='Team A Name'
              name='teamA'
              value={matchData.teamA}
              onChange={handleChange}
            />
            <div className="collapse">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">
                Click for Roster :  {teamAPlayersFilter.valuesString}
              </div>
              <div className="collapse-content">
                <MultiChoice filter={teamAPlayersFilter}
                  handleOptionChanged={(filter, item) => doOptionChanged(filter, item)}>
                </MultiChoice>
              </div>
            </div>
            <input
              type='text'
              className='w-full my-2 pr-40 bg-gray-200 input input-md text-lg font-medium text-black'
              placeholder='Team B Name'
              name='teamB'
              value={matchData.teamB}
              onChange={handleChange}
            />
            <div className="collapse">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">
                Click for Roster :  {teamBPlayersFilter.valuesString}
              </div>
              <div className="collapse-content">
                <MultiChoice filter={teamBPlayersFilter}
                  handleOptionChanged={(filter, item) => doOptionChanged(filter, item)}>
                </MultiChoice>
              </div>
            </div>
            <label className='text-lg font-medium'>Match Date</label>
            <DatePicker
              className='w-full my-2 pr-40 bg-gray-200 input input-md text-lg font-medium text-black'
              name='matchDate'
              selected={matchData.matchDate}
              // onSelect={handleDateSelect} //when day is clicked
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