import * as path from 'path';
import * as fs from 'fs';
export const downloadImageAsPng = async (url: string) => {

    const response = await fetch(url);

    if(!response.ok) {
        throw new Error('Error downloading image');
    }

    const folderPath = path.join(process.cwd(), 'generated', 'images');
    fs.mkdirSync(folderPath, { recursive: true });

    const imageNamePng = `${new Date().getTime()}.png`; 
    const buffer = Buffer.from(await response.arrayBuffer())

    fs.writeFileSync(`${folderPath}/${imageNamePng}`, buffer);

}