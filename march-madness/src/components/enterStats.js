import React, {useState} from 'react';
import axios from 'axios';

const Stats = (props) => {
    const [name, setName] = useState();
    const [adjO, setAdjO] = useState();
    const [adjD, setAdjD] = useState();
    const [adjT, setAdjT] = useState();

    const handleName = e => {
        setName(e.target.value);
    }

    const handleAdjO = e => {
        setAdjO(e.target.value);
    }

    const handleAdjD = e => {
        setAdjD(e.target.value);
    }

    const handleAdjT = e => {
        setAdjT(e.target.value);
    }

    const submitData = e => {
        e.preventDefault();

        axios
            .post('https://arw-march-madness.herokuapp.com/teams', {
                TeamName: props.name,
                AdjO: adjO,
                AdjD: adjD,
                AdjT: adjT
            })
            .then(res => {
                console.log(res);
                props.click();
                props.setCount(props.count + 1);
            })
            .catch(err => {console.log(err)
            })
    }

    return (
        <div>
            <form onSubmit={submitData}>
                <div>
                    <input
                        type='text'
                        name='name'
                        value={props.name}
                        onChange={handleName}
                        className='input'
                    />
                    <input
                        type='number'
                        step='0.1'
                        name='adjO'
                        value={adjO}
                        placeholder='AdjO'
                        onChange={handleAdjO}
                        className='input'
                    />
                </div>
                <div>
                    <input
                        type='number'
                        step='0.1'
                        name='adjD'
                        placeholder='AdjD'
                        value={adjD}
                        onChange={handleAdjD}
                        className='input'
                    />
                    <input
                        type='number'
                        step='0.1'
                        name='adjT'
                        placeholder='AdjT'
                        value={adjT}
                        onChange={handleAdjT}
                        className='input'
                    />
                    <button>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Stats