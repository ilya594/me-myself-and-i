import Signaling from "./Signaling";
import * as Utils from "../utils/Utils";

export default class Viewer {

    private signaling:Signaling;
    private connection:RTCPeerConnection;
    private viewport:any;

    constructor() {
        this.initializeConnection();
    }

    public setSignalingChannel = (signaling:Signaling) => {
        this.signaling = signaling;
    };

    public processOffer = async (offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> => {

        Utils.Logger.log('[Viewer.processOffer] received sdp : ' + '\r\n' + String(offer.sdp).trim());

        this.connection.setRemoteDescription(offer);
        let answer:RTCSessionDescriptionInit = await this.connection.createAnswer();
        this.connection.setLocalDescription(answer);
        return answer;
    };

    public addIceCandidate = async (candidate:RTCIceCandidate) => {
        this.connection.addIceCandidate(candidate);
    };

    private initializeConnection = async () => {

        this.viewport = document.getElementById("viewer");

        this.connection = new RTCPeerConnection();

        this.connection.onicecandidate = (event:RTCPeerConnectionIceEvent) => {
            if (event.candidate !== null) {
                this.signaling.addStreamerIceCandidate(event.candidate);
            } else {
                // received null, candidates gathering finished
            }
        };

        this.connection.ontrack = (event:any) => {          

            this.viewport.onloadedmetadata = () => this.viewport.play();        
            this.viewport.srcObject = new MediaStream([event.track]);   
            this.viewport.play();
        };

        this.connection.oniceconnectionstatechange = (event:any) => {
            //
        };

        this.connection.onsignalingstatechange = (event:any) => {
            //
        };

        this.connection.onconnectionstatechange = (event:any) => {
            //
        };
    };
}