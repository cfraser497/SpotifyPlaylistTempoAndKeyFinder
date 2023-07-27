import axios from 'axios';
import 'dotenv/config';

import { convertListToCommaSeperated } from './utils.js';

//PRE: the list of IDS < 100
//POST: returns a map of IDs to their {tempo, key} pairs
export default async function getTempoAndKeyOfIds (trackIDs, songMap) {
    const linkList = convertListToCommaSeperated(trackIDs);

    const {data} = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${linkList}`)
    .catch(function (error) {
        console.log(error);
    })

    const songs = data.audio_features;

    //fill out dictionary with id keys and tempo, key values for each song
    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        const {name, artists} = songMap.get(song.id);
        songMap.set(song.id, {name: name, artists: artists, tempo: Math.round(song.tempo), 'key': song.key});
    }

    return songMap;
}