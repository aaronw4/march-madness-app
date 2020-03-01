import React, {useEffect, useState} from 'react';
import axios from 'axios';

const TeamStats = (props) => {
    const [teams, setTeams] = useState([]);
    const [matchUp, setMatchUp] = useState([]);
    // const [games, setGames] = useState([]);

    useEffect(() => {
        function fetchData() {
            axios
                .get('https://arw-march-madness.herokuapp.com/teams')
                .then(res => {
                    console.log(res.data);
                    setTeams(res.data);
                })
                .catch(err => console.log(err))
        }
        fetchData()
    },[props.toggle]);

    // useEffect(() => {
    //     function fetchData() {

    //     }
    // });

    function addTeam(team) {
        setMatchUp([...matchUp, team]);
    }

    return (
        <div>
            {matchUp.map(team => (
                <div>
                    <p>{team.TeamName} AdjO: {team.AdjO} AdjD: {team.AdjD} AdjT: {team.AdjT}</p>
                </div>
            ))}
            {teams.map(team => (
                <div key={team.id}>
                    <button className='team'  onClick={() => addTeam(team)}>Select</button>
                    <p className='team' >{team.TeamName} AdjO: {team.AdjO} AdjD: {team.AdjD} AdjT: {team.AdjT}</p>
                </div>
            ))}
        </div>
    )
}

export default TeamStats