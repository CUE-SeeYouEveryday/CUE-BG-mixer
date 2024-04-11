
import { Container, Assets, Sprite, Graphics, DisplayObject, Ticker} from '@pixi/node';
import * as path from 'path';

export class BgContainer extends Container{

    front = new Container();
    back = new Container();
    _groupsMap = new Map();
    _elementMap = new Map();
    dict = '_';

    constructor() {
        super();

        this.addChild(this.front);
        this.addChild(this.back);
    }

    static async from(source){
        const bg = new this();
        await bg._init(source);
        return bg;
    }

    async _init(source) {
        const menifest = await Assets.load(source);
        this.dict = source.split('manifest.json')[0]

        const ratio = 1334 / menifest.env.width;
        // const scale = (menifest.env.height * ratio - 750) /2;
        
        for(let element of menifest.elements){
            const texture = await Assets.load(path.join(this.dict, menifest.env.images, element.texture))
            
            const sprite = Sprite.from(texture);
            sprite.name = element.name;

            sprite.width = element.width * ratio;
            sprite.height = element.height * ratio;

            sprite.anchor.set(element.pivotX ?? 0.5, element.pivotY ?? 0.5);

            sprite.position.set(element.x, element.y);

            sprite.scale.x *= (element.scaleX ?? 1);
            sprite.scale.y *= (element.scaleY ?? 1);

            if(element.blendMode){
                sprite.blendMode = element.blendMode;
            }

            if(element.mask){
                const mask = new Graphics();
                mask.beginFill(0xDE3249);
                mask.drawRect(element.mask.x, element.mask.y, element.mask.w, element.mask.h);
                mask.endFill();
        
                sprite.mask = mask;
            }
            
            this._elementMap.set(element.name, sprite);

            if(element.group){
                let group_container = this._groupsMap.get(element.group)
                if(!group_container){
                    group_container = new Container();
                    group_container.name = element.group;
                    this._groupsMap.set(element.group, group_container);
                    this.front.addChild(group_container);
                }

                group_container.addChild(sprite);
            }
            else{
                this.front.addChild(sprite);
            }

        }

    }

}