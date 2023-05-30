import * as faceapi from "face-api.js";
import * as Faces from '../descriptors.js';
import * as Events from "../utils/Events";
import FaceDetector from "../detection/FaceDetector";
import { FaceDetectionOptions, FaceMatcher } from "face-api.js";
import * as Utils from "../utils/Utils";

const UNKNOWN:string = 'unknown';
const UNAVAIL:string = 'n/a';

class FaceRecognizer extends Events.EventHandler {

    private _faces:any = [];
    private _matcher:FaceMatcher;
    private _processing:boolean = false;
    private _options:FaceDetectionOptions;
    private _detections:any;
    private _data:Events.DetectionData;

    public initialize = async() => {

        Utils.Logger.log('[FaceRecognizer.initialize] with options: [SsdMobileNetv1]'); 

        await faceapi.loadAgeGenderModel("../models/");
        await faceapi.loadFaceRecognitionModel("../models/");
        await faceapi.loadFaceDetectionModel("../models");
        await faceapi.loadSsdMobilenetv1Model("../models");
        await faceapi.nets.faceLandmark68Net.load("../models/");
        await faceapi.nets.faceExpressionNet.load("../models");
   
        Faces.all.forEach(face => this._faces.push(faceapi.LabeledFaceDescriptors.fromJSON(face)));

        this._matcher = new faceapi.FaceMatcher(this._faces);        

        this._options = new faceapi.SsdMobilenetv1Options();

        FaceDetector.addEventListener(Events.FACE_DETECTED, (data:Events.DetectionData) => this._onDetectionDataReceived(data));

        return true;
    };

    private _onDetectionDataReceived = async (data:Events.DetectionData) => {

        Utils.Logger.log('[FaceRecognizer._onDetectionDataReceived] is busy: [' + this._processing + ']'); 

        if (this._processing) return false;   //@ts-ignore    

        this._processing = true; 

        this._data = data;

        const result = await this._analyzeDetections();

        Utils.Logger.log('[FaceRecognizer._onDetectionDataReceived] detections analyzed'); 

        this.dispatchEvent(Events.FACE_RECOGNIZED, { 
            frame: this._data.frame.clone(), 
            persons: result, 
            canvas: this._data.canvas, 
            box: this._data.box 
        });

        this._dispose();
    };

    private _analyzeDetections = async(): Promise<Array<Person>> => {         
        //@ts-ignore
        this._detections = await faceapi.detectAllFaces(this._data.frame, this._options).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptors();

        if (!this._detections?.length) return [];

        const detections = this._detections.slice();

        const match:any = null; //this._matcher.findBestMatch(detection.descriptor); //TODO!

        return detections.map((detection:any) => Distinguish(detection, match));
    };
    
    private _dispose = () => {
        this._data?.frame?.dispose();
        delete this._data?.frame;
        this._detections = null;
        this._processing = false;
    };
}

export const Distinguish = (detection:any | null = null, match:any | null = null): Person => {
    const identified:boolean = match?.distance > 0.7;
    const name:string = identified && match?.label ? match.label : UNKNOWN;
    const age:string = detection?.age ? detection.age.toFixed(0) : UNAVAIL;
    const sex:string = detection?.gender ? detection.gender : UNAVAIL;

    return {
        identified: identified ,
        name: name,
        age: age,
        sex: sex
    };
};

export interface Person {
    identified: boolean;
    name: string;
    age:string;
    sex:string;
    mood?:Array<string>;
};

export default new FaceRecognizer();