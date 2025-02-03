let ApiUrl = "";

let PlayerUrl = "";

let BuildTime = "";

const fetchBaseUrl = async () => {
  try {
    const response = await fetch("/playerreact/config.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    ApiUrl = data.REACT_APP_API_URL;
    PlayerUrl = data.REACT_APP_PLAYER_URL;     
    BuildTime = data.REACT_APP_BUILD; 
    
    
    // Set the base URL
    //console.log("BaseURL fetched:", ApiUrl);
    //console.log("PlayerURL fetched:", PlayerUrl);
  } catch (error) {
    console.error("Error fetching base URL:", error);
    throw error;
  }
};

// Function to get the base URL
const getApiUrl = () => {
  return ApiUrl;
};

const getPlayerUrl = () => {
  return PlayerUrl;
};

const getBuildTime = () => {
  return BuildTime;
};

// Initialize the base URL when the module is loaded
const initialize = async () => {
  await fetchBaseUrl();
};

export { initialize, getApiUrl, getPlayerUrl, getBuildTime };
