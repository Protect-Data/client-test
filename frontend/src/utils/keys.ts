const isDev = process.env.IS_LOCAL;

// const API_URL = isDev ? `http://localhost:4000` : process.env.URL_API;
const API_URL = process.env.URL_API;

export { API_URL };
