

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

        setTimeout(() => this.runCatRun(this._cat_0, Cats.getRandomInt(), {a: 0, b: 1}), 0);
        setTimeout(() => this.runCatRun(this._cat_1, Cats.getRandomInt(), {a: 1, b: 0}), 0);    

        return true;
    };


    private runCatRun = (cat:any, time:number, invert: {a:number, b:number}) => {

        cat.style.setProperty('transform', 'translate(' + 0 + 'px)');
        cat.style.setProperty('filter', 'invert(' + invert.a + ')');

        let initial = { x : 0, alpha: 0.4, amount: invert.a };
        const final = { x: 850, alpha: 0.2, amount: invert.b };

        new TWEEN.Tween(initial).to({ x: final.x, alpha: final.alpha, amount: final.amount }, time).onUpdate(() => {
            cat.style.setProperty('transform', 'translate(' + initial.x + 'px)');
            //cat.style.setProperty('opacity', initial.alpha);
            //cat.style.setProperty('filter', 'invert(' + initial.amount + ')');
        })
        .onComplete(() => this.runCatRun(cat, Cats.getRandomInt(), invert))
        .start();
    }

    private static getRandomInt = (min:number = 1800, max:number = 4000) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); 
    }
}

export default new Cats();