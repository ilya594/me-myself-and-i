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

    private _canvas: any;

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

        this._canvas =  document.createElement("canvas"); this._container.appendChild(this._canvas);
        this._canvas.style.setProperty('position', 'absolute');
        this._canvas.style.setProperty('x', String(this._viewport.x) + 'px');
        this._canvas.style.setProperty('y', String(this._viewport.y - 140) + 'px');
    }

    public startDetection = async () => {

        this._interval = setInterval(async () => {
            
            let tensor = this.calculateTensor();

            let prediction = await this.getPrediction(tensor);  

            this.log(prediction);

        }, 200);
    }

    private calculateTensor = () => {


        let context = this._canvas.getContext('2d', { willReadFrequently: true});

        context.clearRect(0, 0, 1120, 280);
        context.lineWidth = 1;
        context.strokeStyle = '#00ff00';
        
        for (let i = 0; i < 4; i++) {
            context.rect(i * 280, 0, 280, 280);
        }


        return tf.browser.fromPixels(this._viewport, 1)
            .resizeBilinear([28, 28])
            .expandDims(0)
            .toFloat()
            .div(255.0);

    }

    private drawBorders = () => {

    }

    private getPrediction = async (tensor: any) => await this._model.predict(tensor).data();

    private log = (prediction: any) => {    

        prediction.forEach((value: number, index: number) => {
            const color = Utils.rgbToHex({ r: value * 255.0, g: (1 - value) * 255.0, b: 55.0 * value});
            const size = String(34 + (value  * 5.0)) + 'px';
            this._logger[index].style.setProperty('color', color);
            this._logger[index].style.setProperty('font-size', size);
            this._logger[index].textContent = value.toFixed(2);
        });

        //this._logger[prediction.length - 1].textContent += '.........атвічяю пацикі)))'
    }
}

export default new DigitsDetectorLocal();