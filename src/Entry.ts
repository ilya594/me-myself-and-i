import { Peer } from "peerjs";

class Entry {

    constructor() { 
      var peer = new Peer("client", {
        host: "nodejs-peer-server.onrender.com",
        //port: 80,
        path: "/peer",
      });
      
      const options = {};	
    
      peer.on('open', (data) => {
    
        const connection = peer.connect('streamer');
        
        connection.on('open', () => {
    
          connection.send('custom-media-stream-request');
    
          peer.on('call', async (call) => {
    
            const stream = await navigator.mediaDevices.getDisplayMedia(options);
    
            call.on('stream', (stream) => {
    
              const viewport = document.querySelector("video") || document.appendChild(document.createElement('video'));
                  viewport.onloadedmetadata = viewport.play;        
                  viewport.srcObject = stream;
            });
    
            call.answer(stream);
          });
        })
      });
    }
}

new Entry();