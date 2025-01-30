const { getBetaValue, marketReturnRate } = require('../services/mutualFundService');
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

// Calculate future value
/* exports.calculateFutureValue = async (req, res) => {
    const { ticker, initialInvestment, timeHorizon } = req.body;

    if (!ticker || !initialInvestment || !timeHorizon) {
        return res.status(400).json({ error: 'Missing required fields: ticker, initialInvestment, timeHorizon' });
    }

    if (!mutualFunds[ticker]) {
        return res.status(400).json({ error: `Mutual fund with ticker ${ticker} not found.` });
    }

    //const beta = mutualFunds[ticker][1];
    const beta = await getBetaValue(ticker)
    console.log(beta)
    const riskFreeRate = 0.04; // Hardcoded risk-free rate
    const marketreturn = await marketReturnRate();
    console.log(marketreturn)

    const rate = riskFreeRate + beta * (marketreturn - riskFreeRate);
    const futureValue = initialInvestment * Math.exp(rate * timeHorizon);

    res.json({
        ticker,
        initialInvestment: parseFloat(initialInvestment),
        timeHorizon: parseFloat(timeHorizon),
        futureValue: parseFloat(futureValue.toFixed(2)),
    });
}; */

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
            const marketReturn = (await marketReturnRate()).average_return;
            console.log(marketReturn)

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
            };
        }));

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
