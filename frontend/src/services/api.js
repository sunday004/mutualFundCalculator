import axios from 'axios';

// Base URL for the backend
//const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://mutualfundcalculator.onrender.com';


export const getMutualFunds = async () => {
    const response = await axios.get(`${BASE_URL}/mutual-funds`);
    return response.data;
};

export const calculateFutureValue = async (data) => {
    console.log(data);
    const response = await axios.post(`${BASE_URL}/mutual-funds/calculate-fv`, data);
    return response.data;
};

// export const getYearAverages = async () => {
//     try {
//         const response = await axios.get(`${BASE_URL}/mutual-funds/year-averages`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching year averages:", error);
//         throw error;
//     }
// };
