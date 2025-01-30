import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getMutualFunds, calculateFutureValue } from '../services/api';
import MutualFundDropdown from '../components/MutualFundDropdown';

const Calculator = () => {
  const [funds, setFunds] = useState([]);
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Fetch available mutual funds
    const fetchFunds = async () => {
      const data = await getMutualFunds();
      setFunds(data);
    };
    fetchFunds();
  }, []);

  const handleAddFund = () => {
    //code to add an extra fund
    if (selectedFunds.length < 2) {
      setSelectedFunds([
        ...selectedFunds,
        { id: selectedFunds.length + 1, ticker: '', initialInvestment: 10000, timeHorizon: 10, monthlyInvestment: 0 },
      ]);
    }
  };

  const handleRemoveFund = (id) => {
    setSelectedFunds(selectedFunds.filter(fund => fund.id !== id));
    setResults(results.filter(result => result.id !== id));
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
      <h1>Mutual Fund Calculator</h1>

      {selectedFunds.map((fund) => (
        <div key={fund.id} className="calculator-form">
          <h3>Fund {fund.id}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Select a Mutual Fund</label>
              <MutualFundDropdown
                funds={funds}
                selectedFund={fund.ticker}
                onChange={(ticker) => updateFund(fund.id, 'ticker', ticker)}
              />
            </div>

            <div className="form-group">
              <label>Initial Investment Amount ($)</label>
              <input
                type="number"
                value={fund.initialInvestment}
                onChange={(e) => updateFund(fund.id, 'initialInvestment', Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>Time Horizon (Years)</label>
              <input
                type="number"
                value={fund.timeHorizon}
                onChange={(e) => updateFund(fund.id, 'timeHorizon', Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>Monthly Investment ($)</label>
              <input
                type="number"
                value={fund.monthlyInvestment}
                onChange={(e) => updateFund(fund.id, 'monthlyInvestment', Number(e.target.value))}
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
                    <td key={`initial-${result.ticker}`}>${result.initialInvestment}</td>
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
                    <td key={`return-${result.ticker}`}>{result.marketReturn * 100}%</td>
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
                      ${Math.round(result.futureValue)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Total Balance ($)</td>
                  {results.map((result) => (
                    <td key={`total-${result.ticker}`}>
                      ${Math.round(result.futureValue) + result.initialInvestment}
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
