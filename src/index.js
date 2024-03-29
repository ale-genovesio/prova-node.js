import express from "express"
import bodyParser from "body-parser"
const app = express()
const port = 3000
app.use(bodyParser.json())

import { createAlbum, deleteSingleAlbum, getAllAlbums, updateAlbum } from "./routes-album.js"
import { addPhotoToAlbum, createPhoto, deleteSinglePhoto, getAllPhotos, updatePhoto } from "./routes-photo.js"

app.get("/photos", getAllPhotos);
app.get("/albums", getAllAlbums);

app.post('/albums', createAlbum);
app.post('/albums/:albumId/photos/:photoId', addPhotoToAlbum);
app.post('/photos', createPhoto);

app.put('/photos/:id', updatePhoto);
app.put('/albums/:id', updateAlbum);

app.delete('/albums/:id', deleteSingleAlbum);
app.delete('/photos/:id', deleteSinglePhoto);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})