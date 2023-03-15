import Streamer from "./Streamer";
import Viewer from "./Viewer";

// this is a mock that provides the channel for handshake and iceCandidates exchange

export default class Signaling {

    private streamer:Streamer;
    private viewer:Viewer;
    
    constructor(streamer:Streamer, viewer:Viewer) {
        this.streamer = streamer;
        this.viewer = viewer;
    }

    public processOffer = async (offer:RTCSessionDescriptionInit):Promise<RTCSessionDescriptionInit> => {
        return await this.viewer.processOffer(offer);
    };

    public addViewerIceCandidate = (candidate:RTCIceCandidate):void => {
        this.viewer.addIceCandidate(candidate);        
    };

    public addStreamerIceCandidate = (candidate:RTCIceCandidate):void => {
        this.streamer.addIceCandidate(candidate);
    };
}