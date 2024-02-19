import { Peer } from "peerjs";

class Entry {

    constructor() { 
      window.addEventListener("load", (event) => this.initialize()); 
    }

    private initialize = async () => {

      var peer = new Peer("client", {
        host: "nodejs-peer-server.onrender.com",
        path: "/peer",
      });      

      const viewport = document.querySelector("video");
    
      peer.on('open', (data) => {
    
        const connection = peer.connect('streamer');
        
        connection.on('open', () => {
    
          connection.send('custom-media-stream-request');
    
          peer.on('call', async (call) => {
    
            call.on('stream', (stream) => {    
              
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