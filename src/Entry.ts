import { ME, SHPAK, VIDEO_HEIGHT, VIDEO_WIDTH } from "./Constants";
import Snaphots from "./Snaphots";
import * as faceapi from "face-api.js";


class Entry {

    private _snapshots:Snaphots;
    private _constraints = { video : { width: VIDEO_WIDTH, height: VIDEO_HEIGHT } };
    private _stream:MediaStream;   
    private _viewport:HTMLVideoElement;
 

    constructor() {
       this.initialize();         
    }

    private initialize = async () => {
        this._stream = await navigator.mediaDevices.getUserMedia(this._constraints); 

        this._viewport = document.querySelector("video");
        this._viewport.onloadedmetadata = () => this._viewport.play();
        
        this._viewport.srcObject = this._stream;

        this._snapshots = new Snaphots();

        setTimeout(window.console.clear, 1000);
    };

    private tmp = async () => {
        //await faceapi.loadTinyFaceDetectorModel("/");
        //await faceapi.nets.tinyFaceDetector.load("/");
        //await faceapi.loadFaceLandmarkModel("/");
        await faceapi.loadSsdMobilenetv1Model("/");
        await faceapi.loadAgeGenderModel("/");
        await faceapi.loadFaceExpressionModel("/");
        await faceapi.loadFaceRecognitionModel("/");
        await faceapi.nets.faceLandmark68Net.load("/");
        const input = document.querySelector("img");
        
        //debugger;
        //const faceMatcher = new faceapi.FaceMatcher(detectionsWithLandmarks);
        //debugger;
        //const match = faceMatcher.findBestMatch(SHPAK);
        debugger;

        //console.log('-->' + detectionsWithLandmarks[0].descriptor + '<--');
        debugger;
    }
}

new Entry();