// Scroll animation
// $(window).on("scroll",function(e){
//     let x = $(window).scrollTop();
//     console.log(x);
// });
let title,description,all_tags = "",thumbnail;
$(window).on("load", function () {
    $(".svg-vid-container").removeClass("d-none");
    setTimeout(function () {
        $(".svg-vid").addClass("active-rotate");
        $(".svg-vid-container").css("transform", "translate(0px,0px)");
        setTimeout(function () {
            $(".title").css("opacity", "1");
        }, 800);
    }, 100);
});

// set the video svg in the center of the screen
let res = ($("section").width() - $(".svg-vid").width()) / 2;
$(".svg-vid-container").css("transform", "translate(" + res + "px,0px)");

// url input when change add active to button get vid
$("#url-youtube").on("input", function () {
    let string = $(this).val();
    let regexPattern =
        /https?:\/\/(?:youtu\.be\/|(?:www\.)?youtube\.com\/watch\?v=)([^&]+)/gi;
    if (!regexPattern.test(string)) {
        $(".get-vid").removeClass("active");
        $(this).css("border", "1px solid var(--third-color)");
        $(".note-url").css("color", "var(--third-color)");
    } else {
        $(".get-vid").addClass("active");
        $(this).css("border", "1px solid var(--forth-color)");
        $(".note-url").css("color", "lime");
    }
});

// Delete place holder when click and return it back when blur
let old;
$("#url-youtube")
    .on("click", function () {
        old = $(this).attr("placeholder");
        $(this).attr("placeholder", "");
    })
    .blur(function () {
        $(this).attr("placeholder", old);
    });

// function truncate the text
function truncate(str) {
    return str.length > 401 ? str.substr(0, 400) + " &hellip;" : str;
}

// test on truncate
// let truncatedText = truncate($(".card-body").html());
// $(".card-body").html(truncatedText);


//ajax get content

$(".get-vid").on("click",function(){
    let url = $("#url-youtube").val();
    let csrf = $("#csrf").val();
    let route = $("#route-data").val();
    if ($(this).hasClass("active")){
        $(this).removeClass("active");
        $.ajax(route,{
            dataType : 'json',
            method : 'POST',
            data : {
                _token : csrf,
                url : url,
            },
            success : function(data){
                let error  = "error" in data;
                if (error) {$(".result").html('<div class="card"><div class="card-header ">' + 'Error' + '</div><div class="card-body">' + "حدث خطأ غير معروف" +  '</div><div class="note-api">تأكد من رابط الفيديو</div></div>'); return false;}
                else {
                    let html = '';
                    title =  data["title"];
                    description = data["description"];
                    thumbnail = data["thumbnail"];

                    html += '<div class="card"><div class="card-header ">' + 'title' + '</div><div class="card-body">' + data["title"] +  '</div><div class="copy-btn" data="title">نسخ كامل</div></div>';
                    html += '<div class="card"><div class="card-header ">' + 'thumbnail' + '</div><div class="card-body"><img src="' + data["thumbnail"] +  '" width="100%"></div><div class="note-api">اضغط مطولا على الصوره للحفظ</div></div>';
                    html += '<div class="card"><div class="card-header ">' + 'description' + '</div><div class="card-body">' + data["description"] +  '</div><div class="copy-btn" data="description">نسخ كامل</div></div>';
    
                    if (data["tags"] != "not found"){
                        let tags = '';
                        for (let i = 0; i < data["tags"].length;i++ ){
                            tags += '<span>' + data["tags"][i] + '</span>';
                            all_tags += data["tags"][i] + ",";
                        }
                        html += '<div class="card"><div class="card-header ">' + 'tags' + '</div><div class="card-body">' + tags +  '</div><div class="copy-btn" data="all_tags">نسخ كامل</div></div>';
                    }
                    html += '<div class="card"><div class="card-header ">' + 'statistics' + '</div><div class="card-body">' + "<span>View count : " + data["statics"]["viewCount"] + "</span>" + "<span>Likes count : " + data["statics"]["likeCount"] + "</span>" + "<span>Dislike count : " + data["statics"]["dislikeCount"] + "</span>" + "<span>Comments count : " + data["statics"]["commentCount"] + "</span>" + '</div><div class="note-api">احصائيات الفيديو</div></div>';
                    $(".result").html(html);
                }
            },
            error: function(){
                $(".result").html('<div class="card"><div class="card-header ">' + 'Error' + '</div><div class="card-body">' + "حدث خطأ غير معروف" +  '</div><div class="note-api">تأكد من وجود الانترنت</div></div>');
            },
            complete : function(){
                $(".get-vid").addClass("active");
            }
        });
    }
});
$(document).on("click",".copy-btn",function(){
    let data = $(this).attr("data");
    copy(eval(data));
    $(this).text("تم النسخ");
    setTimeout(function(){
        $(".copy-btn").text("نسخ كامل");
    },1500);
    
});
function copy(text){
    $("body").append("<input id='copy-text' value='" + text + "'>");
    $("#copy-text").trigger("select");
    document.execCommand("copy");
    $("#copy-text").remove();
}
//<div class="card"><div class="card-header ">الوصف</div><div class="card-body text-right dir-rtl"></div><div class="copy-btn ">نسخ كامل</div></div>