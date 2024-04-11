#!/usr/bin/env node
import { Application, Assets, Sprite, Container, Texture } from '@pixi/node';
import { BgContainer } from './bgcontainer.js'
import * as fs from 'fs';
import * as path from 'path';

const app = new Application({
    width: 1334,
    height: 750,
});



const bg = await BgContainer.from('./bg/background004_1/manifest.json')
app.stage.addChild(bg);


app.renderer.render(app.stage);
const base64Image = app.renderer.view.toDataURL('image/png');
const base64Data = base64Image.replace(/^data:image\/png;base64,/, '');
const output = `./background004_1.png`;

fs.writeFileSync(output, base64Data, 'base64');

bg.destroy(true)

console.log(Assets.cache._cacheMap)

process.exit(0);