import express from 'express';
import cors from 'cors';
import http from 'http';
import 'dotenv/config';
import axios from 'axios';
import pkg from 'node-schedule';
const schedule = pkg;

import setAuthToken from './lib/setAuthToken.js';
import getPlaylistItemsIds from './lib/getPlaylistItemsIds.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

//get property id using tenant id
app.post('/', async (req, res) => {

    //get and set auth token for session
    if (!axios.defaults.headers.common['Authorization']) {
        await setAuthToken();
    }

    //get tempo and key information for each song on the playlist
    try {
        const playlistInformation = await getPlaylistItemsIds(req.body.playlistId);

        // convert to an array
        const array = Array.from(playlistInformation.values())

        res.send({"tracks": array});
    } catch(error) {
        res.status(404).send(error);
    }
})

const server = http.createServer(app);

const rule = new schedule.RecurrenceRule();
rule.minute = 49;

schedule.scheduleJob(rule, async function () {
    await setAuthToken();
});

server.listen(process.env.PORT || 8080, () => console.log('App available on http://localhost:8080'))