module.exports = {
  name: "Cache",
  model: class {
    constructor(timeout = undefined, timeoutCallback = function(){}){
      var scopedCache = {};
      var tOutWorker;
      const tOutHandler = (timeout !== undefined ? () => {
        if(tOutWorker !== undefined) clearTimeout(tOutHandler);
        tOutWorker = setTimeout(() => {let j = (timeoutCallback ? timeoutCallback.call(scopedCache,scopedCache) : {}); scopedCache = j;}, timeout);
      } : () => {});
      Object.assign(this,{
        append(key, value){tOutHandler(); scopedCache[key] = value;},
        get(key){tOutHandler(); return scopedCache[key];},
        remove(key){tOutHandler();delete scopedCache[key]},
        clearCache(){tOutHandler(); scopedCache = {};},
        clear(){tOutHandler(); scopedCache = {};},
        has(key){return (scopedCache[key] !== undefined && scopedCache[key] !== null)},
        iterate(e){for (const [key, value] of Object.entries(scopedCache)) e(key, value);},
        toObject(){return scopedCache;}
      });
    }
  }
}