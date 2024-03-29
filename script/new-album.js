const send = async () => {
    let res = await fetch("http://localhost:3000/albums", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: "firstAlbum",
            photos: [],
            hashtags: ["#photo"],
            creationDate: new Date(),
            lastEditDate: new Date()
        }),
    })
    let json = await res.json()
    console.log(json.status, res.status);
}
send()