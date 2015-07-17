
$(document).ready(function () {
    var windowHeight = $(window).height();
    var magicScrollOffset = $('#magic-scroll-container').offset();
    var indexTarget = null;
    var cacheScrollPosition = null;
    var lockAnimation = false;
    $(window).resize(function (e) {
        windowHeight = $(window).height();
        magicScrollOffset = $('#magic-scroll-container').offset();
    });

    //jQuery to collapse the navbar on scroll
    $(window).scroll(function() {
        if ($(".navbar").offset().top > 50) {
            $(".navbar-fixed-top").addClass("top-nav-collapse");
        } else {
            $(".navbar-fixed-top").removeClass("top-nav-collapse");
        }

        //SCROLL DISABLER
        var keys = {37: 1, 38: 1, 39: 1, 40: 1};

        var preventDefault = function(e) {
            e = e || window.event;
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;
        }

        var preventDefaultForScrollKeys = function (e) {
            if (keys[e.keyCode]) {
                preventDefault(e);
                return false;
            }
        }

        var disableScroll = function () {
            if (window.addEventListener) // older FF
                window.addEventListener('DOMMouseScroll', preventDefault, false);
            window.onwheel = preventDefault; // modern standard
            window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
            window.ontouchmove  = preventDefault; // mobile
            document.onkeydown  = preventDefaultForScrollKeys;
        }

        var enableScroll = function () {
            if (window.removeEventListener)
                window.removeEventListener('DOMMouseScroll', preventDefault, false);
            window.onmousewheel = document.onmousewheel = null;
            window.onwheel = null;
            window.ontouchmove = null;
            document.onkeydown = null;
        }
        //END DISABLER

        var isScrollViewInsideElement = function ($windowScrollTop, $element) {
            var $elementOffset = $element.offset();
            return ($windowScrollTop > $elementOffset.top && ($windowScrollTop + windowHeight) < ($elementOffset.top + $element.height()))
        }


        var animateToElement = function ($element) {
            disableScroll();
            lockAnimation = true;
            setTimeout(function() {
                lockAnimation = false;
                enableScroll();
            }, 1000);
            $('html, body').stop().animate({
                scrollTop: $element.offset().top
            }, 1000, 'easeInOutExpo');
        };

        var arrayTargets = [$("#luxe"), $("#avance"), $("#standard")];
        var $magicContainer = $('#magic-scroll-container');
        var windowScrollTop = $(window).scrollTop();
        if (cacheScrollPosition == null) cacheScrollPosition = windowScrollTop;
        var carousel;
        if (isScrollViewInsideElement(windowScrollTop, $magicContainer) && !lockAnimation) {
            for (var i = 0, lengthTargets = arrayTargets.length; i < lengthTargets; i++) {
                carousel = arrayTargets[i];
                if (cacheScrollPosition < windowScrollTop) {
                    if (windowScrollTop > carousel.offset().top + 30 && !isScrollViewInsideElement(windowScrollTop, carousel) && arrayTargets[i+1] && windowScrollTop < arrayTargets[i+1].offset().top) {
                        animateToElement(arrayTargets[i+1]);
                        indexTarget = i+1;
                    }
                } else {
                    if (windowScrollTop < carousel.offset().top - 30 && !isScrollViewInsideElement(windowScrollTop, carousel) && arrayTargets[i-1] && windowScrollTop > arrayTargets[i-1].offset().top) {
                        animateToElement(arrayTargets[i-1]);
                        indexTarget = i-1;
                    }
                }

            }
        }
        cacheScrollPosition = windowScrollTop;

    });

//jQuery for page scrolling feature - requires jQuery Easing plugin
    $(function() {
        $('a.page-scroll').bind('click', function(event) {
            lockAnimation = true;
            setTimeout(function() {
                lockAnimation = false;
            }, 1000);
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });
    });

    $('.carousel').carousel({
        interval: false
    });
})
