import axios from "axios";
import "dotenv/config";

import getTempoAndKeyOfIds from "./getTempoAndKeyOfIds.js";
import { convertListToCommaSeperated } from "./utils.js";

export default async function getPlaylistItemsIds(playlist_id) {
  var linkToPlaylist = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
  let playlistInformation = new Map();

  //loop over playlist as we can only request 100 songs per request.
  while (linkToPlaylist) {
    await axios.get(linkToPlaylist)
    .then(async function({data}) {
      //data.next is set if there are more songs in the playlist
      linkToPlaylist = data.next;

      const items = data.items;
      let trackIds = [];
      let artistIds = [];
      let genreList = [];
      let j = 0;
  
      //iterate over JSON array of tracks, adding IDs to an array
      for (let i = 0; i < items.length; i++) {
        let item = items[i];

        //check if the track exists on spotify (filter out local files)
        if (item.track && item.track.id) {
          trackIds[j] = item.track.id;
          artistIds[j % 50] = item.track.artists[0].id;

          //adding genres every 50 tracks
          if ((j + 1) % 50 == 0 || i + 1 == items.length) {
            let linkList = convertListToCommaSeperated(artistIds);
            await axios.get(`https://api.spotify.com/v1/artists?ids=${linkList}`)
            .then(function ({data}) {
              let artistData = data.artists;

              let nearest50 = Math.floor(j / 50) * 50;
              //go back and fill out genre information for last 50 songs
              for(let k = nearest50; k < artistData.length + nearest50; k++) {
                genreList[k] = data.artists[k - nearest50].genres;
              }
            })
            .catch(function (error) {
              console.log(error);
            })
            .finally(function () {
              artistIds = [];
            })
          }
  
          //adding artists
          const artists = item.track.artists;
          let artistList = "";
          for (let k = 0; k < artists.length; k++) {
            artistList += `${artists[k].name}, `;
          }
          //remove last comma
          artistList = artistList.slice(0, -2);

          playlistInformation.set(item.track.id, {
            name: item.track.name,
            artists: artistList,
            image: item.track.album.images[2].url,
          });
          j++;
        }
      }
  
      playlistInformation = await getTempoAndKeyOfIds(
        trackIds,
        playlistInformation,
        genreList
      );
    }).catch(function (error) {
      //invalid playlist id has been entered
      console.log(error);
      linkToPlaylist = null;
    });
  }

  return playlistInformation;
}
