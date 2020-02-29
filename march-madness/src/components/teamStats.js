import React, {useEffect, useState} from 'react';
import axios from 'axios';

const TeamStats = (props) => {
    const [teams, setTeams] = useState([]);

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

    return (
        <div>
            {teams.map(team => (
                <div key={team.id}>
                    <p>{team.TeamName} AdjO: {team.AdjO} AdjD: {team.AdjD} AdjT: {team.AdjT}</p>
                </div>
            ))}
        </div>
    )
}

export default TeamStats