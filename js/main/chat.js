$(document).ready(function(){
    //初始化背景图片
    $("#wrapper").css("background-image","url('../res/chat/chatbg.jpg')").css("height",window.screen.height);
    //得到热点新闻
    $.ajax({
        url:"http://119.29.161.184:8000/news?page=1",
        type:'GET',
        dataType:'JSON',
        success: function(res){
            for(var i=0;i<res.data.length;i++){
                $(".hot-topic-item").append('<li class="list-group-item"><a target="_blank" href="'+res.data[i].url+'">'+res.data[i].title+'</a></li>')
            }
        }
    });

    //加载表情插件
    $("#chat_input").emojiarea({button: '#emotion'});

    //开始聊天
    var userId=location.search.split("=")[1];//用户的ID
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
    };

    messageSocket.onmessage = function (evt)
    {
        var received_temp=$.parseJSON(evt.data);
        var received_msg = received_temp.res.content;
        var chat_temp="#chat_content";
        $(chat_temp).append('<p class="receiveMsg"><textarea class="emojis-receive">'+received_msg+'</textarea></p>');
        var $wysiwyg = $('.emojis-receive:last-child').emojiarea();
        $wysiwyg.trigger('change');

        $(chat_temp).scrollTop($(chat_temp)[0].scrollHeight);
    };

    messageSocket.onclose = function()
    {
        console.log("关闭连接...")
    };
    function sendMessage(){
        var temp_id="#chat_input";
        var msg = {
            type: "message",
            text: $(temp_id).val(),
            id:   userId
        };
        messageSocket.send(JSON.stringify(msg));//以json数据发送消息
        var chat_temp="#chat_content";
        $(chat_temp).append('<p class="myMsg"><textarea class="emojis-wysiwyg">'+$(temp_id).val()+'</textarea></p>');

        //得到最后一个刚发送的表情转换
        var $wysiwyg = $('.emojis-wysiwyg:last-child').emojiarea();
        $wysiwyg.trigger('change');

        $(chat_temp).scrollTop($("#chat_content")[0].scrollHeight);
        $("#chat_input").val("");
        $(".area_clear .emoji-wysiwyg-editor").empty();
    }

});
