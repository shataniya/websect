const jmd = (function(){
    return {
        stringify:function(obj){
            if(Array.isArray(obj)){
                var om = obj.map(el=>JSON.stringify(el,null,5))
                return JSON.stringify(om,null,5)
            }
            if(typeof obj === "object" && obj !== null){
                return JSON.stringify(obj,null,5)
            }
            return JSON.stringify(obj,null,5)
        },
        parse:function(obj){
            var o = JSON.parse(obj)
            if(Array.isArray(o)){
                var om = o.map(el=>JSON.parse(el))
                return om
            }
            if(typeof o === "object" && o !== null){
                return o
            }
            return JSON.parse(obj)
        }
    }
})();

module.exports = jmd