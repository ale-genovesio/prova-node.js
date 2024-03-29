const send = async (id) => {
    let res = await fetch(`http://localhost:3000/albums/${id}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: "firstAlbum-mod",
            hashtags: ["#photo", "photoModify"],
            lastEditDate: new Date()
        }),
    });
    let json = await res.json();
    console.log(json.status, res.status);
}
send(1);