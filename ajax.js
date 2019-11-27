const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const ajax = (function(){
    var xhr = new XMLHttpRequest()
    return {
        get:function(url){
            var URL = encodeURI(url)
            return new Promise((resolve,reject)=>{
                xhr.open("GET",URL,true)
                xhr.send(null)
                xhr.onreadystatechange = function(){
                    if(xhr.readyState === 4){
                        try{
                            resolve(JSON.parse(xhr.responseText))
                        }catch(err){
                            resolve(xhr.responseText)
                        }
                    }
                }
            })
        },
        post:function(url,data){
            var URL = encodeURI(url)
            return new Promise((resolve,reject)=>{
                xhr.open("POST",URL,true)
                xhr.send(formate(data))
                xhr.onreadystatechange = function(){
                    if(xhr.readyState === 4){
                        try{
                            resolve(JSON.parse(xhr.responseText))
                        }catch(err){
                            resolve(xhr.responseText)
                        }
                    }
                }
            })
        }
    }
})();

function formate(data){
    if(typeof data === "string"){
        return data
    }
    var str = ""
    for(let o in data){
        str = str + o + "=" + data[o] + "&"
    }
    return str.replace(/&$/g,"")
}

module.exports = ajax