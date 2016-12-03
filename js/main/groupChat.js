$(document).ready(function(){
    var channel={'sport':'体育','music':'音乐','library':'泡馆','sing':'唱K','game':'游戏','movie':'电影'};
    var topic=location.search.split("=")[1];

    //初始化背景图片
    $("#wrapper").css("background-image","url('../res/chat/chatbg.jpg')").css("height",window.screen.height);
    //得到热点新闻
    $.ajax({
        url:"http://119.29.161.184:8000/topic?type="+topic,
        type:'GET',
        dataType:'JSON',
        success: function(res){
            for(var i=0;i<res.data.length;i++) {
                $(".hot-topic-item").append('<li class="list-group-item news_list"><a target="_blank" href="' + res.data[i].url + '">' + res.data[i].title + '</a></li>')
            }
        }
    });

    var rand=parseInt(Math.random()*10000000);
    var init=0;//还没用初始化用户信息

    //初始化频道信息
    for(var key in channel){
        if(key==topic)
            $("#channel_topic").html(channel[key]+'频道');
    }

    //加载表情插件
    $("#chat_input").emojiarea({button: '#emotion'});

    //开始聊天
    var messageSocket = new WebSocket("ws://119.29.161.184:8000/groupchat?topic="+topic+"&rand="+rand);//引号里面写url
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

    var myName;
    var yourName;
    var userId;

    messageSocket.onmessage = function (evt)
    {
        var received_temp=$.parseJSON(evt.data);
        if(init==0){//这时候接收的就是用户本身的id和name
            myName=received_temp.name;
            userId=received_temp.id;
            init=1;
        }
        else{
            var received_msg = received_temp.res.content;
            var received_time = received_temp.res.time.split(" ")[1];
            yourName=received_temp.res.sender;
            var chat_temp="#chat_content";
            $(chat_temp).append('<p class="yourName">'+yourName+" "+received_time+'</p><p class="receiveMsg"><textarea class="emojis-receive">'+received_msg+'</textarea></p>');
            var $wysiwyg = $('.emojis-receive:last-child').emojiarea();
            $wysiwyg.trigger('change');
            $(chat_temp).scrollTop($(chat_temp)[0].scrollHeight);
        }
    };

    messageSocket.onclose = function()
    {
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
