
    // var KenestoHelper = {
    //           isNullOrEmpty(value: string){
    //         return !value;
    //     }
    // }
function addZero(x, n) {
    while (x.toString().length < n) {
        x = "0" + x;
    }
    return x;
}
    export function getTime() {
        var d = new Date();
        var h = addZero(d.getHours(), 2);
        var m = addZero(d.getMinutes(), 2);
        var s = addZero(d.getSeconds(), 2);
        var ms = addZero(d.getMilliseconds(), 3);
        return  h + ":" + m + ":" + s + ":" + ms;
}

export function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };
    // module.exports = KenestoHelper;