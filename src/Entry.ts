import { Peer } from "peerjs";
import * as uuid from "uuid";

class Entry {

    constructor() { 
      window.addEventListener("load", this.initialize); 
    }

    private initialize = async () => {

      const id: string = 'client__' + uuid.v1();

      const params = {
        host: "nodejs-peer-server.onrender.com",
        path: "/peer",
      };

      var peer = new Peer(id, params);      
    
      peer.on('open', () => {
    
        const connection = peer.connect('streamer');
        
        connection.on('open', () => {
    
          connection.send('custom-media-stream-request');
    
          peer.on('call', (call) => {
    
            call.on('stream', (stream) => {  

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