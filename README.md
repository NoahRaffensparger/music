# Music App

An app I am building in React that let's users rate, log and share music. 

## Tech

React, Node, Express, PSQL, auth, Spotify web API

## Setup

Right now, you need access to spotify's API in order to run the project locally. Gaining access is easy enough as long as you have a spotify account. You just need to go to spotify for devs and follow the instructions there. Once done, you can then set up a .env file with these keys: 
```
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
SPOTIFY_REDIRECT_URI
```
My project also connects to an AWS bucket. For now, this is only for handling user profile pictures, so this is not necessary to set up for testing. 

For now, I have been testing my project with a local psql db. Please run the schema that is in the db folder within the server folder. Then run seeds.sql.

Run server-test.js, then build the project.

For logging in, you can use the usernames and passwords in the seeds.sql file. This will work because password hashing is disabled currently. Clear local storage to log in to another users account. 

```
music-social-media/
│
├── server/            
│   ├── db/
│   │   ├── schema.sql
│   │   └── seeds.sql
│   ├── .env
│   └── server-test.js
├── src/   
│   ├── components/
│   ├── pages/
│   └── App.jsx
│
├── package.json
└── README.md
```

## Screenshots

![alt text](music-app-sc-2.PNG) ![alt text](music-app-sc-3.PNG) ![alt text](music-app-sc-4.PNG) ![alt text](music-app-sc-1.PNG)

## License
This project is licensed under the [MIT License](./LICENSE).


-by Noah Raffensparger