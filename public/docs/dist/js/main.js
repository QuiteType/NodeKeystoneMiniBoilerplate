
// GLOBAL
var root = location.protocol + "//" + location.host;
var tData = "";


////////////////////////////////////////////////
//IF MOBILE
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
//GET VENDOR PREFIXES
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
//JS SPECIFIC LAYOUT ADJ
function forwidth(){
	var navH = "#body{ margin-top:" + $(".navbar").height() + "px;}";
	var winH = ".winH{ min-height:" + $(window).height() + "px;}";
	var winHalf = ".winHalf{ top:" + ($(window).height()/2) + "px;}";
	var winH90 = ".winH90{ height:" + ($(window).height()*0.9) + "px;}";
	// var stickey = ".stuck{left:"+ $(".sticky").offset().left +"px;}"

	//var styling = "<style> .progressBar{margin-top:-"+ $(".progressBar").height()/2 +"px;} .winH{ height:"+ $(window).height() +"px;}</style>"
	var styling = "<style>" + navH + winH + winHalf + winH90 + "</style>";
	$(".jsdump").html(styling);
}
forwidth();

/////////////////////////////////// ?id="+encodeURIComponent(fontID)
//Grab fonts from database via the client
// var font;
// function getFont(){
// 	// $.get( root + "/getfont", function( data ) {
// 	//   	return font = data;
// 	// });
// 	$.ajax({
// 		type: "POST",
// 		data: JSON.stringify("{0{id:"1234567890"}}"),
// 		contentType: "application/json",
// 		url: root + "/endpoint",						
// 		success: function(data) {
// 			console.log("success");
// 			console.log(JSON.stringify(data));
// 		}
// 	});
// }
// getFont();

///////////////////////////////////
//Twitter Generator

// -TO DO
// Seems to be autocapitalizing words after a period. This causes problems in sentences with abbreviations. (found this in the js)
// Smart quoates http://smartquotesjs.com/

var date = new Date();
var day = date.getDate();
var monthIndex = date.getMonth();
var year = date.getFullYear();
var hours = date.getHours();
var ampm = hours >= 12 ? "pm" : "am";
var tries = 0;
function twitterInit(){
	tries++;

	// // FOR TESTING
	// $.getJSON( root + "/tmp/test.json", function( data ) {
	// 		console.log("Using test Twitter data");
	// 		tData = data;

	// 	}).fail(function() {
	// 		console.log("Error with test Twitter data");
	// 		return false;
	// 	});

	// FOR PRODUCTION
	if (tries >= 2) {
		$.getJSON( root + "/tmp/default.json", function( data ) {
			console.log("Using default Twitter data");
			tData = data;

		}).fail(function() {
			console.log("Error with default Twitter data");
			return false;
		});
	} else {
		$.getJSON( root + "/tmp/" + day + "-" + monthIndex + "-" + year + "-" + ampm + "-twitter.json", function( data ) {
			console.log("Found Twitter data");
			tData = data;

		}).fail(function() {
			console.log("Contacting Twitter");
			setTimeout(function () { twitterInit(); }, 500);
			return false;
		});		
	}	
}
twitterInit();

var twiText,
	lstLet;
function twitterFix(twi){
	twiText = twi.text.replace(/(?:https?|ftp):\/\/\S+/g, "").trim();

	//Add a space between sentences
	twiText = twiText.replace(/([\.!?])([a-z])/g, "$1 $2");

	//Capatilize after .“!?
	twiText = twiText.replace(/[\.“!?]\s+[a-z]/g, function(letter) {
		return letter.toUpperCase();
	});				

	//Convert ". to ."
	twiText = twiText.replace("\".", ".\"");

	//Convert '. to .''
	twiText = twiText.replace("'.", ".'");

	twiText = twiText.replace(" ?", "?");
	twiText = twiText.replace(" .", ".");
	twiText = twiText.replace(" !", ".");
	twiText = twiText.replace(" :", ":");
	twiText = twiText.replace(":'", ".'");
	twiText = twiText.replace(":\"", ".\"");
	twiText = twiText.replace(".).", ".)");
	twiText = twiText.replace("...", "…");

	//Spaces
	twiText = twiText.replace("\n", " ");
	
	//Emojis
	twiText = twiText.replace("&lt;3","");

	//Convert -- to emdash
	twiText = twiText.replace("--", "—");

	//Adding period
	lstLet = twiText.substring(twiText.length-1);
	if (lstLet !== "."  &&
		lstLet !== "?"  &&
		lstLet !== "”"  &&
		lstLet !== "’"  &&
		lstLet !== " "  &&
		lstLet !== "!"  &&
		lstLet !== "…"  &&
		lstLet !== ";"  &&
		lstLet !== "/"  &&
		lstLet !== ":"  &&
		lstLet !== "+"  &&
		lstLet !== "="  &&
		lstLet !== "_"  &&
		lstLet !== "-"  &&
		lstLet !== "|"  &&
		lstLet !== "'"  &&
		lstLet !== "\"" &&
		lstLet !== "~"  ){
		twiText = twiText + ".";
	}
	if ( lstLet === ":" ) {
		twiText = twiText.substring(0, twiText.length - 1) + ".";
	}
	return twiText;

	// $(".tweet_spec").append("<div class="col-sm-12">\
//           <h2 class="tweet">" + twiText + "</h2>\
//           <h6>\
//           	<a href="#" class="font_title">DEMOTEXT</a>\
//           	<a href="https://twitter.com/" + twi.user.screen_name + "/status/" + twi.id_str + ""  class="tweet_location">@" + twi.user.screen_name + "</a>\
//           	<a href="" + article[0] + ""  class="article_location">" + article[0].replace(/.*?:\/\//g, "") + "</a>\
//           </h6>\
//       </div>");
}

// function h2Resize(obj){
// 	var mh = 400;
// 	if ($(obj).find("h2").height() < mh) {
// 		$(obj).find("h2").css("font-size", ($(obj).find("h2").css("font-size").slice(0, - 2) + 1) + "px");
// 		console.log($(obj).find("h2").height());
// 		h2Resize(obj);
// 	}
// }

function wFix(obj){
	$(obj).widowFix({
		prevLimit: 5,
		linkFix: true
	});
}

function trimTwit(obj){
	$(obj).find("h2.tweet, h2.tweet > div").css("height", "auto");
}

function countWords(s){
    s = s.replace(/(^\s*)|(\s*$)/gi,"");
    s = s.replace(/[ ]{2,}/gi," ");
    s = s.replace(/\n /,"\n");
    return s.split(" ").length;
}

function h2Twit(data, obj){
	var twi = data[Math.floor((Math.random() * data.length))];
	var twiText = twitterFix(twi);
	var article = twi.text.match(/((?:https?|ftp):\/\/\S+)/);

	$(obj).find("h2").text(twiText);			    	
	$(obj).find(".tweet_location").attr( "href", "https://twitter.com/" + twi.user.screen_name + "/status/" + twi.id_str );
	$(obj).find(".tweet_location").text( "@" + twi.user.screen_name );
	$(obj).find(".article_location").attr( "href", article[0] );
	$(obj).find(".article_location").text( article[0].replace(/.*?:\/\//g, "") );


	tLength = twiText.length;

	if (countWords(twiText) === 1) {
		$(obj).find("h2")
			.addClass("oneWord")
			.bigtext();

	} else {
		if (tLength < 60) {    	
			$(obj).find("h2")
				.css("height", "400px")
				.addClass("under60");

		} else if (tLength >= 60 && tLength < 80) {    	
			$(obj).find("h2")
				.css("height", "350px")
				.addClass("under80");

		} else if (tLength >= 80 && tLength < 100) {    	
			$(obj).find("h2")
				.css("height", "300px")
				.addClass("under100");

		} else if (tLength >= 100 && tLength < 120) {    	
			$(obj).find("h2")
				.css("height", "200px")
				.addClass("under120");

		} else if (tLength >= 120) {    	
			$(obj).find("h2")
				.css("height", "100px")
				.addClass("under140");

		} 

		$(obj).find("h2").textTailor({
			minFont: 15,
			maxFont: 1000,
			fit: true,
			lineHeight: 1.1,
			resizable: false
		});
	}

	
	smartquotes();
	trimTwit(obj);
	setTimeout(function () { smartquotes(); wFix($(obj).find("h2"));}, 200);
	setTimeout(function () { smartquotes(); }, 450);

	$(obj).removeClass("fresh");



	// $(obj).find("h2").textTailor({
	// 	minFont: 15,
	// 	maxFont: 300,
	// 	lineHeight: 1.1,
	// 	resizable: false
	// });

}

function twitterize(obj){
	if (tData !== "") {
		h2Twit(tData, obj);
	} else {
		setTimeout(function () { twitterize(obj); }, 10);
	}
	// tries += 1;
	// if (tries >= 5) {
	// 	$.getJSON( root + "/tmp/default.json", function( data ) {
	// 		console.log("Using Default");
	// 		h2Twit(data, obj);

	// 	}).fail(function() {
	// 		console.log("Error");
	// 		return false;
	// 	});
	// } else {
	// 	$.getJSON( root + "/tmp/" + day + "-" + monthIndex + "-" + year + "-" + ampm + "-twitter.json", function( data ) {
	// 		console.log("FOUNDFILE");
	// 		h2Twit(data, obj);

	// 	}).fail(function() {
	// 		console.log("Contacting Twitter");
	// 		setTimeout(function () { twitterize(obj); }, 500);
	// 		return false;
	// 	});		
	// }
}


//Find Font Object
function getObjects(obj, key, val) {
	var objects = [];
	for (var i in obj) {
		if (!obj.hasOwnProperty(i)) continue;
		if (typeof obj[i] === "object") {
			objects = objects.concat(getObjects(obj[i], key, val));
		} else if (i === key && obj[key] === val) {
			objects.push(obj);
		}
	}
	return objects;
}

///////////////////////////////////////
// Helper Functions

//nav padding
var navPadding = $(".navbar").height();
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

$(document).ready(function() {

///////////////////////////////////
	//Activate tabs
	$(".tabs").tab();

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


		
	////////////////////////////////////////////////
	////////////////                 ///////////////
	////////////////    PARTIALS     ///////////////
	////////////////                 ///////////////
	////////////////////////////////////////////////


	///////////////////////////////////

		// 404 Page

	///////////////////////////////////

	

	///////////////////////////////////

		// Add Font to 404

		function add404Font(amount){

			var parameters = {

			  "number": amount

			};

			$.get( "/getFont", parameters, function(data) {		    				    	

				$.each(data, function (key, font) {

					var el = $(

						"<style>" +

							"@font-face {" +

								"font-family: " + font.typefaceName + ";" +

								"src: url(data:application/font-woff;charset=utf-8;base64," + font.base64Woff + ") format('woff');" +

								"font-weight: " + font.weight.toLowerCase() + ";" +

								"font-style: " + font.style.toLowerCase() + ";" +

							"}" +

						"</style>" +

						"<a href='/" + font.typefaceName.toLowerCase() + "' class='error404' fontFamily='" + font.typefaceName + "' fontStyle='" + font.style + "' fontWeight='" + font.weightName + "'>" +

							"<h2>ERROR</h2>" +

							"<h1 class='" + font.typefaceName.toLowerCase() + " " + font.weightName.toLowerCase() + " w" + font.weight + " " + font.style.toLowerCase() + "' style='font-family:" + font.typefaceName + ";'>- 404 -</h1>" +

							"<h2>ERROR</h2>" +

						"</div>");

					$(".block404").append(el);

				});

			});

		}

		if ($("[page='404']").length > 0) {

			add404Font(1);

		}

	

	
	///////////////////////////////////

		// Cart page

	///////////////////////////////////

	

	 init()

	function init() {

	    if (!store.enabled) {

	        console.log('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')

	        return

	    }

	    var cart = store.get('cart')

	

	}

	

	if ($("html").attr("page") === "cart") {

	

	

	}

	
	///////////////////////////////////

		// Cart Object

	///////////////////////////////////

	

	//----------------------------------------------------------------

	// shopping cart

	//

	function shoppingCart(cartName) {

	    this.cartName = cartName;

	    this.clearCart = false;

	    this.checkoutParameters = {};

	    this.items = [];

	

	    // load items from local storage when initializing

	    this.loadItems();

	

	    // save items to local storage when unloading

	    var self = this;

	    $(window).unload(function () {

	        if (self.clearCart) {

	            self.clearItems();

	        }

	        self.saveItems();

	        self.clearCart = false;

	    });

	}

	

	// load items from local storage

	shoppingCart.prototype.loadItems = function () {

	    var items = localStorage != null ? localStorage[this.cartName + "_items"] : null;

	    if (items != null && JSON != null) {

	        try {

	            var items = JSON.parse(items);

	            for (var i = 0; i < items.length; i++) {

	                var item = items[i];

	                if (item.sku != null && item.name != null && item.price != null && item.quantity != null) {

	                    item = new cartItem(item.sku, item.name, item.price, item.quantity);

	                    this.items.push(item);

	                }

	            }

	        }

	        catch (err) {

	            // ignore errors while loading...

	        }

	    }

	}

	

	// save items to local storage

	shoppingCart.prototype.saveItems = function () {

	    if (localStorage != null && JSON != null) {

	        localStorage[this.cartName + "_items"] = JSON.stringify(this.items);

	    }

	}

	

	// adds an item to the cart

	shoppingCart.prototype.addItem = function (sku, name, price, quantity) {

	    quantity = this.toNumber(quantity);

	    if (quantity != 0) {

	

	        // update quantity for existing item

	        var found = false;

	        for (var i = 0; i < this.items.length && !found; i++) {

	            var item = this.items[i];

	            if (item.sku == sku) {

	                found = true;

	                item.quantity = this.toNumber(item.quantity + quantity);

	                if (item.quantity <= 0) {

	                    this.items.splice(i, 1);

	                }

	            }

	        }

	

	        // new item, add now

	        if (!found) {

	            var item = new cartItem(sku, name, price, quantity);

	            this.items.push(item);

	        }

	

	        // save changes

	        this.saveItems();

	    }

	}

	

	// get the total price for all items currently in the cart

	shoppingCart.prototype.getTotalPrice = function (sku) {

	    var total = 0;

	    for (var i = 0; i < this.items.length; i++) {

	        var item = this.items[i];

	        if (sku == null || item.sku == sku) {

	            total += this.toNumber(item.quantity * item.price);

	        }

	    }

	    return total;

	}

	

	// get the total price for all items currently in the cart

	shoppingCart.prototype.getTotalCount = function (sku) {

	    var count = 0;

	    for (var i = 0; i < this.items.length; i++) {

	        var item = this.items[i];

	        if (sku == null || item.sku == sku) {

	            count += this.toNumber(item.quantity);

	        }

	    }

	    return count;

	}

	

	// clear the cart

	shoppingCart.prototype.clearItems = function () {

	    this.items = [];

	    this.saveItems();

	}

	

	// define checkout parameters

	shoppingCart.prototype.addCheckoutParameters = function (serviceName, merchantID, options) {

	

	    // check parameters

	    if (serviceName != "PayPal" && serviceName != "Google" && serviceName != "Stripe") {

	        throw "serviceName must be 'PayPal' or 'Google' or 'Stripe'.";

	    }

	    if (merchantID == null) {

	        throw "A merchantID is required in order to checkout.";

	    }

	

	    // save parameters

	    this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);

	}

	

	// check out

	shoppingCart.prototype.checkout = function (serviceName, clearCart) {

	

	    // select serviceName if we have to

	    if (serviceName == null) {

	        var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];

	        serviceName = p.serviceName;

	    }

	

	    // sanity

	    if (serviceName == null) {

	        throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";

	    }

	

	    // go to work

	    var parms = this.checkoutParameters[serviceName];

	    if (parms == null) {

	        throw "Cannot get checkout parameters for '" + serviceName + "'.";

	    }

	    switch (parms.serviceName) {

	        case "PayPal":

	            this.checkoutPayPal(parms, clearCart);

	            break;

	        case "Google":

	            this.checkoutGoogle(parms, clearCart);

	            break;

	        case "Stripe":

	            this.checkoutStripe(parms, clearCart);

	            break;

	        default:

	            throw "Unknown checkout service: " + parms.serviceName;

	    }

	}

	

	// check out using PayPal

	// for details see:

	// www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside

	shoppingCart.prototype.checkoutPayPal = function (parms, clearCart) {

	

	    // global data

	    var data = {

	        cmd: "_cart",

	        business: parms.merchantID,

	        upload: "1",

	        rm: "2",

	        charset: "utf-8"

	    };

	

	    // item data

	    for (var i = 0; i < this.items.length; i++) {

	        var item = this.items[i];

	        var ctr = i + 1;

	        data["item_number_" + ctr] = item.sku;

	        data["item_name_" + ctr] = item.name;

	        data["quantity_" + ctr] = item.quantity;

	        data["amount_" + ctr] = item.price.toFixed(2);

	    }

	

	    // build form

	    var form = $('<form/></form>');

	    form.attr("action", "https://www.paypal.com/cgi-bin/webscr");

	    form.attr("method", "POST");

	    form.attr("style", "display:none;");

	    this.addFormFields(form, data);

	    this.addFormFields(form, parms.options);

	    $("body").append(form);

	

	    // submit form

	    this.clearCart = clearCart == null || clearCart;

	    form.submit();

	    form.remove();

	}

	

	// check out using Google Wallet

	// for details see:

	// developers.google.com/checkout/developer/Google_Checkout_Custom_Cart_How_To_HTML

	// developers.google.com/checkout/developer/interactive_demo

	shoppingCart.prototype.checkoutGoogle = function (parms, clearCart) {

	

	    // global data

	    var data = {};

	

	    // item data

	    for (var i = 0; i < this.items.length; i++) {

	        var item = this.items[i];

	        var ctr = i + 1;

	        data["item_name_" + ctr] = item.sku;

	        data["item_description_" + ctr] = item.name;

	        data["item_price_" + ctr] = item.price.toFixed(2);

	        data["item_quantity_" + ctr] = item.quantity;

	        data["item_merchant_id_" + ctr] = parms.merchantID;

	    }

	

	    // build form

	    var form = $('<form/></form>');

	    // NOTE: in production projects, use the checkout.google url below;

	    // for debugging/testing, use the sandbox.google url instead.

	    //form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);

	    form.attr("action", "https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/" + parms.merchantID);

	    form.attr("method", "POST");

	    form.attr("style", "display:none;");

	    this.addFormFields(form, data);

	    this.addFormFields(form, parms.options);

	    $("body").append(form);

	

	    // submit form

	    this.clearCart = clearCart == null || clearCart;

	    form.submit();

	    form.remove();

	}

	

	// check out using Stripe

	// for details see:

	// https://stripe.com/docs/checkout

	shoppingCart.prototype.checkoutStripe = function (parms, clearCart) {

	

	    // global data

	    var data = {};

	

	    // item data

	    for (var i = 0; i < this.items.length; i++) {

	        var item = this.items[i];

	        var ctr = i + 1;

	        data["item_name_" + ctr] = item.sku;

	        data["item_description_" + ctr] = item.name;

	        data["item_price_" + ctr] = item.price.toFixed(2);

	        data["item_quantity_" + ctr] = item.quantity;

	    }

	

	    // build form

	    var form = $('.form-stripe');

	    form.empty();

	    // NOTE: in production projects, you have to handle the post with a few simple calls to the Stripe API.

	    // See https://stripe.com/docs/checkout

	    // You'll get a POST to the address below w/ a stripeToken.

	    // First, you have to initialize the Stripe API w/ your public/private keys.

	    // You then call Customer.create() w/ the stripeToken and your email address.

	    // Then you call Charge.create() w/ the customer ID from the previous call and your charge amount.

	    form.attr("action", parms.options['chargeurl']);

	    form.attr("method", "POST");

	    form.attr("style", "display:none;");

	    this.addFormFields(form, data);

	    this.addFormFields(form, parms.options);

	    $("body").append(form);

	

	    // ajaxify form

	    form.ajaxForm({

	        success: function () {

	            $.unblockUI();

	            alert('Thanks for your order!');

	        },

	        error: function (result) {

	            $.unblockUI();

	            alert('Error submitting order: ' + result.statusText);

	        }

	    });

	

	    var token = function (res) {

	        var $input = $('<input type=hidden name=stripeToken />').val(res.id);

	

	        // show processing message and block UI until form is submitted and returns

	        $.blockUI({ message: 'Processing order...' });

	

	        // submit form

	        form.append($input).submit();

	        this.clearCart = clearCart == null || clearCart;

	        form.submit();

	    };

	

	    StripeCheckout.open({

	        key: parms.merchantID,

	        address: false,

	        amount: this.getTotalPrice() *100, /** expects an integer **/

	        currency: 'usd',

	        name: 'Purchase',

	        description: 'Description',

	        panelLabel: 'Checkout',

	        token: token

	    });

	}

	

	// utility methods

	shoppingCart.prototype.addFormFields = function (form, data) {

	    if (data != null) {

	        $.each(data, function (name, value) {

	            if (value != null) {

	                var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);

	                form.append(input);

	            }

	        });

	    }

	}

	shoppingCart.prototype.toNumber = function (value) {

	    value = value * 1;

	    return isNaN(value) ? 0 : value;

	}

	

	//----------------------------------------------------------------

	// checkout parameters (one per supported payment service)

	//

	function checkoutParameters(serviceName, merchantID, options) {

	    this.serviceName = serviceName;

	    this.merchantID = merchantID;

	    this.options = options;

	}

	

	//----------------------------------------------------------------

	// items in the cart

	//

	function cartItem(sku, name, price, quantity) {

	    this.sku = sku;

	    this.name = name;

	    this.price = price * 1;

	    this.quantity = quantity * 1;

	}

	// //----------------------------------------------------------------

	// // shopping cart

	// //

	// function shoppingCart(cartName) {

	//     this.cartName = cartName;

	//     this.clearCart = false;

	//     this.checkoutParameters = {};

	//     this.items = [];

	

	//     // load items from local storage when initializing

	//     this.loadItems();

	

	//     // save items to local storage when unloading

	//     var self = this;

	//     $(window).unload(function () {

	//         if (self.clearCart) {

	//             self.clearItems();

	//         }

	//         self.saveItems();

	//         self.clearCart = false;

	//     });

	// }

	

	// // load items from local storage

	// shoppingCart.prototype.loadItems = function () {

	//     var items = localStorage != null ? localStorage[this.cartName + "_items"] : null;

	//     if (items != null && JSON != null) {

	//         try {

	//             var items = JSON.parse(items);

	//             for (var i = 0; i < items.length; i++) {

	//                 var item = items[i];

	//                 if (item.sku != null && item.name != null && item.price != null && item.quantity != null) {

	//                     item = new cartItem(item.sku, item.name, item.price, item.quantity);

	//                     this.items.push(item);

	//                 }

	//             }

	//         }

	//         catch (err) {

	//             // ignore errors while loading...

	//         }

	//     }

	// }

	

	// // save items to local storage

	// shoppingCart.prototype.saveItems = function () {

	//     if (localStorage != null && JSON != null) {

	//         localStorage[this.cartName + "_items"] = JSON.stringify(this.items);

	//     }

	// }

	

	// // adds an item to the cart

	// shoppingCart.prototype.addItem = function (sku, name, price, quantity) {

	//     quantity = this.toNumber(quantity);

	//     if (quantity != 0) {

	

	//         // update quantity for existing item

	//         var found = false;

	//         for (var i = 0; i < this.items.length && !found; i++) {

	//             var item = this.items[i];

	//             if (item.sku == sku) {

	//                 found = true;

	//                 item.quantity = this.toNumber(item.quantity + quantity);

	//                 if (item.quantity <= 0) {

	//                     this.items.splice(i, 1);

	//                 }

	//             }

	//         }

	

	//         // new item, add now

	//         if (!found) {

	//             var item = new cartItem(sku, name, price, quantity);

	//             this.items.push(item);

	//         }

	

	//         // save changes

	//         this.saveItems();

	//     }

	// }

	

	// // get the total price for all items currently in the cart

	// shoppingCart.prototype.getTotalPrice = function (sku) {

	//     var total = 0;

	//     for (var i = 0; i < this.items.length; i++) {

	//         var item = this.items[i];

	//         if (sku == null || item.sku == sku) {

	//             total += this.toNumber(item.quantity * item.price);

	//         }

	//     }

	//     return total;

	// }

	

	// // get the total price for all items currently in the cart

	// shoppingCart.prototype.getTotalCount = function (sku) {

	//     var count = 0;

	//     for (var i = 0; i < this.items.length; i++) {

	//         var item = this.items[i];

	//         if (sku == null || item.sku == sku) {

	//             count += this.toNumber(item.quantity);

	//         }

	//     }

	//     return count;

	// }

	

	// // clear the cart

	// shoppingCart.prototype.clearItems = function () {

	//     this.items = [];

	//     this.saveItems();

	// }

	

	// // define checkout parameters

	// shoppingCart.prototype.addCheckoutParameters = function (serviceName, merchantID, options) {

	

	//     // check parameters

	//     if (serviceName != "PayPal" && serviceName != "Google" && serviceName != "Stripe") {

	//         throw "serviceName must be 'PayPal' or 'Google' or 'Stripe'.";

	//     }

	//     if (merchantID == null) {

	//         throw "A merchantID is required in order to checkout.";

	//     }

	

	//     // save parameters

	//     this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);

	// }

	

	// // check out

	// shoppingCart.prototype.checkout = function (serviceName, clearCart) {

	

	//     // select serviceName if we have to

	//     if (serviceName == null) {

	//         var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];

	//         serviceName = p.serviceName;

	//     }

	

	//     // sanity

	//     if (serviceName == null) {

	//         throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";

	//     }

	

	//     // go to work

	//     var parms = this.checkoutParameters[serviceName];

	//     if (parms == null) {

	//         throw "Cannot get checkout parameters for '" + serviceName + "'.";

	//     }

	//     switch (parms.serviceName) {

	//         case "PayPal":

	//             this.checkoutPayPal(parms, clearCart);

	//             break;

	//         case "Google":

	//             this.checkoutGoogle(parms, clearCart);

	//             break;

	//         case "Stripe":

	//             this.checkoutStripe(parms, clearCart);

	//             break;

	//         default:

	//             throw "Unknown checkout service: " + parms.serviceName;

	//     }

	// }

	

	// // check out using PayPal

	// // for details see:

	// // www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside

	// shoppingCart.prototype.checkoutPayPal = function (parms, clearCart) {

	

	//     // global data

	//     var data = {

	//         cmd: "_cart",

	//         business: parms.merchantID,

	//         upload: "1",

	//         rm: "2",

	//         charset: "utf-8"

	//     };

	

	//     // item data

	//     for (var i = 0; i < this.items.length; i++) {

	//         var item = this.items[i];

	//         var ctr = i + 1;

	//         data["item_number_" + ctr] = item.sku;

	//         data["item_name_" + ctr] = item.name;

	//         data["quantity_" + ctr] = item.quantity;

	//         data["amount_" + ctr] = item.price.toFixed(2);

	//     }

	

	//     // build form

	//     var form = $('<form/></form>');

	//     form.attr("action", "https://www.paypal.com/cgi-bin/webscr");

	//     form.attr("method", "POST");

	//     form.attr("style", "display:none;");

	//     this.addFormFields(form, data);

	//     this.addFormFields(form, parms.options);

	//     $("body").append(form);

	

	//     // submit form

	//     this.clearCart = clearCart == null || clearCart;

	//     form.submit();

	//     form.remove();

	// }

	

	// // check out using Google Wallet

	// // for details see:

	// // developers.google.com/checkout/developer/Google_Checkout_Custom_Cart_How_To_HTML

	// // developers.google.com/checkout/developer/interactive_demo

	// shoppingCart.prototype.checkoutGoogle = function (parms, clearCart) {

	

	//     // global data

	//     var data = {};

	

	//     // item data

	//     for (var i = 0; i < this.items.length; i++) {

	//         var item = this.items[i];

	//         var ctr = i + 1;

	//         data["item_name_" + ctr] = item.sku;

	//         data["item_description_" + ctr] = item.name;

	//         data["item_price_" + ctr] = item.price.toFixed(2);

	//         data["item_quantity_" + ctr] = item.quantity;

	//         data["item_merchant_id_" + ctr] = parms.merchantID;

	//     }

	

	//     // build form

	//     var form = $('<form/></form>');

	//     // NOTE: in production projects, use the checkout.google url below;

	//     // for debugging/testing, use the sandbox.google url instead.

	//     //form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);

	//     form.attr("action", "https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/" + parms.merchantID);

	//     form.attr("method", "POST");

	//     form.attr("style", "display:none;");

	//     this.addFormFields(form, data);

	//     this.addFormFields(form, parms.options);

	//     $("body").append(form);

	

	//     // submit form

	//     this.clearCart = clearCart == null || clearCart;

	//     form.submit();

	//     form.remove();

	// }

	

	// // check out using Stripe

	// // for details see:

	// // https://stripe.com/docs/checkout

	// shoppingCart.prototype.checkoutStripe = function (parms, clearCart) {

	

	//     // global data

	//     var data = {};

	

	//     // item data

	//     for (var i = 0; i < this.items.length; i++) {

	//         var item = this.items[i];

	//         var ctr = i + 1;

	//         data["item_name_" + ctr] = item.sku;

	//         data["item_description_" + ctr] = item.name;

	//         data["item_price_" + ctr] = item.price.toFixed(2);

	//         data["item_quantity_" + ctr] = item.quantity;

	//     }

	

	//     // build form

	//     var form = $('.form-stripe');

	//     form.empty();

	//     // NOTE: in production projects, you have to handle the post with a few simple calls to the Stripe API.

	//     // See https://stripe.com/docs/checkout

	//     // You'll get a POST to the address below w/ a stripeToken.

	//     // First, you have to initialize the Stripe API w/ your public/private keys.

	//     // You then call Customer.create() w/ the stripeToken and your email address.

	//     // Then you call Charge.create() w/ the customer ID from the previous call and your charge amount.

	//     form.attr("action", parms.options['chargeurl']);

	//     form.attr("method", "POST");

	//     form.attr("style", "display:none;");

	//     this.addFormFields(form, data);

	//     this.addFormFields(form, parms.options);

	//     $("body").append(form);

	

	//     // ajaxify form

	//     form.ajaxForm({

	//         success: function () {

	//             $.unblockUI();

	//             alert('Thanks for your order!');

	//         },

	//         error: function (result) {

	//             $.unblockUI();

	//             alert('Error submitting order: ' + result.statusText);

	//         }

	//     });

	

	//     var token = function (res) {

	//         var $input = $('<input type=hidden name=stripeToken />').val(res.id);

	

	//         // show processing message and block UI until form is submitted and returns

	//         $.blockUI({ message: 'Processing order...' });

	

	//         // submit form

	//         form.append($input).submit();

	//         this.clearCart = clearCart == null || clearCart;

	//         form.submit();

	//     };

	

	//     StripeCheckout.open({

	//         key: parms.merchantID,

	//         address: false,

	//         amount: this.getTotalPrice() *100, /** expects an integer **/

	//         currency: 'usd',

	//         name: 'Purchase',

	//         description: 'Description',

	//         panelLabel: 'Checkout',

	//         token: token

	//     });

	// }

	

	// // utility methods

	// shoppingCart.prototype.addFormFields = function (form, data) {

	//     if (data != null) {

	//         $.each(data, function (name, value) {

	//             if (value != null) {

	//                 var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);

	//                 form.append(input);

	//             }

	//         });

	//     }

	// }

	// shoppingCart.prototype.toNumber = function (value) {

	//     value = value * 1;

	//     return isNaN(value) ? 0 : value;

	// }

	

	// //----------------------------------------------------------------

	// // checkout parameters (one per supported payment service)

	// //

	// function checkoutParameters(serviceName, merchantID, options) {

	//     this.serviceName = serviceName;

	//     this.merchantID = merchantID;

	//     this.options = options;

	// }

	

	// //----------------------------------------------------------------

	// // items in the cart

	// //

	// function cartItem(sku, name, price, quantity) {

	//     this.sku = sku;

	//     this.name = name;

	//     this.price = price * 1;

	//     this.quantity = quantity * 1;

	// }

	

	
	///////////////////////////////////

		// FAQ Page

	///////////////////////////////////

	

	

		if ($("html").attr("page") === "faq" || $("html").attr("page") === "about" || $("html").attr("page") === "license") {

		

			// Truncate Text	

			$(".readmore, .readless").click(function(event) {

				event.preventDefault();

				$(this).closest(".truncate-group").toggleClass("truncated");

			});

	

	

		//////////////////////////

			// Sidebar

	

			// SideBar Dropdown

			$(".sidebar .list-title").on("click", function(e) {			    	

				$(this).parent().toggleClass("open");		   	    	

			});

			

			// SideBar Anchors

			$(".sidebar .list-group-item[href^='#']").on("click", function(e) {			    	

				e.preventDefault();

				window.location.hash = this.hash;

				$(".sidebar .active").removeClass("active");

				$(this).addClass("active");		   	    	

			});

	

			// Sticky Sidebar

			$('.sticky').Stickyfill();

	

			// Sidebar First Active Section

			function activateSidebar(){

				$(".sidebar .list-group:first-of-type .list-group-item:first-of-type").addClass("active");

			}

			if (window.location.hash === "") {

				activateSidebar();

			}

	

			// Sidebar Update Active Section		

			var navPadding = $(".navbar").height();

			$("body").scrollspy({ 

				target: "#scrollSpyTarget",

			 	offset: navPadding + 1

			});

	

			// var activeNavPadding = $(".navbar").height();

			// $(window).load(function() {				    	

			// 	var updateSidebar = _.throttle(function(e) {

			// 		$('.main-content section').each(function(){

			// 	        if (($(this).offset().top < window.pageYOffset + activeNavPadding) && 

			// 	        	($(this).offset().top + $(this).height() > window.pageYOffset + activeNavPadding)) {

			// 	            window.location.hash = $(this).attr('id');

			// 	        }

			// 	    });

			// 	}, 500);

			// 	window.addEventListener("scroll", updateSidebar, false);

			// });

	

			// function stickeyNav(){

			//     var $sidebar   = $(".sidebar"), 

			//         $window    = $(window),

			//         offset     = $sidebar.offset(),

			//         topPadding = 15;

	

			//     $window.scroll(function() {

			//         if ($window.scrollTop() > offset.top) {

			//             $sidebar.stop().animate({

			//                 marginTop: $window.scrollTop() - offset.top + topPadding

			//             });

			//         } else {

			//             $sidebar.stop().animate({

			//                 marginTop: 0

			//             });

			//         }

			//     });

			// }

			// stickeyNav();

	

	

		}

	

	

			

	
	

	///////////////////////////////////

		// Global

	///////////////////////////////////

	

	///////////////////////////////////

		// Functions Definitions

	

		// Check Uppercase

		String.prototype.isUpperCase = function() {

		    return this.valueOf().toUpperCase() === this.valueOf();

		};

	

		// Check Email

		function validateEmail(email) {

			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

			return re.test(email);

		}

	

	

	

	///////////////////////////////////

		// Functions Calls

	

		$(window).load(function() {				    	

	

			$("p > strong").each( function(){

				if ($(this).text().isUpperCase()) {

					$(this).addClass("allUpper");

				}

			});

	

	

		$("#newsletter input[type='text']").keyup(function(){

			if ($(this).val() === "") { 

				$(this).closest("form").find(".validating").addClass("disabled");

			}else{

				if (validateEmail($(this).val())) {				    	

					$(this).closest("form").find(".validating").removeClass("disabled");

				} else {

					$(this).closest("form").find(".validating").addClass("disabled");

				}

			}

		});

	

	

		});

	

	
	///////////////////////////////////

	// Add Tweet to home page

	function addHomeFont(amount){

		

		var parameters = {

			  "number": amount

			};

	

		$.get( "/getFont", parameters, function(data) {		    				    	

			$.each(data, function (key, font) {

				var el = $(

					"<style>" +

						"@font-face {" +

							"font-family: " + font.typefaceName + ";" +

							"src: url(data:application/font-woff;charset=utf-8;base64," + font.base64Woff + ") format('woff');" +

							"font-weight: " + font.weight.toLowerCase() + ";" +

							"font-style: " + font.style.toLowerCase() + ";" +

						"}" +

					"</style>" +

					"<div class='col-sm-12 tweetWrap fresh' fontFamily='" + font.typefaceName + "' fontStyle='" + font.style + "' fontWeight='" + font.weightName + "'>" +

						"<a href='/" + font.typefaceName.toLowerCase() + "' class='h2wrap'>" +

							"<div class='h2wrap'>" +

								"<h2 class='tweet " + font.typefaceName.toLowerCase() + " " + font.weightName.toLowerCase() + " w" + font.weight + " " + font.style.toLowerCase() + "' style='font-family:" + font.typefaceName + ";'></h2>" +

							"</div>" +

						"</a>" +

						"<h6><span class='font_title'>" + font.font + "</span><a href='#' class='tweet_location'></a><a href='#' class='article_location'></a></h6>" +

					"</div>");

				$(".tweet_spec").append(el);

				twitterize(el);	

			});

		});

	}

	if ($("[page='home']").length > 0) {

		addHomeFont(5);

	}

	

	var randomFont;

	$(".addSpec").click( function(){

		randomFont = data.typeface.font[Math.floor(Math.random()*data.typeface.font.length)];			    	

		$(".tweet_spec").append(

			"<div class='col-sm-12 tweetWrap fresh' fontFamily='" + randomFont.typefaceName + "' fontStyle='" + randomFont.style + "' fontWeight='" + randomFont.weightName + "'>" +

				"<div class='h2wrap'>" +

					"<h2 contenteditable='true' spellcheck='false' class='tweet " + randomFont.typefaceName.toLowerCase() + " " + randomFont.weightName.toLowerCase() + " w" + randomFont.weight + " " + randomFont.style.toLowerCase() + "' style='font-family:" + randomFont.typefaceName + ";'></h2>" +

				"</div>" +

				"<h6><span class='font_title'>" + randomFont.font + "</span><a href='#' class='tweet_location'></a><a href='#' class='article_location'></a></h6>" +

			"</div>");

		var target = $(".fresh");

		twitterize(target);	

		TTSetUp(target);

	});

	
	

	///////////////////////////////////

		// News

	///////////////////////////////////

	

	///////////////////////////////////

	// Attribute functions

	var attrPosLeft,

		attrWidth,

		attrPosTop;	

	

	function setAttrPositionTop(obj){

		attrPosLeft = $(".container.main .page-header").offset().left;

		attrWidth = $(".sidebar").width();

		attrPosTop = $(obj).offset().top;

		$(obj).parent().find("h6").css("left", attrPosLeft);

		$(obj).parent().find("h6").css("width", attrWidth);

		$(obj).parent().find("h6").css("top", attrPosTop);

	}

	

	var attrHeight;

	function setAttrPositionBottom(obj){

		attrPosLeft = $(".container.main .page-header").offset().left;

		attrWidth = $(".sidebar").width();

		attrPosTop = $(obj).offset().top + $(obj).height();

		$(obj).parent().find("h6").css("left", attrPosLeft);

		$(obj).parent().find("h6").css("width", attrWidth);

		$(obj).parent().find("h6").css("top", attrPosTop);

	

		attrHeight = $(obj).parent().find("h6").height();

		$(obj).parent().find("h6").css("margin-top", "-" + attrHeight + "px");

	}

	

	if ($("html").attr("page") === "news") {

	

	///////////////////////////////////

		// Sticky Sidebar

		$('.sticky').Stickyfill();

	

	///////////////////////////////////

		// Attribute Layout

		$(".post-content p:not(:first-of-type) img").each( function() {			    	

			$(this).after("<h6 class='imgAttr text-muted topPos'>" + $(this).attr("alt") + "</h6>");

			setAttrPositionTop(this);   	

		});

		

		$(".post-content p:first-of-type img").each( function() {			    	

			$(this).after("<h6 class='imgAttr text-muted bottomPos'>" + $(this).attr("alt") + "</h6>");

			setAttrPositionBottom(this);   	

		});

	

	///////////////////////////////////

		// Slideshow Layout

		var swipeCounter = 1;

		function swiperLoad(){

			$(".swiper-container:not(.swiped)").each( function(index, element){

				swipeCounter = swipeCounter + 1;

				$(this).addClass("swiped").addClass("s" + swipeCounter);

				if ($("html").hasClass("touchfalse")) {

					$(".s" + swipeCounter).swiper({

						effect: "fade",

						// Loop is causing bug

						// loop: true,

						pagination: ".s" + swipeCounter + " .swiper-pagination",

						slidesPerView: 1,

		        		paginationClickable: true,

		        		paginationBulletRender: function (index, className) {

				        	return "<span class='" + className + "'>" + (swipeCounter + 1) + "</span>";

				        },

				        lazyLoadingInPrevNext: true, 

		        		spaceBetween: 0,

						nextButton: ".s" + swipeCounter + " .swiper-button-next, .s" + swipeCounter + " .swiper-next, .s" + swipeCounter + " .swiper-slide, .s" + swipeCounter + " .swiper-slide img",

						prevButton: ".s" + swipeCounter + " .swiper-button-prev, .s" + swipeCounter + " .swiper-prev",

						onSlideChangeStart: function () {						    	

		                    $(".s" + swipeCounter + " .swiper-wrapper").css("max-height", $(".s" + swipeCounter + " .swiper-slide-active img").height());

		                }

					});  

	

				} else {

					$(".s" + swipeCounter).swiper({

						effect: "fade",

						// Loop is causing bug

						// loop: true,

						pagination: ".s" + swipeCounter + " .swiper-pagination",

						slidesPerView: 1,

						grabCursor: true,

		        		paginationClickable: true,

		        		paginationBulletRender: function (index, className) {

				        	return "<span class='" + className + "'>" + (swipeCounter + 1) + "</span>";

				        },

				        lazyLoadingInPrevNext: true, 

		        		spaceBetween: 0,

		        		mousewheelControl: true,

						nextButton: ".s" + swipeCounter + " .swiper-button-next, .s" + swipeCounter + " .swiper-next",

						prevButton: ".s" + swipeCounter + " .swiper-button-prev, .s" + swipeCounter + " .swiper-prev",

						onSlideChangeStart: function () {

		                    $(".s" + swipeCounter + " .swiper-wrapper").css("max-height", $(".s" + swipeCounter + " .swiper-slide-active img").height());

		                }

					}); 

	    		}

	    		$(window).load(function() {				    	

					$(".s" + swipeCounter + " .swiper-wrapper").css("max-height", $(".s" + swipeCounter + " .swiper-slide-active img").height());

				});

			});

		}

		swiperLoad();

	

		// Load more posts

		var currentNewsPage = 1;

		var maxNewsPages = locals.data.posts.totalPages;

		var newsLoader = "<div class='news-loader'><img src='/src/static/img/load.gif'/></div>"

	

		function addNextPage(){

			$(".news").append(newsLoader);

			currentNewsPage = currentNewsPage + 1;			    	

			var parameters = {

				"currentNewsPage" : currentNewsPage

			}

	

			$.get( "/addNextPage", parameters, function(data) {

					$('.news-loader').remove();

					$(".news").append(data);

					swiperLoad();

			});

		}

	

		var scrollNews = _.throttle(function(e) {			    	

			if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {

				if (maxNewsPages > currentNewsPage) {

					addNextPage();

				}

			}

		}, 500);

		window.addEventListener("scroll", scrollNews, false);

	

	}

	

	

	

	 

	
	

	///////////////////////////////////

		// News

	///////////////////////////////////

	

	if ($("html").attr("page") === "post") {

	

		// Set current post meta

		locals.tmp.currentPost = locals.data.post.publishedDate;	    	

		    	

		// Load previous posts

		var newsLoader = "<div class='news-loader'><img src='/src/static/img/load.gif'/></div>"

	

		function addPreviousPost(){

			$(window).unbind("scroll", scrollPost);

	            	

			$(".news").append(newsLoader);

			currentNewsPage = currentNewsPage + 1;			    	

			var parameters = {

				"currentPost" : locals.tmp.currentPost

			}

	

			$.get( "/addPreviousPost", parameters, function(data) {

					$('.news-loader').remove();

					$("#body").append(data.html);				    	

					locals.tmp.currentPost = data.publishedDate;	    	

					$(window).bind("scroll", scrollPost);

	

			});

		}

	

		function addPreviousPostIfShortPage(){

			if ($(document).height() <= $(window).height()) {

				addPreviousPost();

			}

		}

		addPreviousPostIfShortPage();

		setTimeout(function(){addPreviousPostIfShortPage();}, 1000);

		setTimeout(function(){addPreviousPostIfShortPage();}, 2000);

	

	

		var scrollPost = _.throttle(function(e) {			    	

			if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {

				addPreviousPost();

			}

		}, 500);

		$(window).bind("scroll", scrollPost);

	

	}

	

	

	

	 

	
	

	///////////////////////////////////

		//TYPEFACE Page

	///////////////////////////////////

	

		function twitReset(obj){

			var h2Class = $(obj).find("h2").attr("class");

			var h2family = $(obj).find("h2").css("font-family");

			var h2style = $(obj).find("h2").css("font-style");

			var h2weight = $(obj).find("h2").css("font-weight");

			$(obj).find("h2").replaceWith( "<h2 contenteditable='true' spellcheck='false' style='font-family:" + h2family + "; font-style:" + h2style + ";font-weight:" + h2weight + ";' class='" + h2Class + "'>New heading</h2>");

			$(obj).find("h2").css("height", "");	

			$(obj).find(".tweetEditor").remove(); 	

		}

	

		// PANGRAMS STYLE FUNCTION

		function pangramMe(obj){

			var pangram = pangrams[Math.floor( Math.random() * pangrams.length )];

			$(obj).text(pangram);

			$(obj).attr("placeholder", pangram);

		}

	

	

		// Twitter Setup

		function TTSetUp(obj){	

			if ( typeof $(obj).find("h2.tweet > div").css("font-size") === "undefined") {

				setTimeout(function () { TTSetUp(obj); }, 500);

				return false;

			}

			$(obj).append(

				"<div class='icon icon-close'></div>" +

				"<div class='tweetEditor row'>" +

					"<div class='col-xs-4 col-md-3 btn-group styleButton btn-group-options co'>" +

						"<button type='button' data-toggle='dropdown' aria-expanded='false' class='btn btn-default dropdown-toggle'>" +

							"<span class='disc'>Book</span><span class='caret'></span>" +

						"</button>" +

						"<ul role='menu' class='dropdown-menu'>" + typefaceOptions + "</ul>" +

					"</div>" +

					"<div class='col-xs-4 col-md-3 sizeTweetSlider'>" +

						"<div class='slider'>" +

							"<span class='amount'>64px</span>" +

						"</div>" +

					"</div>" +

					"<div class='col-xs-4 col-md-3 trackingTweetSlider'>" +

						"<div class='slider'>" +

							"<span class='amount'>0em</span>" +

						"</div>" +

					"</div>" +

				"</div>");

	

			// Delete

			$(obj).find(".fa-close").click( function(){

				$(obj).remove();

			});

	

	

			//Size Slider						    	    	    	

			var tweetSize = Math.round($(obj).find("h2.tweet > div").css("font-size").slice(0, - 2));

			$(obj).find(".sizeTweetSlider .slider").slider({

				orientation: "horizontal",

				range: "min",

				min: 10,

				max: 200,

				value: tweetSize,

				animate: true,

				slide: function( event, ui ) {

					$(this).parent().find( ".amount" ).text(ui.value + "px");

					$(this).parent().parent().parent().find( "h2.tweet > div" ).css("font-size", ui.value + "px");

					$(this).find("h2").css("font-size", ui.value + "px");

				},

				create: function( event, ui ) {

					$(this).parent().find( ".amount" ).text(tweetSize + "px");

					$(this).find("h2").css("font-size", tweetSize + "px");

				}

			});

	

			//Tracking Slider

			$(obj).find(".trackingTweetSlider .slider").slider({

				orientation: "horizontal",

				range: "min",

				min: -0.1,

				max: 0.2,

				value: 0,

				step: 0.01,

				animate: true,

				slide: function( event, ui ) {

					$(this).parent().find( ".amount" ).text(ui.value + "em");

					$(this).parent().parent().parent().find( "h2.tweet" ).css("letter-spacing", ui.value + "em");

				},

				create: function( event, ui ) {

					$(this).parent().parent().parent().find( "h2.tweet" ).css("letter-spacing", ui.value + "em");

				}

			});

	

			//Style Selector Button

			var style = $(obj).find(".font_title").text();

			style = style.substr(style.indexOf(" ") + 1);

			var btnGroup = $(obj).find(".btn-group-options");

			$(btnGroup).find("li > a").filter(function(index) { return $(this).text() === style; }).parent().addClass("active");

			$(btnGroup).find(".btn .disc").text(style);

					

			$(btnGroup).find("li > a").click( function(){

				var txt = $(this).text();

				var targetFont = getObjects(data.typeface.font, "weightName", txt.split(" ")[0]);

				if (!txt.split(" ")[1]) {

					targetFont = getObjects(targetFont, "style", "Normal");

				}else{

					targetFont = getObjects(targetFont, "style", "Italic");

				}

				$(btnGroup).find(".btn .disc").text(txt);

						

				$(obj).find("h2.tweet")

					.css("font-weight", targetFont[0].weight)

					.css("font-style", targetFont[0].style)

					.css("font-family", targetFont[0].typefaceName);

	

				$(obj)

					.attr("fontWeight", targetFont[0].weightName)

					.attr("fontStyle", targetFont[0].style)

					.attr("fontFamily", targetFont[0].typefaceName);

	

				var newTitle = $(obj).attr("fontFamily") + " " + $(obj).attr("fontWeight");

				if ($(obj).attr("fontStyle") === "Italic") {

					newTitle += " Italic";

				}

				$(obj).find(".font_title").text(newTitle);

	

				$(btnGroup).find(".active").removeClass("active");								    				

				$(btnGroup).find("li > a").filter(function(index) { return $(this).text() === txt; }).parent().addClass("active");

			});		    

	

			//Display

			$(obj).click( function(){

				$(obj).addClass("active");

			});

			$(document).on("click", function (e) {

				if ($(obj).is(":hover") === false) {

					$(obj).removeClass("active");

				}

			});

	

			//Start Typing

			$(obj).find("h2").keydown(function() {

				// $(obj).find(".tweet_location").attr("href","javascript:;");

				$(obj).find(".tweet_location").preventDefault(); 

				$(obj).find(".tweet_location").text("");

				// $(obj).find(".article_location").attr("href","javascript:;");

				$(obj).find(".article_location").preventDefault(); 

				$(obj).find(".article_location").text("");

			});

		}

	

		if ($("html").attr("page") === "typeface") {

	

			var defaultFont = getObjects(data.typeface.font, "weight", "400");

			defaultFont = getObjects(defaultFont, "style", "Normal");

	

			$("#styles .enterText, #stylesh2").keypress(function(e){ return e.which !== 13; });

			$("#styles .enterText").keyup(function(){

				$("#stylesh2").text($(this).text());

			});

			$("#stylesh2").keyup(function(){

				var cur = $(this);

				$("#stylesh2").each( function(){

					if (!$(this).is(cur)) {

						$(this).text(cur.text());

					}

	

				});

			});

	

			

			$(".refreshSpec").click( function(){

				$(".tweetWrap").each( function(){

					twitReset(this);

					twitterize(this);

					TTSetUp(this);

				});

			});

					

	

		///////////////////////////////////

			//Activate Style Sliders

	

			$(".sizeTextSlider .slider").slider({

				orientation: "horizontal",

				range: "min",

				min: 10,

				max: 200,

				value: 48,

				animate: true,

				slide: function( event, ui ) {

					$(this).parent().find( ".amount" ).text(ui.value + "px");

					$("#styles h3, #styles .overflowText").css("font-size", ui.value + "px");

					$("#stylesh2").css("height", ui.value*1.25 + "px");

					$("#styles h6").css("margin-bottom", ui.value*0.5 + "px");

				},

				create: function( event, ui ) {

					$("#styles h3, #styles .overflowText").css("font-size", "48px");

					$("#stylesh2").css("height", 48*1.25 + "px");

					$("#styles h6").css("margin-bottom", 48*0.5 + "px");

				}

			});

	

			$(".trackingTextSlider .slider").slider({

				orientation: "horizontal",

				range: "min",

				min: -0.1,

				max: 0.2,

				value: 0,

				step: 0.01,

				animate: true,

				slide: function( event, ui ) {

					$(this).parent().find( ".amount" ).text(ui.value + "em");

					$("#stylesh2").css("letter-spacing", ui.value + "em");

				},

				create: function( event, ui ) {

					$("#stylesh2").css("letter-spacing", ui.value + "em");

				}

			});

	

	

		///////////////////////////////////

			// For Tweet Testers

			var typefaceOptions = "";

			for (var font in data.typeface.font) {

				if (font) {

					var name = data.typeface.font[font].weightName;

					if (data.typeface.font[font].style === "Italic") {

						name += " Italic";

					}

					typefaceOptions += "<li><a href='javascript:;'>" + name + "</a></li>";

				}

			}

					

			setTimeout(function () { 

				$("[page='fonts'] .tweetWrap").each( function(){			    	

					TTSetUp(this);

				});

			}, 500);

	

	

		///////////////////////////////////

			// Add Tweet Button

			$(".addSpec").click( function(){

				randomFont = data.typeface.font[Math.floor(Math.random() * data.typeface.font.length)];			    	

				$(".tweet_spec").append(

					"<div class='col-sm-12 tweetWrap fresh' fontFamily='" + randomFont.typefaceName + "' fontStyle='" + randomFont.style + "' fontWeight='" + randomFont.weightName + "'>" +

						"<div class='h2wrap'>" +

							"<h2 contenteditable='true' spellcheck='false' class='tweet " + randomFont.typefaceName.toLowerCase() + " " + randomFont.weightName.toLowerCase() + " w" + randomFont.weight + " " + randomFont.style.toLowerCase() + "' style='font-family:" + randomFont.typefaceName + ";'></h2>" +

						"</div>" +

						"<h6><span class='font_title'>" + randomFont.font + "</span><a href='#' class='tweet_location'></a><a href='#' class='article_location'></a></h6>" +

					"</div>");

				var target = $(".fresh");

				twitterize(target);	

				TTSetUp(target);

			});

	

			// PANGRAMS STYLES

			$(".pangram").each( function(){

				pangramMe(this);

			});

			$("#styles .enterText, #stylesh2").keyup( function(){

				if ($(this).text() === "") {

					$(".pangram").each( function(){

						$(this).text($(this).attr("placeholder"));

					});

				}

			});

		}

	

		///////////////////////////////////

			// Set Features Heights

			function setFeatureGradientHeights(){

				$("#features .overflowText").css("font-size", $("#features h3").height());

			}

			$("[href='#features']").click( function(){			    	

				setFeatureGradientHeights();

				setTimeout(function () { setFeatureGradientHeights(); }, 100);

			});

			setFeatureGradientHeights();

			setTimeout(function () { setFeatureGradientHeights(); }, 100);

	

		///////////////////////////////////

			// Set Features mirroring

			

			$("#features .featureStyleh2").keyup( function(){	

				$(this).parents().eq(3).find(".defaultStyleh2").text($(this).text());

			});

			$("#features .defaultStyleh2").keyup( function(){			    	

				$(this).parents().eq(3).find(".featureStyleh2").text($(this).text());

			});

	

	

	/////////////////

		// Hashtag anchor

		function tabAnchor(hash){

	

			$(hash).parent().find(".active").removeClass("active");

			$(hash).addClass("active");

	

			$(hash).parent().parent().parent().parent().find(".nav-tabs .active").removeClass("active");

			$(hash).parent().parent().parent().parent().find(".nav-tabs a[href='" + hash + "']").parent().addClass("active");

	

	

			$("html, body").animate({

				scrollTop: ($(hash).offset().top - 100)

			}, 300, function(){

				// window.location.hash = hash;

			});

		}

		//BUTTON

		$(".buyThisFont, .main .navbar-nav:not(.nav-tabs) a[href^='#']").on("click", function(e) {

			e.preventDefault();

			var hash = this.hash;

			tabAnchor(hash);

		});

		

	

	

	///////////////

		//Make Tweets

		$(".tweetWrap.fresh").each( function(){

			twitterize(this);

		});

	

		$(window).load(function() {				    	

	

			function ChrSetBtnGrouTypepSetup(obj){

				var thisbtnGroup = $(obj);

				var btnGroup = $(".btn-group-typeoptions");

	

				// Calc Width

				// var btnGroupWidth = 0;

				// $(btnGroup).find(".dropdown-menu").each( function(){

				// 	if ($(this).width() > btnGroupWidth )  {

				// 		btnGroupWidth = $(this).width();

				// 	}

				// });

				// $(btnGroup).find(".btn").css("min-width", btnGroupWidth);

	

				// Add Type styles

				$(btnGroup).find(".btn .disc").text(defaultFont[0].weightName);

				$(thisbtnGroup).closest(".main").find(".style-target")

					.css("font-weight", defaultFont[0].weight)

					.css("font-style", defaultFont[0].style)

					.css("font-family", defaultFont[0].typefaceName);

	

				$(btnGroup).find("li > a").filter(function(index) { return $(this).text() === defaultFont[0].weightName; }).parent().addClass("active");

	

	

				$(btnGroup).find("li > a").click( function(){

					var txt = $(this).text();

					var targetFont = getObjects(data.typeface.font, "weightName", txt.split(" ")[0]);

					if (!txt.split(" ")[1]) {

						targetFont = getObjects(targetFont, "style", "Normal");

					}else{

						targetFont = getObjects(targetFont, "style", "Italic");

					}

	

					$(btnGroup).find(".btn .disc").text(txt);

					$(thisbtnGroup).closest(".main").find(".style-target")

						.css("font-weight", targetFont[0].weight)

						.css("font-style", targetFont[0].style)

						.css("font-family", targetFont[0].typefaceName);

	

					$(btnGroup).find(".active").removeClass("active");								    				

					$(btnGroup).find("li > a").filter(function(index) { return $(this).text() === txt; }).parent().addClass("active");

				});

			}

			$(".btn-group-typeoptions").each(function(){			    	

				ChrSetBtnGrouTypepSetup(this);

			});

		});

	

		
	////////////////////////////////////////////////
	////////////////                 ///////////////
	////////////////    LISTENERS    ///////////////
	////////////////                 ///////////////
	////////////////////////////////////////////////

////////////////////////////////////////////////
	//ON RESIZE
	var updateLayout = _.debounce(function(e) {
		setFeatureGradientHeights();

		// post pages
		$(".post-content p:not(:first-of-type) img").each( function() {			    	
			setAttrPositionTop(this);   	
		});
		$(".post-content p:first-of-type img").each( function() {			    	
			setAttrPositionBottom(this);   	
		});	
		
	}, 500);
	window.addEventListener("resize", updateLayout, false);

////////////////////////////////////////////////
	//ON scroll throttle
	// var scroll = _.throttle(function(e) {

	// }, 500);
	// window.addEventListener("scroll", scroll, false);
	if ($("[page='home']").length > 0) {
		var scrollMore = _.throttle(function(e) {			    	
			if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
				addHomeFont(5);
			}
		}, 500);
		window.addEventListener("scroll", scrollMore, false);
	}
	// if ($("[page="news"], [page="custom"]").length > 0) {
	// 	var scrollMore = _.throttle(function(e) {			    	
	// 		if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
	// 			addNextPage();
	// 		}
	// 	}, 500);
	// }


	//ON scroll
	//$(window).scroll(function(){
		
	//});

	$(window).load(function() {				    	
	///////////////////////////////////
		// General Formating main
		// function ChrSetBtnGroupSetup(obj){
		// 	var thisbtnGroup = $(obj);
		// 	var btnGroup = $(".btn-group-options");

		// 	$(btnGroup).find("li > a").click( function(){
		// 		var txt = $(this).text();

		// 		$(btnGroup).find(".btn .disc").text(txt);

		// 		$(btnGroup).find(".active").removeClass("active");								    				
		// 		$(btnGroup).find("li > a").filter(function(index) { return $(this).text() === txt; }).parent().addClass("active");
		// 	});
		// }
		// $(".btn-group-options").each(function(){			    	
		// 	ChrSetBtnGroupSetup(this);
		// });

	///////////////////////////////////
		// ADjust quotes
		smartquotes();
		setTimeout(function () { smartquotes(); }, 500);

		hashScroll();

	});

});