// pages/HistoryPage.js
import React, { useState } from 'react';

const HistoryPage = () => {
  const [history] = useState([
    {
      id: 1,
      fundName: 'Mutual Fund 1',
      initialAmount: 10000,
      timeHorizon: 10,
      earnings: 38162.71,
      totalBalance: 48162.71,
    },
    {
      id: 2,
      fundName: 'Mutual Fund 2',
      initialAmount: 5000,
      timeHorizon: 5,
      earnings: 12150.45,
      totalBalance: 17150.45,
    },
  ]);

  return (
    <div className="history-page">
      <h1>Calculation History</h1>
      <table>
        <thead>
          <tr>
            <th>Fund Name</th>
            <th>Initial Amount</th>
            <th>Time Horizon (years)</th>
            <th>Earnings</th>
            <th>Total Balance</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.fundName}</td>
              <td>${entry.initialAmount.toLocaleString()}</td>
              <td>{entry.timeHorizon}</td>
              <td>${entry.earnings.toLocaleString()}</td>
              <td>${entry.totalBalance.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryPage;
