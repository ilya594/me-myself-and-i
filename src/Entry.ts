import Snaphots from "./record/Snaphots";
import MotionDetector from "./motion/MotionDetector";
import * as Events from "./utils/Events";  
import StreamProvider from "./network/StreamProvider";
import View from "./view/View";
import Console from "./utils/Console";
import RestService from "./network/RestService";
import Authentification from "./auth/Authentification";
import Controls from "./view/Controls";


class Entry {

    constructor() {
      this.initializeAuth();
    }

    private initializeAuth = async () => {
      await Authentification.initialize();
            Authentification.addEventListener(Events.NETWORK_AUTH_SUCCESS, () => this.initializeView());
    }
    

    private initializeView = async () => {
      await View.initialize();
            View.addEventListener(Events.USER_PROCEEDED, () => this.initializeRoutes());
    }

    private initializeRoutes = async () => {

      const route: string = window.location.search?.substring(1);

      switch (route) {
        case ('client'): {
          this.initializeComponents();
          break;
        }
        case ('provider'): {
          //TODO
          break;
        }
        case ('mix'): {
          await this.initializeIntegratedComponents();
          break;
        }
        default: {
          this.initializeComponents();
          break;
        }
      }
    }

    private initializeIntegratedComponents = async () => {

      const { Streamer } = await System.import('https://html-peer-streamer.onrender.com/index.js');
        
      //'https://localhost:8080/index.js');

      const streamer = new Streamer();
      const stream = await streamer.initialize();

      await StreamProvider.initialize(true);
            View.displayStream(stream);
            Controls.setVisible(true);

      await this.initializeCommonComponents();
    }


    private initializeComponents = async () => {   

      await StreamProvider.initialize();
            StreamProvider.addEventListener(Events.STREAM_RECEIVED, (stream: any) => {
              View.displayStream(stream)
              Controls.setVisible(true);
            });

      await this.initializeCommonComponents();
    }

    private initializeCommonComponents = async () => {

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