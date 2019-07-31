let wheel_opened = false;
$(function () {
    if ($(window).width() > 768 && !$('.fw-wrap').hasClass('noauto')) {
        setTimeout(function () {
            openWheel('auto');
        }, 10000);
    }
    $('.fw-wrap').on('click', function (event) {
        if ($(event.target).hasClass('fw-wrap')) {
            event.preventDefault();
            closeWheel('noauto', 1);
        }
    });
    $('.fw-wrap .fw-close').on('click', function (event) {
        event.preventDefault();
        closeWheel('hide', 7);
    });
    $('.fw-wrap .fw-pull-out-btn').on('click', function (event) {
        event.preventDefault();
        if ($('.fw-wrap').hasClass('fw-closed') || $('.fw-wrap').hasClass('fw-hidden')) {
            openWheel();
        } else {
            closeWheel('noauto', 1);
        }
    });
    $('.fw-form-wrap form').validate({
        errorElement: 'span',
        rules: {'form[email]': {required: true, email: true}, confidence: "required"},
        messages: {
            'form[email]': {required: "Укажите свой email", email: "Похоже, в email ошибка"},
            confidence: "Чтобы продолжить, отметьте галочку"
        },
        submitHandler: function (form) {
            var form = $(form);
            $.post('/fortunewheel/', form.serializeArray(), function (response) {
                if (response) {
                    response = JSON.parse(response);
                    $('.fw-prize-title').text(response.title);
                    $('.fw-prize-content').html(response.content);
                    $('.fw-prize-btn').attr('href', 'https://go.1ps.ru/promo/?fm_promocode=' + response.promo + '&email=' + response.email);
                    rotateWheel(parseInt(response.num));
                    setCookiesWheel('hide', 365);
                    yaCounter36235.reachGoal('fortune_wheel_played');
                }
            });
        }
    });
});

function rotateWheel(num) {
    let rotate_angle = 720 - 30 * num;
    $(".fw-wrap .fw-wheel-rotate").css({
        "-webkit-transform": "rotate(" + rotate_angle + "deg)",
        "-moz-transform": "rotate(" + rotate_angle + "deg)",
        "-ms-transform": "rotate(" + rotate_angle + "deg)",
        "-o-transform": "rotate(" + rotate_angle + "deg)",
        transform: "rotate(" + rotate_angle + "deg)"
    });
    $('.fw-form-wrap-inner').fadeOut(600);
    setTimeout(function () {
        $('.fw-form-wrap-result').fadeIn(400);
    }, 2600);
}

function openWheel(type) {
    type = type || '';
    if (type == 'auto' && wheel_opened) return false;
    if (type == 'auto' && $('.fw-wrap').hasClass('postponed')) {
        setTimeout(function () {
            $('.fw-wrap').removeClass('postponed');
            openWheel('auto');
        }, 10000);
        return false;
    }
    $('.fw-wrap').removeClass('fw-hidden');
    $('.fw-wrap .fw-panel-wrap .fw-panel .fw-wheel-wrap .fw-wheel-rotate').addClass('opened');
    wheel_opened = true;
    setCookiesWheel('noauto', 1);
    // yaCounter36235.reachGoal('fortune_wheel_opened');
}

function closeWheel(name, days) {
    name = name || '';
    days = days || 0;
    $('.fw-wrap').addClass('fw-closed');
    setTimeout(function () {
        $('.fw-wrap').addClass('fw-hidden').removeClass('fw-closed');
        $('.fw-wrap .fw-panel-wrap .fw-panel .fw-wheel-wrap .fw-wheel-rotate').removeClass('opened');
        if (days > 1) {
            $('.fw-wrap .fw-pull-out-btn-wrap').hide();
        }
    }, 600);
    if (name && days) {
        setCookiesWheel(name, days);
    }
}

function setCookiesWheel(name, days) {
    name = name || '';
    days = parseInt(days);
    if (days < 1) days = 15;
    var expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    expires = expires.toGMTString();
    document.cookie = "fwheel_" + name + "=1; expires=" + expires + "; path=/; domain=1ps.ru;";
}