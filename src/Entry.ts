import Snaphots from "./record/Snaphots";
import MotionDetector from "./motion/MotionDetector";
import * as Events from "./utils/Events";  
//import DigitsDetector from "./digits/DigitsDetector";
import StreamProvider from "./stream/StreamProvider";
import View from "./view/View";
import DigitsDetectorLocal from "./digits/DigitsDetectorLocal";
import Console from "./utils/Console";

class Entry {

    constructor() {       
      this.initializeView();
    }

    private initializeView = async () => {

      await View.initialize();
            View.addEventListener(Events.USER_PROCEEDED, () => this.initializeRoutes());
    }

    private initializeRoutes = () => {

      const route: string = window.location.search?.substring(1);

      switch (route) {
        case ('digits'): {
          this.initializeComponents_digits();
          break;
        }
        case ('local'): {
          this.initializeComponents_local();
          break;
        }
        default: {
          this.initializeComponents();
          break;
        }
      }
    }


    private initializeComponents = async () => {   

      (await StreamProvider.initialize()).addEventListener(Events.STREAM_RECEIVED, (stream: any) => View.displayStream(stream));

      await Snaphots.initialize();
            Snaphots.addEventListener(Events.SNAPSHOT_SEND_HOMIE, (data: any) => StreamProvider.sendSnaphot(data));

     // await DigitsDetector.initialize();

      await MotionDetector.initialize();
            MotionDetector.addEventListener(Events.MOTION_DETECTION_STARTED, () => Snaphots.create());
        //  MotionDetector.addEventListener(Events.STREAM_BALANCED, () => DigitsDetector.startDetection());

      await Console.initialize();
    }

    private initializeComponents_digits = async () => {

      await DigitsDetectorLocal.initialize();

      (await StreamProvider.initialize(true)).addEventListener(Events.STREAM_RECEIVED, (stream: any) => {              
          View.displayStream(stream);
          setTimeout(() => DigitsDetectorLocal.startDetection(), 1000);
      });
    }

    private initializeComponents_local = async () => {

      await DigitsDetectorLocal.initialize();
            DigitsDetectorLocal.startDetection();

    }

}

new Entry();