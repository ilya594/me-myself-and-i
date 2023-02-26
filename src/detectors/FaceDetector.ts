import * as faceapi from "face-api.js";
import * as Utils from "../Utils";
import { 
    FACE_DETECT_INTERVAL, 
    FACE_DETECT_DELAY, 
    SHPAK,
    ME} from "./../Constants";
import * as Events from "../Events";
    

export default class FaceDetector extends Events.EventHandler {

    private _viewport:HTMLVideoElement;
    private _collection:Utils.Pool;
    private _interval:any;

    constructor(viewport:HTMLVideoElement) {
        super();
        this._viewport = viewport;
        this._collection = new Utils.Pool(viewport);
        this.initializeFaceDetection();
    }

    private initializeFaceDetection = async () => {
        await faceapi.loadTinyFaceDetectorModel("/");
        await faceapi.nets.tinyFaceDetector.load("/");
        //await faceapi.nets.faceExpressionNet.load("/");

        this.startDetectionInterval();

        await faceapi.loadSsdMobilenetv1Model("/");
        await faceapi.loadAgeGenderModel("/");
        await faceapi.loadFaceExpressionModel("/");
        await faceapi.loadFaceRecognitionModel("/");
        await faceapi.nets.faceLandmark68Net.load("/");
    }

    private startDetectionInterval = () => {
        this._interval = setInterval(async () => {
            await this.analyzeVideoFrame();
        }, FACE_DETECT_INTERVAL);
    };

    private analyzeVideoFrame = async () => {
        const frame:HTMLCanvasElement = Utils.drawCanvasFromVideo(this._collection.get(), this._viewport);
        const options = new faceapi.TinyFaceDetectorOptions();

        const detections = await faceapi.detectAllFaces(frame, options);

        if (detections.length) {
            this.stopDetectionInterval();
            this.dispatchEvent(Events.FACE_DETECTED, { source: frame, faces: detections });
            //this.analyzeFaceDetection(frame);
        }  
        this._collection.put(frame);          
        return detections;        
    };

    private analyzeFaceDetection = async (detection:HTMLCanvasElement) => {
        const options = new faceapi.TinyFaceDetectorOptions();
        const detections = await faceapi.detectAllFaces(detection, options).withFaceLandmarks().withFaceDescriptors();
        const faceMatcher = new faceapi.FaceMatcher(detections);
        const match1 = faceMatcher.findBestMatch(SHPAK);
        const match2 = faceMatcher.findBestMatch(ME);
        debugger;
    };

    private stopDetectionInterval = () => {
        clearInterval(this._interval);        
        setTimeout(this.startDetectionInterval, FACE_DETECT_DELAY);
    };
}