
export function fetchAsync(url){
    try {
        var response = await fetch(url);
        var data = await response.json();
    } catch (e) {
      return null
    }
}