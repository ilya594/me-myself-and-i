import Snaphots from "./record/Snaphots";
import MotionDetector from "./motion/MotionDetector";
import * as Events from "./utils/Events";  
//import DigitsDetector from "./digits/DigitsDetector";
import StreamProvider from "./network/StreamProvider";
import View from "./view/View";
import DigitsDetectorLocal from "./digits/DigitsDetectorLocal";
import Console from "./utils/Console";
import RestService from "./network/RestService";

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
          //
          break;
        }
        case ('local'): {
          //
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

      await RestService.initialize();

      await Snaphots.initialize();
            Snaphots.addEventListener(Events.SNAPSHOT_SEND_HOMIE, (data: any) => {
              StreamProvider.sendSnaphot(data);
              RestService.sendSnaphot(data);
            });

      await MotionDetector.initialize();
            MotionDetector.addEventListener(Events.MOTION_DETECTION_STARTED, () => Snaphots.create());

      await Console.initialize();
    }
}

new Entry();