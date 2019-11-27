#### websect
##### 一个比 cheerio 还快的网页信息爬取工具
##### 下载方式：
>npm i websect
##### websect的原理
- websect 实际上就是一个处理 html字符串的方法，可以把 html字符串解析成dom形式，这里的dom并不是想浏览器里真正的dom，而是一个dom解析的js对象，举个例子：
```javascript
const $ = require("websect")
var s = `<p class="title" id="title">hello world</p>`
var p = $(s).find("p").dom()
console.log(p)
```
- 解析成dom的js对象：
```javascript
sataniyadeMBP:ajax sataniya$ node op
[
  complexdom {
    type: 'complex dom',
    innerHTML: 'hello world',
    tagName: 'p',
    class: 'title',
    id: 'title'
  }
]
sataniyadeMBP:ajax sataniya$ 
```
- 你可以看到，`<p class="title" id="title">hello world</p>`被解析成一个`complexdom类的实例`,里面有很多属性，像`innerHMTL`,`tagName`,`class`,`id`，这都是为了模拟真正的dom而特意设计成这样的
##### `find(selector)`
- `find(selector)`的参数实际上是一个选择器，类似于JQuery，**功能是找到选择器指定的dom并进行解析，并生成一个dom数组**，你可以调用`dom()`来获取解析之后的dom数组，举个例子：
```javascript
// 先定义一个模版字符串s
var s = `<div class="container">
            <h1>hello world</h1>
            <ul class="slider">
                <li class="slider-item">
                    <img class="slider-item-img" src="" data-src="http://op.com/demo1.png" alt="美女" title="美女" />
                    <p class="desc">这是一张美女图片</p>
                </li>
                <li class="slider-item">
                    <img class="slider-item-img" src="" data-src="http://op.com/demo2.png" alt="大海" title="大海" />
                    <p class="desc">这是一张大海图片</p>
                </li>
                <li class="slider-item">
                    <img class="slider-item-img" src="" data-src="http://op.com/demo3.png" alt="星空" title="星空" />
                    <p class="desc">这是一张星空图片</p>
                </li>
                <li class="slider-footer">
                    今天天气真好啊！
                    <h1 class="top">hello, is good day!</h1>
                    你是不是傻！
                    <p class="desc">you is nod good.</p>
                    哇，美女过来了23333
                </li>
            </ul>
        </div>`
```
- `引入 websect`

```javascript
const $ = require("websect")
```

- 现在使用`find()`函数来进行解析：
- 比如说我想要获取h1标题：
```javascript
var p = $(s).find("h1").dom() // 这里的dom() 函数就是获取所有的结果
console.log(p)
```

```javascript
sataniyadeMBP:ajax sataniya$ node op
[
  complexdom {
    type: 'complex dom',
    innerHTML: 'hello world',
    tagName: 'h1',
    class: 'title'
  }
]
```
- 如果想要获取所有类名为 `slider-item` 的li：

```javascript
var p = $(s).find("li.slider-item").dom()
console.log(p)
```
```javascript
sataniyadeMBP:ajax sataniya$ node op
[
  complexdom {
    type: 'complex dom',
    innerHTML: '\n' +
      '                    <img class="slider-item-img" src="" data-src="http://op.com/demo1.png" alt="美女" 
title="美女" />\n' +
      '                    <p class="desc">这是一张美女图片</p>\n' +
      '                ',
    tagName: 'li',
    class: 'slider-item'
  },
  complexdom {
    type: 'complex dom',
    innerHTML: '\n' +
      '                    <img class="slider-item-img" src="" data-src="http://op.com/demo2.png" alt="大海" title="大海" />\n' +
      '                    <p class="desc">这是一张大海图片</p>\n' +
      '                ',
    tagName: 'li',
    class: 'slider-item'
  },
  complexdom {
    type: 'complex dom',
    innerHTML: '\n' +
      '                    <img class="slider-item-img" src="" data-src="http://op.com/demo3.png" alt="星空" title="星空" />\n' +
      '                    <p class="desc">这是一张星空图片</p>\n' +
      '                ',
    tagName: 'li',
    class: 'slider-item'
  }
]
sataniyadeMBP:ajax sataniya$ 
```
- 如果想要获取所有的img：
```javascript
var p = $(s).find("img").dom()
console.log(p)
```

```javascript
sataniyadeMBP:ajax sataniya$ node op
[
  dom {
    type: 'single dom',
    tagName: 'img',
    class: 'slider-item-img',
    src: [],
    'data-src': 'http://op.com/demo1.png',
    alt: '美女',
    title: '美女'
  },
  dom {
    type: 'single dom',
    tagName: 'img',
    class: 'slider-item-img',
    src: [],
    'data-src': 'http://op.com/demo2.png',
    alt: '大海',
    title: '大海'
  },
  dom {
    type: 'single dom',
    tagName: 'img',
    class: 'slider-item-img',
    src: [],
    'data-src': 'http://op.com/demo3.png',
    alt: '星空',
    title: '星空'
  }
]
sataniyadeMBP:ajax sataniya$ 
```
- 如果你想获取所有对图片的描述，即标签p：

```javascript
var p = $(s).find("li.slider-item p").dom()
console.log(p)
```

```javascript
sataniyadeMBP:ajax sataniya$ node op
[
  complexdom {
    type: 'complex dom',
    innerHTML: '这是一张美女图片',
    tagName: 'p',
    class: 'desc'
  },
  complexdom {
    type: 'complex dom',
    innerHTML: '这是一张大海图片',
    tagName: 'p',
    class: 'desc'
  },
  complexdom {
    type: 'complex dom',
    innerHTML: '这是一张星空图片',
    tagName: 'p',
    class: 'desc'
  }
]
sataniyadeMBP:ajax sataniya$ 
```
##### `text()`
- `text()` 的功能是 获取`第一个符合条件的元素的内容`，举个例子：
```javascript
var p = $(s).find("p").text()
console.log(p)
```

```javascript
sataniyadeMBP:ajax sataniya$ node op
这是一张美女图片
sataniyadeMBP:ajax sataniya$ 
```
- 可以看见，只返回了一个p标签的内容，但是实际上有三个p标签，`之所以这么设计是因为大部分的需求只是一个`
##### `textall()`
- `textall()` 的功能是 `获取符合条件的所有元素的内容`，算是对 `text()`的补充：

```javascript
var p = $(s).find("li.slider-item p").textall()
console.log(p)
```

```javascript
sataniyadeMacBook-Pro:ajax sataniya$ node op
[ '这是一张美女图片', '这是一张大海图片', '这是一张星空图片' ]
sataniyadeMacBook-Pro:ajax sataniya$ 
```

##### `attr(name)`
- `attr(name)` 功能就是 获取`第一个符合条件的元素的指定的属性值`，举个例子：

```javascript
var p = $(s).find("img").attr("data-src")
console.log(p)
```

```javascript
sataniyadeMBP:ajax sataniya$ node op
http://op.com/demo1.png
sataniyadeMBP:ajax sataniya$ 
```
##### `attrall(name)`
- `attrall(name)` 功能就是 获取`符合条件的所有元素的指定属性值`

```javascript
var p = $(s).find("li.slider-item img").attrall("data-src")
console.log(p)
```

```javascript
sataniyadeMacBook-Pro:ajax sataniya$ node op
[
  'http://op.com/demo1.png',
  'http://op.com/demo2.png',
  'http://op.com/demo3.png'
]
sataniyadeMacBook-Pro:ajax sataniya$ 
```

##### `each()`
- `each()` 用于遍历解析之后的dom数组

```javascript
const $ = require("websect")
$(s).find("li.slider-item p").each(el=>{
    console.log(el)
})
```

```javascript
sataniyadeMBP:ajax sataniya$ node op
complexdom {
  type: 'complex dom',
  innerHTML: '这是一张美女图片',
  tagName: 'p',
  class: 'desc'
}
complexdom {
  type: 'complex dom',
  innerHTML: '这是一张大海图片',
  tagName: 'p',
  class: 'desc'
}
complexdom {
  type: 'complex dom',
  innerHTML: '这是一张星空图片',
  tagName: 'p',
  class: 'desc'
}
sataniyadeMBP:ajax sataniya$ 
```
##### `info()`
- `info()` 就是获取 `第一个符合条件的元素的的最外层文本节点（即 textNode）`

```javascript
var p = $(s).find("li.slider-footer").info()
console.log(p)
```

```javascript
sataniyadeMacBook-Pro:ajax sataniya$ node op
[ '今天天气真好啊！', '你是不是傻！', '哇，美女过来了23333' ]
sataniyadeMacBook-Pro:ajax sataniya$ 
```
- 对比一下 `li.slider-footer` 指定的元素：

```javascript
<li class="slider-footer">
    今天天气真好啊！
    <h1 class="top">hello, is good day!</h1>
    你是不是傻！
    <p class="desc">you is nod good.</p>
    哇，美女过来了23333
</li>
```
- 可以清楚的看到，`只有最外层的文本节点被获取`，这就是 `info()` 函数的使用，**但是如果我想获取所有的文本节点呢？**
##### `infoall()`
- `infoall()` 就是 获取 `第一个符合条件的元素内的所有文本节点`

```javascript
var p = $(s).find("li.slider-footer").infoall()
console.log(p)
```

```javascript
sataniyadeMacBook-Pro:ajax sataniya$ node op
[
  '今天天气真好啊！',
  'hello, is good day!',
  '你是不是傻！',
  'you is nod good.',
  '哇，美女过来了23333'
]
sataniyadeMacBook-Pro:ajax sataniya$ 
```
- 对比一下 `li.slider-footer` 指定的元素：

```javascript
<li class="slider-footer">
    今天天气真好啊！
    <h1 class="top">hello, is good day!</h1>
    你是不是傻！
    <p class="desc">you is nod good.</p>
    哇，美女过来了23333
</li>
```
- 确实是获取了所有的文本节点

