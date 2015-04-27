var RGB = function(r, g, b) {
    this.red = r > 255 ? 255 : r < 0 ? 0 : r;
    this.green = g > 255 ? 255 : g < 0 ? 0 : g;
    this.blue = b > 255 ? 255 : b < 0 ? 0 : b;
};
    
RGB.prototype.toRGB = function() { return this; }

RGB.prototype.toCMYK = function() {
    return new CMYK(255 - this.red, 255 - this.green, 255 - this.blue);
}
    
RGB.prototype.toHSV = function() {
    var r = this.red / 255;
    var g = this.green / 255;
    var b = this.blue / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var delta = max - min;
    var h;
    var s;
    var v;
    if (delta == 0)
        h = 0;
    else if (max == r && g >= b)
        h = (60 * (g - b) / delta);
    else if (max == r)
        h = (60 * (g - b) / delta + 360);
    else if (max == g)
        h = (60 * (b - r) / delta + 120);
    else if (max == b)
        h = (60 * (r - g) / delta + 240);
    if (max == 0)
        s = 0;
    else
        s = ((1 - min / max) * 100);
    v = (max * 100);
    return new HSV(h, s, v);
}

var XWhite = 95.047;
var YWhite = 100;
var ZWhite = 108.883;

function rgb2xyz(rgb) {
    var var_R = rgb.red / 255;
    var var_G = rgb.green / 255;
    var var_B = rgb.blue / 255;

    if (var_R > 0.04045) 
        var_R = Math.pow((var_R + 0.055) / 1.055, 2.4);
    else 
        var_R = var_R / 12.92;
    if (var_G > 0.04045) 
        var_G = Math.pow((var_G + 0.055) / 1.055, 2.4);
    else 
        var_G = var_G / 12.92;
    if (var_B > 0.04045) 
        var_B = Math.pow((var_B + 0.055) / 1.055, 2.4);
    else 
        var_B = var_B / 12.92;
        
    var_R = var_R * 100;
    var_G = var_G * 100;
    var_B = var_B * 100;

    return {x: var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805,
            y: var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722,
            z: var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505};
}

RGB.prototype.toLUV = function() {
    var xyz = rgb2xyz(this);
    
    if (xyz.X == 0 && xyz.Y == 0 && xyz.Z == 0) {
        return new LUV(0, 0, 0);
    }

    var u = 4 * xyz.x / (xyz.x + 15 * xyz.y + 3 * xyz.z) * 100;
    var v = 9 * xyz.y / (xyz.x + 15 * xyz.y + 3 * xyz.z) * 100;
    var l;
    var y = xyz.y / YWhite;
    if (y <= Math.pow(6 / 29, 3)) {
        l = Math.pow(29 / 3, 3) * y;
    }
    else {
        l = 116 * Math.pow(y, 1.0 / 3.0) - 16;
    }
    return new LUV(l, u, v);
}

var CMYK = function(c, m, y) {
    this.cyan = c > 255 ? 255 : c < 0 ? 0 : c;
    this.magenta = m > 255 ? 255 : m < 0 ? 0 : m;
    this.yellow = y > 255 ? 255 : y < 0 ? 0 : y;
};
    
CMYK.prototype.toRGB = function() {
    return new RGB(255 - this.cyan, 255 - this.magenta, 255 - this.yellow);
}

var HSV = function(h, s, v) {
    this.hue = h > 360 ? 360 : h < 0 ? 0 : h;
    this.saturation = s > 100 ? 100 : s < 0 ? 0 : s;
    this.value = v > 100 ? 100 : v < 0 ? 0 : v;
};
    
HSV.prototype.toRGB = function() {
    var hi = Math.floor(this.hue / 60);
    var vmin = (100 - this.saturation) * this.value / 100;
    var a = (this.value - vmin) * ((this.hue % 60) / 60.0);
    var vinc = vmin + a;
    var vdec = this.value - a;
    vmin = vmin * 255 / 100;
    vinc = vinc * 255 / 100;
    vdec = vdec * 255 / 100;
    var vi = this.value * 255 / 100;
    switch (hi) {
    case 0:
        return new RGB(vi, vinc, vmin);
    case 1:
        return new RGB(vdec, vi, vmin);
    case 2:
        return new RGB(vmin, vi, vinc);
    case 3:
        return new RGB(vmin, vdec, vi);
    case 4:
        return new RGB(vinc, vmin, vi);
    case 5:
        return new RGB(vi, vmin, vdec);
    }
}

var LUV = function(l, u, v) {
    this.l = l > 100 ? 100 : l < 0 ? 0 : l;
    this.u = u > 100 ? 100 : u < 0 ? 0 : u;
    this.v = v > 100 ? 100 : v < 0 ? 0 : v;
}

function xyz2rgb(xyz) {
    var var_X = xyz.x / 100;
    var var_Y = xyz.y / 100;
    var var_Z = xyz.z / 100;

    var var_R = var_X * 3.2406 + var_Y * -1.5372 + var_Z * -0.4986;
    var var_G = var_X * -0.9689 + var_Y * 1.8758 + var_Z * 0.0415;
    var var_B = var_X * 0.0557 + var_Y * -0.2040 + var_Z * 1.0570;

    if (var_R > 0.0031308)
        var_R = 1.055 * Math.pow(var_R, 1 / 2.4) - 0.055;
    else
        var_R = 12.92 * var_R;
    if (var_G > 0.0031308)
        var_G = 1.055 * Math.pow(var_G, 1 / 2.4) - 0.055;
    else 
        var_G = 12.92 * var_G;
    if (var_B > 0.0031308) 
        var_B = 1.055 * Math.pow(var_B, 1 / 2.4) - 0.055;
    else 
        var_B = 12.92 * var_B;

    return new RGB(var_R * 255, var_G * 255, var_B * 255);
}

LUV.prototype.toRGB = function() {
    var u = this.u / 100; 
    var v = this.v / 100;
    
    var var_Y = (this.l + 16) / 116.0;
    if (Math.pow(var_Y, 3) > 0.008856)
        var_Y = Math.pow(var_Y, 3);
    else
        var_Y = (var_Y - 16 / 116.0) / 7.787;

    var xyz = {x: 0, y: 0, z: 0};
    
    if (v == 0) {
        return xyz2rgb(xyz);
    }
    
    xyz.y = var_Y * YWhite;
    xyz.x = -((9 * xyz.y * u) / ((u - 4) * v - v * u));
    xyz.z = (9 * xyz.y - 15 * v * xyz.y - v * xyz.x) / (3 * v);
    return xyz2rgb(xyz);
}

var rgb = new RGB(0, 0, 0);
var cmyk = new CMYK(255, 255, 255);
var hsv = new HSV(0, 0, 100);
var luv = new LUV(0, 0, 0);

var colors = { 'rgb': rgb, 'hsv': hsv, 'cmy': cmyk, 'luv': luv };

var panel = document.getElementById('panel');
var sliders = document.querySelectorAll('input[type="range"]');
for(var i = 0; i < sliders.length; ++i) {
    sliders[i].addEventListener('input', sliderDragged, true);
}
var colorPicker = document.querySelector('input[type="color"]');
colorPicker.addEventListener('input', colorPicked);

function colorPicked() {
    colors.rgb = hexToRgb(this.value);
    panel.style.backgroundColor = this.value;
    refresh();
}

function rgbToHex(r, g, b) {
    r = r > 255 ? 255 : r;
    g = g > 255 ? 255 : g;
    b = b > 255 ? 255 : b;
    return '#' + ('000000' + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
}

function hexToRgb(hex) {
    return new RGB(parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16))
}

function updateSliders(scheme) {
    var sliders = document.getElementById(scheme).querySelectorAll('input[type="range"]');
    for(var i = 0; i < sliders.length; ++i) {
        sliders[i].value = colors[scheme][sliders[i].name];
    }
    var textFields = document.getElementById(scheme).querySelectorAll('input[type="text"]');
    for(var i = 0; i < textFields.length; ++i) {
        textFields[i].value = Math.round(colors[scheme][sliders[i].name]);
    }
}

function refresh(scheme) {
    if(scheme !== 'cmy') {
        colors['cmy'] = colors['rgb'].toCMYK();
    }
    if(scheme !== 'hsv') {
        colors['hsv'] = colors['rgb'].toHSV();
    }
    if(scheme !== 'luv') {
        colors['luv'] = colors['rgb'].toLUV();
    }
    updateSliders('cmy');
    updateSliders('hsv');
    updateSliders('luv');
    updateSliders('rgb');
}

function sliderDragged(e) {
	this.previousElementSibling.value = this.value;
	var colorScheme = this.parentElement.parentElement;
	colors[colorScheme.id][this.name] = +this.value;
    colors['rgb'] = colors[colorScheme.id].toRGB();
    var sliders = colorScheme.querySelectorAll('input[type="range"]');
	panel.style.backgroundColor = rgbToHex(colors['rgb'].red, colors['rgb'].green, colors['rgb'].blue);
    refresh(colorScheme.id);
}