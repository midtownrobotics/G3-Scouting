# G3 Scout-o-matic (v4.0)

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

1. Clone the repo
```bash
git clone https://github.com/midtownrobotics/G3-Scouting.git
```
2. Install node modules for all three node projects (shared, server, client)
```bash
npm --prefix ./shared install
npm --prefix ./server install
npm --prefix ./client install
```
3. Setup config in ./shared/config.ts. You will have to create the file in this location.
```typescript
/** Port to host backend server on. */
export const PORT: number = 8080;

/** Whether to host the react site on the express server. Also turns off sequelize altering. */
export const PRODUCTION: boolean = true;

/** URL that the server is hosted on. Used for slack redirecting. Omit last `/` */
export const SITE_URL: string = "https://example.grayjn.com";

/** Port to host the vite server on. */
export const DEV_VITE_PORT: number = 0; // Only needed for development

/** The api url for development. Sets up vite proxy. */
export const DEV_API_URL = "http://localhost:8080/api";

/** The allowed hosts for vite. */
export const DEV_VITE_HOSTS = ["example.grayjn.com"];
```
4. Compile the React Vite project and Express server
```bash
npm --prefix ./client run build
npm --prefix ./server run build
```
5. Run the backend server
```bash
npm --prefix ./server run prod
```
6. Your server should be up and running! The default username is `admin` and the password is `password`. Check out the other docs to setup and use the software.