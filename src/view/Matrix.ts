import MotionDetector from "../motion/MotionDetector";
import * as Utils from "../utils/Utils";
import * as Events from "../utils/Events"; 

class Matrix {

    private _timeouts: Map<string, any> = new Map();

    private _page: any;
    private _container: any;
    private _graphic: HTMLCanvasElement;

    public interval: any;

    constructor() {

    }

    public initialize = async () => {

        this._page = document.getElementById("view-page");

        this._container = document.createElement("div");
        this._container.id = "container";
        this._container.style.setProperty('z-index', '9999');
        this._container.style.setProperty("position", "absolute");
        
        this._graphic = document.createElement("canvas"); this._container.appendChild(this._graphic);

        document.onmousemove = () => this.hide();    
        
        return this.will();
    }

    public show = () => {
        if (!this.exists()) {
            this._page.appendChild(this._container);
            Utils.matrixEffect(this._graphic, this.interval);     
        }   
    }

    public hide = () => {
        if (this.exists()) {
            this._graphic.getContext("2d").clearRect(0, 0, window.innerWidth, window.innerHeight);
            this._page.removeChild(this._container);
            this.interval = clearInterval(this.interval);  

            this.will();
        }      
    }

    private will = () => {
        return setTimeout(() => this.show(), 11111);
    }

    private exists = () => {
        return document.getElementById("view-page") && document.getElementById("container");
    }

  
}

export default new Matrix();