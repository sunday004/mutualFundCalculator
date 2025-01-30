//import axios from 'axios'
const axios = require('axios');
const { parse } = require('path');
const dayjs = require('dayjs');


const getBetaValue = async (ticker) => {
    try{
        let url = `https://api.newtonanalytics.com/stock-beta/?ticker=${ticker}&index=^GSPC&interval=1mo%E2%80%8B&observations=12`;
        const response = await axios.get(url);
        
        
        return response.data.data;
    } catch (error) {
        console.error("Error fetching beta value:", error.message);
        throw new Error("Error fetching beta value")
    }
    
};

/* const getBetaValues = async (tickers) => {
    try {
        const betaPromises = tickers.map(async (ticker) => {
            const url = `https://api.newtonanalytics.com/stock-beta/?ticker=${ticker}&index=^GSPC&interval=1mo%E2%80%8B&observations=12`;
            const response = await axios.get(url);
            return { ticker, beta: response.data };
        });

        const betaResults = await Promise.all(betaPromises);
        return betaResults.reduce((acc, { ticker, beta }) => ({ ...acc, [ticker]: beta }), {});
    } catch (error) {
        console.error("Error fetching beta values:", error.message);
        throw new Error("Failed to fetch beta values.");
    }
}; */


const marketReturnRate = async () => {
    base_url = "https://api.stlouisfed.org/fred/series/observations?series_id=SP500&api_key=d26079fc190512773ac705629a92f8ea&file_type=json"
    
    const start_date = "2015-01-01";
    const end_date = "2024-12-31";

    try {
        const response = await axios.get(base_url, {
            params: {
                observation_start: start_date,
                observation_end: end_date,
            },
        });

        if (!response.data || !response.data.observations) {
            throw new Error("No data recieved from API")
        }
        let data = response.data.observations.map(obs => ({
            date: dayjs(obs.date),
            value: parseFloat(obs.value)
        })).filter(entry => !isNaN(entry.value));

        let totalReturn = 0;
        let yearCount = 0;

        for (let year = 2015; year <= 2025; year++) {
            let yearData = data.filter(entry => entry.date.year() === year);
            if (yearData.length > 1) {
                let firstDay = yearData[0];
                let lastDay = yearData[yearData.length - 1];

                let yearReturn = (lastDay.value - firstDay.value) / firstDay.value;
                totalReturn += yearReturn;
                yearCount++;
            }
        }
        console.log(totalReturn)
        console.log("years", yearCount)

        const averageReturn = totalReturn / yearCount;
        return {average_return: averageReturn.toFixed(4)};
    } catch (error) {
        console.error("Error fetching market return rate:", error.message);
        return {error: `API request failed: ${error.message}`};
    }
};

module.exports = {
    getBetaValue,
    marketReturnRate,
};
