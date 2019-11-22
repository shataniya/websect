const dom = require("./dom")
const complexdom = require("./complexdom")

if(!Array.prototype.contains){
    Array.prototype.contains = function(name){
        return this.findIndex(el=>el === name) !== -1
    }
}

// 在考虑要不要使用Jquery的形式

// 换一个角度，不需要全部解析，只需要解析符合条件的部分
function domparse(str){
    if(str instanceof dom){
        str = str.innerHTML
    }
    return new domparse.fn.init(str)
}

domparse.fn = domparse.prototype

domparse.prototype.init = function(str){
    Object.defineProperty(this,"__domstr",{
        value:str,
        configurable:true
    })
}

domparse.prototype.init.prototype = domparse.prototype

domparse.prototype.getOneElementByClassName = function(name){
    var reg = new RegExp('<[^<>]+(class="[^<>]*\\b'+name+'\\b[^<>]*")(>([^<>]+)<\/([^<>]+)>|\/>|>)',"g")
    var startreg = new RegExp('class="\\b'+name+'\\b[^<>=\\-]',"g")
    var endreg = new RegExp('class="[^<>=]+[^<>=\\-]\\b'+name+'\\b"\s*',"g")
    var centerreg = new RegExp('class="[^<>=]+[^<>=\\-]\\b'+name+'\\b[^<>=\\-][^<>=]+"',"g")
    var arrs = null
    var hasOne = false
    this.__domstr.replace(reg,match=>{
        if(hasOne){
            return
        }
        if(startreg.test(match)){
            arrs = new dom(match,this.__domstr)
            hasOne = true
        }
        if(endreg.test(match)){
            arrs = new dom(match,this.__domstr)
            hasOne = true
        }
        if(centerreg.test(match)){
            arrs = new dom(match,this.__domstr)
            hasOne = true
        }
    })
    return arrs
}


// 根据 标签名 来获取标签的dom解析形式
domparse.prototype.getElementsByTagName = function(name){
    if(isSingleElement(name)){
        return this.getSingleElementsByTagName(name)
    }
    return this.getDoubleElementsByTagName(name)
}

// 根据 标签名 来获取标签的dom解析形式
domparse.prototype.getOneElementByTagName = function(name){
    if(isSingleElement(name)){
        return this.getOneSingleElementByTagName(name)
    }
    return this.getOneDoubleElementByTagName(name)
}

function isSingleElement(name){
    return name === "img" || name === "input" || name === "meta" || name === "link"
}

// 根据 标签名 来获取单标签的dom解析形式
domparse.prototype.getSingleElementsByTagName = function(name){
    var reg = new RegExp("<\\b"+name+"\\b([^<>]*)>","g")
    var arrs = []
    this.__domstr.replace(reg,(match)=>{
        arrs.push(new dom(match,this.__domstr))
    })
    this.__arrs = arrs
    return this
}

// 根据 标签名 来获取单标签的dom解析形式
domparse.prototype.getOneSingleElementByTagName = function(name){
    var reg = new RegExp("<\\b"+name+"\\b([^<>]*)>")
    var arrs = null
    this.__domstr.replace(reg,(match)=>{
        arrs = new dom(match,this.__domstr)
    })
    this.__arrs = arrs
    return this
}

// 根据 标签名 来获取双标签的dom解析形式
domparse.prototype.getDoubleElementsByTagName = function(name){
    var reg = new RegExp("<\\b"+name+"\\b([^<>]*)>([^<>]+)<\/([^<>]+)>","g")
    var arrs = []
    this.__domstr.replace(reg,(match)=>{
        arrs.push(new dom(match,this.__domstr))
    })
    this.__arrs = arrs
    return this
}

// 获取 this.__arrs 属性
domparse.prototype.dom = function(){
    return this.__arrs
}

// 获取元素属性值
domparse.prototype.attr = function(name){
    if(Array.isArray(this.__arrs) && this.__arrs.length >= 1){
        // 如果 this.__arrs 是一个数组，那么只返回第一个元素的属性值
        return this.__arrs[0][name]
    }
    if(this.__arrs == null){
        // 如果 this.__arrs 不存在，那么返回 null
        return null
    }
    // 不满足以上情况，说明不是一个数组，但是存在，因此只能是单独的一个元素
    return this.__arrs[name]
}

// 获取元素内部的文本
domparse.prototype.text = function(){
    if(Array.isArray(this.__arrs) && this.__arrs.length >= 1){
        return this.__arrs[0].innerHTML
    }
    if(this.__arrs == null){
        return null
    }
    return this.__arrs.innerHTML
}

// 遍历 this.__arrs 
domparse.prototype.each = function(fn){
    if(Array.isArray(this.__arrs)){
        for(let i=0,len=this.__arrs.length;i<len;i++){
            fn(this.__arrs[i])
        }
        return this
    }
    if(this.__arrs == null){
        throw new Error(this.__arrs+" is not a Array!")
    }
    // 不满足以上情况，说明只有一个单独的元素
    fn(this.__arrs)
    return this
}

// 根据 标签名 来获取双标签的dom解析形式
domparse.prototype.getOneDoubleElementByTagName = function(name){
    var reg = new RegExp("<\\b"+name+"\\b([^<>]*)>([^<>]+)<\/([^<>]+)>")
    var arrs = null
    this.__domstr.replace(reg,(match)=>{
        arrs = new dom(match,this.__domstr)
    })
    this.__arrs = arrs
    return this
}

domparse.prototype.getDoubleComplexElementsByTagName = function(name){
    var reg = new RegExp("<\\b"+name+"\\b([^<>]*)>([\\w\\W]+?)<\/\\b"+name+"\\b>")
    this.__domstr.replace(reg,(match)=>{
        console.log(match)
    })
}
// 根据 标签名 来获取双标签的字符串形式
domparse.prototype.getDoubleStringArrayByTagName = function(name){
    var reg = new RegExp('<'+name+'([^<>]*)>([\\w\\W]+?)<\/'+name+'>',"g")
    var arrs = []
    this.__domstr.replace(reg,(match)=>{
        arrs.push(match)
    })
    this.__arrs = arrs
    return this
}

/* 
* @discription 处理class
* @function getElementsByClassName
* @function getStringArrayByClassName
*/

// 通过 类名 获取标签的字符串形式
domparse.prototype.getStringArrayByClassName = function(){
    var name = Array.from(arguments)
    var reg = new RegExp('<([^<>]+)class="([^<>]*)\\b'+name.join(" ")+'\\b([^<>]*)"([^<>]*)(>([\\w\\W]+?)<\/([^<>]+)>|\/?>)',"g")
    var open = new RegExp('<([^<>]+)class="([^<>]*)\\b'+name.join(" ")+'\\b([^<>]*)"([^<>]*)\/?>',"g")
    var doms = []
    this.__domstr.replace(reg,(match)=>{
        match.replace(open,(el)=>{
            var tag = new dom(el,this.__domstr).tagName
            if(isSingleElement(tag)){
                doms.push(el)
            }else{
                var dreg = new RegExp(el+'([\\w\\W]+?)<\/'+tag+'>')
                this.__domstr.replace(dreg,(dch)=>{
                    doms.push(dch)
                })
            }
        })
    })
    this.__arrs = doms
    return this
}

// 通过 类名 获取标签的dom解析形式
domparse.prototype.getElementsByClassName = function(){
    var name = Array.from(arguments)
    var reg = new RegExp('<([^<>]+)class="([^<>]*)\\b'+name.join(" ")+'\\b([^<>]*)"([^<>]*)(>([\\w\\W]+?)<\/([^<>]+)>|\/?>)',"g")
    var open = new RegExp('<([^<>]+)class="([^<>]*)\\b'+name.join(" ")+'\\b([^<>]*)"([^<>]*)\/?>',"g")
    var doms = []
    this.__domstr.replace(reg,(match)=>{
        match.replace(open,(el)=>{
            var tag = new dom(el).tagName
            if(isSingleElement(tag)){
                doms.push(new dom(el,this.__domstr))
            }else{
                var dreg = new RegExp(el+'([\\w\\W]+?)<\/'+tag+'>')
                this.__domstr.replace(dreg,(dch)=>{
                    doms.push(new complexdom(dch,this.__domstr))
                })
            }
        })
    })
    this.__arrs = doms
    return this
}

// 根据 标签名 和 类名 来获取双标签的字符串形式
domparse.prototype.getDoubleStringArrayByTagNameAndClassName = function(name,...classname){
    var doms = this.getDoubleStringArrayByTagName(name).dom()
    var reg = new RegExp('<\\b'+name+'\\b([^<>]*)class="([^<>]*)\\b'+classname.join(" ")+'\\b([^<>]*)"([^<>]*)>([\\w\\W]+?)<\/\\b'+name+'\\b>')
    var ndoms = []
    doms.forEach(el=>{
        el.replace(reg,(match)=>{
            if(new complexdom(match).hasClass(classname)){
                ndoms.push(match)
            }
        })
    })
    this.__arrs = ndoms
    return this
}

// 根据 标签名 和 类名 来获取双标签的dom解析形式
domparse.prototype.getDoubleElementsByTagNameAndClassName = function(name,...classname){
    this.__arrs = this.getDoubleStringArrayByTagNameAndClassName(name,...classname).dom().map(el=>new complexdom(el,this.__domstr))
    return this
}

// 根据 标签名 来获取单标签的字符串形式
domparse.prototype.getSingleStringArrayByTagName = function(name){
    var reg = new RegExp('<'+name+'([^<>]+?)\/?>',"g")
    var arrs = []
    this.__domstr.replace(reg,(match)=>{
        arrs.push(match)
    })
    this.__arrs = arrs
    return this
}

// 根据 标签名 和 类名 来获取单标签的字符串形式，例如 img meta link input之类
domparse.prototype.getSingleStringArrayByTagNameAndClassName = function(name,...classname){
    var doms = this.getSingleStringArrayByTagName(name).dom()
    this.__arrs = doms.filter(el=>new dom(el).hasClass(classname))
    return this
}

// 根据 标签名 和 类名 来获取单标签的dom解析形式
domparse.prototype.getSingleElementsByTagNameAndClassName = function(name,...classname){
    this.__arrs = this.getSingleStringArrayByTagNameAndClassName(name,...classname).dom().map(el=>new dom(el))
    return this
}

/* 
* @discription 处理id
* @function getElementById
* @param{string} id
* @function getStringById
* @param{string} id
*/

// 根据 id 来获取对于标签的dom解析形式
domparse.prototype.getElementById = function(id){
    var doms = this.getDoubleStringById(id).dom()
    if(doms){
        this.__arrs = new dom(doms,this.__domstr)
        return this
    }
    doms = this.getSingleElementById(id).dom()
    if(isSingleElement(doms.tagName)){
        // return this
        this.__arrs = doms
        return this
    }
    var tag = doms.tagName
    doms = this.getDoubleComplexStringByTagNameAndId(tag,id).dom()
    if(doms){
        this.__arrs = new complexdom(doms,this.__domstr)
        return this
    }
    this.__arrs = null
    return this
}

// 根据 id 来获取对于标签的字符串形式
domparse.prototype.getStringById = function(id){
    var doms = this.getDoubleStringById(id).dom()
    if(doms){
        return this
    }
    doms = this.getSingleStringById(id).dom()
    var tag = new dom(doms,this.__domstr).tagName
    if(isSingleElement(tag)){
        return this
    }
    doms = this.getDoubleComplexStringByTagNameAndId(tag,id).dom()
    if(doms){
        return this
    }
    this.__arrs = null
    return this
}


// 根据 标签名 和 id 来获取简单双标签的字符串形式
domparse.prototype.getDoubleStringById = function(id){
    var reg = new RegExp('<([^<>]+)id="\\b'+id+'\\b"([^<>]*)>([^<>]+?)<\/([^<>]+)>')
    var arrs = null
    this.__domstr.replace(reg,(match)=>{
        arrs = match
    })
    this.__arrs = arrs
    return this
}

// 根据 标签名 和 id 来获取简单双标签的dom解析形式
domparse.prototype.getDoubleElementById = function(id){
    var doms = this.getDoubleStringById(id).dom()
    this.__arrs = new dom(doms,this.__domstr)
    return this
}

// 根据 标签名 和 id 来获取简单单标签的字符串形式
domparse.prototype.getSingleStringById = function(id){
    var reg = new RegExp('<([^<>]+)id="\\b'+id+'\\b"([^<>]*)\/?>')
    var arrs = null
    this.__domstr.replace(reg,(match)=>{
        arrs = match
    })
    this.__arrs = arrs
    return this
}

// 根据 标签名 和 id 来获取简单单标签的dom解析形式
domparse.prototype.getSingleElementById = function(id){
    var doms = this.getSingleStringById(id).dom()
    this.__arrs = new dom(doms,this.__domstr)
    return this
}

// 
domparse.prototype.getSingleStringByTagNameAndId = function(name,id){
    var reg = new RegExp('<\\b'+name+'\\b([^<>]*)id="\\b'+id+'\\b"([^<>]*)\/?>')
    var arrs = null
    this.__domstr.replace(reg,(match)=>{
        arrs = match
    })
    this.__arrs = arrs
    return this
}

// 根据 id 和 标签名来获取复合双标签的字符串形式
domparse.prototype.getDoubleComplexStringByTagNameAndId = function(name,id){
    var doms = this.getDoubleStringArrayByTagName(name).dom()
    var reg = new RegExp('<'+name+'([^<>]*)id="\\b'+id+'\\b"([^<>]*)>([\\w\\W]+?)<\/'+name+'>')
    var arrs = null
    doms.forEach(el=>{
        el.replace(reg,(match)=>{
            arrs = match
        })
    })
    this.__arrs = arrs
    return this
}

// 根据 id 和 标签名来获取复合双标签的dom解析形式
domparse.prototype.getDoubleComplexElementByTagNameAndId = function(name,id){
    var doms = this.getDoubleComplexStringByTagNameAndId(name,id).dom()
    this.__arrs = new complexdom(doms,this.__domstr)
    return this
}

// 根据 指定属性 来获取相应的元素的字符串形式
domparse.prototype.getDoubleStringArrayByTagNameAndAttrbute = function(name,key,val){
    var reg = new RegExp('<\\b'+name+'\\b([^<>]*)'+key+'="\\b'+val+'\\b"([^<>]*)>([\\w\\W]+?)<\/\\b'+name+'\\b>',"g")
    var arrs = []
    this.__domstr.replace(reg,(match)=>{
        arrs.push(match)
    })
    this.__arrs = arrs
    return this
}

// 根据 指定属性 来获取相应的元素的dom解析形式
domparse.prototype.getDoubleElementsByTagNameAndAttribute = function(name,key,val){
    var doms = this.getDoubleStringArrayByTagNameAndAttrbute(name,key,val).dom()
    this.__arrs = doms.map(el=>new complexdom(el,this.__domstr))
    return this
}

// 根据 指定属性 来获取单标签元素的字符串形式
domparse.prototype.getSingleStringArrayByTagNameAndAttribute = function(name,key,val){
    var reg = new RegExp('<\\b'+name+'\\b([^<>]*)'+key+'="\\b'+val+'\\b"([^<>]*)\/?>',"g")
    var arrs = []
    this.__domstr.replace(reg,(match)=>{
        arrs.push(match)
    })
    this.__arrs = arrs
    return this
}

// 根据 指定属性 来获取单标签元素的dom解析形式
domparse.prototype.getSingleElementsByTagNameAndAttribute = function(name,key,val){
    var doms = this.getSingleStringArrayByTagNameAndAttribute(name,key,val).dom()
    this.__arrs = doms.map(el=>new dom(el,this.__domstr))
    return this
}

// 优先使用 标签名 来进行检索会提高效率
domparse.prototype.find = function(){
    var name = Array.from(arguments)
    if(name.length > 1){
        // 说明是多个参数,那么第一个参数就是标签名，其他的参数默认就是类名
        var tag = name[0]
        if(isSingleElement(tag)){
            // 说明是单标签
            return this.getSingleElementsByTagNameAndClassName(...name)
        }else{
            // 说明是双标签
            return this.getDoubleElementsByTagNameAndClassName(...name)
        }
    }else if(name.length === 1){
        var ns = name[0]
        if(/^\./g.test(ns)){
            // 说明是以.开头，那么就是以 类名 进行检索
            var narrs = ns.replace(/^\./,"").split(".")
            return this.getElementsByClassName(...narrs)
        }
        if(/^#/g.test(ns)){
            // 说明是以#开头，那么就是以 id 进行检索
            var narrs = ns.replace(/^#/,"")
            return this.getElementById(narrs)
        }
        if(/\./.test(ns)){
            // 说明是含有类名，建议是 标签名 和 类名 进行检索，例如：li.link-item.slider-item
            var narrs = ns.split(".")
            var tag = narrs[0]
            if(isSingleElement(tag)){
                return this.getSingleElementsByTagNameAndClassName(...narrs)
            }else{
                return this.getDoubleElementsByTagNameAndClassName(...narrs)
            }
        }
        if(/#/.test(ns)){
            // 说明含有id，建议是 标签名 和 id 进行检索，例如：li#slider-header
            var narrs = ns.split("#")
            var tag = narrs[0]
            var id = narrs[1]
            if(isSingleElement(tag)){
                return this.getSingleElementById(id)
            }else{
                // 这里需要进行优化
                return this.getDoubleComplexElementByTagNameAndId(tag,id)
            }
        }
        if(/[\[\]]/.test(ns)){
            // 说明是要根据 指定属性 来获取元素，例如：li[rel=list-item]
            var narrs = ns.split(/[\[\]]/g)
            var tag = narrs[0]
            var params = narrs[1].split("=")
            var key = params[0]
            var val = params[1]
            if(isSingleElement(tag)){
                return this.getSingleElementsByTagNameAndAttribute(tag,key,val)
            }else{
                return this.getDoubleElementsByTagNameAndAttribute(tag,key,val)
            }
        }

        // 以上情况都不是的话，那就是以 标签名 来进行检索
        if(isSingleElement(ns)){
            return this.getSingleElementsByTagName(ns)
        }else{
            // 这里需要进行 优化处理
            var doms = this.getDoubleStringArrayByTagName(ns).dom()
            this.__arrs = doms.map(el=>new complexdom(el,this.__domstr))
            return this
        }
    }else{
        // 说明没有参数，这里要进行报错处理
        throw new Error("the arguments of find function is null!")
    }
}

domparse.prototype.querySelector = function(name){
    if(/^\./g.test(name)){
        name = name.replace(/\./g,"")
        return this.getOneElementByClassName(name)
    }
    if(/^#/g.test(name)){
        name = name.replace(/#/g,"")
        return this.getElementById(name)
    }
    return this.getOneElementByTagName(name)
}

domparse.prototype.querySelectorAll = function(name){
    if(/^\./g.test(name)){
        name = name.replace(/\./g,"")
        return this.getElementsByClassName(name)
    }
    if(/^#/g.test(name)){
        name = name.replace(/#/g,"")
        return this.getElementById(name)
    }
    return this.getElementsByTagName(name)
}




module.exports = domparse
