import { MediaConnection, Peer } from "peerjs";
import * as uuid from "uuid";
import Snaphots from "./record/Snaphots";
import MotionDetector from "./motion/MotionDetector";
import * as Events from "./utils/Events";  

const id = (device: string = !!screen.orientation ? "static-" : "mobile-"): string => device + uuid.v4();

class Entry {

    private peer: Peer;

    private connection: any;

    constructor() { 
      window.onload = (event) => this.initializeView();
      window.onunload = (event) => this.destroy();
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

    private initializeConnection = async () => {   

     await MotionDetector.initialize();

     await Snaphots.initialize();

     MotionDetector.addEventListener(Events .MOTION_DETECTION_STARTED, () => Snaphots.create());

      const params = {
        host: "nodejs-peer-server.onrender.com",
        path: "/peer",
        secure: true,
      };

      this.peer = new Peer(id(), params);      
    
      this.peer.on('open', (data) => {
    
        this.connection = this.peer.connect('streamer');
        
        this.connection.on('open', () => {
    
          this.connection.send('custom-media-stream-request');
    
          this.peer.on('call', async (call: MediaConnection) => {
    
            call.on('stream', (stream) => {  

              document.getElementById("loader").style.display = 'none';

              const viewport = document.querySelector("video");              
              viewport.onloadedmetadata = viewport.play;        
              viewport.srcObject = stream;
              viewport.style.display = 'flex';
              
            //  document.body.requestFullscreen();

            });
    
            call.answer(null);
          });
        })
      });
    }

    private destroy = () => {
      this.connection?.close?.();
      this.peer?.disconnect?.();
      this.peer?.destroy?.();

    };
}

new Entry();