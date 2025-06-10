/** Port to host server on. */
export const PORT: number = 3001;

/** Whether to host the react site. Also turns off sequlize altering. */
export const PRODUCTION: boolean = false;

/** Base URL for the backend API. Can be site relative. */
export const BASE_API_URL = PRODUCTION ? "/api" : "https://3001.grayjn.com/api"

/** Whether to use the authHandler for express requests. */
export const ENABLE_AUTH: boolean = PRODUCTION;