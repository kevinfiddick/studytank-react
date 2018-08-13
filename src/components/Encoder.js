


  const sha256 = function(str) {
    init();
    var buffer = new TextEncoder("utf-8").encode(str);
    return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
      return hex(hash);
    });
  }
  const hex = function(buffer) {
    var hexCodes = [];
    var view = new DataView(buffer);
    for (var i = 0; i < view.byteLength; i += 4) {
      var value = view.getUint32(i);
      var stringValue = value.toString(16);
      var padding = '00000000';
      var paddedValue = (padding + stringValue).slice(-padding.length);
      hexCodes.push(paddedValue);
    }
    return hexCodes.join("");
  }
  const init = function(){
    if (!window.crypto){
      window.crypto=window.msCrypto;
    }
    if (typeof TextEncoder === "undefined") {
        TextEncoder = function TextEncoder(){};
        TextEncoder.prototype.encode = function encode(str) {
            "use strict"; // add a little speed, maybe?
            var Len = str.length, resPos = -1, resArr = new Uint8Array(Len * 3);
            for (var point=0, nextcode=0, i = 0; i !== Len; ) {
                point = str.charCodeAt(i), i += 1;
                if (point >= 0xD800 && point <= 0xDBFF) {
                    if (i === Len) {
                        resArr[resPos += 1] = 0xef/*0b11101111*/; resArr[resPos += 1] = 0xbf/*0b10111111*/;
                        resArr[resPos += 1] = 0xbd/*0b10111101*/; break;
                    }
                    // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                    nextcode = str.charCodeAt(i);
                    if (nextcode >= 0xDC00 && nextcode <= 0xDFFF) {
                        point = (point - 0xD800) * 0x400 + nextcode - 0xDC00 + 0x10000;
                        i += 1;
                        if (point > 0xffff) {
                            resArr[resPos += 1] = (0x1e/*0b11110*/<<3) | (point>>>18);
                            resArr[resPos += 1] = (0x2/*0b10*/<<6) | ((point>>>12)&0x3f/*0b00111111*/);
                            resArr[resPos += 1] = (0x2/*0b10*/<<6) | ((point>>>6)&0x3f/*0b00111111*/);
                            resArr[resPos += 1] = (0x2/*0b10*/<<6) | (point&0x3f/*0b00111111*/);
                            continue;
                        }
                    } else {
                        resArr[resPos += 1] = 0xef/*0b11101111*/; resArr[resPos += 1] = 0xbf/*0b10111111*/;
                        resArr[resPos += 1] = 0xbd/*0b10111101*/; continue;
                    }
                }
                if (point <= 0x007f) {
                    resArr[resPos += 1] = (0x0/*0b0*/<<7) | point;
                } else if (point <= 0x07ff) {
                    resArr[resPos += 1] = (0x6/*0b110*/<<5) | (point>>>6);
                    resArr[resPos += 1] = (0x2/*0b10*/<<6)  | (point&0x3f/*0b00111111*/);
                } else {
                    resArr[resPos += 1] = (0xe/*0b1110*/<<4) | (point>>>12);
                    resArr[resPos += 1] = (0x2/*0b10*/<<6)    | ((point>>>6)&0x3f/*0b00111111*/);
                    resArr[resPos += 1] = (0x2/*0b10*/<<6)    | (point&0x3f/*0b00111111*/);
                }
            }
            resArr = new Uint8Array(resArr.buffer.slice(0, resPos+1));
            return resArr;
        };
        Object.defineProperty(TextEncoder.prototype,"encoding",{get:function(){if(!(this
        instanceof TextEncoder))throw TypeError("Illegal invocation");else return "utf-8"}});
        if(typeof Symbol!=="undefined")TextEncoder.prototype[Symbol.toStringTag]="TextEncoder";
    }
  }
  export { sha256 };
