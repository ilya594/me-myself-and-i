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

