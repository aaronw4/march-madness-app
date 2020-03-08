import React, {useEffect, useState} from 'react';
import axios from 'axios';

const TeamStats = (props) => {
    const [teams, setTeams] = useState([]);
    const [orderedTeams, setOrderedTeams] = useState([]);
    const [matchUp, setMatchUp] = useState([]);
    const [games, setGames] = useState([]);
    const [adjOave, setAdjOave] = useState();
    const [adjTAve, setAdjTAve] = useState();
    const [update, setUpdate] = useState(0);
    const [toggle, setToggle] = useState(false);
    const [gameId, setGameId] = useState('');

    useEffect(() => {
        function fetchData() {
            axios
                .get('https://arw-march-madness.herokuapp.com/teams')
                .then(res => {
                    setTeams(res.data);
                })
                .catch(err => console.log(err))
        }
        fetchData()
    },[props.count]);

    useEffect(() => {
        function newList() {
            let list = teams.map(team => ({
                id: team.id,
                TeamName: team.TeamName,
                AdjO: team.AdjO,
                AdjD: team.AdjD,
                AdjT: team.AdjT
            }));

            let orderedList = list.sort(function(a,b) {
                var name1 = a.TeamName;
                var name2 = b.TeamName;
                if (name1 < name2) {
                    return -1
                }
                if (name1 > name2) {
                    return +1
                }
                return 0;
            });

            setOrderedTeams(orderedList);
        }
        newList();
    },[teams]);

    useEffect(() => {
        function fetchData() {
            axios
                .get('https://arw-march-madness.herokuapp.com/matchups')
                .then(res => {
                    setGames(res.data);
                })
                .catch(err => console.log(err))
        }
        fetchData();
    },[update])

    useEffect(() => {
        function averages() {
            let adjTArray = teams.map(team => team.AdjT);
            let adjTtotal = adjTArray.reduce((total, number) => total + number, 0);
            let adjTave = adjTtotal / teams.length;
            setAdjTAve(adjTave);

            let adjOArray = teams.map(team => team.AdjO);
            let adjOtotal = adjOArray.reduce((total, number) => total + number, 0);
            let adjOave = adjOtotal / teams.length;
            setAdjOave(adjOave);
        }
        averages();
    },[teams]);

    function addTeam(team) {
        setMatchUp([...matchUp, team]);
    }

    function deleteTeam(id) {        
        axios
            .delete(`https://arw-march-madness.herokuapp.com/teams/${id}`)
            .then(res => {
                console.log(res);
                props.setCount(props.count + 1);
            })
            .catch(err => console.log(err));        
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

            const possPerGame = AdjT1 * AdjT2 / adjTAve;
            const score1 = AdjO1 * AdjD2 * possPerGame / adjOave / 100;
            const score2 = AdjO2 * AdjD1 * possPerGame / adjOave / 100;
            const spread = score1 - score2;
            const total = score1 + score2;

            axios
                .post('https://arw-march-madness.herokuapp.com/matchups', {
                    TeamName1: name1,
                    TeamName2: name2,
                    Pyth1: pyth1,
                    Pyth2: pyth2,
                    Odds1: odds1,
                    Odds2: odds2,
                    Score1: score1,
                    Score2: score2,
                    Spread: spread,
                    Total: total
                })
                .then(res => {
                    console.log(res);
                    setUpdate(update + 1);
                })
                .catch(err => console.log(err));        

            setMatchUp([]);
        }
    }

    function deleteMatchup(id) {
        axios
            .delete(`https://arw-march-madness.herokuapp.com/matchups/${id}`)
            .then(res => {
                console.log(res);
                setUpdate(update + 1);
            })
            .catch(err => console.log(err)); 
    }

    function decimals(number) {
        let decimal = number.toFixed(2);
        return decimal;
    }

    function handleClick(id) {
        setToggle(!toggle);
        setGameId(id);
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
                {orderedTeams.map(team => (
                    <div key={team.id}>
                        <button className='team'  onClick={() => addTeam(team)}>Select</button>
                        <p className='team' >{team.TeamName} AdjO: {team.AdjO} AdjD: {team.AdjD} AdjT: {team.AdjT}</p>
                        <button className='team delete' onClick={() => deleteTeam(team.id)}>X</button>
                    </div>
                ))}
            </div>
            <div className='gamesCont'>
                {games.map(game => (
                    toggle === false && gameId === game.id ?  
                    <div>
                        <button className='delete deleteMatchup' onClick={() => deleteMatchup(game.id)}>X</button>
                        <table key={game.id}> 
                                <button onClick={() => handleClick(game.id)}>Close</button>
                            <tr>
                                <th colSpan='2'>Team Name</th>
                                <td colSpan='2'>{game.TeamName1}</td>
                                <td colSpan='2'>{game.TeamName2}</td>
                            </tr>
                            <tr>
                                <th colSpan='2'>Pyth</th>
                                <td colSpan='2'>{decimals(game.Pyth1)}</td>
                                <td colSpan='2'>{decimals(game.Pyth2)}</td>
                            </tr>
                            <tr>
                                <th colSpan='2'>Odds</th>
                                <td colSpan='2'>{decimals(game.Odds1)}</td>
                                <td colSpan='2'>{decimals(game.Odds2)}</td>
                            </tr>
                            <tr>
                                <th colSpan='2'>Score</th>
                                <td colSpan='2'>{decimals(game.Score1)}</td>
                                <td colSpan='2'>{decimals(game.Score2)}</td>
                            </tr>
                            <tr>
                                <td colSpan='3'>Spread: {decimals(game.Spread)}</td>
                                <td colSpan='3'>Total: {decimals(game.Total)}</td>
                            </tr>
                        </table>
                    </div>
                    :
                    <div>
                        <button className='delete deleteMatchup' onClick={() => deleteMatchup(game.id)}>X</button>
                        <table key={game.id}>
                            <button onClick={() => handleClick(game.id)}>Open</button>
                            <tr>
                                <th colSpan='2'>Team Name</th>
                                <td colSpan='2'>{game.TeamName1}</td>
                                <td colSpan='2'>{game.TeamName2}</td>
                            </tr>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TeamStats