import Snaphots from "./record/Snaphots";
import MotionDetector from "./motion/MotionDetector";
import * as Events from "./utils/Events";  
import DigitsDetector from "./digits/DigitsDetector";
import StreamProvider from "./stream/StreamProvider";

class Entry {

    constructor() { 
      window.onload = (_) => this.initializeView();
    }

    private initializeView = async () => {
      //@ts-ignore-line
      screen.lockOrientation?.("landscape") || screen.lock?.("landscape");

      document.querySelector("img").onclick = (event) => {
        document.getElementById("entry-page").style.display = 'none';
        document.getElementById("view-page").style.display = 'flex'; 

        this.initializeConnection(); 
      }
    }

    private displayStream = (stream: any) => {
      document.getElementById("loader").style.display = 'none';
    
      const viewport = document.querySelector("video");              
      viewport.onloadedmetadata = viewport.play;        
      viewport.srcObject = stream;
      viewport.style.display = 'flex';
      
    //  document.body.requestFullscreen();
    }

    private initializeConnection = async () => {   

      await StreamProvider.initialize();
        StreamProvider.addEventListener(Events.STREAM_RECEIVED, (stream: any) => this.displayStream(stream))

      await Snaphots.initialize();

      //await DigitsDetector.initialize();

      await MotionDetector.initialize();
        MotionDetector.addEventListener(Events.MOTION_DETECTION_STARTED, () => Snaphots.create());
      //  MotionDetector.addEventListener(Events.STREAM_BALANCED, () => DigitsDetector.startDetection());
    }


}

new Entry();