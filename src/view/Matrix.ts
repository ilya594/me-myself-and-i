import MotionDetector from "../motion/MotionDetector";
import * as Utils from "../utils/Utils";
import * as Events from "../utils/Events"; 

import { 
    MATRIX_COOLDOWN_DELAY,
    MATRIX_FONT_SIZE
} from "../utils/Constants";

class Matrix {

    private _page: any;
    private _container: any;
    private _graphic: HTMLCanvasElement;

    private _interval: any;
    private _timeout: any;

    constructor() {

    }

    public initialize = async () => {

        this._page = document.getElementById("view-page");

        this._container = document.createElement("div");
        this._container.id = "container";
        this._container.style.setProperty('z-index', '9999');
        this._container.style.setProperty("position", "absolute");
        
        this._graphic = document.createElement("canvas"); this._container.appendChild(this._graphic);

        document.onmousemove = () => this.hide();    
        
        return this.will();
    }

    public show = () => {
        if (!this.exists()) {
            this._page.appendChild(this._container);
            this.matrixEffect(this._graphic);     
        }   
    }

    public hide = () => {
        if (this.exists()) {
            this._graphic.getContext("2d").clearRect(0, 0, window.innerWidth, window.innerHeight);
            this._page.removeChild(this._container);
            clearInterval(this._interval);
            clearTimeout(this._timeout);

            this.will();
        }      
    }

    private will = () => {
        clearTimeout(this._timeout);
        return (this._timeout = setTimeout(() => this.show(), MATRIX_COOLDOWN_DELAY));
    }

    private exists = () => {
        return document.getElementById("view-page") && document.getElementById("container");
    }


    private matrixEffect(canvas: HTMLCanvasElement) {
    
        const context = canvas.getContext("2d"),
            w = (canvas.width = window.innerWidth),
            h = (canvas.height = window.innerHeight);
        
        const str = "А+Б0ƓВڲ-Г1Д=Е2Ё Ж3З И4Йۺ К5Лإ М6Нڧ О7П ۴Р8Сñ Тʬ9УƔڟ Ф!ڮХ ЦÛ?Ч ƪШ.іагb н ьцск бйщцгу ритй" +
                    "шлщшб пртаиук ؿЩЪ,Ы Ь:ЭЮ;ڿڿڦЯ 开儿 艾  诶Ƣ 开伊 艾2 艾ƕڪ   西Ý 吉 3艾 %$艾 伊4 ¿ 67 娜% ڠ伊" + 
                    "6a bcƜ dٿefï 3@j k=l m% no#pؠ-qrstu &v* ڜ wxy3z ¼ ¾ æè ƩỺ ʭʩʥ˩˩ͼ  ͽͽΔΔΔΔω ϘϠ ϠϡϢϧ Ϩ ϬϬϪЉЊ" + 
                    "ѭ ѭѬ ѸѶѺ҂؏	ڝ ҈ҨӜ ٹ ӾӾ֍ AGK QWN QJN BRY FGN eTY ZVQ [RM<R F ØņȺ ѪѭՃ ՉԾԷ Ֆܟڀڰ ۴ ڬ ڇ ۼ ש  ܔ" + 
                    "🝳 ৈ ੴ ੯ ୷ ௵ ௸௶ ෴෴ ⇫⇼⇱	⇲⇳⇴	⇶⇷⇸	⇹⇽	⇾	⇿	⇞⇈	↡	↢	↣	↤	↥	↦"	
                    "↧	↨	↩	↪	↫	↬	↭	↮	↯	⎱	⎲	⎳	⎴	⎵	⎶	⎷	⎸	⎹	⎺	⎻	⎼	";

        
        const matrix = str.split("");
        
        let font = MATRIX_FONT_SIZE,
            cols = w / font,
            pool: any = [];   
    
        
        for (let i = 0; i < cols; i++) pool[i] = 1;
        
        const draw = () => {
    
            context.fillStyle = "rgba(0,0,0,.05)";
            context.fillRect(0, 0, w, h);
            context.fillStyle = "#0f0";
            
            if (Math.random() > 0.9977) {
                context.fillStyle = "#f00";
            }
            context.font = font + "px system-ui";
    
            for (let i = 0; i < pool.length; i++) {
                const txt = matrix[Math.floor(Math.random() * matrix.length)];
                context.fillText(txt, i * font, pool[i] * font);
                if (pool[i] * font > h && Math.random() > 0.975) pool[i] = 0;
                pool[i]++;
            }
        }
        
        this._interval = setInterval(draw, 20);
    }

  
}

export default new Matrix();