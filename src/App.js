import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState({});
  const [anomalies, setAnomalies] = useState({});
  const [maxValues, setMaxValues] = useState({});
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(null);
  const names = ['888sport', 'betway', 'misli', 'nesine', 'unibet','bet10','marathon','tuttur'];

  useEffect(() => {
    const fetchData = async () => {
      let allData = {};
      const anomalies = await axios.get('http://localhost:8000/api/anomalies');
      const maxValues = await axios.get('http://localhost:8000/api/max');

      for (const name of names) {
        const teamsRes = await axios.get(`http://localhost:8000/api/teams/${name}`);
        const oddsRes = await axios.get(`http://localhost:8000/api/odds/${name}`);
        allData[name] = {
          teams: teamsRes.data,
          odds: oddsRes.data,
        };
      }
      setData(allData);
      setAnomalies(anomalies);
      setMaxValues(maxValues);
    };

    fetchData();
  }, []);

  const handleChange = event => {
    if (event.target.value === '') {
      return;
    }
    setSelectedTeamIndex(event.target.value);
  };

  // Teams list for dropdown menu
  let teamsList = [];
  if(data[names[0]]?.teams) { // We are taking teams from the first site only to avoid duplicates
    let index = 0;
    for (const pair in data[names[0]].teams[0]) {
      teamsList.push({team: data[names[0]].teams[0][pair], index});
      index++;
    }
  }

  return (
    <div className="container">
      <h1 className="text-center my-4">Cimri Bahis</h1>
      <select value={selectedTeamIndex} onChange={handleChange}>
        <option value="">--Please choose a team--</option>
        {teamsList.map(({team, index}) => (
          <option key={index} value={index}>{team}</option>
        ))}
      </select>
      <div className="row">
        {names.map(name => (
          <div key={name} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h2>{name}</h2>
              </div>
              <div className="card-body">
                <h3 className="card-title">Oranlar:</h3>
                {data[name]?.odds && selectedTeamIndex !== null ? (
                  <div>
                    <p className='card-text-win' style={{color: anomalies.data[selectedTeamIndex][0] !== null && anomalies.data[selectedTeamIndex][0][0] === name && maxValues.data[selectedTeamIndex][0] === name ? 'purple' : (anomalies.data[selectedTeamIndex][0] !== null && anomalies.data[selectedTeamIndex][0][0] === name ? 'red' : (maxValues.data[selectedTeamIndex][0] === name ? '#e3b409' : ''))}}>{`1: ${data[name].odds[0][selectedTeamIndex][0]}`}</p>
                    <p className='card-text-tie' style={{color: anomalies.data[selectedTeamIndex][1] !== null && anomalies.data[selectedTeamIndex][1][0] === name && maxValues.data[selectedTeamIndex][1] === name ? 'purple' : (anomalies.data[selectedTeamIndex][1] !== null && anomalies.data[selectedTeamIndex][1][0] === name ? 'red' : (maxValues.data[selectedTeamIndex][1] === name ? '#e3b409' : ''))}}>{`X: ${data[name].odds[0][selectedTeamIndex][1]}`}</p>
                    <p className='card-text-loose' style={{color: anomalies.data[selectedTeamIndex][2] !== null && anomalies.data[selectedTeamIndex][2][0] === name && maxValues.data[selectedTeamIndex][2] === name ? 'purple' : (anomalies.data[selectedTeamIndex][2] !== null && anomalies.data[selectedTeamIndex][2][0] === name ? 'red' : (maxValues.data[selectedTeamIndex][2] === name ? '#e3b409' : ''))}}>{`2: ${data[name].odds[0][selectedTeamIndex][2]}`}</p>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <div>
          <div style={{backgroundColor: 'red', maxWidth: '10px', maxHeight: '10px', marginBottom: '5px'}}>&nbsp;</div>
          <p>anomaly</p>
        </div>
        <div>
          <div style={{backgroundColor: 'purple', maxWidth: '10px', maxHeight: '10px', marginBottom: '5px'}}>&nbsp;</div>
          <p>anomaly + max</p>
        </div>
        <div>
          <div style={{backgroundColor: '#e3b409', maxWidth: '10px', maxHeight: '10px', marginBottom: '5px'}}>&nbsp;</div>
          <p>max</p>
        </div>
      </div>
    </div>
  );
};

export default App;
