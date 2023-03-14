import * as faceapi from "face-api.js";
import { 
    FACE_DETECT_INTERVAL_ACTIVE, 
    FACE_DETECT_INTERVAL_WORKTIME,
    VIDEO_WIDTH,
    VIDEO_HEIGHT,
    FACE_DETECT_INTERVAL_LAZY} from "./../utils/Constants";
import * as Events from "../utils/Events";
import { data, browser, Tensor4D }  from "@tensorflow/tfjs";
import { FaceDetectionOptions, TinyFaceDetectorOptions } from "face-api.js";
import * as Utils from "../utils/Utils";
import MotionDetector from "./MotionDetector";
    

class FaceDetector extends Events.EventHandler {

    private _viewport:HTMLVideoElement;
    private _frame:Tensor4D;
    private _camera:any;
    private _options:TinyFaceDetectorOptions | FaceDetectionOptions;
    private _detections:any = [];
    private _processing: boolean = false;
    private _timeout:any;
    private _interval:any;
    private _modes = { LAZY: FACE_DETECT_INTERVAL_LAZY, ACTIVE: FACE_DETECT_INTERVAL_ACTIVE };
    private _mode: number = this._modes.LAZY;

    constructor() {
        super();  
    }

    public initialize = async () => {

        this._viewport = document.querySelector("video");

        this._viewport.width = VIDEO_WIDTH;
        this._viewport.height = VIDEO_HEIGHT;

        this._camera  = await data.webcam(this._viewport);

        MotionDetector.addEventListener(Events.MOTION_DETECTION_STARTED, this._enableActiveDetectionMode);

        return await this._initializeFaceDetection();
    };

    private _initializeFaceDetection = async () => {

        await faceapi.loadTinyFaceDetectorModel("../models/");
        await faceapi.nets.tinyFaceDetector.load("../models/");
        await faceapi.loadSsdMobilenetv1Model("../models/");

        this._options = new faceapi.TinyFaceDetectorOptions();

        this._enableLazyDetectionMode();

        return true;
    };

    private _enableActiveDetectionMode = () => {        
        if (this._mode === this._modes.ACTIVE) return;

        Utils.Logger.log('[FaceDetector._enableActiveDetectionMode]');

        Utils.Speaker.playMotionDetectionSound();    
        
        this._timeout = setTimeout(this._enableLazyDetectionMode, FACE_DETECT_INTERVAL_WORKTIME);

        this._restartDetectionInterval(FACE_DETECT_INTERVAL_ACTIVE);        
        
    };

    private _enableLazyDetectionMode = () => {
        if (this._mode === this._modes.LAZY) return;

        Utils.Logger.log('[FaceDetector._enableLazyDetectionMode]');
       
        this._restartDetectionInterval(FACE_DETECT_INTERVAL_LAZY);
    };

    private _restartDetectionInterval = (mode: number) => {
        clearInterval(this._interval);
        clearTimeout(this._timeout);
        this._mode = mode;
        this._interval = setInterval(this._processVideoFrame, mode);
    };


    private _processVideoFrame = async () => {

        if (this._processing) return false;

        this._processing = true;

        this._frame = await this._camera.capture();       

        if (!this._frame) return this._dispose(); //@ts-ignore
        
        this._detections = await faceapi.detectAllFaces(this._frame, this._options); 

        if (!this._detections?.length) return this._dispose();

        Utils.Logger.log('[FaceDetector._processVideoFrame] detections: [' + this._detections.length + ']');  

        this.dispatchEvent(Events.FACE_DETECTED, { frame: this._frame.clone(), canvas: await this._splashFrametoCanvas(this._frame), box: this._detections.pop().box }); 

        this._dispose();

        return true;
    };

    private _splashFrametoCanvas = async (frame:Tensor4D) => {
        const canvas = document.createElement("canvas"); //@ts-ignore
        canvas.width = frame.shape.width; //@ts-ignore
        canvas.height = frame.shape.height; //@ts-ignore
        await browser.toPixels(frame, canvas);
        return canvas;
    };

    private _dispose = () => {
        this._frame?.dispose();
        this._frame = null;
        this._detections = null;
        this._processing = false;
        return false;
    };
}

export default new FaceDetector();