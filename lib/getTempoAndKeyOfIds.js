import axios from "axios";
import "dotenv/config";

import { convertListToCommaSeperated } from "./utils.js";

//PRE: the list of IDS < 100
//POST: returns a map of IDs to their {tempo, key} pairs
export default async function getTempoAndKeyOfIds(trackIDs, songMap, genreList) {
  const linkList = convertListToCommaSeperated(trackIDs);

  await axios
    .get(`https://api.spotify.com/v1/audio-features?ids=${linkList}`)
    .then(async function({data}) {
      const songs = data.audio_features;

      //fill out dictionary with id keys and tempo, key values for each song
      for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        const { name, artists, image } = songMap.get(song.id);
        songMap.set(song.id, {
          id: song.id,
          name: name,
          artists: artists,
          genres: genreList[i],
          image: image,
          tempo: Math.round(song.tempo),
          key: song.key,
          mode: song.mode,
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  return songMap;
}
