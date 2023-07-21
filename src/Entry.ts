import { VIDEO_HEIGHT, VIDEO_WIDTH } from "./utils/Constants";
import * as Events from "./utils/Events";
import Snaphots from "./view/Snaphots";
import * as Utils from "./utils/Utils";
import FaceDetector from "./detection/FaceDetector";
import FaceRecognizer from './recognition/FaceRecognizer';
import Cats from "./view/Cats";  //@ts-ignore  
import * as Filesaver from 'file-saver';
import moment from "moment";
import MotionDetector from "./detection/MotionDetector";
import Soundpad from "./view/Soundpad";
//import StreamingEntity from "./sharing/StreamingEntity";


class Entry {

    private _constraints = { video : { width: VIDEO_WIDTH, height: VIDEO_HEIGHT } };
    private _stream:MediaStream;   
    private _viewport: HTMLVideoElement | any;

    constructor() {

        this.initialize();         
    }

    private initialize = async () => {
        
        this._stream = await navigator.mediaDevices.getUserMedia(this._constraints); 

        this._viewport = document.querySelector("video");
        this._viewport.onloadedmetadata = this._viewport.play;        
        this._viewport.srcObject = this._stream;        

        await MotionDetector.initialize();

        await FaceDetector.initialize();          

        await FaceRecognizer.initialize();    
        
        await Snaphots.initialize();

        await Cats.initialize();

    //    await StreamingEntity.initialize();

        await Soundpad.initialize();

        await Utils.Speaker.initialize();      
        
        

        FaceRecognizer.addEventListener(Events.FACE_RECOGNIZED, async (data: Events.DetectionData) => { //@ts-ignore            

            //Utils.Logger.log('[Snapshots.FACE_RECOGNIZED] person: [' + data.person.name + '].');  

            Utils.Speaker.playMotionDetectionSound();

            const canvas = Utils.signCanvas(data);

            Snaphots.createSnaphot(canvas);

            canvas.toBlob(file => Filesaver.saveAs(file, moment().toString() + '.png'));
         });

        //Utils.Speaker.playMotionDetectionSound();

        return Utils.Logger.log('\r\n' + 'Chlenix v 1.1 activated.');  
    };
}

new Entry();