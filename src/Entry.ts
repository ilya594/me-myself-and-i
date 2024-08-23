import Snaphots from "./record/Snaphots";
import MotionDetector from "./motion/MotionDetector";
import * as Events from "./utils/Events";  
import StreamProvider from "./network/StreamProvider";
import View from "./view/View";
import Console from "./utils/Console";
import RestService from "./network/RestService";
import Authentification from "./auth/Authentification";
import Controls from "./view/Controls";
import Sounds from "./utils/Sounds";
import * as Utils from './utils/Utils';
import Matrix from "./view/Matrix";
import { XmlGenerator } from "./utils/XmlGenerator";

const route = (): string => window.location.search?.substring(1); 

class Entry {

    constructor() {

      switch (route()) {
        case ('show'): {
          this.initializeView();
          break;
        }

        default: {
          this.initializeAuth();
          break;
        }
      }
    }

    private initializeAuth = async () => {

      Utils.tryResizeWindow();

      await Console.initialize();

      await Authentification.initialize();
            Authentification.addEventListener(Events.NETWORK_AUTH_SUCCESS, () => this.initializeView());
    }
    

    private initializeView = async () => {
      await View.initialize();
            View.addEventListener(Events.USER_PROCEEDED, () => this.initializeRoutes());
    }

    private initializeRoutes = async () => {

      switch (route()) {
        case ('client'): {
          this.initializeComponents();
          break;
        }
        case ('show'): {
          await this.initializeIntegratedComponents( { kind: 'videoinput' } );
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

    private initializeIntegratedComponents = async ( options: any = { label: '720' } ) => {

      const { Streamer } = await System.import('https://html-peer-streamer.onrender.com/index.js');
        
      const callbacks = new Map().set('a', () => {});

      const streamer = new Streamer();
          //  streamer.addEventListener*()
      const { stream, devices } = await streamer.initialize(options, callbacks);

      await StreamProvider.initialize(true);
            View.displayStream(stream, devices);
            Controls.setVisible(true);

      await this.initializeCommonComponents();
    }


    private initializeComponents = async () => {   

      await StreamProvider.initialize();
            StreamProvider.addEventListener(Events.STREAM_RECEIVED, (stream: any) => {
              View.displayStream(stream);
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


      await Sounds.initialize();

      await Matrix.initialize();

   // await Console.initialize();
    }
}

new Entry();