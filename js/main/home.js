$(document).ready(function(){
    var sex;
    listenMale();
    listenFemale();
    $("#enterChat").on("click",function(){
       if($("#roleImg").attr("src")=='') {
           $("#role_miss").show().text("请先选择角色！");
           return;
       }
       initName(sex);
        $("#roleCard").css("opacity","0");
        $("#chooseName").modal("show").on('hidden.bs.modal', function () {
            $("#roleCard").css("opacity","1");
        });
        $("#begin_chat").on("click",function(){
            var temp="#name option:selected";
            var name=$(temp).val();
            if(name=="-1"){
                $("#name").css("width","40%");
                $("#name_miss").show().text('请选择昵称!');
                return;
            }
            $("#chooseName").modal("hide");
            var rand=parseInt(Math.random()*10000000);
            var url="http://119.29.161.184:8000?rand="+rand+"&sex="+sex+"&nameIndex="+name;
            $.ajax({
                url:url,
                type:"get",
                dataType: 'json',
                success: function (data) {
                    window.location.href="chat.html?"+data.id;
                }
            });

            $("#matching").modal("show");
            setInterval(function(){
                var class_temp=".progress-bar";
                var current=$(class_temp).attr("aria-valuenow")+10;
                $(class_temp).attr("aria-valuenow",current).css("width",current+"%");
            },500);
        });
    });


    function listenMale(){
        $("#male").on("mouseover",function(){
            $(this).attr("src","../res/home/male.jpg");
        }).on("mouseout",function(){
            $(this).attr("src","../res/home/card.jpg");
        }).on("click",function(){
            $(this).attr("src","../res/home/male.jpg");
            $(this).unbind("mouseout").unbind("mouseover").unbind("click");
            $("#female").unbind("mouseout").unbind("mouseover").unbind("click").attr("src","../res/home/card.jpg");
            sex=0;
            listenFemale();
            showRoleImg("../res/home/maleCircle.jpg");

        });
    }

    function listenFemale(){
        $("#female").on("mouseover",function(){
            $(this).attr("src","../res/home/female.jpg");
        }).on("mouseout",function(){
            $(this).attr("src","../res/home/card.jpg");
        }).on("click",function(){
            $(this).attr("src","../res/home/female.jpg");
            $(this).unbind("mouseout").unbind("mouseover").unbind("click");
            $("#male").unbind("mouseout").unbind("mouseover").unbind("click").attr("src","../res/home/card.jpg");
            sex=1;
            listenMale();
            showRoleImg("../res/home/femaleCircle.jpg")
        });
    }

    function showRoleImg(img){
        $("#role_miss").css("display","none");
        $("#roleDiv").show();
        $("#roleImg").attr("src",img);
    }

    function initName(sex){

        $.ajax({
            url:"http://119.29.161.184:8000/name?sex="+sex,
            type:'GET',
            dataType:'JSON',
            success: function(res){
                var nameTemp=res.data;
                $.each(nameTemp,function(key,value){
                    $("#name").append('<option value="'+key+'">'+value+'</option>');
                });
            }
        });

    }
});