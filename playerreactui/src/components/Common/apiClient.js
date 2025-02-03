import axios from "axios";
import {
  getApiUrl,
  initialize,
} from "../../../src/components/Common/fetchConfig";

import encryptData from '../Authentication/encryptPayloadData';

let BASE_API_URL = "";

// Function to set up the base API URL
const setupApiHelper = async () => {
  await initialize();
  BASE_API_URL = getApiUrl();
};

// Common function to set headers
const getHeaders = () => {
  const token = sessionStorage.getItem("userToken");
  // console.log("userToken.." + token);
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const apiRequest = async (endpoint, payload, options = {}) => {
  await setupApiHelper();

  try {

    const payloadJSON = JSON.stringify(payload);
    const encryptedPayload = encryptData(payloadJSON);
    const response = await axios.post(`${BASE_API_URL}/${endpoint}`,
      {
        data: encryptedPayload,
      },
      {
        headers: getHeaders(),
        ...options,
      }
    );

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};


export default { apiRequest };