import { Peer } from "peerjs";
import * as uuid from "uuid";

class Entry {

    constructor() { 
      window.addEventListener("load", this.initialize); 
    }

    private initialize = async () => {

      document.querySelector("input").onkeyup = (event) => {
        //@ts-ignore  
        if (event.target.value.length > 5) {
          document.getElementById("entry-page").style.display = 'none';
          document.getElementById("view-page").style.display = 'flex';   
          //@ts-ignore     
          this.initializeViewport(event.target.value); 
        }
      }
    }

    private initializeViewport = async (login: string) => { 

      const generateId = (input: string, pattern = /^[\u0400-\u04FF]+$/): string => 
        (pattern.test(input) ? "client" : input) + "-" + uuid.v4();      

      const params = {
        host: "nodejs-peer-server.onrender.com",
        path: "/peer",
      };

      var peer = new Peer(generateId(login), params);      
    
      peer.on('open', (data) => {
    
        const connection = peer.connect('streamer');
        
        connection.on('open', () => {
    
          connection.send('custom-media-stream-request');
    
          peer.on('call', async (call) => {
    
            call.on('stream', (stream) => {  

              document.getElementById("loader").style.display = 'none';

              const viewport = document.querySelector("video");
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