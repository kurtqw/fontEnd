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
        $("#chat_content").append('<p class="receiveMsg">'+received_msg+'</p>').scrollTop($(chat_temp)[0].scrollHeight);
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
        $("#chat_content").append('<p class="myMsg">'+$(temp_id).val()+'</p>').scrollTop($(this)[0].scrollHeight);
        $("#chat_input").val("");
    }


});
