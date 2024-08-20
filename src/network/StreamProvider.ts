import * as Events from "../utils/Events";    
import { DataConnection, MediaConnection, Peer } from "peerjs";
import * as uuid from "uuid";
import axios from "axios";
import Sounds from "../utils/Sounds";

const id = (device: string = !!screen.orientation ? "static-" : "mobile-"): string => device + uuid.v4();

export class StreamProvider extends Events.EventHandler {

    private _peer: any;
    private _connection: any;

    constructor() {
        super();

        window.onunload = (_) => this.destroy();
        window.onpagehide = (_) => { this.destroy(); };
    }

    public initialize = async (local: boolean = false) => {

        if (local) {
            this.initializeLocalStream();
        } else {
            this.initializePeerStream();
        }

        return this;
    }

    private initializePeerStream = async () => {

      const params = {
        host: "nodejs-peer-server.onrender.com",
        path: "/peer",
        secure: true,
      };
    
      this._peer = new Peer(id(), params);      
        
      this._peer.on('open', () => {
        
        this._connection = this._peer.connect('streamer');
            
        this._connection.on('open', () => {
        
          this._connection.send({ type: 'custom-media-stream-request' });
        
          this._peer.on('call', async (call: MediaConnection) => {
        
            call.on('stream', (stream) => this.dispatchEvent(Events.STREAM_RECEIVED, stream));
        
            call.answer(null);
          });
        });

        this._connection.on('data', async (data: any) /** TODO describe message interface **/ => {
 
          switch (data.type) {  

            case ('sounds-adjust-homie-volume'): {
              debugger;
              if (!isNaN(data?.data)) {
                Sounds.volume = Number(data.data);
              }
            }
          }
        });
      });
    }

    public sendSnaphot = (snapshot: string) => {
      this._connection?.send({ type : 'snapshot-send-homie-message', data: snapshot });     
    }

    public adjustVolume = (value: number) => {
      this._connection?.send({ type: 'sounds-adjust-homie-volume', data: value });
    }

    private initializeLocalStream = async () => {
      this.dispatchEvent(Events.STREAM_RECEIVED);
    }

    private destroy = () => {
        this._connection?.close?.();
        this._peer?.disconnect?.();
        this._peer?.destroy?.();  
    };



}

export default new StreamProvider();