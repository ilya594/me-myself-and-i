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

export function rbgToHsv(r:number, g:number, b:number) {
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