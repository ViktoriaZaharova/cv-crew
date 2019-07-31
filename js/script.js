jQuery(document).ready(function(){
	
	"use strict";

    function fadeElementByScroll(){
	$(window).scroll(function(event) {
            $(".services").each(function(i, el) {
                var el = $(el);
                if (el.visible(true)) {
                el.addClass("animated fadeInUp"); 
                } 
            });	
            $(".tab_content").each(function(i, el) {
                var el = $(el);
                if (el.visible(true)) {
                el.addClass("animated fadeInUp"); 
                } 
            });		
            $(".animate .prdct-mock img").each(function(i, el) {
                var el = $(el);
                if (el.visible(true)) {
                el.addClass("animated fadeInRight"); 
                } 
            });		
            $(".price-table-area").each(function(i, el) {
                var el = $(el);
                if (el.visible(true)) {
                el.addClass("animated fadeInLeft"); 
                } 
            });		
            $(".animate .prdct-mockup").each(function(i, el) {
                var el = $(el);
                if (el.visible(true)) {
                el.addClass("animated fadeInLeftBig"); 
                } 
            });	
            $(".animate .prdct-mockup-info").each(function(i, el) {
                var el = $(el);
                if (el.visible(true)) {
                el.addClass("animated fadeInRightBig"); 
                } 
            });	
            $(".item-shot").each(function(i, el) {
                var el = $(el);
                if (el.visible(true)) {
                el.addClass("animated fadeInUp"); 
                } 
            });
            $(".get-in-touch").each(function(i, el) {
                var el = $(el);
                if (el.visible(true)) {
                el.addClass("animated fadeInUp"); 
                } 
            });
            $(".location").each(function(i, el) {
                var el = $(el);
                if (el.visible(true)) {
                el.addClass("animated fadeInBottom"); 
                } 
            });

	});
    }
    
    fadeElementByScroll();

	/*** Why Dont  ***/
	$(".why-dont-sec > .pointer > span").on('click', function(){
	$(".why-dont").fadeToggle();
	});	
	
	/*** Form Show  ***/
	$(".show-form-btn").on('click', function(){
	$(".trial-form > form").slideToggle();
	$(".show-form-btn").toggleClass('hide-form');
	});
	
	/*** Menu Show  ***/
	$(".open-nav").on('click', function(){
	$(".menu > ul").fadeToggle();
	});
	
	/*** FIXED Menu APPEARS ON SCROLL DOWN ***/	
	$(window).scroll(function() {    
	var scroll = $(window).scrollTop();
	if (scroll >= 50) {
	$("header").addClass("sticky");
	}
	else{
	$("header").removeClass("sticky");
	$("header").addClass("");
	}
	});
	
	/*** SMOOTH SCROLLING ***/	
	$(function() {
	$('a[href*=#]:not([href=#])').on('click', function() {
	if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	var target = $(this.hash);
	target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	if (target.length) {
	$('html,body').animate({
	scrollTop: target.offset().top
	}, 1000);
	}
	}
	});
	});    

	var lastId,
	topMenu = $("nav"),
	topMenuHeight = topMenu.outerHeight()+15,
	// All list items
	menuItems = topMenu.find("a"),
	scrollItems = menuItems.map(function(){
	var item = $($(this).attr("href"));
	if (item.length) { return item; }
	});
	$(window).scroll(function(){
	// Get container scroll position
	var fromTop = $(this).scrollTop()+topMenuHeight;

	// Get id of current scroll item
	var cur = scrollItems.map(function(){
	if ($(this).offset().top < fromTop)
	return this;
	});
	// Get the id of the current element
	cur = cur[cur.length-1];
	var id = cur && cur.length ? cur[0].id : "";

	if (lastId !== id) {
	lastId = id;
	// Set/remove active class
	menuItems
	.parent().removeClass("active")
	.end().filter("[href=#"+id+"]").parent().addClass("active");
	}                   
	});	
	
	
	$(".color-themes > ul > li > a.dark").on('click', function(){
	$(".color-themes > ul > li > a.dark").addClass("active");
	$(".color-themes > ul > li > a.light").removeClass("active");
	$("section").addClass('dark');
	$("header").addClass('dark');
	});
	
	$(".color-themes > ul > li > a.light").on('click', function(){
	$(".color-themes > ul > li > a.light").addClass("active");
	$(".color-themes > ul > li > a.dark").removeClass("active");
	$("section").removeClass('dark');
	$("header").removeClass('dark');
	});
	
	$(".theme-layouts > ul > li > a.boxed").on('click', function(){
	$(".theme-layouts > ul > li > a.boxed").addClass("active");
	$(".theme-layouts > ul > li > a.full").removeClass("active");
	});
	
	$(".theme-layouts > ul > li > a.full").on('click', function(){
	$(".theme-layouts > ul > li > a.full").addClass("active");
	$(".theme-layouts > ul > li > a.boxed").removeClass("active");
	});
	
	$(".header-option > ul > li > a.top").on('click', function(){
	$(".header-option > ul > li > a.top").addClass("active");
	$("header").addClass("top");
	$(".header-option > ul > li > a.bottom").removeClass("active");
	$("header").removeClass("bottom");
	});
	
	$(".header-option > ul > li > a.bottom").on('click', function(){
	$(".header-option > ul > li > a.bottom").addClass("active");
	$("header").addClass("bottom");
	$(".header-option > ul > li > a.top").removeClass("active");
	$("header").removeClass("top");
	});
	
	$(".boxed").on('click', function(){
	$(".theme-layout").addClass("boxed");
	$("body").addClass('background bg1');
	});

	$(".full").on('click', function(){
	$(".theme-layout").removeClass("boxed");
	$("body").removeClass('bg1');
	$("body").removeClass('bg2');
	$("body").removeClass('bg3');
	});

	$(".bg1").on('click', function(){
	$("body").addClass('bg1');
	$("body").removeClass('bg2');
	$("body").removeClass('bg3');
	});

	$(".bg2").on('click', function(){
	$("body").removeClass('bg1');
	$("body").addClass('bg2');
	$("body").removeClass('bg3');
	});

	$(".bg3").on('click', function(){
	$("body").removeClass('bg1');
	$("body").removeClass('bg2');
	$("body").addClass('bg3');
	});

	
});