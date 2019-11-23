function dom(str,whole){
    var plainreg = /^<([^<>]+)>([^<>]+)<\/([^<>]+)>$/g
    var simplereg = /^<([^<>]+)>$/g
    Object.defineProperty(this,"__domstr",{
        value:str,
        configurable:true
    })
    Object.defineProperty(this,"catch",{
        value:whole,
        configurable:true
    })
    if(plainreg.test(str)){
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
                var els = el.trim().replace(/[""'']/g,"").split("=")
                var key = els[0]
                var val = els[1] ? els[1].replace(/[""'']/g,"").split(/\s+/g) : []
                val = val.length === 1 ? val[0] : val
                this[key] = val
            })
        })
    }
    if(simplereg.test(str)){
        this.type = "single dom"
        str.replace(simplereg,(match,key1)=>{
            key1 = key1.replace(/\/$/g,"").trim()
            var tag = key1.split(/\s+/g)[0]
            this.tagName = tag
            var opens = key1.replace(tag,"").trim().split(/["''"]\s+/g)
            if(opens.toString() === ""){
                return this
            }
            opens.forEach(el=>{
                var els = el.trim().replace(/[""'']/g,"").split("=")
                var key = els[0]
                var val = els[1] ? els[1].replace(/[""'']/g,"").split(/\s+/g) : []
                val = val.length === 1 ? val[0] : val
                this[key] = val
            })
        })
    }
}

dom.prototype.hasClass = function(name){
    if(Array.isArray(this.class)){
        // 说明class是一个数组
        var classes = this.class
        if(Array.isArray(name)){
            // 如果传入的类名参数是一个数组
            for(let i=0,len=name.length;i<len;i++){
                if(!classes.contains(name[i])){
                    return false
                }
            }
            return true
        }
        return classes.contains(name)
    }else{
        if(Array.isArray(name)){
            return this.class === name[0]
        }else{
            return this.class === name
        }
    }
    return false
}

dom.prototype.addClass = function(name){
    if(!this.hasClass(name)){
        if(Array.isArray(this.class)){
            if(Array.isArray(name)){
                this.class.concat(name)
            }else{
                this.class.push(name)
            }
        }else{
            if(Array.isArray(name)){
                this.class = [this.class].concat(name)
            }else{
                this.class = [this.class,name]
            }
        }
    }
    return this
}

dom.prototype.removeClass = function(name){
    if(this.hasClass(name)){
        if(Array.isArray(this.class)){
            if(Array.isArray(name)){
                for(let i=0,len=name.length;i<len;i++){
                    var index = this.class.findIndex(val=>val === name[i])
                    this.class.splice(index,1)
                }
            }else{
                var index = this.class.findIndex(val=>val === name)
                this.class.splice(index,1)
            }
        }else{
            this.class = ""
        }
    }
    return this
}

dom.prototype.next = function(){
    var nextdom = null
    var nextplain = new RegExp(this.__domstr +"(\n\\s+)*<([^<>]+)>([^<>]+)<\/([^<>]+)>")
    var nextsimple = new RegExp(this.__domstr +"(\n\\s+)*<([^<>]+)\/>")
    this.catch.replace(nextplain,(match)=>{
        nextdom = match.replace(this.__domstr,"").trim()
    })
    this.catch.replace(nextsimple,(match)=>{
        nextdom = match.replace(this.__domstr,"").trim()
    })
    return (nextdom && new this.constructor(nextdom))
}

dom.prototype.prev = function(){
    var prevdom = null
    var prevplain = new RegExp("<([^<>]+)>([^<>]+)<\/([^<>]+)>(\n\\s+)*"+this.__domstr,"g")
    var prevsimple = new RegExp("<([^<>]+)\/>(\n\\s+)*"+this.__domstr,"g")
    this.catch.replace(prevplain,(match)=>{
        prevdom = match.replace(this.__domstr,"").trim()
    })
    this.catch.replace(prevsimple,(match)=>{
        prevdom = match.replace(this.__domstr,"").trim()
    })
    return (prevdom && new this.constructor(prevdom))
}

module.exports = dom