import { Tensor4D } from '@tensorflow/tfjs';
import Person from './../recognition/FaceRecognizer';

export class EventHandler {

    private readonly events:any = {};
   
    public addEventListener(eventName:string, handler:Function) {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      return this.events[eventName].push(handler);
    }
  
    public removeEventListener(eventName:string) {
      return delete this.events[eventName];
    }
  
    public dispatchEvent(eventName:string, data:any) {
      const event = this.events[eventName];
      if (event) {
        event.forEach((handler:Function) => {
          handler.call(null, data);
        });
      }
    }
  }

  export interface DetectionData {
    frame: Tensor4D | any;
    canvas: HTMLCanvasElement;
    persons?: Array<typeof Person>;
    box?:any;
  }

  export const FACE_DETECTED = 'face_detected';
  export const FACE_RECOGNIZED = 'face_recognized';
  export const MOTION_DETECTED ='motion_detected';
  export const MOTION_DETECTION_STARTED = 'motion_detection_started';
  export const MOTION_DETECTION_FINISHED = 'motion_detection_finished';
