const zlib = require("zlib")
const Buffer = require("buffer").Buffer
const https = require("https")
const http = require("http")
const url = require("url")
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

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

var ajax = (function(){
    var xhr = new XMLHttpRequest()
    return {
        get:function(path,flag){
            var URL = {}
            if(typeof path === "object"){
                var opt = url.parse(path.url)
                var protocol = opt.protocol
                URL.hostname = opt.hostname
                URL.path = opt.path
                URL.headers = path.headers
            }else{
                URL = path
                var protocol = url.parse(path).protocol
            }
            if(typeof path === "string" && typeof flag === "boolean" && flag){
                URL = encodeURI(path)
            }
            return new Promise((resolve,reject)=>{
                if(protocol === "http:"){
                    http.get(URL,(res)=>{
                        var text = []
                        var restext = null
                        res.on("data",function(chunk){
                            text.push(chunk)
                        })
                        res.on("end",function(){
                            restext = Buffer.concat(text)
                            var response = {}
                            response.buffer = restext
                            response.text = restext.toString()
                            response.headers = res.headers
                            response.rawHeaders = res.rawHeaders
                            response.uncompress = function(compress_method){
                                var cm = compress_method || this.headers["content-encoding"]
                                if(cm === "deflate"){
                                    try{
                                        var uncompressed = zlib.inflateSync(this.buffer)
                                    }catch(err){
                                        var uncompressed = zlib.inflateRawSync(this.buffer)
                                    }
                                    return uncompressed
                                }
                                if(cm === "gzip"){
                                    var uncompressed = zlib.unzipSync(this.buffer)
                                    return uncompressed
                                }
                            }
                            resolve(response)
                        })
                    }).end()
                }
                if(protocol === "https:"){
                    https.get(URL,(res)=>{
                        var text = []
                        var restext = null
                        res.on("data",function(chunk){
                            text.push(chunk)
                        })
                        res.on("end",function(){
                            restext = Buffer.concat(text)
                            var response = {}
                            response.buffer = restext
                            response.text = restext.toString()
                            response.headers = res.headers
                            response.rawHeaders = res.rawHeaders
                            response.uncompress = function(compress_method){
                                var cm = compress_method || this.headers["content-encoding"]
                                if(cm === "deflate"){
                                    try{
                                        var uncompressed = zlib.inflateSync(this.buffer)
                                    }catch(err){
                                        var uncompressed = zlib.inflateRawSync(this.buffer)
                                    }
                                    return uncompressed
                                }
                                if(cm === "gzip"){
                                    var uncompressed = zlib.unzipSync(this.buffer)
                                    return uncompressed
                                }
                            }
                            resolve(response)
                        })
                    }).end()
                }
            })
        },
        post:function(path,data,flag){
            var URL = path
            if(typeof flag === "boolean" && flag){
                URL = encodeURI(path)
            }
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

module.exports = ajax