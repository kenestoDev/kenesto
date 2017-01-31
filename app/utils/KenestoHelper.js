
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


    // module.exports = KenestoHelper;