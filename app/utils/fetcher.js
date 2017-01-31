
export function fetchAsync(url){
    try {
        var response = await fetch(url);
        var data = await response.json();
    // console.log(data);
    } catch (e) {
      return null
    }
}