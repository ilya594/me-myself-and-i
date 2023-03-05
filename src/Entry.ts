import { VIDEO_HEIGHT, VIDEO_WIDTH } from "./Constants";
import * as Events from "./Events";
import Snaphots from "./view/Snaphots";
import * as Utils from "./Utils";
import FaceDetector from "./detection/FaceDetector";
import FaceRecognizer from './recognition/FaceRecognizer'; //@ts-ignore  
import * as Filesaver from 'file-saver';
import * as moment from "moment";

class Entry {

    private _snapshots:Snaphots;
    private _constraints = { video : { width: VIDEO_WIDTH, height: VIDEO_HEIGHT } };
    private _stream:MediaStream;   
    private _viewport:HTMLVideoElement;
    private _speaker:HTMLAudioElement = document.createElement("audio");
 

    constructor() {
       this.initialize();         
    }

    private initialize = async () => {
        
        this._stream = await navigator.mediaDevices.getUserMedia(this._constraints); 

        this._viewport = document.querySelector("video");
        this._viewport.onloadedmetadata = () => this._viewport.play();        
        this._viewport.srcObject = this._stream;

        this._snapshots = new Snaphots();

        await FaceDetector.initialize();          

        await FaceRecognizer.initialize();       

        FaceRecognizer.addEventListener(Events .FACE_RECOGNIZED, async (data:Events.DetectionData) => { //@ts-ignore            

            Utils.log('[Snapshots.FACE_RECOGNIZED] person: [' + data.person.name + ']');  

            this._playDetectedAudio();

            const canvas = Utils.signCanvas(data);

            this._snapshots.createSnaphot(canvas);

            canvas.toBlob(file => Filesaver.saveAs(file, moment().toString() + '.png'));
         });

        Utils.log('[Snapshots.initializeDetectors] initilization completed');  

        this._playInitializedAudio();

        setTimeout(window.console.clear, 1000);
    };

    private _playInitializedAudio = () => {
        this._speaker.setAttribute('src', '/audio/initialization.mp3');
        this._speaker.play();
    };

    private _playDetectedAudio = () => {
        this._speaker.setAttribute('src', './audio/detection.mp3');
        this._speaker.play();
    }
}

new Entry();