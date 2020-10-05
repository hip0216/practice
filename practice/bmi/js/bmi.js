var input_height = $("#input_height");
var input_weight = $("#input_weight");
var input_data=localStorage.getItem("input_data")?JSON.parse(localStorage.getItem("input_data")):[];
var check_input_status=true;
var input_data_length=input_data.length;
var buttonAnimatePlay=true;
function li_format(object_data,index) {
    let str="";
    str+="<li id=li"+index+"><span id='span_style"+index+"'></span>";
    str+="<span class='span_big_text'>"+object_data.span_name+"</span>";
    str+="<div><span class='span_small_text'>BMI</span><span class='span_big_text'> "+object_data.bmi+"</span></div>";
    str+="<div><span class='span_small_text'>weight</span><span class='span_big_text'> "+object_data.weight+"kg</span></div>";
    str+="<div><span class='span_small_text'>height</span><span class='span_big_text'> "+object_data.height+"cm</span></div>";
    str+="<div><span class='span_small_text'>"+object_data.date+"</span></div>";
    str+="<input type='button' value='清除' id="+index+" class='delete_button'></li>";
    $('#content-box').append(str);
    let span_style=$("#span_style"+index);
    spanStyle(span_style,object_data.color);
}

function no_data(){
    $("#content-box").html("");
    $("#content-box").append("<li class=nodata>目前尚無資料</li>");
}

function print_input_data(){
    if(input_data_length>0){
        $('#content-box').html("");
        for(var i=0;i<input_data.length;i++){
            li_format(input_data[i],i);
        }
    }
    else{
        no_data();
    }
}

function spanStyle(span_style,color) {
    span_style.css("background-color",color);
    span_style.css("width","7px");
    span_style.css("height","100%");
    $('#content-box>li>div:last-of-type').css('margin-right','50px');
}

function check_input(height,weight){
    let check_user_input_preg=/^[1-9]{1}\d{0,2}(\.\d{0,2}[1-9]{1})?$/;
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
        $('#error').show(850);
        $('#error').hide(850);
    }
}
function check_bmi(bmi_number) {
    switch(true){
        case bmi_number < 18.5:
            return ["過輕","#31BAF9"];
        case bmi_number >= 18.5 && bmi_number < 24:
            return ["理想","#86D73F"];
        case bmi_number >= 24 && bmi_number < 27:
            return ["過重","#FF982D"];
        case bmi_number >= 27 && bmi_number < 30:
            return ["輕度肥胖","#FF6C02"];
        case bmi_number >= 30 && bmi_number < 35:
            return ["中度肥胖","#FF6C02"];
        case bmi_number >= 35:
            return ["重度肥胖","#FF1200"];
        default:
            return 'ERROR';
    } 
}


function get_today(){
    let today=new Date();
    let month=(today.getMonth()+1)>=10?(today.getMonth()+1):"0"+(today.getMonth()+1);
    let date=today.getDate()>=10?today.getDate():"0"+today.getDate();
　  return date+"-"+month+"-"+today.getFullYear();
}

function clickButton() {
    if(buttonAnimatePlay){
        let check=false;
        let height_cm = input_height.val();
        let weight_kg = input_weight.val();
        check=check_input(height_cm,weight_kg);
        if(check){
            if(input_data_length==0){
                $("#content-box").html("");
            }
            let height_m = parseFloat(height_cm)/100;
            let bmi=(parseFloat(weight_kg)/(height_m*height_m)).toFixed(2);
            let span = check_bmi(bmi);
            let object_data={"span_name":span[0],"color":span[1],"weight":weight_kg,"height":height_cm,"bmi":bmi,"date":get_today()};
            input_data.push(object_data);
            localStorage.setItem("input_data",JSON.stringify(input_data));
            button_show(bmi,span[1],span[0]);
            li_format(object_data,input_data_length);
            input_data_length++;
            setTimeout(button_hide,1500);
        }
        else{
            buttonAnimatePlay=false;
            $('#error').show(850);
            $('#error').hide(850)
            setTimeout(function(){
                buttonAnimatePlay=true;
            },1000)
        }
    }
}

function button_hide() {
    $('.submit_button').val("看結果");
    $('.submit_button_innertext').hide(850);
    $('.span_text').hide(850);
    $('.submit_button_icon').hide(850);
    $(".submit_button").css({
        'border':"",
        'color':"#424242",
        'background':'#FFD366',
    });
    setTimeout(function(){
        buttonAnimatePlay=true;
    },1000);
}

function button_show(bmi,color,span_text){
    buttonAnimatePlay=false;
    $('.submit_button').val(bmi);
    $(".submit_button").css({
        'border':"6px solid rgba(255,195,49,0.64)",
        'color':color,
    });
    $('.submit_button_innertext').css({
        'color':color,
    });
    $('.span_text').css({
        color:color
    });
    $('.submit_button_icon').css({
        'background-color':color
    });
    $('.submit_button_innertext').show(850);
    $('.span_text').show(850);
    $('.submit_button_icon').show(850);
    $('.span_text').text(span_text);
    input_height.val("");
    input_weight.val("");
}

function init(){
    $('.submit_button_innertext').hide();
    $('.span_text').hide();
    $('.submit_button_icon').hide();
    $('#error').hide();
    print_input_data();
}

init();
$(".div_submit_button").click(clickButton);
$('#content-box').click(function(event){
    if(event.target.localName=="input"){
        input_data.splice(event.target.id,1);
        localStorage.setItem("input_data",JSON.stringify(input_data));
        input_data_length--;
        print_input_data();
        if(input_data_length==0){
            no_data();
        }
    }
});
$(".div_submit_button").mouseover(function(){
    $(".submit_button").css('box-shadow','0 1px 6px 3px rgba(255,195,49,0.64)');
});
$(".div_submit_button").mouseleave(function(){
    $(".submit_button").css('box-shadow','');
});