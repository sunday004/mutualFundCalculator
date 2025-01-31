import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getMutualFunds, calculateFutureValue } from '../services/api';
import MutualFundDropdown from '../components/MutualFundDropdown';
import GoldmanSachsLogo from '../styling/assets/Goldman_Sachs.svg.png';

const Calculator = () => {
    const [funds, setFunds] = useState([]);
  const [selectedFunds, setSelectedFunds] = useState([
    { id: 1, name: 'Fund 1', ticker: '', initialInvestment: '', timeHorizon: '', monthlyInvestment: '' },
  ]);
  const [results, setResults] = useState([]);

  const formatNumber = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString();
  };
  
  useEffect(() => {
    // Fetch available mutual funds
    const fetchFunds = async () => {
      const data = await getMutualFunds();
      setFunds(data);
    };
    fetchFunds();
  }, []);

  const handleAddFund = () => {
    // Add a new fund if there are less than 2 funds
    if (selectedFunds.length < 2) {
      const newId = selectedFunds.length + 1; // Assign new ID
      setSelectedFunds([
        ...selectedFunds,
        { 
          id: newId, 
          name: `Fund ${newId}`,  // Make sure we add the correct name for the fund
          ticker: '', 
          initialInvestment: '', 
          timeHorizon: '', 
          monthlyInvestment: '' 
        },
      ]);
    }
  };
  
  const handleRemoveFund = (id) => {
    const updatedFunds = selectedFunds.filter(fund => fund.id !== id);
    setSelectedFunds(updatedFunds);
    setResults(results.filter(result => result.id !== id));
  
    // Check if there's only one fund left, and rename it to "Fund 1"
    if (updatedFunds.length === 1) {
      updatedFunds[0].name = "Fund 1"; // Automatically rename the last remaining fund
      setSelectedFunds(updatedFunds); // Update the funds state
    }
  };
  
  const updateFund = (id, field, value) => {
    setSelectedFunds(selectedFunds.map(fund =>
      fund.id === id ? { ...fund, [field]: value } : fund
    ));
  };
  

  const handleCalculate = async () => {
    try {
      const response = await calculateFutureValue({ funds: selectedFunds });
      setResults(response);
    } catch (error) {
      console.error("Error calculating future value:", error);
    }
  };

  return (
    <div className="calculator container">
      <div className="logo-container">
        <img src={GoldmanSachsLogo} alt='goldman sachs logo' className='goldman-logo'/>
      </div>
      <h1>mutual fund calculator.</h1>
      {selectedFunds.map((fund) => (
        <div key={fund.id} className="calculator-form">
          <h3>{fund.name}</h3>
          <div className="form-grid">
            <div className="form-group wide">
              <label>Select a Mutual Fund</label>
              <MutualFundDropdown 
                funds={funds}
                selectedFund={fund.ticker}
                onChange={(ticker) => updateFund(fund.id, 'ticker', ticker)}
              />
            </div>

            <div className="form-group narrow">
              <label>Initial Investment Amount ($)</label>
              <input
                className='small-input'
                type="text"
                value={fund.initialInvestment ? formatNumber(fund.initialInvestment) : ""}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/[^0-9]/g, '');
                  updateFund(fund.id, 'initialInvestment', rawValue);
                }}
                placeholder="e.g., 10000"
              />
            </div>

            <div className="form-group narrow">
              <label>Time Horizon (Years)</label>
              <input
                className='small-input'
                type="text"
                value={fund.timeHorizon}
                onChange={(e) => updateFund(fund.id, 'timeHorizon', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder='e.g., 5'
              />
            </div>

          </div>

          {selectedFunds.length > 1 && (
            <button onClick={() => handleRemoveFund(fund.id)} className="remove-btn">
              Remove Fund
            </button>
          )}
        </div>
      ))}

      <div className="button-group">
        {selectedFunds.length < 2 && (
          <button onClick={handleAddFund} className="add-btn">
            + Add Another Fund
          </button>
        )}
        <button onClick={handleCalculate} className="calculate-btn">
          Calculate
        </button>
      </div>

      {results.length > 0 && (
        <div className="results">
          <h2>Results Summary</h2>

          <div className="summary-table">
            <table>
              <thead>
                <tr>
                  <th className="metrics-header">Metrics</th>
                  {results.map((result) => (
                    <th key={result.ticker} className="fund-header">
                      {result.ticker}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Initial Investment ($)</td>
                  {results.map((result) => (
                    <td key={`initial-${result.ticker}`}>${formatNumber(result.initialInvestment)}</td>
                  ))}
                </tr>
                <tr>
                  <td>Time Horizon (Years)</td>
                  {results.map((result) => (
                    <td key={`time-${result.ticker}`}>{result.timeHorizon}</td>
                  ))}
                </tr>
                <tr>
                  <td>Return Rate (%)</td>
                  {results.map((result) => (
                    <td key={`return-${result.ticker}`}>{parseFloat(result.marketReturn * 100).toFixed(2)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>Risk-Free Rate (%)</td>
                  {results.map((result) => (
                    <td key={`risk-${result.ticker}`}>4.57 %</td>
                  ))}
                </tr>
                <tr>
                  <td>Beta</td>
                  {results.map((result) => (
                    <td key={`beta-${result.ticker}`}>{result.beta}</td>
                  ))}
                </tr>
                <tr>
                  <td>Earnings ($)</td>
                  {results.map((result) => (
                    <td key={`earnings-${result.ticker}`} className="earnings">
                      ${formatNumber(Math.round(result.futureValue))}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Total Balance ($)</td>
                  {results.map((result) => (
                    <td key={`total-${result.ticker}`}>
                      ${formatNumber(Math.round(result.futureValue) + Number(result.initialInvestment))}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="chart">
            <LineChart width={600} height={300}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              {results.map((result, index) => (
                <>
                  <Line key={`balance-${result.ticker}`} type="monotone" dataKey="balance" stroke={index === 0 ? "#2563eb" : "#7c3aed"} name={`${result.ticker} Balance`} />
                  <Line key={`earnings-${result.ticker}`} type="monotone" dataKey="earnings" stroke={index === 0 ? "#16a34a" : "#db2777"} name={`${result.ticker} Earnings`} />
                </>
              ))}
            </LineChart>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
