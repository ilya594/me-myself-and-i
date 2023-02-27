import * as faceapi from "face-api.js";
import * as Utils from "../Utils";
import { 
    FACE_DETECT_INTERVAL, 
    FACE_DETECT_DELAY } from "./../Constants";
import * as Events from "../Events";
import * as tf from "@tensorflow/tfjs";
import { TinyFaceDetectorOptions, TNetInput } from "face-api.js";
    

class FaceDetector extends Events.EventHandler {

    private _viewport:HTMLVideoElement;
    private _collection:Utils.Pool;
    private _interval:any;
    private _frame:tf.Tensor4D;
    private _camera:any;
    private _options:TinyFaceDetectorOptions;
    private _detections:any = [];

    constructor() {
        super();  
    }

    public initialize = async (viewport:HTMLVideoElement) => {
        this._viewport = viewport;
        this._viewport.width = 1280/2;
        this._viewport.height = 720/2;

        this._camera  = await tf.data.webcam(this._viewport);
        
        await this.initializeFaceDetection();

        return this;
    };

    private initializeFaceDetection = async () => {
        await faceapi.loadTinyFaceDetectorModel("../models/");
        await faceapi.nets.tinyFaceDetector.load("../models/");
        await faceapi.loadSsdMobilenetv1Model("../models/");

        this._options = new faceapi.TinyFaceDetectorOptions();

        this.startDetectionInterval();
    }

    private startDetectionInterval = () => {
        this._interval = setInterval(async () => {
            await this.analyzeVideoFrame();
        }, FACE_DETECT_INTERVAL);
    };

    private analyzeVideoFrame = async () => {
        this._frame = await this._camera.capture();       

        if (!this._frame) return this.dispose();
        //@ts-ignore
        this._detections = await faceapi.detectAllFaces(this._frame, this._options);

        if (!this._detections?.length) return this.dispose();

        this.stopDetectionInterval();

        this.dispatchEvent(Events.FACE_DETECTED, { source: this._frame, detections: this._detections }); 

        return this.dispose();
    };

    private dispose = () => {
        this._frame?.dispose();
        this._frame = null;     
    };

    private stopDetectionInterval = () => {
        clearInterval(this._interval);        
        setTimeout(this.startDetectionInterval, FACE_DETECT_DELAY);
    };
}

export default new FaceDetector();