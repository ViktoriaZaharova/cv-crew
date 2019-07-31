$(document).ready(function () {

    var pathname = window.location.pathname;
    var requestUrl = window.location.href;
    var defaultErrorMessage = '<div class="color-danger error-message"> Oops.. Something went wrong!</div>';
    var loader = '<span class="loader"><i class="icon-spinner7 spin"></i></span>';

    // Load payment button behavior script
    if ($('body').find('.payButtonContainer').length > 0) {
        $.getScript("/js/project/payment-button.js");
    }

    // popover on login page
    $('.login-popover').popover('show');

    function trimInput() {
        // trim all input
        $('input').on('change', function () {
            $(this).val($.trim($(this).val()));
        });
    }

    trimInput();

    $('.popover-info').popover({
        trigger: 'manual'
    })
        .hover(function () {
            $(this).popover('show');
        }, function () {
            $(this).popover('hide');
        });


    /*-- form popover --*/
    var showPopover = function () {
        $(this).popover('show');
    }
        , hidePopover = function () {
        $(this).popover('hide');
    };

    $('input, textarea').popover({
        trigger: 'manual'
    })
        .click(showPopover)
        .blur(hidePopover);

    /*-- end form popover --*/


    /*-------- register block------------*/
    $('#register_block select[name=reg_user_type]').change(function () {
        $(this).after('<span class="loader" style="margin-right:-20px"><i class="icon-spinner7 spin"></i></span>');
        $('.error-message').remove();
        $('#register_block input').not('#regSubmitButton').attr('disabled', true);
        var regUserType = $(this).val();
        var url = Routing.generate('_ajax_get_register_additional', {regUserType: regUserType});
        $.post(url, function (data) {
            $('.loader').remove();
            $('#register_block input').not('#regSubmitButton').attr('disabled', false);
            $('#register_block #regAdditional').html(data);
            $("select").select2({
                width: 250
            });
            trimInput();
        }).error(function () {
            $("#register_block .catalog-block").append(defaultErrorMessage);
        });

        if (regUserType === '1') {
            $('#register_block #info-seaman').show();
            $('#register_block #info-company, #register_block #info-service').hide();
        } else if (regUserType === '2' || regUserType === '3') {
            $('#register_block #info-seaman, #register_block #info-service').hide();
            $('#register_block #info-company').show();
        } else if (regUserType === '4') {
            $('#register_block #info-seaman, #register_block #info-company').hide();
            $('#register_block #info-service').show();
        }

    });

    $('#register_block .email').change(function () {
        $('.email-result').hide('slow');
        var $this = $(this);
        var email = $.trim($(this).val());
        var url = Routing.generate('_ajax_is_email_exists', {email: email});
        var message = '';
        if (validateEmail(email)) {
            $.post(url, function (data) {
                if (data === '0') {
                    $this.removeClass('error').addClass('valid');
                    message = '<span class="color-success">Available for registration!</span>';
                } else {
                    $this.removeClass('valid').addClass('error');
                    message = '<span class="color-danger">Email already exists! <a href="http://crewell.net/login">Please login</a>.</span>';
                }
                $('.email-result').html(message).show('slow');
            });
        } else {
            $this.removeClass('valid').addClass('error');
            message = '<span class="color-danger">Email is not valid!</span>';
            $('.email-result').html(message).show('slow');
        }
    });

    $('#register_block #terms_accept').click(function () {
        if ($(this).is(':checked')) {
            $('#register_block #regSubmitButton').attr('disabled', false);
        } else {
            $('#register_block #regSubmitButton').attr('disabled', true);
        }
    });

    $('#register_block #regSubmitButton').click(function () {

        var password1 = $("#fos_user_registration_form_plainPassword_first").val();
        var password2 = $("#fos_user_registration_form_plainPassword_second").val();
        if (password1 === password2) {
            if ($('#registerForm').valid()) {
                $('#register_block #regSubmitButton').attr('disabled', true);
                $('#registerForm').submit();
            }
        } else {
            $("#fos_user_registration_form_plainPassword_second").after('<div class="color-danger">Password doesn\'t match</div>');
        }
    });

    function validateEmail($email) {
        var emailReg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return emailReg.test($email);
    }

    /*-------- end register block------------*/


    // topmenu floating
    var nav = $('#navbar-float');
    if (nav.length > 0) {
        var navHomeY = nav.offset().top;
        var isFixed = false;
        var $w = $(window);
        $w.scroll(function () {
            var scrollTop = $w.scrollTop();
            var shouldBeFixed = scrollTop > navHomeY;
            if (shouldBeFixed && !isFixed) {
                nav.css({
                    position: 'fixed',
                    top: 0,
                    left: nav.offset().left,
                    //                width: nav.width()
                });
                isFixed = true;
            } else if (!shouldBeFixed && isFixed) {
                nav.css({
                    position: 'static'
                });
                isFixed = false;
            }
        });
    }


    $("#content-wrapper").on('click', '.likeReferenceBtn', function () {
        var url = Routing.generate('_ajax_reference_likes_count');
        var itemId = $(this).parents('.itemId').attr('data-item-id');
        $this = $(this).parents('.itemId');
        var params = {
            itemId: itemId
        };

        $.post(url, params, function (data) {
            if (data.responseCode === 200) {
                $this.find(".likeReferenceBtn span").html(data.likeCount);
            }
        });
    });


    // front form search vacancy by ID
    $("#frontSearchVacancyByIdButton").on("click", function () {
        var itemId = $("#frontSearchVacancyById").val();
        var requestUrl = Routing.generate('vacancy_details', {id: itemId});
        window.location.replace(requestUrl);
    });

    // keypress enter for front search Vacancy by ID
    $("#frontFormSearchVacancyById").keypress(function (event) {
        if (event.which === 13) {
            event.preventDefault();
            var itemId = $("#frontSearchVacancyById").val();
            var requestUrl = Routing.generate('vacancy_details', {id: itemId});
            window.location.replace(requestUrl);
        }
    });

    // front form search company by name
    $("#searchCompanyButton").on("click", function () {
        var str = $("input[name=searchCompany]").val();
        var requestUrl = Routing.generate('company_catalog', {searchCompany: str});
        window.location.replace(requestUrl);
    });

    // keypress enter for front company by name
    $("#searchCompanyButton").keypress(function (event) {
        if (event.which === 13) {
            event.preventDefault();
            var str = $("input[name=searchCompany]").val();
            var requestUrl = Routing.generate('company_catalog', {searchCompany: str});
            window.location.replace(requestUrl);
        }
    });


    function sidebarToggle() {
        $('body').on('click', '.sidebar-toggle', function (e) {

            e.preventDefault();

            $('body').toggleClass('sidebar-narrow');

            if ($('body').hasClass('sidebar-narrow')) {
                var cookie = Cookies.get('sidebarStyle');
                if (!cookie) {
                    Cookies.set('sidebarStyle', 'narrow', {expires: 180}); // set sidebar cookies
                }

                $('.navigation').children('li').children('ul').css('display', '');

                $('.sidebar-content').hide().delay().queue(function () {
                    $(this).show().addClass('animated fadeIn').clearQueue();
                });

                $('.sidebar-toggle').attr('title', 'Show').html('<i class="icon-arrow-right11"></i>');

            } else {
                $('body').addClass('sidebar-wide');
                Cookies.remove('sidebarStyle'); // remove sidebar cookies
                $('.navigation').children('li').children('ul').css('display', 'none');
                $('.navigation').children('li.active').children('ul').css('display', 'block');

                $('.sidebar-content').hide().delay().queue(function () {
                    $(this).show().addClass('animated fadeIn').clearQueue();
                });

                $('.sidebar-toggle').attr('title', 'Hide').html('<i class="icon-arrow-left10"></i>');


            }
        });
    }

    if (window.location.href.indexOf("/account/") > 0) {
        $('a.sidebar-toggle').show();
        sidebarToggle();
    } else {
        $('a.sidebar-toggle').hide();
        // fix sidebar height
        var docHeight = document.body.clientHeight;
        var childHeight = docHeight - 260;
        $('.sidebar').attr('style', 'height:' + childHeight + 'px !important; min-height:' + childHeight + 'px !important');
    }

    // put closed tooltips in cookies
    $('.usefulTips .close').on('click', function () {
        var tipsId = $(this).parents('.usefulTips').attr('data-tips-id');
        var usefulTips = Cookies.get(tipsId);
        if (!usefulTips) {
            Cookies.set(tipsId, 'close', {expires: 180});
        }
    });

    // ПЕРЕДЕЛАТЬ ПОД РАБОТУ С RECAPTCHA!
    $('body').on('click', '.contact-form #submit', function () {
        $('form[name=contactform]').validate();
        if ($('form[name=contactform]').valid()) {
            waitingDialog.show('In progress...', {dialogSize: 'sm', progressType: 'info'});

            $("#submit").attr('disabled', true);
            $('form[name=contactform]').ajaxSubmit(function (data, statusText, xhr) {
                if (xhr.status === 200) {
                    $('form[name=contactform]').find("input[type=text], input[type=email], textarea");
                    //                    $('.contact-form .alertBlock').html('<span class="alert alert-success" >Your message was sent successfully!</span> ');
                    window.location.replace(requestUrl);
                } else {
                    $("#submit").attr('disabled', false);
                    //                    $('.contact-form .alertBlock').html('<span class="alert alert-error" >Oops! Something went wrong...</span> ');
                    window.location.replace(requestUrl);
                }
            });
        }
    });

    // Smooth scroll to the id
    function scrollToId() {
        $(function () {
            $('.scroll-to-id a[href*=#]:not([href=#])').click(function () {
                if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    if (target.length) {
                        $('html,body').animate({
                            scrollTop: target.offset().top
                        }, 1000);
                        return false;
                    }
                }
            });
        });
    }

    scrollToId();


    $('.viewType').on('click', function () {
        var route = $(this).attr('data-route');
        var viewType = $(this).attr('data-view-type');
        if (route && viewType) {
            Cookies.set('viewType_' + route, viewType, {expires: 180});
        }
    });


    $('select[name=vesselType]').on('change', function () {
        var isPropose = $(this).val() === 'propose' ? true : false;
        if (isPropose) {
            $(this).prop('selectedIndex', 0);
            var url = Routing.generate('feedback');
            openUrlInNewTab(url);
        }
    });


    $('#setReadStatusForChat').on('click', function () {
        var url = Routing.generate('_ajax_set_read_status_for_chat');
        $.post(url, [], function (data) {
            if (data.responseCode === 200) {
                $('#newChatMessageMenu').hide('slow');
            } else {
                alert('error');
            }
        });

    });


});


$(document).ready(function () {

    $(".clients-slider").slick({
        autoplay: true,
        smartSpeed: 1000,
        infinity: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: false,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        responsive: [
            {
                breakpoint: 860,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 550,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 380,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

    //** Tabs **//
    (function ($) {
        $('.tab ul.tabs').addClass('active').find('> li:eq(0)').addClass('current');
        $('.tab ul.tabs li a').click(function (g) {
            var tab = $(this).closest('.tab'),
                index = $(this).closest('li').index();
            tab.find('ul.tabs > li').removeClass('current');
            $(this).closest('li').addClass('current');
            tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').slideUp();
            tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').slideDown();
            g.preventDefault();
        });
    })(jQuery);

    /*================== COUNTER =====================*/
    $('.count').counterUp({
        delay: 10,
        time: 2000
    });

    $('.recent-vacancy__slider').slick({
        autoplay: true,
        infinite: true,
        speed: 500,
        arrows: true,
        dots: false,
        slidesToShow: 3,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        responsive: [
            {
                breakpoint: 950,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

    $('.recent-article__slider').slick({
        autoplay: true,
        infinite: true,
        speed: 500,
        arrows: true,
        dots: false,
        slidesToShow: 3,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        responsive: [
            {
                breakpoint: 950,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });


    $('.testimonial-slick').slick({
        centerMode: true,
        centerPadding: '1px',
        // autoplay: true,
        infinite: true,
        speed: 500,
        slide: 'li',
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        dots: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 900,
                settings: {
                    centerMode: true,
                    // centerPadding: '40px',
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 610,
                settings: {
                    centerMode: true,
                    // centerPadding: '40px',
                    slidesToShow: 1
                }
            }
        ]
    });

    $('.item-shot').slick({
        infinite: true,
        slidesToShow: 4,
        slide: 'li',
        slidesToScroll: 2,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            }
        ]
    });

    $('.twitter-slide').slick({
        infinite: true,
        slidesToShow: 1,
        slide: 'li',
        slidesToScroll: 1
    });

});

$(document).ready(function () {

    function setPayToSeamanMembershipBlock() {

        var membershipBlock = $('.paymentMembershipWrapper tbody');
        if (membershipBlock.length > 0) {
            var url = Routing.generate('_ajax_get_block_seaman_pay_membership');

            $.post(url, function (data) {
                if (data.responseCode === 200) {
                    $.each($('.planWrapper'), function () {
                        var prodId = $(this).attr('data-product-id');
                        var prod = data.product[prodId];
                        $(this).find('.periodTitle').html(prod.title);
                        $(this).find('.prodPrice').html(prod.price);
                        //                        $(this).find('.oldPrice').html(prod.oldPrice);
                        $(this).find('input[name=prodType]').attr('data-order-id', prod.orderId);

                    });
                } else {
                    $('.paymentMembershipWrapper').after(defaultErrorMessage);
                }
            }).error(function () {
                $('.paymentMembershipWrapper').after(defaultErrorMessage);
            });

        }
    }

    setPayToSeamanMembershipBlock();


    $('body').on('click', '.payToMembership', function () {

        var prodType = $("form[name=paymentMembershipForm] input:radio[name='prodType']:checked").val();
        var period = $("form[name=paymentMembershipForm] input:radio[name='prodType']:checked").attr("data-period");
        var orderId = $("form[name=paymentMembershipForm] input:radio[name='prodType']:checked").attr("data-order-id");

        var params = {
            prodType: prodType,
            period: period,
            orderId: orderId,
            commentForEmployer: null
        };

        var url = Routing.generate('seaman_checkout', params);
        window.location.assign(url);

    });

    // burger
    $('.burger').click(function () {
        $('.burger').toggleClass('clicked');
        $('.mobile-menu').toggleClass('show', 700);
        $('html').toggleClass('blocked');
    });


    $('.btn-mobile-filter').click(function () {
        $('.page-content__top-info').toggleClass('show', 700);
        // $('html').toggleClass('blocked');
    });

    $(document).mouseup(function (e) { // событие клика по веб-документу
        var div = $(".page-content__top-info"); // тут указываем ID элемента
        if (!div.is(e.target) // если клик был не по нашему блоку
            && div.has(e.target).length === 0 && div.siblings('.btn-mobile-filter')) { // и не по его дочерним элементам
            div.removeClass('show', 700); // скрываем его
        }
    });

    if ($(window).width() < 560) {
        $('.label-wrapper .box .select-wrapper select, .label-wrapper .box .select-wrapper label').unwrap('.select-wrapper');
    }


    // select = input show
    $('#register-select').change(function () {
        if ($(this).val() === "company" || $(this).val() === "shipowner") {
            $(".label-hidden").css("display", "block");
            $('#info-company').fadeIn();
            $('#info-seaman').fadeOut();
        } else {
            $(".label-hidden").css("display", "none");
            $('#info-company').fadeOut();
            $('#info-seaman').fadeIn();
        }
    });

});

$(document).ready(function () {
    $(".counter").countTo({
        speed: 4E3, refreshInterval: 60, formatter: function (value, options) {
            return value.toFixed(options.decimals)
        }
    });
    if ($(".animated")[0])
        $(".animated").css("opacity", "0");
    $(".triggerAnimation").waypoint(function () {
        var animation = $(this).attr("data-animate");
        $(this).css("opacity", "");
        $(this).addClass("animated " + animation)
    }, {offset: "80%", triggerOnce: true})


    $('.panel_heading .block_title').click(function () {
        $(this).toggleClass('in').next().slideToggle();
        $('.panel_heading .block_title').not(this).removeClass('in').next().slideUp();
    });

    $('.checkbox-list > li > .btn-arrow').click(function () {
        $(this).toggleClass('in').next('.dropdown-checkbox').slideToggle();
    });
});


$(document).ready(function () {
    var overlay = $('#overlay');
    var open_modal = $('.open_modal');
    var close = $('.modal_close, #overlay');
    var modal = $('.modal_div');

    open_modal.click(function (event) {
        event.preventDefault();
        var div = $(this).attr('href');
        overlay.fadeIn(400,
            function () {
                $(div)
                    .css('display', 'flex')
                    .animate({
                        opacity: 1,
                        top: '50%'
                    }, 200);
            });
    });

    close.click(function () {
        modal
            .animate({
                    opacity: 0,
                    top: '45%'
                }, 200,
                function () {
                    $(this).css('display', 'none');
                    overlay.fadeOut(400);
                }
            );
    });


});

$(document).ready(function () {

    $('.slider-range1').slider({
        range: true,
        min: 0,
        max: 100000,
        values: [0, 0],
        classes: {
            "ui-slider-handle": "ui-corner-all"
        },
        slide: function (event, ui) {
            //Поле минимального значения
            $(".dec1").val(ui.values[0] + '$');
            //Поле максимального значения
            $(".dec2").val(ui.values[1] + '$');
        }
    });

    $(".dec1").val($(".slider-range1").slider("value"));
    $(".dec2").val($(".slider-range1").slider("value"));

    $('.slider-range2').slider({
        range: true,
        min: 18,
        max: 100,
        values: [0, 0],
        classes: {
            "ui-slider-handle": "ui-corner-all"
        },
        slide: function (event, ui) {
            //Поле минимального значения
            $(".dec3").val(ui.values[0]);
            //Поле максимального значения
            $(".dec4").val(ui.values[1]);
        }
    });

    $(".dec3").val($(".slider-range2").slider("value"));
    $(".dec4").val($(".slider-range2").slider("value"));


    $(':input').keyup(function(){
        $(this).siblings('.ajax-icon').fadeIn();
    });
});

function initDatepicker() {

    $.datepicker.regional['ru'] = {
        closeText: 'Закрыть',
        prevText: '&#x3c;Пред',
        nextText: 'След&#x3e;',
        currentText: 'Сегодня',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        weekHeader: 'Нед',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['ru']);


    $(".datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "1960:2050"
    });


}

initDatepicker();


$(document).ready(function () {

    var clock = $('.clock').FlipClock({
        clockFace: 'HourlyCounter',
        autoStart: false,
        callbacks: {
            stop: function() {
                setTimeout(function(){location.reload();}, 8000); // reload current page
            }
        }
    });

    clock.setTime(38266);
    clock.setCountdown(true);
    clock.start();

});
