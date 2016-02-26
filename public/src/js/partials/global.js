
///////////////////////////////////
	// Global
///////////////////////////////////

////////////////////////////////////////////////
// IF MOBILE
function isMobile() {
	if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/IEMobile/i)){
		return true; } else { return false; }
}
function iphone() {
	if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){
		return true; } else { return false; }
}
var isTouchDevice = "ontouchstart" in document.documentElement;

////////////////////////////////////////////////
// GET VENDOR PREFIXES
var browser, webkit, touch;

var prefix = (function () {
	var styles = window.getComputedStyle(document.documentElement, ""),
		pre = (Array.prototype.slice
			.call(styles)
			.join("")
			.match(/-(moz|webkit|ms)-/) || (styles.OLink === "" && ["", "o"])
		)[1],
		dom = ("WebKit|Moz|MS|O").match(new RegExp("(" + pre + ")", "i"))[1];
	return {
		dom: dom,
		lowercase: pre,
		css: "-" + pre + "-",
		js: pre[0].toUpperCase() + pre.substr(1)
	};
})();
browser = prefix.lowercase;

if (isTouchDevice) {
	touch = true;
}else{
	touch = false;
}
if (navigator.userAgent.indexOf("Safari") !== -1){
	if (navigator.userAgent.indexOf("Chrome") === -1){
		webkit = "safari";
	} else {
		webkit = "chrome";
	}
}
$("html").addClass(browser);
if (browser === "webkit") {
	$("html").addClass(webkit);
}
$("html").addClass("touch" + touch);

////////////////////////////////////////////////
// JS SPECIFIC LAYOUT ADJ
function forwidth(){
	var winH = ".winH{ min-height:" + $(window).height() + "px;}";
	var winHalf = ".winHalf{ top:" + ($(window).height()/2) + "px;}";
	var winH90 = ".winH90{ height:" + ($(window).height()*0.9) + "px;}";
	// var stickey = ".stuck{left:"+ $(".sticky").offset().left +"px;}"

	//var styling = "<style> .progressBar{margin-top:-"+ $(".progressBar").height()/2 +"px;} .winH{ height:"+ $(window).height() +"px;}</style>"
	var styling = "<style>" + winH + winHalf + winH90 + "</style>";
	$(".jsdump").html(styling);
}
forwidth();


///////////////////////////////////
// Hash Scrolling 

// Nav Padding
var navPadding = 0;
if ($(".navbar").length > 0) {
	navPadding = $(".navbar").height();
}
var scrollSpeed = 300;

// Page opens with a hash
function hashScroll(){	    	
	if (window.location.hash !== "") {
		$("html, body").animate({
			scrollTop: ( $(window.location.hash).offset().top - navPadding )
		}, scrollSpeed);
	}
}

// link is clicked with a hash
$("a[href*=#]:not([href=#])").click(function() {
    if (location.pathname.replace(/^\//,"") === this.pathname.replace(/^\//,"") && location.hostname === this.hostname) {
	    var target = $(this.hash);
	    target = target.length ? target : $("[name=" + this.hash.slice(1) +"]");
	    if (target.length) {
	        $("html, body").animate({
	        	scrollTop: (target.offset().top - navPadding )
	        }, scrollSpeed);
	        return false;
	    }
    }
});


///////////////////////////////////
// Activate tabs
if ($(".tabs").length > 0) {
	(".tabs").tab();

	$(function(){
	  	var hash = window.location.hash;
	  	$("ul.nav a[href='" + hash + "']").tab("show");

	  	$(".nav-tabs a").click(function (e) {
			$(this).tab("show");
			var scrollmem = $("body").scrollTop();
			window.location.hash = this.hash;
			$("html, body").scrollTop(scrollmem);
	  	});
	});
}

$(window).load(function() {				    	

///////////////////////////////////
	// Adjust quotes
	smartquotes();
	setTimeout(function () { smartquotes(); }, 500);

///////////////////////////////////
	// Hash Scroll
	hashScroll();

});
