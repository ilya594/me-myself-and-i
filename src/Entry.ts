import { Peer } from "peerjs";
import * as uuid from "uuid";

class Entry {

    constructor() { 
      window.addEventListener("load", this.initialize); 
    }

    private initialize = async () => {

      const entryPage = document.getElementById("entry-page");

      const viewPage = document.getElementById("view-page");

      entryPage.onclick = () => {

        entryPage.style.display = 'none';
        viewPage.style.display = 'flex';
        
        this.initializeViewport();
      }
    }

    private initializeViewport = async () => {

      const id: string = uuid.v4();

      const params = {
        host: "nodejs-peer-server.onrender.com",
        path: "/peer",
      };

      var peer = new Peer(id, params);      
    
      peer.on('open', (data) => {
    
        const connection = peer.connect('streamer');
        
        connection.on('open', () => {
    
          connection.send('custom-media-stream-request');
    
          peer.on('call', async (call) => {
    
            call.on('stream', (stream) => {  

              const loader = document.getElementById("loader");
              loader.style.display = 'none';

              const viewport = document.querySelector("video");
              viewport.onloadedmetadata = viewport.play;        
              viewport.srcObject = stream;

            });
    
            call.answer(null);
          });
        })
      });
    }
}

new Entry();