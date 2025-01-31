const { getBetaValue, marketReturnRate, yearlyAverage} = require('../services/mutualFundService');
//const getBetaValue = require('../services/mutualFundService');
//const services = require('../services/mutualFundService');


// Hardcoded list of mutual funds that run on s&p 500 index
const mutualFunds = {
    FXAIX: ['Fidelity 500 Index Fund'],
    VFIAX: ['Vanguard 500 Index Fund;Admiral'],
    SWPPX: ['Schwab S&P 500 Index Fund'],
    VFFSX: ['Vanguard 500 Index Fund;Institutional Select'],
    VIIIX: ['Vanguard Institutional Index Fund;Inst Plus'],
    VINIX: ['Vanguard Institutional Index Fund;Institutional'],
    FUSEX: ['Fidelity Spartan 500 Index Fund;Investor'],
};


// Get list of mutual funds
exports.getMutualFunds = (req, res) => {
    const fundList = Object.entries(mutualFunds).map(([ticker, [name]]) => ({
        ticker,
        name,
    }));
    res.json(fundList);
};


exports.calculateFutureValue = async (req, res) => {
    console.log("Received request body:", req.body)

    const { funds } = req.body; // Expecting an array of funds

    if (!Array.isArray(funds) || funds.length === 0) {
        return res.status(400).json({ error: 'At least one mutual fund must be provided.' });
    }

    try {
        const results = await Promise.all(funds.map(async (fund) => {
            const { ticker, initialInvestment, timeHorizon } = fund;
            if (!ticker || !initialInvestment || !timeHorizon) {
                throw new Error(`Missing fields for ${ticker}`);
            }
            console.log("ticker: ", ticker)
            const beta = await getBetaValue(ticker);
            console.log("beta value", beta)
            const riskFreeRate = 0.04;
            const marketData = (await marketReturnRate());
            console.log("marketData: ", marketData);
            const marketReturn = marketData.average_return;
            const historicalData = await yearlyAverage();

            console.log(marketReturn)
            console.log("historical: ",historicalData);

            const rate = riskFreeRate + beta * (marketReturn - riskFreeRate);
            const futureValue = initialInvestment * Math.exp(rate * timeHorizon);
            
            console.log("market: ",marketReturn)
            return {
                ticker,
                initialInvestment,
                timeHorizon,
                beta,
                marketReturn,
                futureValue: futureValue.toFixed(2),
                historicalData,
            };
        }));

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// exports.getYearAverages = async (req, res) => {
//     try {
//         const result = await marketReturnRate();
//         console.log("Yearly Averages Result:", result.year_averages);
        
//         if (result.error) {
//             return res.status(500).json({ error: result.error });
//         }
//         res.json(result.year_averages);
//     } catch (error) {
//         console.error("Error fetching year averages:", error);
//         res.status(500).json({ error: error.message });
//     }
// };