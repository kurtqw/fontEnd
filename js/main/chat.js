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
});
