import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputPage from './InputPage';

function Home() {
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
    var evs = []
    localStorage.setItem('savedMatchData', JSON.stringify(md))
    localStorage.setItem('savedEvents', JSON.stringify(evs))

    navigate('/inputpage', { state: matchData })
  }

  return (
    <>
      <div className="profile">
        <header>
          <p className='pageHeader'>Match Detail</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input
              type='text'
              className='w-full my-2 pr-40 bg-gray-200 input input-md text-black'
              placeholder='Team A Name'
              name='teamA'
              value={matchData.teamA}
              onChange={handleChange}
            />
            <input
              type='text'
              className='w-full my-2 pr-40 bg-gray-200 input input-md text-black'
              placeholder='Team B Name'
              name='teamB'
              value={matchData.teamB}
              onChange={handleChange}
            />
            <label className='formLabel'>Match Date</label>
            <DatePicker
              className='w-full my-2 pr-40 bg-gray-200 input input-md text-black'
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
                className="flex mr-4 justify-end rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Start
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  )
}

export default Home