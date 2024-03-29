const send = async () => {
    let res = await fetch("http://localhost:3000/photos", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: "firstPhoto",
            creationDate: new Date(),
            lastEditDate: new Date(),
            hashtags: ["#dog"]
        }),
    })
    let json = await res.json()
    console.log(json.status, res.status);
}
send()