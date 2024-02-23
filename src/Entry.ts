import { Peer } from "peerjs";
import * as uuid from "uuid";

class Entry {

    constructor() { 
      window.addEventListener("load", this.initialize); 
    }

    private initialize = async () => {
      //@ts-ignore-line
      screen.lockOrientation?.("landscape") || screen.lock?.("landscape");

      document.querySelector("img").onclick = (event) => {
        document.getElementById("entry-page").style.display = 'none';
        document.getElementById("view-page").style.display = 'flex'; 
        this.initializeViewport(); 
      }
    }

    private initializeViewport = async () => {   

      const params = {
        host: "nodejs-peer-server.onrender.com",
        path: "/peer",
        secure: true,
      };

      var peer = new Peer(uuid.v4(), params);      
    
      peer.on('open', (data) => {
    
        const connection = peer.connect('streamer');
        
        connection.on('open', () => {
    
          connection.send('custom-media-stream-request');
    
          peer.on('call', async (call) => {
    
            call.on('stream', (stream) => {  

              document.getElementById("loader").style.display = 'none';

              const viewport = document.querySelector("video");
              viewport.onloadedmetadata = viewport.play;        
              viewport.srcObject = stream;
              viewport.style.display = 'flex';

            });
    
            call.answer(null);
          });
        })
      });
    }
}

new Entry();