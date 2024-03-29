import { readDb } from "./db.js";
import fs from "node:fs/promises"

export const getAllPhotos = async (req, res) => {
    let foundPhotos = [];
    let db = await readDb();
    let keys = Object.keys(req.query);
    console.log(db.photos);
    if (keys.length == 0) {
        res.json({ status: "ok", photos: db.photos });
        return;
    }
    for (let i = 0; i < db.photos.length; i++) {
        let photo = db.photos[i];
        let count = 0;
        for (let k = 0; k < keys.length; k++) {
            let key = keys[k];
            if (photo[key] == req.query[key]) {
                count++;
            }
        }
    }
    res.json({ status: "ok", photos: foundPhotos });
};


let photoId = 1;
let db = await readDb();
if (db.photos.length) {
    photoId = db.photos[db.photos.length - 1].id + 1;
}
export const createPhoto = async (req, res) => {
    let db = await readDb();
    let nameExists = await photoNameExisist(req.body.name);
    console.log(nameExists, 'nameExists')
    console.log(photoIsValid(req.body), 'photoIsValid')
    if (photoIsValid(req.body) && !nameExists) {
        req.body.id = photoId;
        db.photos.push(req.body);
        await fs.writeFile("./db.json", JSON.stringify(db));
        res.status(201).json({ status: "ok" });
        photoId++;
    } else {
        res.status(400).json({ status: "error" });
    }
};

export const deleteSinglePhoto = async (req, res) => {
    let db = await readDb();
    let photo = db.photos.find((photo) => photo.id == req.params.id);
    if (photo) {
        let photosToWrite = db.photos.filter((photo) => photo.id != req.params.id);
        db.photos = photosToWrite;
        await fs.writeFile("./db.json", JSON.stringify(db));
        res.json({ status: "ok", photo: photo });
    } else {
        res.status(404).json({ status: "error" });
    }
};


export const updatePhoto = async (req, res) => {
    let db = await readDb();
    let photo = db.photos.find((photo) => photo.id == req.params.id);
    if (photo) {
        let newPhotoData = req.body;
        let nameExists = await photoNameExisist(newPhotoData.name);
        if (photoIsValid(newPhotoData) && !nameExists) {
            photo.name = newPhotoData.name;
            photo.hashtags = newPhotoData.hashtags;
            photo.lastEditDate = newPhotoData.lastEditDate;
            await fs.writeFile("./db.json", JSON.stringify(db));
            res.json({ status: "ok" });
        } else {
            res.status(400).json({ status: "error" });
        }
    } else {
        res.status(404).json({ status: "error" });
    }
};

const photoNameExisist = async (name) => {
    let db = await readDb();
    let photos = db.photos;
    let photosWithSameName = photos.filter((photo) => photo.name == name);
    return photosWithSameName.length > 0;
}

const photoIsValid = (photos) => {
    return (
        photos.name &&
        photos.hashtags
    );
}

export const addPhotoToAlbum = async (req, res) => {

    let albumId = parseInt(req.params.albumId, 10);
    let photoId = parseInt(req.params.photoId, 10);

    if (!(await exists("albums", albumId))) {
        return res.status(404).send({ status: "error" });
    }
    if (!(await exists("photos", photoId))) {
        return res.status(404).send({ status: "error" });
    }
    let albumConteiningPhoto = await getAlbumsForPhotos(photoId);
    if (albumConteiningPhoto && albumConteiningPhoto.id == albumId) {
        return res
            .status(409)
            .send({ status: "error", msg: "photo already in this album" });
    }
    if (albumConteiningPhoto) {
        await removePhotoFromAlbum(albumConteiningPhoto, photoId);
    }

    await addPhotoToAlbumAndSave(albumId, photoId);
    res.json({ status: "ok" });
};

const exists = async (collection, id) => {
    let db = await readDb();
    let foundElements = db[collection].filter((element) => element.id == id);
    return foundElements.length > 0;
}

const getAlbumsForPhotos = async (photoId) => {
    let db = await readDb();
    let albums = db.albums;
    for (let i = 0; i < albums.length; i++) {
        let photos = albums[i].photos;
        if (photos.indexOf(photoId) > -1) {
            return albums[i];
        }
    }
    return null;
}
const removePhotoFromAlbum = async (album, photoId) => {
    let db = await readDb();
    let albums = db.albums;
    let otherPhotos = album.photos.filter((pid) => pid != photoId);

    for (let i = 0; i < albums.length; i++) {
        if (albums[i].id == album.id) {
            albums[i].photos = otherPhotos;
        }
    }
    await saveAlbums(albums);
}

const addPhotoToAlbumAndSave = async (albumId, photoId) => {
    let db = await readDb();
    let albums = db.albums;
    let album = albums.find((album) => album.id == albumId);
    album.photos.push(photoId);
    saveAlbums(albums);
}

const saveAlbums = async (albums) => {
    let db = await readDb();
    db.albums = albums;
    await fs.writeFile("./db.json", JSON.stringify(db));
}