var input_height = $("#input_height");
var input_weight = $("#input_weight");
var input_data=localStorage.getItem("input_data")?JSON.parse(localStorage.getItem("input_data")):[];
var check_input_status=true;
var input_data_length=input_data.length;
var button_status=false;
function li_format(object_data,index) {
    let str="";
    str+="<li><span id='span_style"+index+"'></span>";
    str+="<span class='span_big_text'>"+object_data.span_name+"</span>";
    str+="<div><span class='span_small_text'>BMI</span><span class='span_big_text'> "+object_data.bmi+"</span></div>";
    str+="<div><span class='span_small_text'>weight</span><span class='span_big_text'> "+object_data.weight+"kg</span></div>";
    str+="<div><span class='span_small_text'>height</span><span class='span_big_text'> "+object_data.height+"cm</span></div>";
    str+="<div><span class='span_small_text'>"+object_data.date+"</span></div>";
    str+="<input type='button' value='清除' id=delete"+index+" class='delete_button'></li>";
    $('#content-box').append(str);
    $("#delete"+index).hide();
    let span_style=$("#span_style"+index);
    spanStyle(span_style,object_data.color);
}

function print_input_data(){
    for(var i=0;i<input_data.length;i++){
        li_format(input_data[i],i);
    }
}

function spanStyle(span_style,color) {
    span_style.css("background-color",color);
    span_style.css("width","7px");
    span_style.css("height","100%");
    $('#content-box>li>div:last-of-type').css('margin-right','50px');
}

function check_input(height,weight){
    let check_user_input_preg=/^\d+(\.\d+)?$/;
    if(height!=null && weight!=null){
        if(height.search(check_user_input_preg) || weight.search(check_user_input_preg)){
            input_height.val("");
            input_weight.val("");
        }
        else{
            return true;
        }
    }
    else{
        alert("請輸入資料");
    }
}

function check_bmi(bmi_number) {
    switch(true){
        case bmi_number < 18.5:
            return ["過輕","two_words","#31BAF9"];
        case bmi_number >= 18.5 && bmi_number < 24:
            return ["理想","two_words","#86D73F"];
        case bmi_number >= 24 && bmi_number < 27:
            return ["過重","two_words","#FF982D"];
        case bmi_number >= 27 && bmi_number < 30:
            return ["輕度肥胖","four_words","#FF6C02"];
        case bmi_number >= 30 && bmi_number < 35:
            return ["中度肥胖","four_words","#FF6C02"];
        case bmi_number >= 35:
            return ["重度肥胖","four_words","#FF1200"];
        default:
            return 'ERROR';
    } 
}


function get_today(){
    var today=new Date();
    var month=(today.getMonth()+1)>=10?(today.getMonth()+1):"0"+(today.getMonth()+1);
    var date=today.getDate()>=10?today.getDate():"0"+today.getDate();
　  return date+"-"+month+"-"+today.getFullYear();
}

function clickbutton() {
    if(check_input_status){
        var check=false;
        var height_cm = input_height.val();
        var weight_kg = input_weight.val();
        check=check_input(height_cm,weight_kg);
        if(check){
            var height_m = height_cm/100;
            var bmi=(weight_kg/(height_m*height_m)).toFixed(2);
            var span = check_bmi(bmi);
            var object_data={"span_name":span[0],"span_space":span[1],"color":span[2],"weight":weight_kg,"height":height_cm,"bmi":bmi,"date":get_today()};
            input_data.push(object_data);
            localStorage.setItem("input_data",JSON.stringify(input_data));
            button_show(bmi,span[2],span[0]);
            li_format(object_data,input_data_length);
            input_data_length++;
            setTimeout(button_hide,2500);
            check_input_status=false;
        }
        else{
            alert("輸入有誤,請檢查輸入");
        }
    }
    else{
        button_hide();
        check_input_status=true;
    }
}

function button_hide() {
    $('.submit_button').val("看結果");
    $('.submit_button_innertext').hide(850);
    $('.span_text').hide(850);
    $('.submit_button_icon').hide(850);
    $(".submit_button").animate({
        'border':"",
        'color':"#424242",
        'background':'#FFD366',
    });
}

function button_show(bmi,color,span_text){
    $('.submit_button').val(bmi);
    $('.submit_button_innertext').show(850);
    $('.span_text').show(850);
    $('.submit_button_icon').show(850);
    $('.span_text').text(span_text);
    $(".submit_button").animate({
        'border':"6px solid "+color,
        'color':color,
        'background':'#424242',
    });
    $('.submit_button_innertext').animate({
        'color':color,
        'background-color':color,
    });
    $('.span_text').animate({
        color:color,
    });
    input_height.val("");
    input_weight.val("");
}

function init(){
    $('.submit_button_innertext').hide();
    $('.span_text').hide();
    $('.submit_button_icon').hide();
    if(input_data.length>0){
        print_input_data();
    }
    else{
        var str="<li class=nodata>目前尚無資料</li>";
        $("#content-box").append(str);
    }
}

init();
$(".div_submit_button").click(clickbutton);
$('#content-box').click(function(event){
    delete data[event.target.id];
});
$(".set_button").click(function(){
    if(button_status==false){
        for(var i=0;i<input_data.length;i++){
            $('#delete'+i).show(850);
        }
        $('.median_content> div:nth-child(2)>ul>li').animate({
            width:'774px'
        },850)
        button_status=!button_status;
    }
    else{
        for(var i=0;i<input_data.length;i++){
            $('#delete'+i).hide(850);
        }
        $('.median_content> div:nth-child(2)>ul>li').animate({
            width:'624px'
        },850)
        button_status=!button_status;
    }
});
$()
$(".set_button").mouseover(function(){
    $(".set_button").css('box-shadow','0 1px 6px 3px rgba(255,195,49,0.64)');
});
$(".set_button").mouseleave(function(){
    $(".set_button").css('box-shadow','');
});
$(".div_submit_button").mouseover(function(){
    $(".submit_button").css('box-shadow','0 1px 6px 3px rgba(255,195,49,0.64)');
});
$(".div_submit_button").mouseleave(function(){
    $(".submit_button").css('box-shadow','');
});