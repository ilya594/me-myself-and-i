import * as Events from "../utils/Events";    
//import * as Utils from "../utils/Utils";

import * as tf from '@tensorflow/tfjs';


const url = './model_0/model.json';

export class DigitsDetectorLocal extends Events.EventHandler {

    private _container: any;
    private _viewport: HTMLVideoElement | any;
    private _interval: any;

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

        this._interval = setInterval(async () => {
            
            let tensor = this.calculateTensor();

            let prediction = await this.getPrediction(tensor);  

            this.trace(prediction);

        }, 300);
    }

    private calculateTensor = () => {

        return tf.browser.fromPixels(this._viewport, 1)
            .resizeBilinear([28, 28])
            .expandDims(0)
            .toFloat()
            .div(255.0);

        /*
            .toFloat()
            .expandDims(0)
            .resizeNearestNeighbor([28, 28])
            .div(255.0);*/

    }

    private getPrediction = async (tensor: any) => await this._model.predict(tensor).data();
    
    private trace = (prediction: any) => {    

        this._label.textContent = '';

        prediction.forEach((value: number) => this._label.textContent += value.toFixed(2) + (value > 0.9 ? '^' : ' '));
    }
}

export default new DigitsDetectorLocal();