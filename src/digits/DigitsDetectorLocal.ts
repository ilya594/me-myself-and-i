import * as Events from "../utils/Events";    
import * as Utils from "../utils/Utils";

import * as tf from '@tensorflow/tfjs';


const url = './model_0/model.json';

export class DigitsDetectorLocal extends Events.EventHandler {

    private _container: any;
    private _viewport: HTMLVideoElement | any;
    private _interval: any;

    private _model: any = null;

    private _logger : any = [];

    private _label : any;

    constructor() {
        super();
    }

    public initialize = async () => {

        this._container = document.getElementById("view-page");
        this._viewport = document.querySelector("video");      

        this._model = await tf.loadLayersModel(url);

        for (let i = 0; i < 10; i++) {
            let label = document.createElement("label"); this._container.appendChild(label);       
            label.style.setProperty('position', 'absolute');
            label.style.setProperty('top', '3%');
            label.style.setProperty('left', (String(i * 7 + 3) + '%'));
            label.style.setProperty('font-size', '34px');
            label.style.setProperty('font-family', 'Courier New'); 
            label.style.setProperty('font-weight', 'bold');
            label.style.setProperty('color', '#ffffff');
            this._logger.push(label);
        }     

        this._label = document.createElement("label"); this._container.appendChild(this._label);       
        this._label.style.setProperty('position', 'absolute');
        this._label.style.setProperty('top', '9%');
        this._label.style.setProperty('left', '3%');
        this._label.style.setProperty('font-size', '44px');
        this._label.style.setProperty('font-family', 'Courier New');
        this._label.style.setProperty('font-weight', 'bold');
        this._label.style.setProperty('color', '#ff0000');
    }

    public startDetection = async () => {

        this._interval = setInterval(async () => {
            
            let tensor = this.calculateTensor();

            let prediction = await this.getPrediction(tensor);  

          //  tensor?.dispose();

          // this.trace(prediction);

            this.trace_t(prediction);

        }, 200);
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
    
   /* private trace = (prediction: any) => {    

        if (String(this._label.textContent).includes('хз')) {
            this._label.textContent += '.';

            if (String(this._label.textContent).length > 15) {
                this._label.textContent = 'хз непонятно';
            }
        }

        let found = '';

        for (let i = 0; i < prediction.length; i++) {

            if (prediction[i] > 0.5) {
                found = 'це походу ' + i;
            }

            if (prediction[i] > 0.7) {
                found = 'бля буду це ' + i;
            }
        }

        if (found.length) {
            this._label.textContent = found;
        } else {
            this._label.textContent = 'хз непонятно';
        }
    }*/

    private trace_t = (prediction: any) => {    

        prediction.forEach((value: number, index: number) => {
            const color = Utils.rgbToHex({ r: value * 255.0, g: (1 - value) * 255.0, b: 255.0})
            this._logger[index].style.setProperty('color', color);
            this._logger[index].textContent = value.toFixed(2);
        });
    }
}

export default new DigitsDetectorLocal();