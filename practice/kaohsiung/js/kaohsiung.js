var data;
var mapdata = {};
var now_page;
var content_length;
var title='all';

function getdata() {
    $.ajax({
        url: 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', dataType: 'json', async: false, success: function (e) {
            data = e.result.records;
        }
    });
}

function setData(data) {
    mapdata['all']=[];
    for (var i = 0; i < data.length; i++) {
        mapdata['all'].push({ Name: data[i].Name, "Picture": data[i].Picture1, Opentime: data[i].Opentime, Add: data[i].Add, Tel: data[i].Tel, Ticketinfo: data[i].Ticketinfo ,Zone:data[i].Zone});
        if (mapdata[data[i].Zone]) {
            mapdata[data[i].Zone].push({ Name: data[i].Name, "Picture": data[i].Picture1, Opentime: data[i].Opentime, Add: data[i].Add, Tel: data[i].Tel, Ticketinfo: data[i].Ticketinfo });
        }
        else {
            mapdata[data[i].Zone] = [];
            mapdata[data[i].Zone].push({ Name: data[i].Name, "Picture": data[i].Picture1, Opentime: data[i].Opentime, Add: data[i].Add, Tel: data[i].Tel, Ticketinfo: data[i].Ticketinfo });
        }
    }
}
function sortData(){
    let dataLengthArray=[];
    let innerObject={};
    for(key in mapdata){
        innerObject['name']=key;
        innerObject['length']=mapdata[key].length
        dataLengthArray.push(innerObject);
        innerObject={};
    }
    dataLengthArray=dataLengthArray.sort(function(i,j){
        return i.length>j.length?-1:1;
    });
    return dataLengthArray;
}
function setContent(select) {
    if(title!=select || select=="all"){
        title=select;
        if(title=='all'){
            $('.title').text("所有資料");
        }
        else{
            $('.title').text(title);
        }
        content_length = mapdata[title].length;
        now_page = 1;
        pageSet();
        blockContent();
        setPageColor();
    }
}
function setPageColor(){
    $('.page_ul>li').css('color', '#4A4A4A')
    if (now_page == 1) {
        $('.page_ul>li:nth-child(1)').css('color', 'rgba(73,73,73,0.50)');
    }
    if (now_page == $('.page_ul>li:nth-last-child(2)').text().trim()) {
        $('.page_ul>li:nth-last-child(1)').css('color', 'rgba(73,73,73,0.50)');
    }
    $('.page_ul>li:nth-child('+(now_page+1)+')').css('color', 'rgba(73,73,73,0.50)');
}
function blockContent() {
    let str = "";
    let length;
    if (now_page == parseInt($('.page_ul>li:nth-last-child(2)').text().trim())) {
        length = content_length;
    }
    else {
        length = now_page * 8;
    }
    $(".content_block").html(str);
    for (let i = (now_page - 1) * 8; i < length; i++) {
        str += "<div class='block'>";
        str += "<div id=" + i + " class='place_img'>";
        str += "<div class='place_text'>";
        str += "<span class='place_name'>" + mapdata[title][i]['Name'] + "</span>";
        if(title=='all'){
            str += "<span class='area_name'>" + mapdata[title][i]['Zone'] + "</span>";
        }
        else{
            str += "<span class='area_name'>" + $('.title').text() + "</span>";
        }
        str += "</div>";
        str += "</div>";
        str += "<div class='block_content'>";
        str += "<div class='block_left_content'>";
        str += "<img src='img/icons_clock.png'>";
        str += "<img src='img/icons_pin.png'>";
        str += "<img src='img/icons_phone.png'>";
        str += "</div>";
        str += "<div class='block_left_content'>";
        str += "<span>" + mapdata[title][i]['Opentime'] + "</span>";
        str += "<span>" + mapdata[title][i]['Add'] + "</span>";
        str += "<span>" + mapdata[title][i]['Tel'] + "</span>";
        str += "</div>";
        str += "<div class='block_right_content'>";
        str += "<img src='img/icons_tag.png'>";
        str += "<span>" + mapdata[title][i]['Ticketinfo'] + "</span>";
        str += "</div>";
        str += "</div>";
        str += "</div>";
        $(".content_block").append(str);
        $("#" + i).css("background-image", "url(" + mapdata[title][i]['Picture'] + ")");
        str = "";
    }
}
function setSelectArea() {
    let str = "";
    for (key in mapdata) {
        if(key!='all'){
            str += "<option value=" + key + ">" + key + "</option>";
        }
    }
    $('.nvm_select').append(str);
}

function pageSet() {
    var total_page = Math.ceil(content_length / 8);
    var str = "<li>< prev</li>";
    for (var i = 1; i <= total_page; i++) {
        str += "<li> " + i + " </li>";
    }
    str += "<li>next ></li>";
    $(".page_ul").html(str);
}
function setNvmArea(){
    let dataLengthArray=sortData();
    let str="";
    let colorArray=['purple','orange','yellow','blue'];
    for(let index=0;index<5;index++) {
        if(index<5 && index>0){
            str+="<span class="+colorArray[index-1]+">"+dataLengthArray[index].name+"</span>";
        }
    }
    $(".nvm_area").html(str);
}
function changePage(e) {
    var select_page = e.target.textContent.trim();
    switch (select_page) {
        case now_page:
            break;
        case "< prev":
            if (now_page != 1) {
                now_page--;
                blockContent();
            }
            break;
        case "next >":
            if (now_page != $('.page_ul>li:nth-last-child(2)').text().trim()) {
                now_page++;
                blockContent();
            }
            break;
        default:
            now_page = parseInt(select_page);
            blockContent();
            break;
    }
    setPageColor();
}
function init() {
    getdata();
    setData(data);
    setSelectArea();
    setNvmArea();
    setContent('all');
}
init();
if(data){
    $('.nvm_select').change(function () {
        let select=$('.nvm_select').val();
        setContent(select);
    }
    );
    $('.dotted_line div').click(function () {
        $('.content_box').slideToggle('slow');
    }
    );
    $(".nvm_area").click(function (e) {
        let select=e.target.textContent;
        setContent(select);
    })
    $('.page_ul').click(function (e) {
        changePage(e);
    })
}