//= components/swiper.js
//= components/simple-lightbox.js
//= components/jquery.validate.js
// components/validate.js

$.fn.removeStyle = function(style) {
    var search = new RegExp(style + '[^;]+;?', 'g');
    return this.each(function() {
        $(this).attr('style', function(i, style)
        {
            return style.replace(search, '');
        });
    });
};

function showPopup(parent, children, close, speed, display) {
    if(display == '') {
        $(children).fadeIn(speed);
    } else {
        $(children).fadeIn(speed).css("display",display);
    }
    $(parent).fadeIn(speed).addClass('show');
    $('body').addClass('hidden');
    var closePopup = $(children).find(close);

    $(closePopup).on('click', function() {
        $('body').removeClass('hidden');
        $(parent).fadeOut(speed).removeClass('show');
        $(children).fadeOut(speed);
    });
}

function formInput(param) {
    $(param).on('focus', function () {
        $(this).parent().addClass('send');
    }).blur(function () {
        if ($(this).val() == '') {
            $(this).parent().removeClass('send');
        }
    });
}

function clickArea() {
    var key = window.event.keyCode;

    if (key == 13) {
        $()
    }
    else {
        return true;
    }
}

$(document).ready(function () {
    clickArea();

    $('.fm_area').on('submit', function () {

    });

    /*var swiper = new Swiper('.largeSlide', {
        pagination: '.l_pagination',
        autoplay: 7000,
        paginationClickable: true
    });

    var swiper = new Swiper('.smallSlide', {
        pagination: '.s_pagination',
        autoplay: 7000,
        effect: 'fade',
        speed: 200,
        paginationClickable: true
    });

    var swiper = new Swiper('.newsSlide', {
        pagination: '.n_pagination',
        nextButton: '.arrow_next',
        prevButton: '.arrow_prev',
        autoplay: 2000,
        slidesPerView: 4,
        //centeredSlides: true,
        paginationClickable: true,
        spaceBetween: 20,
        breakpoints: {
            630: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            650: {
                slidesPerView: 2
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            991: {
                spaceBetween: 20
            },
            1023: {
                slidesPerView: 3,
                spaceBetween: 10

            },
            1277: {
                slidesPerView: 3,
                spaceBetween: 20
            }
        }
    });*/
    // slide cf_first


    // $('.menu_toggle').on('click', function() {
    //     var menuWidth = $('.nav_mobile').outerWidth();
    //
    //     $(this).toggleClass('toggled');
    //
    //     if ($(this).is('.toggled')) {
    //         $('html, body').css({overflow:'hidden'});
    //         $('.contFluid').css({
    //             "-webkit-transform": "translateX(" + menuWidth + "px)",
    //             "-moz-transform": "translateX(" + menuWidth + "px)",
    //             "-ms-transform": "translateX(" + menuWidth + "px)",
    //             "-o-transform": "translateX(" + menuWidth + "px)",
    //             "transform": "translateX(" + menuWidth + "px)"
    //         });
    //     } else {
    //         $('html, body').css({overflow:'visible'});
    //
    //         $('.contFluid').css({
    //             "-webkit-transform": "translateX(0px)",
    //             "-moz-transform": "translateX(0px)",
    //             "-ms-transform": "translateX(0px)",
    //             "-o-transform": "translateX(0px)",
    //             "transform": "translateX(0px)"
    //         });
    //         $('.contFluid').removeStyle('transform');
    //     }
    // });
    // //show mobile menu


    // $('.list_photo a').simpleLightbox();
    // $('.boxGallery a').simpleLightbox();
    // //END PLUGIN GALLERY

    // var heightHeader = $('.header').outerHeight();
    // var heightNav = $('.nav').outerHeight();
    // var commonHeight = heightHeader + heightNav;
    //
    // $(window).bind('resize', function () {
    //     heightHeader = $('.header').outerHeight();
    //     heightNav = $('.nav').outerHeight();
    //     commonHeight = heightHeader + heightNav;
    // });
    //
    // $(window).bind('scroll', function () {
    //     if ($(window).scrollTop() > commonHeight) {
    //         $('body').addClass('menuFixed');
    //     } else if($(window).scrollTop() < heightHeader) {
    //         $('body').removeClass('menuFixed');
    //     }
    // });




    function textError(input, text) {
        $(input).parent().addClass('errors').find('.error').text(text);
    }

    function removeError(input, text) {
        $(input).parent().removeClass('errors').find('.error').text(text);
    } 
    
    $('.rb_login .btn.login').on('click', function(event) {
        event.preventDefault();
        var email = $('.email_login');
        var password = $('.password_login');

        if (email.val() == '') {
            textError(email, 'Поле обязательно для заполнения');
        } else {
            removeError(email, '');
        }
        
        if (password.val() == '') {
            textError(password, 'Поле обязательно для заполнения');
        } else {
            removeError(password, '');
        }

        if (email.val() != '' && password.val() != '') {
            window.location.replace("/login?email=" + email.val());
        }
    });
    
    $('.rb_signup .btn.signup').on('click', function (event) {

        var name = $('.name_signup');
        var surname = $('.surname_signup');
        var email = $('.email_signup');
        var password = $('.password_signup');
        var regCheck = email.val().match(/[^@]+@[^@\.]+\.[^@]+/);

        if (name.val() == '') {
            textError(name, 'Поле обязательно для заполнения');
        } else {
            removeError(name, '');
        }

        if (surname.val() == '') {
            textError(surname, 'Поле обязательно для заполнения');
        } else {
            removeError(surname, '');
        }
        
        if (email.val() == '') {
            textError(email, 'Поле обязательно для заполнения');
        } else if (!regCheck) {
            textError(email, 'Некорректный E-Mail');
        } else {
            removeError(email, '');
        }
        
        if (password.val() == '') {
            textError(password, 'Поле обязательно для заполнения');
        } else {
            removeError(password, '');
        }

        if (email.val() == '' || !regCheck || password.val() == '') {
            event.preventDefault();
        }
    });
    
}); //END READY
