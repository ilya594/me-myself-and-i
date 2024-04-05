import * as Events from "../utils/Events";    
//import * as Utils from "../utils/Utils";

import * as tf from '@tensorflow/tfjs';


const url = "/model_0/model.json"

export class DigitsDetector extends Events.EventHandler {

    private _container: any;
    private _viewport: HTMLVideoElement | any;
    private _interval: any;

    private _views: any = {
        view: null,
        tensor: null,
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
    }

    public startDetection = async () => {

        this.createCanvas(); 

        this._interval = setInterval(async () => {

            this.updateZoom();

            this.redrawCanvas();
            
            let tensor = this.calculateTensor();

            let prediction = await this.getPrediction(tensor);  

            this.trace(prediction);

        }, 100);
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

        context.drawImage(this._viewport, 
            0, 
            0, 
            this._zoom.x, 
            this._zoom.y,
            0,
            0,
            this._width, 
            this._height, 
        );      
    }

    private calculateTensor = () => {

        return tf.browser.fromPixels(this._viewport, 1)
            .toFloat()
            .expandDims(0)
            .resizeNearestNeighbor([28, 28])
            .div(255.0);

    }

    private getPrediction = async (tensor: any) => {
        let prediction = await this._model.predict(tensor).data();
        return prediction;
    }

    private createCanvas = () => {

        this._views.view = document.createElement("canvas"); this._container.appendChild(this._views.view);
        this._views.view.width = this._width; 
        this._views.view.height = this._height;

        this._views.view.style.setProperty('transform', 'scale(' + 20 + ',' + 20 + ')');
        this._views.view.style.setProperty('position', 'absolute');
        this._views.view.style.setProperty('right', '0%');
        this._views.view.style.setProperty('bottom', '0%');
        this._views.view.style.setProperty('width', '28px');
        this._views.view.style.setProperty('height', '28px');
    }
    
    private trace = (prediction: any) => {    

        this._label.textContent = '';

        prediction.forEach((value: number) => {
            this._label.textContent += value.toFixed(2) + (value > 0.9 ? '^' : ' ');
        });
    }
}

export default new DigitsDetector();