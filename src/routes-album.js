import { readDb } from "./db.js";
import fs from "node:fs/promises"


export const getAllAlbums = async (req, res) => {
    let foundAlbums = [];
    let db = await readDb();
    let keys = Object.keys(req.query);
    console.log(db.albums);
    if (keys.length == 0) {
        res.json({ status: "ok", albums: db.albums });
        return;
    }
    for (let i = 0; i < db.albums.length; i++) {
        let album = db.albums[i];
        let count = 0;
        for (let k = 0; k < keys.length; k++) {
            let key = keys[k];
            if (album[key] == req.query[key]) {
                count++;
            }
        }
    }
    res.json({ status: "ok", albums: foundAlbums });
};


let albumId = 1;
let db = await readDb();
if (db.albums.length) {
    albumId = db.albums[db.albums.length - 1].id + 1;
}
export const createAlbum = async (req, res) => {
    let db = await readDb();
    let nameExists = await albumNameExisist(req.body.name);
    if (albumIsValid(req.body) && !nameExists) {
        req.body.id = albumId;
        db.albums.push(req.body);
        await fs.writeFile("./db.json", JSON.stringify(db));
        res.status(201).json({ status: "ok" });
        albumId++;
    } else {
        res.status(400).json({ status: "error" });
    }
};

export const updateAlbum = async (req, res) => {
    let db = await readDb();
    let album = db.albums.find((album) => album.id == req.params.id);
    if (album) {
        let newAlbumData = req.body;
        let nameExists = await albumNameExisist(newAlbumData.name);
        if (albumIsValid(newAlbumData) && !nameExists) {
            album.name = newAlbumData.name;
            album.hashtags = newAlbumData.hashtags;
            album.lastEditDate = newAlbumData.lastEditDate;
            await fs.writeFile("./db.json", JSON.stringify(db));
            res.json({ status: "ok" });
        } else {
            res.status(400).json({ status: "error" });
        }
    } else {
        res.status(404).json({ status: "error" });
    }
};

export const deleteSingleAlbum = async (req, res) => {
    let db = await readDb();
    let album = db.albums.find((album) => album.id == req.params.id);
    if (album) {
        let albumToWrite = db.albums.filter((album) => album.id != req.params.id);
        db.albums = albumToWrite;
        await fs.writeFile("./db.json", JSON.stringify(db));
        res.json({ status: "ok", album: album });
    } else {
        res.status(404).json({ status: "error" });
    }
};

const albumNameExisist = async (name) => {
    let db = await readDb();
    let albums = db.albums;
    let albumsWithSameName = albums.filter((album) => album.name == name);
    return albumsWithSameName.length > 0;
}

const albumIsValid = (albums) => {
    return (
        albums.name &&
        albums.hashtags
    );
}
