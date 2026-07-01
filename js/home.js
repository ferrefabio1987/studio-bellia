jQuery(window).on('load', function() {
    checkCookiePolicy();

    openServices('.round_top');
    openServices('.round_top_left');
    openServices('.round_top_right');
    openServices('.round_right');
    openServices('.round_left');
    openServices('.round_bottom_right');
    openServices('.round_bottom_left');
    openServices('.round_bottom');

    openMenuMobile();

    clickCookie();
});

// init cookie

function removeStorage(name) {
    try {
        localStorage.removeItem(name);
        localStorage.removeItem(name + '_expiresIn');
    } catch(e) {
        console.log('removeStorage: Error removing key ['+ key + '] from localStorage: ' + JSON.stringify(e) );
        return false;
    }
    return true;
}

function getStorage(key) {
    var now = Date.now();
    var expiresIn = localStorage.getItem(key+'_expiresIn');
    if (expiresIn===undefined || expiresIn===null) { expiresIn = 0; }

    if (expiresIn < now) {// Expired
        removeStorage(key);
        return null;
    } else {
        try {
            var value = localStorage.getItem(key);
            return value;
        } catch(e) {
            console.log('getStorage: Error reading key ['+ key + '] from localStorage: ' + JSON.stringify(e) );
            return null;
        }
    }
}

function setStorage(key, value) {
    var now = Date.now();
    var schedule = now + 365*1000; 
    try {
        localStorage.setItem(key, value);
        localStorage.setItem(key + '_expiresIn', schedule);
    } catch(e) {
        console.log('setStorage: Error setting key ['+ key + '] in localStorage: ' + JSON.stringify(e) );
        return false;
    }
    return true;
}

function checkCookiePolicy() {
    var myCookie = getStorage("cookie-policy");

    if (myCookie == null) {
        jQuery('#cookiePolicy').show();
    } else {
        jQuery('#cookiePolicy').hide();
    }
}

/**
 * cookie value
 * 1: click on #cookiePolicy
 * 2: click on Accept cookie
 * 3: clic on Refuses cookie
 */
function clickCookie() {
    jQuery( "#cookiePolicy" ).click(function(e) {
        e.preventDefault();
        setStorage('cookie-policy', 1);
        checkCookiePolicy();
    })

    jQuery("#acceptCookie").click(function(e) {
        e.preventDefault();
        setStorage('cookie-policy', 2)
        checkCookiePolicy()
    })

    jQuery("#refusesCookie").click(function(e) {
        e.preventDefault();
        setStorage('cookie-policy', 3)
        checkCookiePolicy()
    })
}

// finish cookie

function openServices(classes) {
    jQuery(document).on('click', classes, function() {
        var title = jQuery(classes).attr('data-title');
        var text = jQuery(classes).attr('data-text');

        jQuery('.show_info_service').animate({ scrollTop: 0 }, 50);

        if (jQuery('.show_info_service.hide').length > 0) {
            jQuery('.show_info_service').removeClass('hide');

            jQuery(window).on('scroll', function(e) {
                if((jQuery('#services').offset().top > jQuery(this).scrollTop()) || (jQuery(this).scrollTop() > jQuery('#doctors').offset().top - 150)) {
                    jQuery('.show_info_service').addClass('hide');
                    jQuery(window).unbind('scroll');
                }
            });
        } else {
            if (title.indexOf(jQuery('.show_info_service h4').html()) > -1) jQuery('.show_info_service').addClass('hide');
        }

        jQuery('.show_info_service h4').html(title);
        jQuery('.show_info_service p').html(text);
    });

    jQuery(document).on('click', '.close_info_service', function() {
        jQuery('.show_info_service').addClass('hide');
    });
}

function openMenuMobile() {
    jQuery(document).on('click', '#openMenuMobile', function() {
        var menu = '';
        if(jQuery('.menu_open').length > 0) {
            jQuery('.menu_open').remove();
        } else {
            jQuery('#menu-main-menu li').each(function() {
                menu += '<div class="element_menu">' + jQuery(this).html() + '</div>';
            });
            jQuery('body').append('<div class="menu_open">' +  menu + '</div>');
        }
    });

    jQuery(document).on('click', '.menu_open a', function() {
        jQuery('.menu_open').remove();
    });
}