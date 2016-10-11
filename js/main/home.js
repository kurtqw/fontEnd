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
        $("#chooseName").modal("show");
        $("#begin_chat").on("click",function(){
            var temp="#name option:selected";
            var name=$(temp).val();
            if(name=="请选择"){
                $("#name").css("width","300px");
                $("#name_miss").show().text('请选择昵称!');
                return;
            }
            $("#chooseName").modal("hide");
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
            $(this).attr("src","../res/male.jpg");
        }).on("mouseout",function(){
            $(this).attr("src","../res/card.png");
        }).on("click",function(){
            $(this).attr("src","../res/male.jpg");
            $(this).unbind("mouseout").unbind("mouseover").unbind("click");
            $("#female").unbind("mouseout").unbind("mouseover").unbind("click").attr("src","../res/card.png");
            sex=0;
            listenFemale();
            showRoleImg("../res/male.jpg");

        });
    }

    function listenFemale(){
        $("#female").on("mouseover",function(){
            $(this).attr("src","../res/female.jpg");
        }).on("mouseout",function(){
            $(this).attr("src","../res/card.png");
        }).on("click",function(){
            $(this).attr("src","../res/female.jpg");
            $(this).unbind("mouseout").unbind("mouseover").unbind("click");
            $("#male").unbind("mouseout").unbind("mouseover").unbind("click").attr("src","../res/card.png");
            sex=1;
            listenMale();
            showRoleImg("../res/female.jpg")
        });
    }

    function showRoleImg(img){
        $("#role_miss").css("display","none");
        $("#roleDiv").show();
        $("#roleImg").attr("src",img);
    }

    function initName(sex){
        var a={13: "风清扬", 20: "王  诚", 21: "王二叔", 23: "王家骏", 32: "平一指", 34: "史镖头", 43: "成不忧", 52: "定  逸"};
        for(var i in a){
            console.log(a[i]);
        }
        $.ajax({
            url:"http://119.29.161.184:8000/name?sex="+sex,
            type:'GET',
            dataType:'JSON',
            success: function(res){
                var nameTemp=res.data;
                for(var i in nameTemp){
                    $("#name").append('<option value="'+i+'">'+nameTemp[i]+'</option>')
                }
            }
        });

    }
});