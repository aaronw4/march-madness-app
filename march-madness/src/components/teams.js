import React, {useEffect, useState} from 'react';
import axiosWithAuth from './axiosWithAuth';
import EnterStats from './enterStats';
import TeamStats from './teamStats';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [list, setList] = useState([]);
    const [toggle, setToggle] = useState(false);
    const [teamId, setTeamId] = useState('');
    const [avePoints, setAvePoints] = useState();
    const [count, setCount] = useState(0);

    useEffect(() => {
        function fetchData() {
            axiosWithAuth()
                .get('/standings?league=116&season=2023-2024')
                .then(res => {
                    console.log(res);
                    setTeams(res.data.response[0])
                })
                .catch(err => console.log(err))
        }
        fetchData();        
    },[]);

    useEffect(() => {
        function total() {

        let gamesArray = teams.map(team => (team.games.played));
        let pointsArray = teams.map(team => (team.points.for));
        let games = gamesArray.reduce((total, number) => total + number, 0);
        let points = pointsArray.reduce((total, number) => total + number, 0);
        let avePointsPerGame = points/games;  

        setAvePoints(avePointsPerGame);    
        }
        total();
    },[teams]);

    useEffect(() => {
        function newList() {
            let list = teams.map(team => ({
                id: team.team.id,
                name: team.team.name,
                wins: team.games.win.total,
                loses: team.games.lose.total
            }));
            
            let orderedList = list.sort(function(a,b) {
                var name1 = a.name;
                var name2 = b.name;
                if (name1 < name2) {
                    return -1;
                }
                if (name1 > name2) {
                    return +1;
                }
                return 0;
            });
            
            setList(orderedList);
        } 
        newList();
    },[teams]);

    function handleClick(id) {
        setToggle(!toggle);
        setTeamId(id);
    }
    
    return (
        <div className='container'>
            <div>
                <h1>NCAABB Teams</h1>
                <p>Average Points/Game: {avePoints}</p>
                {list.map(team => (
                    <div key={team.id}>
                        <div>
                            <button className='team' onClick={() => handleClick(team.id)}>Enter Stats</button>
                            <p className='team teamName'>{team.name}({team.wins}-{team.loses})</p>
                        </div>
                        <div style={{display: toggle && teamId === team.id ? 'block' : 'none'}}>
                            <EnterStats click={handleClick} name={team.name} setCount={setCount} count={count}/>
                        </div>
                    </div>
                ))}
            </div>
            <TeamStats total={avePoints} setCount={setCount} count={count}/>
        </div>
    )
}

export default Teams