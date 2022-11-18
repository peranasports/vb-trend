import { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TrendLine from '../components/screens/TrendLine';
import Pdf from 'react-to-pdf'

function MatchPage() {
    const { state } = useLocation();
    const ref = useRef(null)
    const options = {
        orientation: 'portrait',
    };

    return (
        <div className="App">
            <Pdf targetRef={ref} options={options} scale={2} x={10} y={10} filename="code-example.pdf">
                {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
            </Pdf>
            <div ref={ref}>
                <h1 className='mt-4 text-xl text-base font-bold'>{state.teamA.toUpperCase()} vs {state.teamA.toUpperCase()}</h1>
                <h2 className='my-4 text-lg font-bold'>{state.matchDate.toDateString()}</h2>
                {state.sets.filter(obj => obj.events !== undefined).map(set =>
                <div className="w-full h-72">
                    <p className='text-md font-medium'>SET {set.setNumber}</p>
                    <TrendLine events={set.events} order={-1} key={set.setNumber} />
                </div>
                )}
            </div>
        </div>
    );
}
export default MatchPage;