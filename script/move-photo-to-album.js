const send = async (albumId, photoId) => {
    let res = await fetch(`http://localhost:3000/albums/${albumId}/photos/${photoId}`,
        {
            method: "POST",
        }
    );
    let json = await res.json();
    console.log(json.status, res.status);
}
send(2, 1);
