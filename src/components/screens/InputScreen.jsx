import React from 'react'

function InputScreen({ team, teamData, eventAdded, playerAdded }) {

  const buttons = ['A', 'B', 'K', 'SE', 'BH', 'F', 'HE', 'BE', 'TO']

  const players = () =>
  {
    return team === 0 ? teamData.teamAPlayers : teamData.teamBPlayers
  }

  const doButton = (name) => {
    eventAdded(name)
  }

  const doPlayerButton = (pname) => {
    playerAdded(pname)
  }

  return (
    <>
      {team === 0 ?
        <div className='mt-2'>
          <p className='text-md font-bold'>{teamData.teamA.toUpperCase()}</p>
        </div>
        : <></>
      }
      <div>
        {buttons.map(btnname =>
            <button key={btnname} tabIndex={0}
              type="button"
              onClick={() => {
                doButton(btnname)
              }}
              className={team === 1 ? "mr-1.5 mt-1 rounded-md border border-transparent bg-red-600 px-2 md:px-6 py-1 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto" : 
              "mr-1.5 mt-1 rounded-md border border-transparent bg-green-600 px-2 md:px-6 py-1 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"}>
              {btnname}
            </button>
        )}
      </div>
      <div>
        {players() && players().map(pname =>
            <button key={pname} tabIndex={0}
              type="button"
              onClick={() => {
                doPlayerButton(pname)
              }}
              className={team === 1 ? "mr-1.5 mt-1 rounded-md border border-transparent bg-red-600 px-2 md:px-6 py-1 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto" : 
              "mr-1.5 mt-1 rounded-md border border-transparent bg-green-600 px-2 md:px-6 py-1 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"}>
              {pname}
            </button>
        )}
      </div>

      {team === 1 ?
        <div className='mt-1'>
          <p className='text-md font-bold'>{teamData.teamB.toUpperCase()}</p>
        </div>
        : <></>
      }

    </>
  )
}

export default InputScreen