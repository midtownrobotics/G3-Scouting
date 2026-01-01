# G3 Scout-o-matic (v4.1)

The G3 Scout-o-matic is a fully online scouting and event management system built with **Node.js** and **React**.

It helps robotics teams handle data collection, match prep, scheduling, and team coordination with ease.

---

## Docs

- [Admin](./admin.md)
- [Settings](./settings.md)
- [Scheduling](./scheduling.md)
- [Form Maker](./formMaker.md)
- [All Other Pages](./other.md)

Data page docs are coming soon...

## Features

- Schedule development
- Match assignment
- Custom form creation
- Data analysis tools
- Built-in pit monitor
- Robot battery tracker
- Slack reminders
- and more!

## Setup

This setup assumes you have [Git CLI](https://git-scm.com/install/) as well as Node and NPM which can be installed using the [Node Version Manager (NVM)](https://www.nvmnode.com/guide/download.html).

1. Clone the repo
```bash
git clone https://github.com/midtownrobotics/G3-Scouting.git
```
2. Install all dependencies
```bash
npm install
```
3. Setup config in ./shared/config.ts. You will have to create the file in this location.
```typescript
/** Port to host backend server on. */
export const PORT: number = 8080;

/** Whether to host the react site on the express server. Also turns off sequelize altering. */
export const PRODUCTION: boolean = true;

/** URL that the server is hosted on. Used for slack redirecting. Omit last `/` */
export const SITE_URL: string = "https://g3.grayjn.com";

// Below are only needed for development but still required in file

/** Port to host the vite server on. */
export const DEV_VITE_PORT: number = 8081;

/** The api url for development. Sets up vite proxy. */
export const DEV_API_URL = "http://localhost:8080/api";

/** The websocket url for development. Sets up vite proxy. */
export const DEV_WS_URL = "ws://localhost:8080";

/** The allowed hosts for vite. */
export const DEV_VITE_HOSTS = ["g3.grayjn.com"];
```
4. Compile the React Vite project and Express server
```bash
npm run build
```
5. Run the backend server
```bash
npm run prod
```
6. Your server should be up and running! The default username is `admin` and the password is `password`. Check out the other docs to setup and use the software.