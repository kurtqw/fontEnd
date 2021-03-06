$(document).ready(function(){
    //初始化背景图片
    $("#wrapper").css("background-image","url('../res/chat/chatbg.jpg')").css("height",window.screen.height);
    //得到热点新闻
    $.ajax({
        url:"http://119.29.161.184:8000/news?page=1",
        type:'GET',
        dataType:'JSON',
        success: function(res){
            //按点击量对新闻进行排序
            res.data.sort('visit_cnt');
            for(var i=0;i<res.data.length;i++){
                $(".hot-topic-item").append('<li class="list-group-item news_list" id="'+res.data[i].id+'"><a target="_blank" href="'+res.data[i].url+'">'+res.data[i].title+'</a></li>')
            }
            //记录新闻的点击量
            $(".news_list").on("click",function(){
                var post_cnt_temp={"news_id":parseInt($(this).attr('id')),"cnt":1};
                var post_cnt=JSON.stringify(post_cnt_temp);
                $.ajax({
                    url: "http://119.29.161.184:8000/news",
                    data:post_cnt,
                    type: 'POST',
                    dataType: 'JSON',
                    success: function () {
                    }
                });

            });
        }
    });


    //加载表情插件
    $("#chat_input").emojiarea({button: '#emotion'});

    var userId=location.search.split("=")[1];//用户的ID
    var myName;
    var yourName;

    //得到自己和对方的名字
    $.ajax({
        url:"http://119.29.161.184:8000/othername?id="+userId,
        type:'GET',
        dataType:'JSON',
        success: function(res){
            myName=res.mine;
            yourName=res.other;
        }
    });


    //开始聊天
    var messageSocket = new WebSocket("ws://119.29.161.184:8000/chat?id="+userId);//引号里面写url
    messageSocket.onopen = function () {
        $("#send").on("click",sendMessage);
        //捕获回车键
        $('html').on('keydown',function(e){
            if(e.keyCode==13){
                $('#send').click();
                e.preventDefault();
            }
        });
        $("#send_joke").on("click",sendjoke);
    };


    messageSocket.onmessage = function (evt)
    {
        var received_temp=$.parseJSON(evt.data);
        var received_msg = received_temp.res.content;
        var received_time = received_temp.res.time.split(" ")[1];

        var chat_temp="#chat_content";
        $(chat_temp).append('<p class="yourName">'+yourName+" "+received_time+'</p><p class="receiveMsg"><textarea class="emojis-receive">'+received_msg+'</textarea></p>');
        var $wysiwyg = $('.emojis-receive:last-child').emojiarea();
        $wysiwyg.trigger('change');

        $(chat_temp).scrollTop($(chat_temp)[0].scrollHeight);
    };

    messageSocket.onclose = function()
    {
        $("#chat_content").append('<p class="receiveMsg">对方已退出聊天...</p>');
        console.log("关闭连接...")
    };

    function sendMessage(){
        var temp_id="#chat_input";
        if($(temp_id).val()==""){
            alert('发送内容不能为空！');
            return;
        }
        var msg = {
            type: "message",
            text: $(temp_id).val(),
            id:   userId
        };
        messageSocket.send(JSON.stringify(msg));//以json数据发送消息
        var chat_temp="#chat_content";
        $(chat_temp).append('<p class="myName">'+myName+'</p><p class="myMsg"><textarea class="emojis-wysiwyg">'+$(temp_id).val()+'</textarea></p>');

        //得到最后一个刚发送的表情转换
        var $wysiwyg = $('.emojis-wysiwyg:last-child').emojiarea();
        $wysiwyg.trigger('change');

        $(chat_temp).scrollTop($("#chat_content")[0].scrollHeight);
        $("#chat_input").val("");
        $(".area_clear .emoji-wysiwyg-editor").empty();
    }

    function sendjoke(){
        //发送笑话
        $.ajax({
            url:"http://119.29.161.184:8000/joke",
            type:'GET',
            dataType:'JSON',
            success: function(res){
                var msg = {
                    type: "message",
                    text: res.data,
                    id:   userId
                };
                messageSocket.send(JSON.stringify(msg));//以json数据发送消息
                $("#chat_content").append('<p class="myName">'+myName+'</p><p class="myMsg">'+res.data+'</p>');
            }
        });

    }

});
