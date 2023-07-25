import express from 'express';
import cors from 'cors';
import http from 'http';
import 'dotenv/config';
import axios from 'axios';

import setAuthToken from './lib/setAuthToken.js';
import getPlaylistItemsIds from './lib/getPlaylistItemsIds.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//get and set auth token for session
if (!axios.defaults.headers.common['Authorization']) {
    await setAuthToken();
    console.log("auth token set");
}

//get tempo and key information for each song on the playlist
const playlistInformation = await getPlaylistItemsIds(process.env.PLAYLIST_ID);

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'))