import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';

export const downloadImageAsPng = async (url: string) => {

    const response = await fetch(url);

    if(!response.ok) {
        throw new Error('Error downloading image');
    }

    const folderPath = path.join(process.cwd(), 'generated', 'images');
    fs.mkdirSync(folderPath, { recursive: true });

    const imageNamePng = `${new Date().getTime()}.png`; 
    const buffer = Buffer.from(await response.arrayBuffer())

    //fs.writeFileSync(`${folderPath}/${imageNamePng}`, buffer);

    await sharp(buffer)
        .png()
        .ensureAlpha()
        .toFile(path.join(folderPath,imageNamePng))

    return path.join(folderPath, imageNamePng);

}