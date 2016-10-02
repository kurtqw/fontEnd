$(document).ready(function(){
    $(".choice").attr("id","choose_role");//初始化默认选择角色
    $("#choose_role").on("click",function(){
        $("#chooseGender").modal("show");
    });
    listenMale();
    listenFemale();
    certainRole();


    function listenMale(){
        $("#male").on("mouseover",function(){
            $(this).attr("src","../res/male.jpg");
        }).on("mouseout",function(){
            $(this).attr("src","../res/card.png");
        }).on("click",function(){
            $(this).attr("src","../res/male.jpg");
            $(this).unbind("mouseout").unbind("mouseover").unbind("click");
            $("#female").unbind("mouseout").unbind("mouseover").unbind("click").attr("src","../res/card.png");
            listenFemale();
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
            listenMale();
        });
    }

    function certainRole(){

        $("#certain_role").on("click",function(){
            var role;
            var malePhoto=$("#male").attr("src");
            var femalePhoto=$("#female").attr("src");
            if(malePhoto=="../res/card.png"&&femalePhoto=="../res/card.png"){
                $("#role_miss").show().text('请选择角色!');
                return;
            }
            var id_temp="#chooseGender";
            if(malePhoto=="../res/card.png"){
                role="female";
                $(id_temp).modal("hide");
            }
            else{
                role="male";
                $(id_temp).modal("hide");
            }
            $("#role_photo").append('<img src="../res/'+role+'.jpg" class="img-circle">');
            $("#choose_role").unbind("click").attr("id","choose_name").html('<span class="glyphicon glyphicon-cloud"></span>选择昵称');
            $("#choose_name").on("click",function(){
                $("#chooseName").modal("show");
            });
            $("#begin_chat").on("click",function(){
                var temp="#name option:selected";
                var name=$(temp).val();
                if(name=="请选择"){
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

        })

    }

});