import React, {useEffect, useState} from 'react';
import axios from 'axios';

const TeamStats = (props) => {
    const [teams, setTeams] = useState([]);
    const [matchUp, setMatchUp] = useState([]);
    const [games, setGames] = useState([]);

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

    function calculateOdds() {

        if (matchUp.length === 2) {
            const name1 = matchUp[0].TeamName;
            const AdjO1 = matchUp[0].AdjO;
            const AdjD1 = matchUp[0].AdjD;
            const AdjT1 = matchUp[0].AdjT;
            const name2 = matchUp[1].TeamName;
            const AdjO2 = matchUp[1].AdjO;
            const AdjD2 = matchUp[1].AdjD;
            const AdjT2 = matchUp[1].AdjT;
            
            const pyth1 = Math.pow(AdjO1, 10.25)/(Math.pow(AdjO1, 10.25) + Math.pow(AdjD1, 10.25));
            const pyth2 = Math.pow(AdjO2, 10.25)/(Math.pow(AdjO2, 10.25) + Math.pow(AdjD2, 10.25));

            const odds1 = 100*((pyth1-pyth1*pyth2)/(pyth1+pyth2-2*pyth1*pyth2));
            const odds2 = 100*((pyth2-pyth1*pyth2)/(pyth1+pyth2-2*pyth1*pyth2));


            setGames([
                ...games,
            {
                name1: name1,
                pyth1: pyth1,
                odds1: odds1,
                name2: name2,
                pyth2: pyth2,
                odds2: odds2
            }]);

            setMatchUp([]);
        }
    }

    return (
        <div className='container'>
            <div>
                {matchUp.map(team => (
                    <div className='matchUp' key={team.id}>                        
                        <p>{team.TeamName} AdjO: {team.AdjO} AdjD: {team.AdjD} AdjT: {team.AdjT}</p>
                    </div>
                ))}
                {matchUp.length === 2 ? <div className='buttonCont'><button className='submit' onClick={() => calculateOdds()}>Submit</button></div> : null}
                {teams.map(team => (
                    <div key={team.id}>
                        <button className='team'  onClick={() => addTeam(team)}>Select</button>
                        <p className='team' >{team.TeamName} AdjO: {team.AdjO} AdjD: {team.AdjD} AdjT: {team.AdjT}</p>
                    </div>
                ))}
            </div>
            <div className='gamesCont'>
                {games.map(game => (
                    <div>
                        <p>{game.name1} Pyth:{game.pyth1} Odds:{game.odds1}</p>
                        <p>{game.name2} Pyth:{game.pyth2} Odds:{game.odds2}</p>
                        <p></p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TeamStats