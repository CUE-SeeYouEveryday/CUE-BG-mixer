#!/usr/bin/env node
import { Application, Assets, Sprite, Container, Texture } from '@pixi/node';
import { BgContainer } from './bgcontainer.js'
import * as fs from 'fs';
import * as path from 'path';

const InputDir = './bg'
const outputDir = './out/'

async function takeScreenshot(app, filename){
    app.renderer.render(app.stage);
    const base64Image = app.renderer.view.toDataURL('image/png');
    const base64Data = base64Image.replace(/^data:image\/png;base64,/, '');
    const output = path.join(outputDir, `./${filename}.png`);

    console.log(`Export : ${filename}`)
    fs.writeFileSync(output, base64Data, 'base64');
}

const app = new Application({
    width: 1334,
    height: 750,
});

const folderObj = fs.readdirSync(InputDir);

for (let file of folderObj){
    const bg = await BgContainer.from(path.join(InputDir, file, 'manifest.json'))
    app.stage.addChild(bg);

    takeScreenshot(app, file);

    bg.destroy({texture : true, baseTexture : true, children : true})
    app.stage.removeChildren();
}

process.exit(0);