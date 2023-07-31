import axios from "axios";
import "dotenv/config";

import getTempoAndKeyOfIds from "./getTempoAndKeyOfIds.js";

export default async function getPlaylistItemsIds(playlist_id) {
  var linkToPlaylist = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
  let playlistInformation = new Map();

  //loop over playlist as we can only request 100 songs per request.
  while (linkToPlaylist) {
    const { data } = await axios.get(linkToPlaylist).catch(function (error) {
      console.log(error);
    });

    //data.next is set if there are more songs in the playlist
    linkToPlaylist = data.next;

    const items = data.items;
    let trackIds = [];
    let j = 0;

    //iterate over JSON array of tracks, adding IDs to an array
    for (let i = 0; i < items.length; i++) {
      let item = items[i];

      //check if the track exists on spotify (filter out local files)
      if (item.track.id) {
        trackIds[j] = item.track.id;

        //adding artists
        const artists = item.track.artists;
        let artistList = "";
        for (let k = 0; k < artists.length; k++) {
          artistList += `${artists[k].name}, `;
        }
        artistList = artistList.slice(0, -2);

        playlistInformation.set(item.track.id, {
          name: item.track.name,
          artists: artistList,
          image: item.track.album.images[2].url,
        });
        j++;
      }
      // console.log(item.track.name);
    }

    playlistInformation = await getTempoAndKeyOfIds(
      trackIds,
      playlistInformation
    );
  }

  return playlistInformation;
}
