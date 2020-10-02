var input_height = $("#input_height");
var input_weight = $("#input_weight");
var check_user_input_preg=/^\d+(\.\d+)?$/;
var bmi_table=[18.5,24,27,30,35];
var input_data=localStorage.getItem("input_data")?JSON.parse(localStorage.getItem("input_data")):[];
var check_input_status=true;
var input_data_length=input_data.length;
$('.submit_button_innertext').hide();
$('.span_text').hide();
$('.submit_button_icon').hide();
$(".div_submit_button").mouseover(function(){
    $(".submit_button").css('box-shadow','0 1px 6px 3px rgba(255,195,49,0.64)');
});
$(".div_submit_button").mouseleave(function(){
    $(".submit_button").css('box-shadow','');
});

function li_format(object_data,index) {
    var str="";
    str+="<li><span id='span_style"+index+"'></span>";
    str+="<span class='span_big_text'>"+object_data.span_name+"</span>";
    str+="<span class="+object_data.span_space+"></span>"
    str+="<div class='median_content_inner_text'>";
    str+="<div><span class='span_small_text'>BMI</span><span class='span_big_text'> "+object_data.bmi+"</span></div>";
    str+="<div><span class='span_small_text'>weight</span><span class='span_big_text'> "+object_data.weight+"kg</span></div>";
    str+="<div><span class='span_small_text'>height</span><span class='span_big_text'> "+object_data.height+"cm</span></div>";
    str+="<div><span class='span_small_text'>"+object_data.date+"</span></div>";
    str+="</div></li>";
    $('#content-box').append(str);
    var span_style=$("#span_style"+index);
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
}

$(".div_submit_button").click(clickbutton);
function check_input(height,weight){
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
    var bmi_level=false;
    for(var i=0;i<bmi_table.length;i++){
        if(bmi_number<bmi_table[i]){
            bmi_level=i;
            return bmi_level_set(bmi_level);
        }
    }
    if(!bmi_level){
        bmi_level=bmi_table.length;
        return bmi_level_set(bmi_level);
    }
}

function bmi_level_set(bmi_level) {
    switch(bmi_level){
        case 0:
            return ["過輕","two_words","#31BAF9"];
        case 1:
            return ["理想","two_words","#86D73F"];
        case 2:
            return ["過重","two_words","#FF982D"];
        case 3:
            return ["輕度肥胖","four_words","#FF6C02"];
        case 4:
            return ["中度肥胖","four_words","#FF6C02"];
        default:
            return ["重度肥胖","four_words","#FF1200"];
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
    $('.submit_button').css('border',"");
    $('.submit_button').css('color',"#424242");
    $('.submit_button').css('background','#FFD366');
    $('.submit_button_innertext').hide(850);
    $('.span_text').hide(850);
    $('.submit_button_icon').hide(1050);
}

function button_show(bmi,color,span_text){
    $('.submit_button').val(bmi);
    $('.submit_button').css('border',"6px solid "+color);
    $('.submit_button').css('color',color);
    $('.submit_button').css('background','#424242');
    $('.submit_button_innertext').show(850);
    $('.span_text').show(850);
    $('.submit_button_icon').show(1050);
    $('.submit_button_innertext').css('color',color);
    $('.span_text').text(span_text);
    $('.span_text').css('color',color);
    $('.submit_button_icon').css('background-color',color);
}

function init(){
    if(input_data.length>0){
        print_input_data();
    }
    else{
        var str="<li class=nodata>目前尚無資料</li>";
        $("#content-box").append(str);
    }
}
init();