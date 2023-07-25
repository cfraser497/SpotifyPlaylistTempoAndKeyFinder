import axios from 'axios';
import 'dotenv/config';

export default async function getPlaylistItemsIds (playlist_id) {
    var linkToPlaylist = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
    const trackIds = [];
    let j = 0;

    //loop over playlist as we can only request 100 songs per request.
    while (linkToPlaylist) {
        const {data} = await axios.get(linkToPlaylist)
        .catch(function (error) {
            console.log(error);
        })

        //data.next is set if there are more songs in the playlist
        linkToPlaylist = data.next;

        const items = data.items;
    
        //iterate over JSON array of tracks, adding IDs to an array
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
    
            //check if the track exists on spotify (filter out local files)
            if (item.track.id) {
                trackIds[j] = item.track.id;
                j++;
            }
            // console.log(item.track.name);
        }
    }

    return trackIds;
}