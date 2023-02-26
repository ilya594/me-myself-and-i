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

  export const FACE_DETECTED = 'face_detected';
  export const MOTION_DETECTED = 'motion_detected';
