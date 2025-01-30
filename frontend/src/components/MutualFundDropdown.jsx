import React from 'react';


const MutualFundDropdown = ({ funds, selectedFund, onChange }) => {
    return (
        <div className="dropdown">
            <label htmlFor="fund-select">Select a Mutual Fund</label>
            <select id="fund-select" value={selectedFund} onChange={(e) => onChange(e.target.value)}>
                <option value="">-- Choose an Option --</option>
                {funds.map((fund) => (
                    <option key={fund.ticker} value={fund.ticker}>
                        {fund.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default MutualFundDropdown;
