const send = async (id) => {
    let res = await fetch(`http://localhost:3000/photos/${id}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: "firstPhoto-modify",
            lastEditDate: new Date(),
            hashtags: ["#dog", "#cat"]
        }),
    });
    let json = await res.json();
    console.log(json.status, res.status);
}
send(1);