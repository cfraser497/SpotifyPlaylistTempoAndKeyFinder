

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