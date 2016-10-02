* 前端主要框架使用bootstrap,所有的控件如果可以都直接从库里面调用，避免自己重复写，引入bootstrap的css和js文件的方法参考home.html
<a href="http://v3.bootcss.com">bootstrap官网</a>

* 导航栏和页脚
  * 导航栏使用<nav></nav>这个在文档有介绍，最好在home.html的导航栏上作改进
 
* 热点推送
  * 先自己写一个json 文件，模拟一组数据，json数据按照以下格式
  ```
  {status:success,
  res:[{url:"",title:"",id:"",visit_cnt:""},{url:"",title:"",id:"",visit_cnt:""}...]}
  ```
  * 从后端获得数据使用ajax ,方法是get
   ```
   $.ajax({ url:"", //json文件的地址
      type:'get',    
   dataType:'JSON',    
   success: function(data){        
      }});
   ```
  * 根据点击量visit_cnt从上到下显示

* 聊天框
  * 点击发送或者是按回车，发送内容动态append到上面的显示框中，显示聊天气泡，气泡框的样式如果bootstrap中没有，可以到网上去找一个好看一点的。
  
