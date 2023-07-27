export function convertListToCommaSeperated (list) {
    let s = "";

    for (let i = 0; i < list.length; i++) {
        s += `${list[i]},`
    }

    // remove last comma
    if (s != "") {
        s = s.slice(0, -1);
    }

    return s;
}

export function getPlaylistId (playlistLink) {

}

// https://open.spotify.com/playlist/2tLLUTRINF4zBnkDBXuisf?si=bdd0a07fb3e041c0&pt=5d5db5eb4d132479a102d38194464af0