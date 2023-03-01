import * as faceapi from "face-api.js";
import { 
    FACE_DETECT_INTERVAL, 
    FACE_DETECT_DELAY, 
    VIDEO_WIDTH,
    VIDEO_HEIGHT} from "./../Constants";
import * as Events from "../Events";
import * as tf from "@tensorflow/tfjs";
import { FaceDetectionOptions, TinyFaceDetectorOptions } from "face-api.js";
import * as Utils from "./../Utils";
    

class FaceDetector extends Events.EventHandler {

    private _viewport:HTMLVideoElement;
    private _frame:tf.Tensor4D;
    private _camera:any;
    private _options:TinyFaceDetectorOptions | FaceDetectionOptions;
    private _detections:any = [];
    private _processing: boolean = false;

    constructor() {
        super();  
    }

    public initialize = async (viewport:HTMLVideoElement) => {

        this._viewport = viewport;

        this._viewport.width = VIDEO_WIDTH / 1.2;
        this._viewport.height = VIDEO_HEIGHT / 1.2;

        this._camera  = await tf.data.webcam(this._viewport);

        return await this._initializeFaceDetection();
    };

    private _initializeFaceDetection = async () => {

        await faceapi.loadTinyFaceDetectorModel("../models/");
        await faceapi.nets.tinyFaceDetector.load("../models/");
        await faceapi.loadSsdMobilenetv1Model("../models/");

        this._options = new faceapi.TinyFaceDetectorOptions();

        setInterval(this._processVideoFrame, FACE_DETECT_INTERVAL);

        return Promise.resolve();
    }


    private _processVideoFrame = async () => {

        if (this._processing) return false;

        this._processing = true;

        this._frame = await this._camera.capture();       

        if (!this._frame) return this.dispose(); //@ts-ignore
        
        this._detections = await faceapi.detectAllFaces(this._frame, this._options); 

        if (!this._detections?.length) return this.dispose();

        //debugger;

        Utils.log('[FaceDetector._processVideoFrame] detections: [' + this._detections.length + ']');  

        this.dispatchEvent(Events.FACE_DETECTED, { frame: this._frame.clone(), box: this._detections.pop().box }); 

        this.dispose();

        return true;
    };

    private dispose = () => {
        this._frame?.dispose();
        this._frame = null;
        this._detections = null;
        this._processing = false;
        return false;
    };
}

export default new FaceDetector();