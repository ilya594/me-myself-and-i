import Snaphots from "./record/Snaphots";
import MotionDetector from "./motion/MotionDetector";
import * as Events from "./utils/Events";  
import DigitsDetector from "./digits/DigitsDetector";
import StreamProvider from "./stream/StreamProvider";
import View from "./view/View";

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
        default: {
          this.initializeComponents();
          break;
        }
      }
    }


    private initializeComponents = async () => {   

      await StreamProvider.initialize();
            StreamProvider.addEventListener(Events.STREAM_RECEIVED, (stream: any) => View.displayStream(stream));

      await Snaphots.initialize();

      //await DigitsDetector.initialize();

      await MotionDetector.initialize();
            MotionDetector.addEventListener(Events.MOTION_DETECTION_STARTED, () => Snaphots.create());
      //  MotionDetector.addEventListener(Events.STREAM_BALANCED, () => DigitsDetector.startDetection());
    }

    private initializeComponents_digits = async () => {
      await StreamProvider.initialize(true);
            StreamProvider.addEventListener(Events.STREAM_RECEIVED, (stream: any) => View.displayStream(stream));
    }

}

new Entry();