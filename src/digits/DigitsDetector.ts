import * as Events from "../utils/Events";    
import * as Utils from "../utils/Utils";

import * as tf from '@tensorflow/tfjs';


const url = "http://localhost:8008/model_0/model.json"

export class DigitsDetector extends Events.EventHandler {

    private _container: any;
    private _viewport: HTMLVideoElement | any;
    private _interval: any;

    private _views: any = {
        view: null,
    };



    private _zoom: any = { x: 1, y: 1 };

    private get _width() { return this._viewport.videoWidth }
    private get _height() { return this._viewport.videoHeight }

    private get _mwidth() { return this._width / 2 }
    private get _mheight() { return this._height / 2 }

    private _model: any = null;

    private _label: any;

    constructor() {
        super();
    }

    public initialize = async () => {

        this._container = document.getElementById("view-page");
        this._viewport = document.querySelector("video");   

        this._model = await tf.loadLayersModel(url);
        
        this._label = document.createElement("label"); this._container.appendChild(this._label);       
        this._label.style.setProperty('position', 'absolute');
        this._label.style.setProperty('top', '9%');
        this._label.style.setProperty('left', '3%');
        this._label.style.setProperty('font-size', '34px');
        this._label.style.setProperty('font-family', 'Courier New');
        this._label.style.setProperty('font-weight', 'bold');
        this._label.style.setProperty('color', '#00ff30');


       // let viewport = document.querySelector("video");  

        //let frame = this.fillCanvas(viewport, canvas);

      //  let tensor = tf.browser.fromPixels(this._canvas).mean(2).expandDims().toFloat().div(255.0);       

      //  let prediction = await model.predict(tensor).data();



    }

    public startDetection = async () => {

        this.createCanvas(); 

        this._interval = setInterval(async () => {

            this.updateZoom();

            this.redrawCanvas();

            let tensor = this.calculateTensor();

            let prediction = await this.getPrediction(tensor);

            for (let i = 0; i < prediction.length; i++) {
                if (prediction[i] > 0.9) {
                    debugger;
                }
            }



            this.trace(2, prediction[2]);

        }, 300);
    }

    private updateZoom = () => {
        if (this._zoom.x <= this._width && this._zoom.y <= this._height) {
            this._zoom.x += 1;
            this._zoom.y += 1;
        }
    }

    private redrawCanvas = () => {

        let context = this._views.view.getContext('2d', { willReadFrequently: true });

        context.reset();

      // context.filter = "invert(100)";

        context.drawImage(this._viewport, 
            800, 
            20, 
            this._zoom.x, 
            this._zoom.y,
            0,
            0,
            28, 
            28, 
        );      
   

    }

    private calculateTensor = () => {
        let tensor = tf.browser.fromPixels(this._views.view)
        .reshape([null, 28, 28]);

        tensor = tf.cast(tensor, 'float32');

        /*
        .resizeNearestNeighbor([28, 28])
        .mean(2)
        .expandDims(2)
        .expandDims()
        .toFloat()
        .div(255.0);*/

       // let img = tf.browser.fromPixels(imageData, 1);
       // img = img;
       // img = tf.cast(img, 'float32');

       return tensor;
    }

    private getPrediction = async (tensor: any) => {
        let prediction = await this._model.predict(tensor).data();
        return prediction;
    }

    private createCanvas = () => {

        this._views.view = document.createElement("canvas"); this._container.appendChild(this._views.view);
        this._views.view.width = 28; 
        this._views.view.height = 28;

        //this._views.view.style.setProperty('transform', 'scale(' + 10 + ',' + 10 + ')')
    }
    
    private trace = (digit: number, probability: number) => {

        if (probability > 0.93) {
            debugger;
        }
        
        

        this._label.textContent = 'D [' +  digit + '] НАВЕРКУ [' + (probability * 100).toFixed(0) + '%]';
    }
    private drawBorder = () => {
        let context = this._views.view.getContext('2d', { willReadFrequently: true });
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = "white"; 
        context.rect(0, 0, this._width / 4, this._height / 2);
        context.stroke();
    }
}

export default new DigitsDetector();