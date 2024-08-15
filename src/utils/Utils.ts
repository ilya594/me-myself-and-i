export function getRgb(bitmap: any) {
    let offset: number = 4;

    let r = 0;
    let g = 0;
    let b = 0;       
    let j = 0;

    for (let i = 0; i < bitmap.data.length - offset; i = i + offset) {
        r += bitmap.data[i];
        g += bitmap.data[i + 1];
        b += bitmap.data[i + 2];
        j++;
    }  
    let R = r/j;
    let G = g/j;
    let B = b/j;
    return {r:R, g:G, b:B};
};

export function rbgToHsv({r, g, b}: any) {
    r /= 255;
    g /= 255;
    b /= 255;
    let maxc = Math.max(r, g, b)
    let minc = Math.min(r, g, b)
    let v = maxc;
    if (minc === maxc) {
        return {h: 0.0, s: 0.0, v: v};
    } 

    let s = (maxc-minc) / maxc
    let rc = (maxc-r) / (maxc-minc)
    let gc = (maxc-g) / (maxc-minc)
    let bc = (maxc-b) / (maxc-minc)
    let h;
    if (r == maxc)
        h = 0.0+bc-gc
    else if (g == maxc)
        h = 2.0+rc-bc
    else h = 4.0+gc-rc;

    h = (h/6.0) % 1.0
    return {h: h * 360, s: s * 100, v: v * 100};
};

export function rgbToHex({r, g, b}: any) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

export function addTimeStamp(canvas: HTMLCanvasElement, date = new Date()): HTMLCanvasElement {
    const context = canvas.getContext('2d');
    context.font = '42px Courier New';
    context.fillStyle = "#00ff30";
    const dateStr =  '[time]    : ' + date.toISOString().split('T')[0] +
        ' ' + date.toTimeString().split(' ')[0] + 
        '.' + date.getMilliseconds();
    context.fillText(dateStr , 30, 30);
    return canvas;
}

export function addSourceStamp(canvas: HTMLCanvasElement, source: string): HTMLCanvasElement {
    const context = canvas.getContext('2d');
    context.font = '42px Courier New';
    context.fillStyle = "#00ff30";
    context.fillText('[trigger] : ' + source + ' ' + navigator?.appVersion, 30, 70);
    return canvas;
}

export function tryResizeWindow() {

    if (window.screen?.availWidth > 3000) {
       // debugger;
        window.resizeTo(window.screen.availWidth / 4, window.screen.availHeight / 4);
    }
}

export function matrixEffect(canvas: HTMLCanvasElement, interval: any) {
    
    let context = canvas.getContext("2d"),
        w = (canvas.width = window.innerWidth),
        h = (canvas.height = window.innerHeight);
    
    const str = "А+Б0В-Г1Д=Е2Ё Ж3З И4Й К5Л М6Н О7П Р8С Т9У Ф!Х Ц?Ч Ш.ЩЪ,Ы Ь:ЭЮ;Я 开儿 艾  诶 开伊 艾2 艾  西 吉 3艾 %$艾 伊4 67 娜% 伊 6a bc def 3@j k=l m% no#p-qrstu &v*wxy3z",
    matrix = str.split("");
    
    let font = 24,
        col = w / font,
        arr: any = [];


    
    for (let i = 0; i < col; i++) arr[i] = 1;
    
    function draw() {

        context.fillStyle = "rgba(0,0,0,.05)";
        context.fillRect(0, 0, w, h);
        context.fillStyle = "#0f0";
        context.font = font + "px system-ui";

        for (let i = 0; i < arr.length; i++) {
            const txt = matrix[Math.floor(Math.random() * matrix.length)];
            context.fillText(txt, i * font, arr[i] * font);
            if (arr[i] * font > h && Math.random() > 0.975) arr[i] = 0;
            arr[i]++;
        }
    }
    
    interval = setInterval(draw, 100);
}