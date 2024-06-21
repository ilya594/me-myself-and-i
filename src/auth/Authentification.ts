import RestService from "../network/RestService";
import * as Events from "../utils/Events";    
import * as tf from '@tensorflow/tfjs';

export class Authentification extends Events.EventHandler {

    constructor() {
        super();        
    }

    private _url = './model_0/model.json';
    private _buffer: any;

    public initialize = async () => {

      this._authenticate();

      return this;
    }

    private _authenticate = async () => {

      let sign = { x: new Array<number>(), y: new Array<number>() };

      const onStart = (event: any) => {
        window.onmousemove = (event: MouseEvent) => {
          sign.x.push(event.clientX) && sign.y.push(event.clientY);
        }
        window.ontouchmove = (event: TouchEvent) => {
          sign.x.push(event.targetTouches[0].clientX) && sign.y.push(event.targetTouches[0].clientY);
        }
        window.onmouseup = (event: any) => onEnd(event);
        window.ontouchend = (event: any) => onEnd(event);
      }

      const onEnd = async (event: any) => {
        window.onmousemove = null;
        window.onmouseup = null;
        window.ontouchmove = null;
        window.ontouchend = null;
        
        this._buffer = document.createElement("canvas"); document.getElementById("entry-page").appendChild(this._buffer);
        this._buffer.width = window.screen.height;
        this._buffer.height = window.screen.height;

        this._buffer.getContext('2d').lineWidth = 100;
        this._buffer.getContext('2d').strokeStyle = "gray";
        this._buffer.getContext('2d').beginPath();
        this._buffer.style.setProperty('opacity', '1%');
        this._buffer.style.setProperty('position', 'absolute');

        let length = sign.x.length;
        let offset = this._buffer.offsetLeft;

        for (let i = 1; i < length; i++) {
          this._buffer.getContext('2d').moveTo(sign.x[i - 1] - offset, sign.y[i - 1]);
          this._buffer.getContext('2d').lineTo(sign.x[i] - offset, sign.y[i]);
          this._buffer.getContext('2d').stroke();
        }
        this._buffer.getContext('2d').closePath();

        sign = { x: new Array<number>(), y: new Array<number>() };

        const tensor = tf.browser.fromPixels(this._buffer, 1)
        .resizeBilinear([28, 28])
        .expandDims(0)
        .toFloat()
        .div(255.0);
        

        const model: any = await tf.loadLayersModel(this._url);

        const prediction = await model.predict(tensor).dataSync();

        let sorted = [];

        for (let i = 0; i < prediction.length; i++) sorted.push({ value: i, probability: prediction[i]});
        
        sorted = sorted.sort((a, b) => a.probability > b.probability ? 1 : -1)

        RestService.validatePrediction(sorted).then((result) => {
          if (result.data) {
            this._destroy();
            this.dispatchEvent(Events.NETWORK_AUTH_SUCCESS, null);
          }
        }); 
    }
    
    window.onmousedown = (event: any) => onStart(event);
    window.ontouchstart = (event: any) => onStart(event);
    window.oncontextmenu = () => { return false; } 
  }

  private _destroy = () => {

    window.onmousedown = null;
    window.ontouchstart = null;
   
    try {
      document.getElementById("entry-page").removeChild(this._buffer);
    } catch (error) {
      //TODO
    }

  }


}

export default new Authentification();