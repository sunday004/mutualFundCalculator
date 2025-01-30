import axios from 'axios';

// Base URL for the backend
//const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';


export const getMutualFunds = async () => {
    const response = await axios.get(`${BASE_URL}/mutual-funds`);
    return response.data;
};

export const calculateFutureValue = async (data) => {
    console.log(data);
    const response = await axios.post(`${BASE_URL}/mutual-funds/calculate-fv`, data);
    return response.data;
};
