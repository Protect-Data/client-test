const isDev = false;

const API_URL = isDev ? `http://localhost:4000` : process.env.URL_API;

export { API_URL };
