import * as Events from "../utils/Events";    
import * as Utils from "../utils/Utils";

//import * as tf from '@tensorflow/tfjs';

export class DigitsDetector extends Events.EventHandler {
    constructor() {
        super();
    }

    public initialize = async () => {
        //let model: any = await tf.loadLayersModel("https://github.com/Erkaman/regl-cnn/blob/gh-pages/src/d0.json");

      //  debugger;
    }
}

export default new DigitsDetector();