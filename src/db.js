import fs from "node:fs/promises";

export const readDb = async () => {
    let content = await fs.readFile("./db.json");
    let stringContent = content.toString();
    let db = JSON.parse(stringContent);
    return db;
}