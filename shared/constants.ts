/** Port to host server on. */
export const PORT: number = 3001;

/** Whether to host the react site. Also turns off sequlize altering. */
export const PRODUCTION: boolean = false;

/** The api url for development. Sets up vite proxy. */
export const DEV_API_URL = "https://3001.grayjn.com/api";

/** The allowed hosts for vite. */
export const DEV_VITE_HOSTS = ["3002.grayjn.com"];