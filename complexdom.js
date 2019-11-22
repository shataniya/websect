const dom = require("./dom")

// 解析复合dom，复合dom就是含有子元素的父元素就是复合dom
function complexdom(str){
    var plainreg = /^<([^<>]+)>([\w\W]+?)<\/([^<>]+)>$/g
    Object.defineProperty(this,"__domstr",{
        value:str,
        configurable:true
    })
    this.type = "plain dom"
    str.replace(plainreg,(match,key1,key2,key3)=>{
        this.innerHTML = key2
        var opentag = key1.trim().split(/\s+/g)[0]
        var closetag = key3.trim()
        if(opentag === closetag){
            this.tagName = opentag
        }else{
            throw new Error(str+" is not a legal dom!")
        }
        var opens = key1.trim().replace(opentag,"").trim().split(/["''"]\s+/g)
        if(opens.toString() === ""){
            return this
        }
        opens.forEach(el=>{
            var els = el.trim().split('="')
            var key = els[0]
            var val = els[1] ? els[1].replace(/[""'']/g,"").split(/\s+/g) : []
            val = val.length === 1 ? val[0] : val
            this[key] = val
        })
    })
}

complexdom.prototype = Object.create(dom.prototype)
complexdom.prototype.constructor = complexdom

module.exports = complexdom