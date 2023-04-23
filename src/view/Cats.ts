

//@ts-ignore
import * as TWEEN from '@tweenjs/tween.js';

class Cats {

    private _cat_0:any;
    private _cat_1:any;

    constructor() { }

    public initialize = async () => {   

        this._cat_0 = document.getElementById("watermark_0");
        this._cat_1 = document.getElementById("watermark_1");

        this._cat_0.style.setProperty('visibility', 'visible');
        this._cat_1.style.setProperty('visibility', 'visible');

        setTimeout(() => this.runCatRun(this._cat_0, Cats.getRandomInt()), 0);
        setTimeout(() => this.runCatRun(this._cat_1, Cats.getRandomInt()), 0);    
    };


    private runCatRun = (cat:any, time:number) => {

        cat.style.setProperty('transform', 'translate(' + 0 + 'px')
        let ini = { x : 0, alpha: 0.4 };
        new TWEEN.Tween(ini)
        .to({ x: 1000, alpha: 0.2 }, time)
        //.easing(TWEEN.Easing.Exponential.In)
        .onUpdate(() => {
            cat.style.setProperty('transform', 'translate(' + ini.x + 'px');
            cat.style.setProperty('opacity', ini.alpha);
        })
        .onComplete(() => this.runCatRun(cat, Cats.getRandomInt()))
        .start();
    }

    private static getRandomInt = (min:number = 1800, max:number = 4000) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); 
    }
}

export default new Cats();