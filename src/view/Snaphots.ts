//@ts-ignore
import * as TWEEN from '@tweenjs/tween.js';
import MotionDetector from '../detection/MotionDetector';
import { 
    VIDEO_WIDTH, 
    VIDEO_HEIGHT, 
    SNAP_WIDTH, 
    SNAP_HEIGHT, 
    SNAP_COUNT, 
} from "../utils/Constants";
import * as Utils from "../utils/Utils";
import * as Events from "../utils/Events";

class Snaphots {

    private _viewport:any;
    private _proxy:any;
    private _buffer:any;
    private _snapsaver:any;
    private _snapshot:any;
    private _count = 0;
    private _tween:any;
    
    private _tmpTimeout:any;

    private get w() { return this._viewport.getBoundingClientRect().width; }
    private get h() { return this._viewport.getBoundingClientRect().height; }

    public get playing() {
        return !!this._tween?.isPlaying;
    };

    public initialize = async () => {
        this._viewport = document.querySelector("video");
        this._viewport.onclick = () => this.onViewportClick();  

        this._snapsaver = document.querySelector("canvas");  
        this._snapsaver.onclick = () => this.onViewportClick(); 
        this._snapsaver.style.setProperty('transform', 'translate(' + 0 + 'px,' + 0 + 'px)' + 'scale(' + 1 + ',' + 1 + ')');         
        this._snapsaver.getContext('2d').clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);             

        this._snapshot = document.querySelectorAll("canvas")[1];
        this._snapshot.width = SNAP_WIDTH;
        this._snapshot.height = SNAP_HEIGHT;
        this._snapshot.getContext('2d').globalAlpha = 0;
        this._snapshot.getContext('2d').beginPath();
        this._snapshot.getContext('2d').lineWidth = "0";
        this._snapshot.getContext('2d').strokeStyle = "black"; 
        this._snapshot.getContext('2d').rect(0, 0, SNAP_WIDTH, SNAP_HEIGHT);
        this._snapshot.getContext('2d').stroke();
        this._snapshot.onclick = () => this.viewSnapshotCollection();

        this._proxy = document.createElement("canvas");
        
        this._buffer = document.createElement("canvas");
        this._buffer.width = VIDEO_WIDTH * SNAP_COUNT;
        this._buffer.height = VIDEO_HEIGHT * SNAP_COUNT;

        this._buffer.getContext('2d').beginPath();
        this._buffer.getContext('2d').lineWidth = "1";
        this._buffer.getContext('2d').strokeStyle = "black";
        this._buffer.getContext('2d').rect(0, 0, VIDEO_WIDTH * 5, VIDEO_HEIGHT * 5);
        this._buffer.getContext('2d').stroke();

        requestAnimationFrame(this.tick);
    };

    public onViewportClick = () => {         //TODO refactor

        Utils.Logger.log('[Snapshots.onViewportClick]');

        this.createSnaphot(this.drawCanvasFromVideo(this._proxy, this._viewport, "manual"));
    };

    private drawCanvasFromVideo(canvas:HTMLCanvasElement, video:any, source:string):HTMLCanvasElement {
        const w:number = canvas.width = video.getBoundingClientRect().width;
        const h:number = canvas.height = video.getBoundingClientRect().height;
        const context = canvas.getContext('2d'); 
        context?.clearRect(0, 0, w, h);
        context?.drawImage(video, 0, 0, w, h);
        Utils.addTimeStamp(canvas);        
        Utils.addSourceStamp(canvas, source);
        return canvas;
    };

    public createSnaphot = (source: HTMLCanvasElement) => { 

        Utils.Logger.log('[Snapshots.createSnapshot]');

        if (this.playing) this._tween.stop();
        
        const x:number = (this._count % SNAP_COUNT) * VIDEO_WIDTH;
        const y:number = Math.floor(this._count/SNAP_COUNT) * VIDEO_HEIGHT;

        this._buffer.getContext('2d').drawImage(source, x, y, VIDEO_WIDTH, VIDEO_HEIGHT);

        this._snapsaver.width = this.w;
        this._snapsaver.height = this.h;
        this._snapsaver.getContext('2d').globalAlpha = 0.4;  
        this._snapsaver.getContext('2d').drawImage(source, 0, 0, this.w, this.h);          

        this.startSaverTween(this.w, this.h);
    };

    private startSaverTween = (w:number, h:number) => {

        Utils.Logger.log('[Snapshots.startSaverTween] ');

        const ini = { scaleX: 1,            scaleY: 1,             x: 0,           y: 0 };
        const end = { scaleX: SNAP_WIDTH/w, scaleY: SNAP_HEIGHT/h, x: (w - SNAP_WIDTH)/2, y: -(h - SNAP_HEIGHT)/2 };   
        this._tween = new TWEEN.Tween(ini)
            .to({ scaleX: end.scaleX, scaleY: end.scaleY, x: end.x, y: end.y }, 200)
            .easing(TWEEN.Easing.Linear.None)
	        .onUpdate(() => this._snapsaver.style.setProperty('transform', 
                                    'translate(' + ini.x + 'px,' + ini.y + 'px)' + 
                                    'scale(' + ini.scaleX + ',' + ini.scaleY + ')'))
            .onComplete(() => this.onSaverTweenComplete())
            .onStop(() => this.onSaverTweenComplete())
            .start();    
    }

    private onSaverTweenComplete = () => {

        Utils.Logger.log('[Snapshots.onSaverTweenComplete] ');

        this._snapshot.getContext('2d').globalAlpha = 1;
        this._snapshot.getContext('2d').clearRect(0, 0, SNAP_WIDTH + 1, SNAP_HEIGHT) + 1;
        this._snapshot.getContext('2d').drawImage(this._snapsaver, 0, 0, SNAP_WIDTH, SNAP_HEIGHT);
        this._snapshot.getContext('2d').beginPath();
        this._snapshot.getContext('2d').lineWidth = "1";
        this._snapshot.getContext('2d').strokeStyle = "black";
        this._snapshot.getContext('2d').rect(0, 0, SNAP_WIDTH, SNAP_HEIGHT);
        this._snapshot.getContext('2d').stroke();
        
        this._snapsaver.style.setProperty('transform', 'translate(' + 0 + 'px,' + 0 + 'px)' + 'scale(' + 1 + ',' + 1 + ')');         
        this._snapsaver.getContext('2d').clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);            

        if (++this._count === SNAP_COUNT * SNAP_COUNT) this.flushBuffer();  
    }

    private flushBuffer = () => {

        Utils.Logger.log('[Snapshots.flushBuffer]');

        this.viewSnapshotCollection();
        this._buffer.getContext('2d').clearRect(0, 0, VIDEO_WIDTH * SNAP_COUNT, VIDEO_HEIGHT * SNAP_COUNT);
        this._buffer.width = VIDEO_WIDTH * SNAP_COUNT;
        this._buffer.height = VIDEO_HEIGHT * SNAP_COUNT;
        this._count = 0;
    };

    private viewSnapshotCollection = () => {

        Utils.Logger.log('[Snapshots.viewSnapshotCollection]');

        const tab: any = window.open();
        tab.document.body.style.width = tab.document.body.style.height = '100%';
        tab.document.body.style.overflow = 'hidden';
        tab.document.body.innerHTML = '<div width="100%" height="100%">' + 
        '<img src="' + this._buffer.toDataURL() + '" width="' + VIDEO_WIDTH + 'px" height="' + VIDEO_HEIGHT + 'px">' + '</div>';
    }

    private tick = (time:number) => {
	    requestAnimationFrame(this.tick);
	    TWEEN.update(time);
    };
}

export default new Snaphots();

