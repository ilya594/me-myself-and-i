
class Matrix {

    private _enabled: boolean;
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
        this._container.width = "100%";
        this._container.style.setProperty('z-index', '9999');
        this._container.style.setProperty("position", "absolute");
        
        this._graphic = document.createElement("canvas"); this._container.appendChild(this._graphic);

        document.onmousemove = () => this.hide();    

  //      Controls.addEventListener(Events.CHANGE_TRACE_VISIBILITY, () => { 
 //           this._enabled = !this._enabled; 
  //          if (this._enabled) this.will();
 //       });
        
        return this;
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
        return (this._timeout = setTimeout(() => this.show(), 10000));
    }

    private exists = () => {
        return document.getElementById("view-page") && document.getElementById("container");
    }


    private matrixEffect(canvas: HTMLCanvasElement, font = 24) {
    
        const context = canvas.getContext("2d", {willReadFrequently: true});
           const w = (canvas.width = window.innerWidth);
           const h = (canvas.height = window.innerHeight);

           
        
        const str = "А+Б0ƓВڲ-Г1Д=Е2Ё Ж3З И4Йۺ К5Лإ М6Нڧ О7П ۴ڟ Ф!ڮХ ЦÛ?Ч ƪШ.іагb н ьцск бйщцгу ритй" +
                    "шлщшб пр,Ы Ь:ЭЮ;ڿڿڦЯ 开儿 艾  诶Ƣ 开伊 艾2 艾ƕڪ   西Ý 吉 3艾 %$艾 伊4 ¿ 67 娜% ڠ伊" + 
                    "6a bcƜ dٿefïo#pؠ-qrstu &v* ڜ wxy3z ¼ ¾ æè ƩỺ ʭʩʥ˩˩ͼ  ͽͽΔΔΔΔω ϘϠ ϠϡϢϧ Ϩ ϬϬϪЉЊ" + 
                    "1871640532 1 udp 1677729535 188.212777 typ srflx raddr 0.0.0.0 rport 0 generation 0" + 
                    "ufrag AfOL network-coe:832498458 1 udp 1677729535 4147.105 55549 typ srflx" +
                    " raddr 0.0.0.0 rport 0 generation 0 ufrag 4W3O ne ϲτ χ κ ͷρ φ 	π314 ʏ ƙ ɜ ӆ ϰ ƴ" +
                    "и̷ ய ౦ ӥ ❡ ㄐ и̷ௐ ჯ ய౦? ቀ 	ჶ ෲ? ƿ ᗱ ㄏ ㄨ ȹ Ⴏ ȝ Κ Ͷ Λ  Ο Φ Η БΛЯΤЬ ❞૱ઐᙓዘҚ☯" +
                    " нaχƴй ㄨㄦ੦ഠ〇ㄇㄐ૯ㄏㄏ πiȝgyютьㄇㄈ ㄋ ㄏ ㄐ ㄒ	ㄗ ㄙ ㄚ	 ㄤ ㄥ ㄦ ㄨ ㄩ	4TG";
        
        const matrix = str.split("");

        let cols = w / font;
        let pool: any = [];   
        
        for (let i = 0; i < cols; i++) pool[i] = 1;
        
        const draw = () => {
    
            context.fillStyle = "rgba(0,0,0,.05)";
            context.fillRect(0, 0, w, h);

            context.fillStyle = "#00ff00";
            
            if (Math.random() > 0.9955) {
                context.fillStyle = "#f00";
            }
            context.font = font + "px system-ui";
    
            for (let i = 0; i < pool.length; i++) {
                const txt = matrix[Math.floor(Math.random() * matrix.length)];
                context.fillText(txt, i * font, pool[i] * font);
                if (pool[i] * font > h && Math.random() > 0.95) pool[i] = 0;
                pool[i]++;
            }
        }
        
        this._interval = setInterval(draw, 77);
    }

  
}

export default new Matrix();