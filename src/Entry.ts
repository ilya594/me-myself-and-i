import { Peer } from "peerjs";
import * as uuid from "uuid";

class Entry {

    constructor() { 
      window.addEventListener("load", this.initialize); 
    }

    private initialize = async () => {

      document.querySelector("textarea").onkeydown = (event) => {
        if ((event.target as any).textLength > 4) {
          document.getElementById("entry-page").style.display = 'none';
          document.getElementById("view-page").style.display = 'flex';   
          //@ts-ignore     
          this.initializeViewport(event.target.value); 
        }
      }
    }

    private initializeViewport = async (login: string) => {

      const id: string = login + uuid.v4();

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