/* global window */
/* global document */
/* global jQuery */
/* global g1 */
/* global bimber_front_config */
/* global bimber_front_microshare */
/* global SuperGif */
/* global Waypoint */
/* global enquire */
/* global mashsb */
/* global auto_load_next_post_params */
/* global FB */
/* global mejs */
/* global ga */
/* global embedly */
/* global console */

/*************
 *
 * Init env
 *
 *************/

(function($) {
    'use strict';

    var config = $.parseJSON(bimber_front_config);

    // namespace
    var g1 = {
        'config': config
    };

    g1.getWindowWidth = function () {
        if (typeof window.innerWidth !== 'undefined') {
            return window.innerWidth;
        }

        return $(window).width();
    };

    g1.isDesktopDevice = function () {
        return g1.getWindowWidth() > g1.getDesktopBreakpoint();
    };

    g1.getDesktopBreakpoint = function () {
        var desktopBreakPoint = $('#g1-breakpoint-desktop').css('min-width');

        if ( ! desktopBreakPoint ) {
            return 9999;
        }

        desktopBreakPoint = parseInt( desktopBreakPoint, 10 );

        // not set explicitly via css
        if (desktopBreakPoint === 0) {
            return 9999;
        }

        return desktopBreakPoint;
    };

    g1.isTouchDevice = function () {
        return ('ontouchstart' in window) || navigator.msMaxTouchPoints;
    };

    g1.isStickySupported = function () {
        var prefixes = ['', '-webkit-', '-moz-', '-ms-'];
        var block = document.createElement('div');
        var supported = false;
        var i;

        // Test for native support.
        for (i = prefixes.length - 1; i >= 0; i--) {
            try {
                block.style.position = prefixes[i] + 'sticky';
            }
            catch(e) {}
            if (block.style.position !== '') {
                supported = true;
            }
        }

        return supported;
    };

    g1.isRTL = function () {
        return $('body').is('.rtl');
    };

    g1.log = function(data) {
        if (window.bimberDebugMode && typeof console !== 'undefined') {
            console.log(data);
        }
    };

    g1.createCookie = function (name,value,time) {
        var expires;

        if (time) {
            var date = new Date();
            var ms = time;

            if (typeof time === 'object') {
                ms = time.value;

                switch (time.type) {
                    case 'days':
                        ms = ms * 24 * 60 * 60 * 1000;
                        break;
                }
            }

            date.setTime(date.getTime() + ms);
            expires = '; expires=' + date.toGMTString();
        }
        else {
            expires = '';
        }

        document.cookie = name + '=' + value + expires + '; path=/';
    }

	g1.readCookie = function (name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');

        for(var i = 0; i < ca.length; i += 1) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1,c.length);
            }

            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length,c.length);
            }
        }

        return null;
    }

	g1.removeCookie = function (name) {
        createCookie(name, '', -1);
    }

    // expose to the world
    window.g1 = g1;
})(jQuery);


/**************************
 *
 * document ready functions
 *
 *************************/

(function ($) {

    'use strict';

    $(document).ready(function () {
        g1.uiHelpers();

        if (g1.config.timeago === 'on') {
            g1.dateToTimeago();
        }

        g1.backToTop();
        g1.loadMoreButton();
        g1.infiniteScroll();
        g1.gifPlayer();
        g1.featuredEntries();
        g1.shareContentElements();
        g1.customShareButtons();
        g1.customizeShareButtons();
        g1.bpProfileNav();

        if (g1.config.sharebar === 'on') {
            g1.shareBar();
        }

        g1.stickyPosition();
        g1.droppableElements();
        g1.canvas();
        g1.ajaxSearch();
        g1.isotope();
        g1.comments();
        g1.snax();
        g1.mediaAce();

        g1.loadNextPost();
        g1.autoPlayVideo();
        g1.myCredNotifications();
        g1.archiveFilters();
        g1.popup();
        g1.slideup();
    });

    $(window).load(function () {
        g1.stickySidebar();
        g1.mp4Player();
    });

})(jQuery);


/*************
 *
 * UI Helpers
 *
 ************/

(function ($) {

    'use strict';

    g1.uiHelpers = function () {
        if (g1.isTouchDevice()) {
            $('body').removeClass( 'g1-hoverable' );
        }

        // Add class to Mailchimp widget.
        var mc4wpBackgroundClasses = [
            'g1-box-background'
        ];

        if ('original-2018' === g1.config.stack) {
            mc4wpBackgroundClasses.push('g1-current-background');
        }

        $('.widget_mc4wp_form_widget').
            addClass( 'g1-box g1-newsletter').
            prepend('<i class="g1-box-icon"></i>').
            append('<div class="' + mc4wpBackgroundClasses.join(' ') + '"></div>');

        // Focus on search input field.
        $('.g1-drop-the-search').on('click', '.g1-drop-toggle', function (e) {
            e.preventDefault();

           $('.g1-drop-the-search input.search-field').focus();
        });

        $('.search-submit').on('click', function(e){
            var $form = $(this).closest('form');
            var $input = $('input.search-field', $form);
            if ( ! $input.val()){
               e.preventDefault();
            }
        });
    };

})(jQuery);


/****************
 *
 * Back to top
 *
 ****************/

(function ($) {

    'use strict';

    g1.backToTop = function () {
        var $scrollToTop = $('.g1-back-to-top');

        // init
        toggleVisibility($scrollToTop);

        $scrollToTop.on('click', function (e) {
            e.preventDefault();

            var multipier = 200;
            var durationRange = {
                min: 200,
                max: 1000
            };

            var winHeight = $(window).height();
            var docHeight = $(document).height();
            var proportion = Math.floor(docHeight / winHeight);

            var duration = proportion * multipier;

            if (duration < durationRange.min) {
                duration = durationRange.min;
            }

            if (duration > durationRange.max) {
                duration = durationRange.max;
            }

            $('html, body').animate({
                scrollTop: 0
            }, duration);
        });

        $(window).scroll(function() {
            window.requestAnimationFrame(function () {
                toggleVisibility($scrollToTop);
            });
        });
    };

    function toggleVisibility ($scrollToTop) {
        if ($(window).scrollTop() > 240) {
            $scrollToTop.addClass('g1-back-to-top-on').removeClass('g1-back-to-top-off');
        } else {
            $scrollToTop.addClass('g1-back-to-top-off').removeClass('g1-back-to-top-on');
        }
    }
})(jQuery);


/********************
 *
 * Load More Button
 *
 ********************/

(function ($) {

    'use strict';

    // prevent triggering the action more than once at the time
    var loading = false;
    var startingUrl = window.location.href;
    var setTargetBlank = g1.setTargetBlank;
    var useWaypoints = g1.useWaypoints;

    g1.loadMoreButton = function () {
        $('.g1-load-more').on('click', function (e) {
            if (loading) {
                return;
            }

            loading = true;

            e.preventDefault();

            var $button = $(this);
            var $collectionMore = $button.parents('.g1-collection-more');
            var url = $button.attr('data-g1-next-page-url');
            var $endMessage = $('.g1-pagination-end');

            $collectionMore.addClass('g1-collection-more-loading');

            // load page
            var xhr = $.get(url);

            // on success
            xhr.done(function (data) {
                var collectionSelector = '#primary > .g1-collection .g1-collection-items';

                // find elements in response
                var $resCollectionItems = $(data).find(collectionSelector).find('.g1-collection-item');
                var $resButton = $(data).find('.g1-load-more');

                // find collection on page
                var $collection = $(collectionSelector);

                // add extra classes to new loaded items
                $resCollectionItems.addClass('g1-collection-item-added');

                // If there are insta embeds BEFORE the load, we will force to refresh them AFTER the load
                var $insta = $('script[src="//platform.instagram.com/en_US/embeds.js"]');

                // make sure that mejs is loaded
                if (typeof window.wp.mediaelement === 'undefined') {
                    var matches = data.match(/<script(.|\n)*?<\/script>/g);
                    var mejsCode = '';
                    matches.forEach(function( match ) {
                        if ( match.indexOf('mejs') > 0 || match.indexOf('mediaelement') > 0 ){
                            match = match.replace('<script','<script async');
                            mejsCode+=match;
                        }
                    });
                    matches = data.match(/<link(.|\n)*?\/>/g);
                    matches.forEach(function( match ) {
                        if ( match.indexOf('mejs') > 0 || match.indexOf('mediaelement') > 0 ){
                            mejsCode+=match;
                        }
                    });
                    $collection.after(mejsCode);
                }
                if (setTargetBlank) {
                    $('a',$resCollectionItems).attr('target','_blank');
                }

                var $collection_waypoint = '<span class="bimber-collection-waypoint" data-bimber-archive-url="' + url + '"></span>';
                $collection.append($collection_waypoint);
                // add new elements to collection
                $collection.append($resCollectionItems);


                if ( $insta.length > 0) {
                    window.instgrm.Embeds.process();
                }

                if (typeof window.wp.mediaelement !== 'undefined') {
                    window.wp.mediaelement.initialize();
                }

                // load all dependent functions
                $('body').trigger( 'g1PageHeightChanged' );
                $('body').trigger( 'g1NewContentLoaded', [ $resCollectionItems ] );

                // update more button
                if ($resButton.length > 0) {
                    $button.attr('data-g1-next-page-url', $resButton.attr('data-g1-next-page-url'));
                } else {
                    $collectionMore.remove();
                }

                //bind auto play video events
                g1.autoPlayVideo();
                if ( useWaypoints ){
                    $('.bimber-collection-waypoint').waypoint(function(direction) {
                        var $waypoint = $(this.element);
                        if('up' === direction) {
                            var $waypointUp = $waypoint.prevAll('.bimber-collection-waypoint');
                            if ($waypointUp.length > 0){
                                $waypoint = $($waypointUp[0]);
                            } else {
                                window.history.replaceState( {} , '', startingUrl );
                                return;
                            }
                        }
                        var waypointUrl = $waypoint.attr('data-bimber-archive-url');
                        var currentUrl = window.location.href;
                        if ( waypointUrl !== currentUrl ){
                            window.history.replaceState( {} , '', waypointUrl );
                        }
                    }, {
                        offset: '-5%'
                    });
                }
            });

            xhr.fail(function () {
                $button.addClass('g1-info-error');
                $button.remove();
                $endMessage.show();
            });

            xhr.always(function () {
                $collectionMore.removeClass('g1-collection-more-loading');
                loading = false;
            });
        });
    };

})(jQuery);


/*******************
 *
 * Infinite scroll
 *
 ******************/

(function ($) {

    'use strict';

    g1.infiniteScrollConfig = {
        'offset': '150%'
    };

    var triggeredByClick = false;

    g1.infiniteScroll = function () {
        $('.g1-collection-more.infinite-scroll').each(function () {
            var $this = $(this);

            if ($this.is('.on-demand') && !triggeredByClick) {
                return false;
            }

            $this.waypoint(function(direction) {
                if('down' === direction) {
                    $this.find('.g1-load-more').trigger('click');
                }
            }, {
                // trigger when the "Load More" container is 10% under the browser window
                offset: g1.infiniteScrollConfig.offset
            });
        });
    };

    // wait for new content and apply infinite scroll events to it
    $('body').on( 'g1NewContentLoaded', function () {
        triggeredByClick = true;
        g1.infiniteScroll();
    } );

})(jQuery);


/*************
 *
 * GIF Player
 *
 *************/

(function ($) {

    'use strict';

    g1.gifPlayer = function ($scope) {
        if (! $scope ) {
            $scope = $('body');
        }

        // SuperGif library depends on the overrideMimeType method of the XMLHttpRequest object
        // if browser doesn't support this method, we can't use that library
        if ( typeof XMLHttpRequest.prototype.overrideMimeType === 'undefined' ) {
            return;
        }

        g1.gifPlayerIncludeSelectors =[
            '.entry-content img.aligncenter[src$=".gif"]',
            '.entry-content .aligncenter img[src$=".gif"]',
            'img.g1-enable-gif-player',
            '.entry-featured-media img[src$=".gif"]'
        ];

        g1.gifPlayerExcludeSelectors = [
            '.ajax-loader',             // for Contact Form 7
            '.g1-disable-gif-player'
        ];

        $( g1.gifPlayerIncludeSelectors.join(','), $scope ).not( g1.gifPlayerExcludeSelectors.join(',') ).each(function () {
            var $img = $(this);
            var imgClasses = $img.attr('class');
            var imgSrc = $img.attr('src');

            // Check only absolute paths. Relative paths, by nature, are from the same domain.
            if (-1 !== imgSrc.indexOf('http')) {
                // Only locally stored gifs, unless user decided otherwise.
                if (imgSrc.indexOf(location.hostname) === -1 && !$img.is('.g1-enable-gif-player')) {
                    return;
                }
            }

            var gifObj = new SuperGif({
                gif: this,
                auto_play: 0
            });

            var $gitIndicator = $('<span class="g1-indicator-gif g1-loading">');

            gifObj.load(function() {
                var frames = gifObj.get_length();

                var $canvasWrapper = $(gifObj.get_canvas()).parent();

                // Only for animated gifs.
                if (frames > 1) {
                    var isPlaying = false;

                    var playGif = function() {
                        gifObj.play();
                        isPlaying = true;
                        $gitIndicator.addClass('g1-indicator-gif-playing');
                    };

                    var pauseGif = function() {
                        gifObj.pause();
                        isPlaying = false;
                        $gitIndicator.removeClass('g1-indicator-gif-playing');
                    };

                    if (!g1.isTouchDevice()) {
                        $canvasWrapper.on('click', function(e) {
                            // Prevent redirecting to single post.
                            e.preventDefault();

                            if (isPlaying) {
                                pauseGif();
                            } else {
                                playGif();
                            }
                        });
                    } else {
                        $canvasWrapper.on('hover', function() {
                            playGif();
                        });
                    }

                    // API.
                    $canvasWrapper.on('bimberPlayGif', playGif);
                    $canvasWrapper.on('bimberPauseGif', pauseGif);

                    $gitIndicator.toggleClass('g1-loading g1-loaded');

                    $(document).trigger('bimberGifPlayerLoaded', [$canvasWrapper]);
                } else {
                    // It's just a gif type image, not animation to play.
                    $gitIndicator.remove();
                }
            });

            // canvas parent can be fetched after gifObj.load() call
            var $canvasWrapper = $(gifObj.get_canvas()).parent();

            $canvasWrapper.
                addClass(imgClasses + ' g1-enable-share-links').
                attr('data-img-src', imgSrc).
                append($gitIndicator);
        });
    };

})(jQuery);


/*************
 *
 * MP4 Player
 *
 *************/

(function ($) {

    'use strict';

    g1.mp4Player = function () {
        // We depend on mediaelement.js
        if ( typeof mejs === 'undefined' ) {
            return;
        }

        g1.mp4PlayerIncludeSelectors =[
            '.entry-content .mace-video',
            '.entry-featured-media .mace-video',
            '.g1-enable-mp4-player'
        ];

        g1.mp4PlayerExcludeSelectors = [
            '.g1-disable-mp4-player'
        ];

        $( g1.mp4PlayerIncludeSelectors.join(',') ).not( g1.mp4PlayerExcludeSelectors.join(',') ).each(function () {
            var $video = $(this);
            var $mejsContainer = $video.parents('.mejs-container');
            var playerId;
            var player;

            // Hide controls.
            $mejsContainer.find('.mejs-controls').remove();

            // Set up player.
            $video.attr('loop', 'true');

            $mejsContainer.hover(
                // In.
                function() {
                    // Get player on first access.
                    if (!player) {
                        playerId = $mejsContainer.attr('id');
                        player   = mejs.players[playerId];
                    }

                    // Player loaded?
                    if (player) {
                        player.play();
                    }
                },
                // Out.
                function() {}
            );
        });
    };

})(jQuery);

/*******************
 *
 * Featured Entries
 *
 ******************/

(function ($) {

    'use strict';

    var selectors = {
        'wrapper':  '.g1-featured',
        'items':    '.g1-featured-items',
        'item':     '.g1-featured-item',
        'prevLink': '.g1-featured-arrow-prev',
        'nextLink': '.g1-featured-arrow-next'
    };

    var classes = {
        'startPos': 'g1-featured-viewport-start',
        'endPos':   'g1-featured-viewport-end',
        'noArrows':  'g1-featured-viewport-no-overflow'
    };

    var isRTL;
    var $wrapper;   // main wrapper
    var $items;     // items wrapper, is scrollable
    var $prevLink;  // move collection left
    var $nextLink;  // move collection right

    // public
    g1.featuredEntries = function () {
        isRTL = g1.isRTL();

        $(selectors.wrapper).each(function () {
            $wrapper = $(this);
            $items = $wrapper.find(selectors.items);
            $prevLink = $wrapper.find(selectors.prevLink);
            $nextLink = $wrapper.find(selectors.nextLink);

            var singleItemWidth = $items.find(selectors.item + ':first').width();
            var moveOffset = 2 * singleItemWidth;
            var direction = isRTL ? -1 : 1;

            $prevLink.on('click', function (e) {
                e.preventDefault();

                scrollHorizontally(-direction * moveOffset);
            });

            $nextLink.on('click', function (e) {
                e.preventDefault();

                scrollHorizontally(direction * moveOffset);
            });

            $items.on('scroll', function () {
                window.requestAnimationFrame(function () {
                    updateScrollState();
                });
            });

            updateScrollState();
        });
    };

    // private
    function updateScrollState () {
        var width = $items.get(0).scrollWidth;
        var overflowedWidth = $items.width();
        var scrollLeft = $items.scrollLeft();

        $wrapper.removeClass(classes.endPos + ' ' + classes.startPos);
        // we add 20px "error margin", so we don't have scroll when the last element's overflow only a tiny bit.
        // 20px is equal to the padding of the title, so the text is always in viewport.
        if ( $items[0].offsetWidth + 20 >= $items[0].scrollWidth ){
            $wrapper.addClass(classes.noArrows);
            return;
        }

        // no scroll LTR, most left RTL
        if (scrollLeft <= 0) {
            if (isRTL) {
                $wrapper.addClass(classes.endPos);
                $wrapper.removeClass(classes.startPos);
            } else {
                $wrapper.addClass(classes.startPos);
                $wrapper.removeClass(classes.endPos);
            }
        // most right LTR, no scroll RTL
        } else if (width <= scrollLeft + overflowedWidth) {
            if (isRTL) {
                $wrapper.addClass(classes.startPos);
                $wrapper.removeClass(classes.endPos);
            } else {
                $wrapper.addClass(classes.endPos);
                $wrapper.removeClass(classes.startPos);
            }
        }
    }

    function scrollHorizontally(difference) {
        var leftOffset = $items.scrollLeft();

        $items.animate(
            // properties to animate
            {
                'scrollLeft': leftOffset + difference
            },
            375,        // duration
            'swing'     // easing
        );
    }

})(jQuery);


/*******************
 *
 * Date > Time ago
 *
 ******************/

(function ($) {

    'use strict';

    g1.dateToTimeago = function () {
        if (!$.fn.timeago) {
            return;
        }

        $('time.entry-date, .comment-metadata time, time.snax-item-date').timeago();

        $('body').on( 'g1NewContentLoaded', function ( e, $newContent ) {
            if ($newContent) {
                $newContent.find('time.entry-date, .comment-metadata time, time.snax-item-date').timeago();
            }
        } );
    };

})(jQuery);


/**********
 *
 * Canvas
 *
 *********/

(function($) {
    'use strict';

    var selectors = {
        'toggle':   '.g1-hamburger'
    };

    g1.globalCanvasSelectors = selectors;

    var canvas;

    g1.canvas = function() {
        canvas = Canvas();

        // Allow global access.
        g1.canvasInstance = canvas;

        $(selectors.toggle).on('click', function (e) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: 0
            }, 10);

            canvas.open();
        });
    };

    function Canvas () {
        var that = {};
        var listeners = {
            'open': [],
            'close': []
        };

        var currentContent = '';

        var init = function () {
            var $overlay = $( '.g1-canvas-overlay');

            // toogle canvas events
            $overlay.on('click', that.toggle);

            $('.g1-canvas').on('toggle-canvas', function () {
                that.toggle();
            });

            $('.g1-canvas .g1-canvas-toggle').on('click', that.toggle);

            enquire.register('screen and ( min-width: 700px )', {
                match : function() {
                    that.close();
                }
            });

            return that;
        };

        that.getContent = function() {
            return $('.g1-canvas-global .g1-canvas-content');
        };

        that.open = function (content) {
            window.requestAnimationFrame(function () {
                $('html').
                addClass('g1-off-global').
                removeClass('mtm-off-from-global mtm-off-from-local');

                currentContent = content;
                var $canvas = $('.g1-canvas-global');

                if (content) {
                    if (typeof content === 'string') {
                        $canvas.find('.g1-canvas-content').html(content);
                    } else {
                        $canvas.find('.g1-canvas-content').empty().append(content);
                    }

                    // notify about adding new content to DOM so other elements can be reloaded
                    $canvas.find('.g1-canvas-content').trigger('g1-new-content');
                }

                $canvas.scrollTop(0);

                that.notify('open');
            });
        };

        that.close = function () {
            window.requestAnimationFrame(function () {
                $('html').removeClass('g1-off-global');

                that.notify('close');
            });
        };

        that.toggle = function (e) {
            if (e) {
                e.preventDefault();
            }

            // is opened?
            if ( $('html').hasClass('g1-off-global') ) {
                that.close();
            } else {
                that.open(null);
            }
        };

        that.notify = function (eventType) {
            var callbacks = listeners[eventType];

            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i](that.getContent());
            }
        };

        that.on = function (eventType, listener, priority) {
            listeners[eventType][priority] = listener;
        };

        return init();
    }

})(jQuery);


/********************
 *
 * Sticky sidebar
 *
 ********************/

(function($) {
    'use strict';

    var stickyContainerSelector = '.g1-row:first';

    g1.stickyTopOffsetSelectors = [
        '#wpadminbar',
        '.g1-sharebar',
        '.g1-sticky-top-wrapper'
    ];

    g1.stickySidebar = function() {
        enquire.register('screen and (min-width:'+ 800 +'px)', {
            match : function() {
                g1.activateStickySidebar();
            },
            unmatch: function () {
                g1.deactivateStickySidebar();
            }
        });

        $('body').on('g1PageHeightChanged', function () {
            g1.updateStickySidebar();
        });
    };

    g1.activateStickySidebar = function () {
        if (g1.isTouchDevice()) {
            return;
        }

        var containerColumnsSelector = '> .g1-row-inner > .g1-column';
        var stickySelector = '.g1-sticky-sidebar';
        var stickyHandlerNotExecuted = true;
        var containerHandlerBlocked = false;

        $(stickySelector).each(function () {
            g1.stickyEnabled = true;
            var $sticky = $(this);

            if ($sticky.hasClass('g1-activated')) {
                return;
            }

            var $container = $sticky.parents(stickyContainerSelector);
            var $containerColumns = $container.find(containerColumnsSelector);

            // sticky sidebar can't be in the highest column in the row
            // --------------------------------------------------------

            // first check if we can compare columns
            if ($containerColumns.length >= 2) {
                var $highestColumn = null;
                var highestColumnHeight = 0;

                // find the highest column
                $containerColumns.each(function () {
                    var $column = $(this);
                    var columnHeight = $column.outerHeight();

                    if (columnHeight > highestColumnHeight) {
                        highestColumnHeight = columnHeight;
                        $highestColumn = $column;
                    }
                });

                // if sticky inside the highest column prevent sticky
                if (null !== $highestColumn) {
                    if ($highestColumn.find($sticky).length > 0) {
                        g1.stickyEnabled = false;
                    }
                }
            }

            var top = 0;
            top += parseInt($sticky.attr('data-g1-offset'), 10);

            for (var i = 0; i < g1.stickyTopOffsetSelectors.length; i++) {
                var $element = $(g1.stickyTopOffsetSelectors[i]);

                if ($element.length > 0 && $element.is(':visible')) {
                    top += parseInt($element.outerHeight(), 10);
                }
            }

            var containerHandler = function (direction) {
                if (direction === 'down') {
                    // offset between the container top edge and
                    // first sticky parent element that has the "relative" position set
                    var extraOffset = 0;

                    $sticky.parentsUntil($container).each(function () {
                        var $parent = $(this);

                        if ($parent.css('position') === 'relative') {
                            var parentOffset = $parent.offset();
                            var containerOffset = $container.offset();

                            if (typeof parentOffset.top !== 'undefined' && typeof containerOffset.top !== 'undefined') {
                                extraOffset = parseInt(parentOffset.top, 10) - parseInt(containerOffset.top, 10);
                            }

                            return false;
                        }
                    });

                    $sticky.css({
                        'position': 'absolute',
                        'top': $container.outerHeight() - $sticky.outerHeight(),
                        'width': $sticky.outerWidth()
                    });
                } else {
                    $sticky.css({
                        'position': 'fixed',
                        'top': top,
                        'width': $sticky.outerWidth()
                    });
                }
            };

            if (g1.stickyEnabled) {
                var containerWaypoint = new Waypoint({
                    element: $container,
                    handler: function (direction) {
                        if (stickyHandlerNotExecuted) {
                            containerHandlerBlocked = true;
                            return;
                        }

                        containerHandler(direction);
                    },
                    offset: function() {
                        // Bottom edge of container - sticky height stick to the top edge of the viewport
                        return -$container.outerHeight() + $sticky.outerHeight() + top;
                    }
                });

                $container.data('waypoint', containerWaypoint);
            }

            if (g1.stickyEnabled) {
                var waypoint = new Waypoint({
                    element: $sticky,
                    handler: function(direction) {
                        stickyHandlerNotExecuted = false;

                        if (direction === 'down') {
                            $sticky.css({
                                'position': 'fixed',
                                'top': top,
                                'width': $sticky.outerWidth()
                            });
                        } else {
                            $sticky.css({
                                'position': 'static',
                                'top': 0,
                                'width': 'auto'
                            });
                        }

                        if (containerHandlerBlocked) {
                            containerHandlerBlocked = false;

                            containerHandler('down');
                        }
                    },
                    offset: function () {
                        return top;
                    }
                });

                $sticky.data('waypoint', waypoint);
                $sticky.addClass('g1-activated');
            }
        });
    };

    g1.deactivateStickySidebar = function () {
        var $stickySidebar = $('.g1-sticky-sidebar.g1-activated');

        $stickySidebar.each(function () {
            var $sticky = $(this);
            var $container = $sticky.parents(stickyContainerSelector);

            var waypoint = $sticky.data('waypoint');
            var containerWaypoint = $container.data('waypoint');

            if (waypoint) {
                waypoint.destroy();
            }

            if (containerWaypoint) {
                containerWaypoint.destroy();
            }

            $sticky.removeClass('g1-activated');
            $sticky.removeAttr('style');
            $sticky.removeProp('style');
        });
    };

    g1.updateStickySidebar = function () {
        g1.deactivateStickySidebar();
        g1.activateStickySidebar();
    };

    $('#buddypress .load-more').click(function() {
        var i = 0;
        var intervalID = setInterval( function() {
            $('body').trigger( 'g1PageHeightChanged' );
            i++;
            if (i === 5){
                window.clearInterval(intervalID);
            }
        },1000);
    });

})(jQuery);


/**************************
 *
 * Share Content Elements
 * (images, video)
 *
 **************************/

(function ($) {

        'use strict';

        var template = $.parseJSON(bimber_front_microshare)['html'];
        var config = $.parseJSON(bimber_front_config);
        var fb_api_id_number = 0;

        g1.shareContentElements = function ($scope, customTemplate) {
            if (config.microshare !== 'on') {
                return;
            }
            if (! $scope) {
                $scope = $('#content');
            }

            g1.microShareIncludeSelectors =[
                '.entry-featured-media-main img.wp-post-image',
                '.entry-content img.aligncenter',
                '.entry-content .aligncenter img',
                '.entry-content .g1-enable-share-links'
            ];

            g1.microShareExcludeSelectors = [
                '.entry-content img.g1-disable-share-links',
                '.entry-content .snax-item-box',
                '.entry-content .wp-video'
            ];

            $( g1.microShareIncludeSelectors.join(',') ).not( g1.microShareExcludeSelectors.join(',') ).each(function () {
                var $elem = $(this);
                var src = '';

                if ( $elem.parents('.mashsb-micro-wrapper').length > 0 ) {
                    return;
                }
                var $img = $('img', $elem);
                if ($img.length > 0){
                    src = $img.attr('data-src');
                    if (!src) {
                        src = $img.attr('src');
                    }
                } else {
                    src = $elem.attr('data-src');
                    if (!src) {
                        src = $elem.attr('src');
                    }
                }
                if (typeof src !== 'string') {
                    src = '';
                }
                if (!src.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/))){
                    var base = $('base').attr('href');
                    if(base){
                        src = base.replace(/\/$/, '') + src.replace('./','/');
                    }else{
                        src = '';
                    }
                }
                var microshare = template;
                if (customTemplate){
                    microshare = customTemplate;
                }

                var fb_function_id = 'bimber_microshare_' + fb_api_id_number;
                fb_api_id_number+=1;
                microshare = microshare.replace(new RegExp(/_bimber_replace_unique_241gw/g),fb_function_id);
                microshare = microshare.replace('bimber_replace_encode_241gw',encodeURIComponent(src));
                microshare = microshare.replace('bimber_replace_241gw',src);


                // @todo-pp: replace the "g1-img-wrap" class with something more general, we don't wrap just images here
                $elem.wrap( '<div class="g1-img-wrap"></div>' );
                $elem.parent().addClass( 'mashsb-micro-wrapper' );
                $elem.parent().append(microshare);
                $elem.find('.snax-item-share').empty();
            });

            //add embedly script if needed
            if ( $('.bimber-snax-embedly-script-placeholder').length > 0){
                $('.bimber-snax-embedly-script-placeholder').replaceWith('<script async src="//cdn.embedly.com/widgets/platform.js" charset="UTF-8"></script>');
            }

            $('.bimber-microshare-twitter').on('click', function (e) {
                e.preventDefault();
                window.open($(this).attr('href'), 'Google', 'width=500,height=300');
            });
            $('.bimber-microshare-pinterest').on('click', function (e) {
                e.preventDefault();
                window.open($(this).attr('href'), 'Google', 'width=700,height=670');
            });

            // On none touchable devices, shares visibility is handled via css :hover.
            // On touch devices there is no "hover", so we emulate hover via CSS class toggle on click.
            $('.bimber-microshare-item-share-toggle').on('click touchstart', function (e) {
                e.preventDefault();
                $(this).parents('.bimber-microshare-item-share').addClass('bimber-microshare-item-share-expanded');
            });

            // Hide shares on focus out.
            $('body').on('click touchstart', function (e) {
                var $activeMicroShares = $(e.target).parents('.bimber-microshare-item-share-expanded');

                // Collapse all expanded micro shares except active one.
                $('.bimber-microshare-item-share-expanded').not($activeMicroShares).removeClass( 'bimber-microshare-item-share-expanded' );
            });

        };

    })(jQuery);


/*************************
 *
 * Custom Share Buttons
 * (open in a new window)
 *
 *************************/

(function ($) {

    'use strict';

    g1.customShareButtons = function () {
        openCustomSharesInNewWindow();
    };

    function openCustomSharesInNewWindow () {
        $('.mashicon-pinterest, .mashicon-google').click( function(e) {
            var winWidth = 750;
            var winHeight = 550;
            var winTop = (screen.height / 2) - (winHeight / 2);
            var winLeft = (screen.width / 2) - (winWidth / 2);
            var url = $(this).attr('href');

            // Since Mashshare v3.2.8.
            if ('#' === url) {
                url = $(this).attr('data-mashsb-url');
            }

            window.open(
                url,
                'sharer',
                'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight
            );

            e.preventDefault();
        });
    }

})(jQuery);


/***************************
 *
 * Customize Share Buttons
 * (open in a new window)
 *
 ***************************/

(function ($) {

    'use strict';

    g1.customizeShareButtons = function () {
        overrideOnOffSwitch();
        subscribeViaMailbox();
    };

    function overrideOnOffSwitch () {
        // disable current events
        var $onoffswitch    = $('.onoffswitch');
        var $onoffswitch2   = $('.onoffswitch2');

        $onoffswitch.off('click');
        $onoffswitch2.off('click');

        $onoffswitch.on('click', function() {
            var $container = $(this).parents('.mashsb-container');

            $('.onoffswitch', $container).hide();
            $('.secondary-shares', $container).show();
            $('.onoffswitch2', $container).show();
        });

        $onoffswitch2.on('click', function() {
            var $container = $(this).parents('.mashsb-container');

            $('.onoffswitch', $container).show();
            $('.secondary-shares', $container).hide();
        });
    }

    function subscribeViaMailbox () {
        // Skip if subscription is done via content box.
        if (typeof mashsb !== 'undefined' && mashsb.subscribe === 'content') {
            return;
        }

        // Skip if subsciption is done via custom url.
        if (typeof mashsb !== 'undefined' && mashsb.subscribe_url !== '') {
            return;
        }

        // Open default mail client to subscribe.
        $('a.mashicon-subscribe').each(function () {
            var $link = $(this);

            if ($link.attr('href') === '#') {
                // remove all assigned events
                $link.off('click');

                var postTitle = $('head > title').text();
                var postUrl = location.href;

                var subject = g1.config.i18n.newsletter.subscribe_mail_subject_tpl.replace('%subject%', postTitle);
                var body = postTitle + '%0A%0A' + postUrl;

                // template
                var mailTo = 'mailto:?subject={subject}&body={body}';

                // build final link
                mailTo = mailTo.replace('{subject}', subject);
                mailTo = mailTo.replace('{body}', body);

                $link.attr('href', mailTo);
            }
        });
    }

})(jQuery);


/*************
 *
 * Share Bar
 *
 *************/

(function ($) {

    'use strict';

    g1.shareBarTopOffsetSelectors = [
        '#wpadminbar'
    ];

    g1.shareBar = function () {
        var $shareBar = g1.activateShareBar();

        $('body').on('g1PageHeightChanged', function () {
            if ($shareBar !== false) {
                g1.updateShareBarPosition($shareBar);
            }
        });

        enquire.register('screen and ( min-width: 801px )', {
            match : function() {
                if ($shareBar !== false) {
                    g1.updateShareBarPosition($shareBar);
                }
            },
            unmatch: function() {
                if ($shareBar !== false) {
                    g1.updateShareBarPosition($shareBar);
                }
            }
        });
    };

    g1.activateShareBar = function () {
        var $shareBar = $('.g1-sharebar');
        var $shareButtons = $('.mashsb-main:first');

        // exit if any of required elements not exists
        if ($shareBar.length === 0 || $shareButtons.length === 0) {
            return false;
        }

        var $shareBarInner = $shareBar.find('.g1-sharebar-inner');

        if (!$shareBar.is('.g1-sharebar-loaded')) {
            var $clonedShareButtons = $shareButtons.clone(true);
            //$clonedShareButtons.removeClass('mashsb-main');

            // If shares are animated, we need to set total count in sharebar before animation ends
            if (typeof mashsb !== 'undefined' && mashsb.animate_shares === '1' && $clonedShareButtons.find('.mashsbcount').length) {
                $clonedShareButtons.find('.mashsbcount').text(mashsb.shares);
            }

            $shareBarInner.append($clonedShareButtons);

            $shareBar.addClass('g1-sharebar-loaded');

            g1.updateShareBarPosition($shareBar);
        }

        new Waypoint({
            element: $('body'),
            handler: function (direction) {
                if (direction === 'down') {
                    $shareBar.addClass('g1-sharebar-on');
                    $shareBar.removeClass('g1-sharebar-off');
                } else {
                    $shareBar.removeClass('g1-sharebar-on');
                    $shareBar.addClass('g1-sharebar-off');
                }
            },
            offset: function() {
                // trigger waypoint when body is scrolled down by 100px
                return -100;
            }
        });

        return $shareBar;
    };

    g1.updateShareBarPosition = function ($shareBar) {
        var shareBarWidth = parseInt($shareBar.outerWidth(), 10);
        var cssMediaQueryBreakpoint = 800;

        // Below breakpoint value, sticky is placed on bottom so top has to be reset.
        if (shareBarWidth <= cssMediaQueryBreakpoint) {
            $shareBar.css('top', '');
        } else {
            var top = 0;

            for (var i = 0; i < g1.shareBarTopOffsetSelectors.length; i++) {
                var $element = $(g1.shareBarTopOffsetSelectors[i]);

                if ($element.length > 0 && $element.is(':visible')) {
                    top += parseInt($element.outerHeight(), 10);
                }
            }

            $shareBar.css('top', top + 'px');
        }
    };

})(jQuery);


/*****************
 *
 * Sticky Elements
 *
 ****************/

(function ($) {

    'use strict';

    var selectors = [
        '#wpadminbar',
        '.g1-iframe-bar',
        '.g1-sharebar',
        '.g1-sticky-top-wrapper'
    ];

    // Accessible globally.
    g1.stickyElementsTopOffsetSelectors = selectors;

    g1.stickyPosition = function ($context) {
        $context = $context || $('body');

        var topOffset = 0;

        for (var i = 0; i < selectors.length; i++) {
            var $elem = $(selectors[i]);

            if ($elem.length > 0 && $elem.is(':visible')) {
                topOffset += $elem.outerHeight();
            }
        }

        // Sticky top.
        var $stickyTop = $('.g1-sticky-top-wrapper');

        // If exists and not loaded already.
        if ($stickyTop.length > 0 && !$stickyTop.is('.g1-loaded')) {
            var disableStickyHeader = false;
            var isDesktop = g1.getWindowWidth() > 800;



            // Disable if sharebar enabled.
            var sharebarLoaded = $('.g1-sharebar-loaded').length > 0;

            if (sharebarLoaded && isDesktop) {
                disableStickyHeader = true;
            }

            if (disableStickyHeader) {
                // Prevent native sticky support, like on FF.
                $stickyTop.removeClass('g1-sticky-top-wrapper');
            } else {
                // Apply pollyfill only if not supported.
                if (!g1.isStickySupported()) {
                    $stickyTop.Stickyfill();
                }

                $stickyTop.addClass('g1-loaded');
            }
        }

        // Sticky Item Actions (shares, votes etc).
        $context.find('.g1-wrapper-with-stickies > .entry-actions').each(function() {
            var $this = $(this);

            $this.css('top', topOffset);

            $this.Stickyfill();
        });

        // Sticky snax form sidebar.
        $('.snax-form-frontend .snax-form-side').Stickyfill();


        // Sticky Item Actions (shares, votes etc).
        $context.find('.entry-tpl-index-stickies > .entry-actions').each(function() {
            var $this = $(this);

            $this.css('top', topOffset);

            $this.Stickyfill();
        });
    };

    $('body').on( 'g1NewContentLoaded', function ( e, $newContent ) {
        if ($newContent) {
            g1.stickyPosition($newContent);
        }
    } );

})(jQuery);


/**********************
 *
 * Droppable Elements
 *
 **********************/

(function ($) {

    'use strict';

    var selectors = {
        'drop' :        '.g1-drop',
        'dropExpanded': '.g1-drop-expanded',
        'dropToggle':   '.g1-drop-toggle'
    };

    var classes = {
        'dropExpanded': 'g1-drop-expanded'
    };

    g1.droppableElements = function () {
        // Hide drop on focus out.
        $('body').on('click touchstart', function (e) {
            var $activeDrop = $(e.target).parents('.g1-drop-expanded');

            // Collapse all except active.
            $(selectors.dropExpanded).not($activeDrop).removeClass(classes.dropExpanded);
        });

        // Handle drop state (expanded | collapsed).

        // For touch devices we need to toggle CSS class to trigger state change.
        if ( g1.isTouchDevice() ) {
            $(selectors.drop).on( 'click', function(e) {
                var $drop = $(this);

                // Drop is expanded, collapse it on toggle click.
                if ($drop.is(selectors.dropExpanded)) {
                    var $clickedElement = $(e.target);

                    var toggleClicked = $clickedElement.parents(selectors.dropToggle).length > 0;

                    if (toggleClicked) {
                        $drop.removeClass(classes.dropExpanded);
                        e.preventDefault();
                    }
                // Drop is collapsed, expand it.
                } else {
                    $drop.addClass(classes.dropExpanded);
                    e.preventDefault();
                }
            } );
        // Devices without touch events, state is handled via CSS :hover
        } else {
            // Prevent click on toggle.
            $(selectors.dropToggle).on( 'click', function() {
            });
        }
    };

})(jQuery);


/*************************
 *
 * BuddyPress Profile Nav
 *
 *************************/

(function ($, i18n) {

    'use strict';

    var selectors = {
        'items':        '> li:not(.g1-drop):not(.g1-delimiter):not(.g1-tab-item-current)'
    };

    var classes = {
        'hidden':       'hidden'
    };

    var isRTL = g1.isRTL();

    g1.bpProfileNav = function () {
        // Define reverse function as jQuery plugin.
        $.fn.g1Reverse = [].reverse;

        $('#menu-bp.g1-tab-items').each(function() {
            var $ul             = $(this);
            var $liMore         = $('<li class="g1-drop g1-drop-before g1-tab-item">');
            var $liMoreToggle   = $('<a class="g1-drop-toggle g1-tab" href="#">' + i18n.more_link + '<span class="g1-drop-toggle-arrow"></span></a>');
            var $liMoreContent  = $('<div class="g1-drop-content"></div>' );
            var $liMoreSubmenu  = $('<ul class="sub-menu"></ul>');
            var $liDelimiter    = $('<li class="g1-delimiter">');
            var maxWidth        = $ul.width() - $liMoreToggle.width();
            if ($ul.prop('scrollWidth') <= $ul.width() ) {
                return;
            }

            $liMore.
                append($liMoreToggle);
            $ul.
                append($liMore).
                append($liDelimiter);

            $ul.find(selectors.items).g1Reverse().each(function(index) {
                var $this = $(this);

                if ( isRTL) {
                    if ( $liMore.position().left < 0) {
                        $liMoreSubmenu.prepend( $this);
                    } else if (0 === index) {
                        $liMore.toggleClass(classes.hidden);
                        $liDelimiter.toggleClass(classes.hidden);

                        return false;
                    } else {
                        if ( $liDelimiter.position().left < 0 ) {
                            $liMoreSubmenu.prepend( $this);
                        }
                    }
                } else {
                    if ( $liMore.position().left > maxWidth) {
                        $liMoreSubmenu.prepend( $this);
                    } else if (0 === index) {
                        $liMore.toggleClass(classes.hidden);
                        $liDelimiter.toggleClass(classes.hidden);

                        return false;
                    } else {
                        if ( $liDelimiter.position().left > maxWidth ) {
                            $liMoreSubmenu.prepend( $this);
                        }
                    }
                }
            });

            $liMoreContent.append($liMoreSubmenu);
            $liMore.append($liMoreContent);
            $liDelimiter.toggleClass(classes.hidden);
        });
    };

})(jQuery, g1.config.i18n.bp_profile_nav);


/********************************
 *
 * BuddyPress input placeholders
 *
 ********************************/

(function ($) {

    'use strict';

    $( 'input#bp-login-widget-user-login' ).attr( 'placeholder', $( 'label[for="bp-login-widget-user-login"]' ).text() );
    $( 'input#bp-login-widget-user-pass' ).attr( 'placeholder', $( 'label[for="bp-login-widget-user-pass"]' ).text() );

})(jQuery);


/*******************************
 *
 * Auto Load Next Post plugin
 *
 *******************************/

(function ($) {

    'use strict';

    $(document).ready(function() {
        if ( typeof auto_load_next_post_params === 'object' ) {
            g1.autoLoadNextPost();
        }
    });

    g1.autoLoadNextPost = function() {
        // Use that code when plugin start supports the "alnpNewPostLoaded" event.
        // $('body').on('alnpNewPostLoaded', function () {
        //    updateElements();
        // });

        $('.post-divider').on('scrollSpy:exit', updateElements);
        $('.post-divider').on('scrollSpy:enter', updateElements);
    };

    function updateElements() {
        var $lastArticle = $('> article:last', auto_load_next_post_params.alnp_content_container );

        // Apply micro shares for new posts.
        g1.shareContentElements($lastArticle);

        // Reposition sitciky sidebar.
        g1.updateStickySidebar();

        // Load player.
        g1.gifPlayer($lastArticle);

        // Apply scrollspy again.
        $('.post-divider').on('scrollSpy:exit', updateElements);
        $('.post-divider').on('scrollSpy:enter', updateElements);
    }

})(jQuery);


/*****************
 *
 * Ajax search
 *
 *****************/

(function ($) {

    'use strict';

    var selectors = {
        'wrapper':  'div[role=search]',
        'form':     'form.g1-searchform-ajax',
        'input':    'form.g1-searchform-ajax input.search-field',
        'results':  '.g1-searches-ajax',
        'seeAll':   '.bimber-see-all-results'
    };

    g1.ajaxSearch = function () {
        if (!$.fn.autocomplete) {
            return;
        }

        $( selectors.input).each(function() {
            var $input   = $(this);
            var $form    = $input.parents(selectors.form);
            var $wrapper = $input.parents(selectors.wrapper);

            $input.autocomplete({
                'appendTo':   $form,
                'delay':      500,
                'minLength':  2,
                'source': function(request) {
                    var xhr = $.ajax({
                        'type': 'GET',
                        'url': g1.config.ajax_url,
                        'dataType': 'json',
                        'data': {
                            'action':       'bimber_search',
                            'bimber_term':  request.term
                        }
                    });

                    xhr.done(function (res) {
                        if (res.status === 'success') {
                            $wrapper.find(selectors.results).html(res.html);
                        }
                    });
                }
            });

            // See all results.
            $wrapper.on('click', selectors.seeAll, function(e) {
                e.preventDefault();

                $form.submit();
            });
        });
    };

    // Update WooCommerce mini cart.

    // Trigger event
    $( document.body ).on( 'adding_to_cart', function() {
        $('.g1-drop-toggle-badge').removeClass('g1-drop-toggle-badge-animate');
    } );

    $( document.body ).on( 'added_to_cart removed_from_cart', function() {
        // the event is called BEFORE the cart AJAX comes back so we need a small timeout or we'll get the wrong count.
        setTimeout(function() {
            var $drop = $('.g1-drop-the-cart');

            var count = parseInt( $drop.find( '.cart_list').data('g1-cart-count'), 10 );
            if ( count > 0 ) {
                $drop.find('.g1-drop-toggle-badge').removeClass('g1-drop-toggle-badge-hidden').addClass('g1-drop-toggle-badge-animate').text(count);
            } else {
                $drop.find('.g1-drop-toggle-badge').addClass('g1-drop-toggle-badge-hidden').text(count);
            }
        }, 500);
    } );





})(jQuery);

/*****************
 *
 * Isotope
 *
 *****************/

(function ($) {

    'use strict';

    var selectors = {
        'grid':     '.g1-collection-masonry .g1-collection-items'
    };

    var $grid;

    g1.isotope = function () {
        if (!$.fn.isotope) {
            return;
        }

        $grid = $(selectors.grid);

        if (!$grid.length) {
            return;
        }

        $grid.isotope({
            itemSelector:   '.g1-collection-item',
            layoutMode:     'masonry'
        });

        $('body').on( 'g1NewContentLoaded', function(e, $addedItems) {
            $grid.isotope('appended', $addedItems);
        });
    };

})(jQuery);

/*******************
 *
 * Snax Integration
 *
 ******************/

(function ($) {

    'use strict';

    g1.snax = function () {
        var $body = $('body');

        // Load FB SDK on demand.
        $body.on('snaxFbNotLoaded', function() {
            $('body').trigger('bimberLoadFbSdk');
        });

        $body.on('snaxFullFormLoaded', function(e, $post) {
            $post.find('.g1-button-m.g1-button-solid').removeClass('g1-button-m  g1-button-solid').addClass('g1-button-s  g1-button-simple');
            $post.find('.g1-beta.g1-beta-1st').removeClass('g1-beta g1-beta-1st').addClass('g1-gamma g1-gamma-1st');
        });
    };

})(jQuery);

/*******************
 *
 * Media Ace Integration
 *
 ******************/

(function ($) {

    'use strict';

    g1.mediaAce = function () {

        $('body').on('g1NewContentLoaded', function() {
            $('body').trigger('maceLoadYoutube');
        });

        $(document).on('lazybeforeunveil', function(e) {
            var $target = $(e.target);
            var targetSrc = $target.attr('data-src');

            if (targetSrc.endsWith('.gif')) {
                // Wait till image fully loaded.
                $target.on('load', function() {
                    $target.addClass('g1-enable-gif-player');

                    // Wait a while before applying player.
                    setTimeout(function() {
                        g1.gifPlayer($target.parent());
                    }, 100);
                });
            }
        });

        $(document).on('bimberGifPlayerLoaded', function(e, $canvasWrapper) {
            if ($canvasWrapper.hasClass('lazyloading')) {
                $canvasWrapper.removeClass('lazyloading');
                $canvasWrapper.addClass('lazyloaded');
            }
        });
    };

})(jQuery);

/*************
 *
 * Comments
 *
 ************/

(function ($) {

    'use strict';

    var selectors = {
        'wrapper':      '.g1-comments',
        'tabs':         '.g1-tab-items > li',
        'tab':          '.g1-tab-item',
        'currentTab':   '.g1-tab-item-current',
        'commentType':  '.g1-comment-type'
    };

    var classes = {
        'currentTab':   'g1-tab-item-current',
        'currentType':  'g1-tab-pane-current',
        'type':         'g1-tab-pane',
        'loading':      'g1-loading',
        'loaded':       'g1-loaded'
    };

    var $wrapper;

    g1.comments = function () {
        $wrapper = $(selectors.wrapper);

        if ($wrapper.length === 0) {
            return;
        }

        initTabs();

        g1.facebookComments();
        g1.disqusComments();
    };

    var initTabs = function() {
        var $tabs = $wrapper.find(selectors.tabs);
        var currentType = $tabs.filter(selectors.currentTab).attr('data-bimber-type');

        // Can't find current tab.
        if (!currentType) {
            var types = g1.config.comment_types;

            if (types && types.length > 0) {
                currentType = types[0];
            } else {
                currentType = 'wp';
            }
        }

        $wrapper.find(selectors.commentType).each(function() {
            var $type = $(this);

            $type.addClass(classes.type);
        });

        if ( 'dsq' === currentType ) {
            setTimeout(function() {
                selectTab(currentType);
            }, 1000);
        } else {
            selectTab(currentType);
        }

        $tabs.on('click', function() {
            var type = $(this).attr('data-bimber-type');

            selectTab(type);
        });
    };

    var selectTab = function(type) {
        var $tab = $wrapper.find(selectors.tab + '-' + type);
        var $type = $wrapper.find(selectors.commentType + '-' + type);

        if ($type.hasClass(classes.currentType)) {
            return;
        }

        if ('fb' === type) {
            if (!$type.hasClass(classes.loaded)) {
                $type.addClass(classes.loading);
            }

            $('body').trigger('bimberLoadFbSdk');
        }

        // Select new type.
        $wrapper.find(selectors.commentType).removeClass(classes.currentType);
        $type.addClass(classes.currentType);

        $type.trigger('loadComments');

        // Select new tab.
        $wrapper.find(selectors.tabs).removeClass(classes.currentTab);
        $tab.addClass(classes.currentTab);
    };

})(jQuery);

/*******************
 *
 * Facebook Comments
 * (plugin integration)
 *
 ******************/

(function ($) {

    'use strict';

    var selectors = {
        'wrapper':  '.g1-comment-type-fb',
        'counter':  '.g1-comment-count',
        'list':     '.g1-comment-list',
        'tab':      '.g1-comments .g1-tab-item-fb'
    };

    var classes = {
        'loading':  'g1-loading',
        'loaded':   'g1-loaded'
    };

    var $wrapper;
    var loaded = false;

    g1.facebookComments = function () {
        $wrapper = $(selectors.wrapper);

        if (!$wrapper.is('.g1-on-demand')) {
            loaded = true;
        }

        if ($wrapper.length > 0) {
            init();

            return $wrapper;
        } else {
            return false;
        }
    };

    var init = function() {
        // Init when FB is ready.
        var origFbAsyncInit = window.fbAsyncInit;

        window.fbAsyncInit = function() {
            if (typeof FB === 'undefined') {
                return;
            }

            // Update on post load.
            FB.Event.subscribe('xfbml.render', function() {
                $wrapper.removeClass(classes.loading);
                $wrapper.addClass(classes.loaded);

                var $counter = $wrapper.find(selectors.counter);

                var realCount = parseInt($counter.find('.fb_comments_count').text(), 10);
                var postCount = parseInt($counter.attr('data-bimber-fb-comment-count'), 10);

                if (realCount !== postCount) {
                    save(realCount);
                }
            });

            // New comment added.
            FB.Event.subscribe('comment.create', function() {
                changeCommentsNumber(1);
            });

            // Comment removed.
            FB.Event.subscribe('comment.remove', function() {
                changeCommentsNumber(-1);
            });

            if (typeof origFbAsyncInit === 'function') {
                origFbAsyncInit();
            }
        };

        // Listen on "Load comments" event.
        $wrapper.on('loadComments', function() {
            if (loaded) {
                return;
            }

            $wrapper.addClass(classes.loading);

            loadComments(function(html) {
                // Reset FB (hack).
                $('script#facebook-jssdk').remove();
                $('#fb-root').remove();
                if (window.FB) {
                    delete window.FB;
                }

                $wrapper.find(selectors.list).html(html);
                $wrapper.removeClass(classes.loading);
            });
        });
    };

    var changeCommentsNumber = function(diff) {
        var $counter = $wrapper.find(selectors.counter);
        var postCount = parseInt($counter.attr('data-bimber-fb-comment-count'), 10);

        postCount += diff;

        // Update Facebook comment count.
        $wrapper.find('.fb_comments_count').text(postCount);
        $counter.attr('data-bimber-fb-comment-count', postCount);

        // Update total post comment count.
        var $postCommentCount = $wrapper.parents('#content').find('.entry-comments-link strong');

        var postCommentCount = parseInt($postCommentCount.text(), 10);
        $postCommentCount.text(postCommentCount + diff);

        // Update tab counter.s
        var $fbCount = $(selectors.tab).find('a > span');

        if ($fbCount.length > 0) {
            var fbCount = parseInt($fbCount.text(), 10);

            $fbCount.text(fbCount + diff);
        }

        save(postCount);
    };

    var save = function(newCount) {
        var postId = $wrapper.find(selectors.counter).attr('data-bimber-post-id');
        var nonce  = $wrapper.find(selectors.counter).attr('data-bimber-nonce');

        $.ajax({
            'type': 'POST',
            'url': g1.config.ajax_url,
            'dataType': 'json',
            'data': {
                'action':   'bimber_update_fb_comment_count',
                'post_id':  postId,
                'security': nonce,
                'count':    newCount
            }
        });
    };

    var loadComments = function(callback) {
        var postId = $wrapper.find(selectors.counter).attr('data-bimber-post-id');

        var xhr = $.ajax({
            'type': 'GET',
            'url': g1.config.ajax_url,
            'data': {
                'action':   'bimber_load_fbcommentbox',
                'post_id':  postId
            }
        });

        xhr.done(function(res) {
            callback(res);

            loaded = true;
        });
    };

})(jQuery);


/**********************
 *
 * Disqus Comments
 * (plugin integration)
 *
 *********************/

(function ($) {

    'use strict';

    var selectors = {
        'wrapper':  '.g1-comment-type-dsq',
        'counter':  '.g1-comment-count',
        'list':     '.g1-comment-list',
        'tab':      '.g1-comments .g1-tab-item-dsq'
    };

    var classes = {
        'loading':  'g1-loading'
    };

    var $wrapper;
    var loaded = false;

    g1.disqusComments = function () {
        $wrapper = $(selectors.wrapper);

        if ($wrapper.length > 0) {
            init();

            return $wrapper;
        } else {
            return false;
        }
    };

    var init = function() {
        var origDsqConfig = window.disqus_config;

        window.disqus_config = function() {
            if (typeof origDsqConfig === 'function') {
                origDsqConfig();

                $wrapper.removeClass(classes.loading);
                loaded = true;
            }

            // DISQUSWIDGETS.getCount({reset: true});

            // Init.
            var $counter = $wrapper.find(selectors.counter);

            var realCount = parseInt($counter.find('.disqus-comment-count').text(), 10);
            var postCount = parseInt($counter.attr('data-bimber-dsq-comment-count'), 10);

            if (realCount !== postCount) {
                save(realCount);
            }

            this.callbacks.onNewComment = [function() {
                changeCommentsNumber(1);
            }];
        };

        // Listen on "Load comments" event.
        $wrapper.on('loadComments', function() {
            if (loaded) {
                return;
            }

            $wrapper.addClass(classes.loading);

            loadComments();
        });
    };

    var changeCommentsNumber = function(diff) {
        var $counter = $wrapper.find(selectors.counter);
        var postCount = parseInt($counter.attr('data-bimber-dsq-comment-count'), 10);

        postCount += diff;

        // Update Facebook comment count.
        $wrapper.find('.disqus-comment-count').text(postCount);
        $counter.attr('data-bimber-dsq-comment-count', postCount);

        // Update total post comment count.
        var $postCommentCount = $wrapper.parents('#content').find('.entry-comments-link strong');

        var postCommentCount = parseInt($postCommentCount.text(), 10);
        $postCommentCount.text(postCommentCount + diff);

        // Update tab counter.s
        var $dsqCount = $(selectors.tab).find('a > span');

        if ($dsqCount.length > 0) {
            var dsqCount = parseInt($dsqCount.text(), 10);

            $dsqCount.text(dsqCount + diff);
        }

        save(postCount);
    };

    var save = function(newCount) {
        var postId = $wrapper.find(selectors.counter).attr('data-bimber-post-id');
        var nonce  = $wrapper.find(selectors.counter).attr('data-bimber-nonce');

        $.ajax({
            'type': 'POST',
            'url': g1.config.ajax_url,
            'dataType': 'json',
            'data': {
                'action':   'bimber_dsq_update_comment_count',
                'post_id':  postId,
                'security': nonce,
                'count':    newCount
            }
        });
    };

    var loadComments = function() {
        var dsq = document.createElement('script');
        dsq.type = 'text/javascript';
        dsq.async = true;
        dsq.src = 'https://' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    };

})(jQuery);

/*******
 *
 * Menu
 *
 *******/
(function (context, $, i18n) {

    'use strict';

    $(document).ready(function () {
        PrimaryMenu();
    });

    function PrimaryMenu () {
        var that = {};

        that.init = function () {
            that.registerEventsHandlers();

            // add toggle to menu
            $('.menu-item-has-children > a, .menu-item-g1-mega > a').append( '<span class="g1-link-toggle"></span>' );

            return that;
        };

        that.registerEventsHandlers = function () {
            that.handleMenuItemClick();
            that.handleMenuItemFocusOut();
        };

        that.handleMenuItemFocusOut = function () {
            $('body').on('click', function (e) {
                if ($(e.target).parents('.mtm-drop-expanded').length === 0 ) {
                    that.collapseAllOpenedSubmenus();
                }
            });
        };

        that.handleMenuItemClick = function () {
            $('.g1-primary-nav').on('click', '.menu-item > a', function (e) {
                var $menu = $(this).parents('.g1-primary-nav');

                var isSimpleList = $menu.is('#g1-canvas-primary-nav');

                if (g1.isTouchDevice() || isSimpleList) {
                    that.handleMenuTouchEvent($(this), e);
                }
            });
        };

        that.handleMenuTouchEvent = function ($link, event) {
            var $li = $link.parent('li');

            that.collapseAllOpenedSubmenus($li);

            if ($li.hasClass('menu-item-has-children')) {
                event.preventDefault();

                var $helper = $li.find('ul.sub-menu:first > li.g1-menu-item-helper');

                if ($helper.length === 0) {
                    var href = $link.attr('href');
                    var anchor = i18n.go_to + ' <span class="mtm-item-helper-title">'+ $link.text() +'</span>';

                    $helper = $('<li class="menu-item g1-menu-item-helper"><a class="mtm-link" href="'+ href +'"><span class="mtm-link-text"><span class="mtm-link-title">' + anchor +'</span></span></a></li>');

                    $li.find('ul.sub-menu:first').prepend($helper);
                }

                if (!$li.is('.mtm-drop-expanded')) {
                    $li.find('.mtm-drop-expanded .g1-menu-item-helper').remove();
                    $li.addClass('mtm-drop-expanded');
                } else {
                    $li.find('.mtm-drop-expanded').removeClass('mtm-drop-expanded');
                    $li.removeClass('mtm-drop-expanded');
                }
            }
        };

        that.collapseAllOpenedSubmenus = function ($currentItem) {
            if ($currentItem) {
                var $currentMenu = $currentItem.parents('nav');
                var $topLevelLi = $currentItem.parents('li.menu-item');

                // We are at top level of menu
                if($topLevelLi.length === 0) {
                    // Collapse all, except current.
                    // This will collapse current item subtree items but not item itself. Item will be collapse by the "handleMenuTouchEvent" handler.
                    $currentMenu.find('.mtm-drop-expanded').not($currentItem).removeClass('mtm-drop-expanded');
                } else {
                    // Collapse all opened submenus in current menu, except current subtree.
                    $topLevelLi.siblings('li').find('.mtm-drop-expanded').removeClass('mtm-drop-expanded');
                }

                // Collapse all opened submenus in all other menus.
                $('nav').not($currentMenu).find('.mtm-drop-expanded').removeClass('mtm-drop-expanded');
            } else {
                // collapse all opened, site wide, submenus
                $('.mtm-drop-expanded').removeClass('mtm-drop-expanded');
            }
        };

        return that.init();
    }

})(window, jQuery, g1.config.i18n.menu);

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

/**********************
 *
 * Bimber Load Next Post
 *
 **********************/

(function ($) {

    'use strict';

    g1.loadNextPostConfig = {
        'offset': '500%'
    };

    var selectors = {
        'button' :       '.bimber-load-next-post',
        'urlWaypoint':   '.bimber-url-waypoint',
        'elementButton': '.g1-auto-load-button'
    };

    g1.loadNextPost = function () {

        var mainUrl = window.location.href;
        var autoLoadLimit = g1.config.auto_load_limit;
        var loadedPosts = 0;

        var updatePostViews = function(nonce,postId) {
            $.ajax({
                'type': 'POST',
                'url': g1.config.ajax_url,
                'data': {
                    'action':   'update_views_ajax',
                    'wpp_id':   postId,
                    'token':    nonce
                }
            });
        };

        var loadNextEvent = function(e){

            e.preventDefault();

            if (autoLoadLimit > 0 && loadedPosts >= autoLoadLimit){
                $(this).remove();
                return;
            }

            var $button = $(this);
            var template = 'classic';
            $button.css('position','relative');
            $button.addClass('g1-collection-more-loading');
            var postUrl = $('a', this).attr('href');
            var gaPostUrl = $('a', this).attr('data-bimber-analytics-href');
            var url = postUrl + '?bimber_auto_load_next_post_template=' + template;

            $('a', this).remove();

            // load page
            var xhr = $.get(url);
            loadedPosts += 1;

            // on success
            xhr.done(function (data) {
                var $html = $($.parseHTML(data, document, true));
                var $content = $html.find('#content');
                var title = $($content.find('.entry-title')[0]).text();
                var $microshare_template_tag = $content.find('#bimber-front-microshare-autoload');
                var microshare_template = $microshare_template_tag.html();
                $microshare_template_tag.remove();
                $content.find('#secondary').remove();

                // If there are insta embeds BEFORE the load, we will force to refresh them AFTER the load
                var $insta = $('script[src="//platform.instagram.com/en_US/embeds.js"]');

                // make sure that mejs is loaded
                if (typeof window.wp.mediaelement === 'undefined') {
                    var matches = data.match(/<script(.|\n)*?<\/script>/g);
                    var mejsCode = '';
                    matches.forEach(function( match ) {
                        if ( match.indexOf('mejs') > 0 || match.indexOf('mediaelement') > 0 ){
                            match = match.replace('<script','<script async');
                            mejsCode+=match;
                        }
                    });
                    matches = data.match(/<link(.|\n)*?\/>/g);
                    matches.forEach(function( match ) {
                        if ( match.indexOf('mejs') > 0 || match.indexOf('mediaelement') > 0 ){
                            mejsCode+=match;
                        }
                    });
                    $button.after(mejsCode);
                }
                $button.before('<div class="g1-divider"></div>');
                var $scope = $($content.html()).insertAfter($button);

                if ( $insta.length > 0) {
                    window.instgrm.Embeds.process();
                }

                $button.remove();

                g1.shareContentElements($scope,microshare_template);
                $('body').trigger( 'g1NewContentLoaded', [ $scope ] );

                if (typeof window.wp.mediaelement !== 'undefined') {
                    window.wp.mediaelement.initialize();
                }

                if ( g1.stickyEnabled ) {
                    g1.updateStickySidebar();
                }

                // Google Analytics.
                if ( typeof ga !== 'undefined') {
                    ga('create', ga.getAll()[0].get('trackingId'), 'auto');
                    ga('set', { page: gaPostUrl, title: title });
                    ga('send', 'pageview');
                }

                // WPP Ajax.
                var $nonce = $html.find('#bimber-wpp-nonce');
                if ($nonce.length>0){
                    var nonce  = $nonce.attr('data-bimber-wpp-nonce');
                    var postId = $nonce.attr('data-bimber-wpp-id');
                    updatePostViews(nonce,postId);
                }
                bindEvents();
            });

            xhr.always(function () {
                $button.removeClass('g1-collection-more-loading');
            });
        };

        var bindEvents = function() {
            $(selectors.button).click(loadNextEvent);

            $(selectors.elementButton).click(function(){
                window.history.replaceState( {} , '', mainUrl );
            });

            $(selectors.button).waypoint(function(direction) {
                if('down' === direction) {
                    $(selectors.button).trigger('click');
                }
            }, {
                offset: g1.loadNextPostConfig.offset
            });

            $(selectors.urlWaypoint).waypoint(function(direction) {
                var $waypoint = $(this.element);
                if('up' === direction) {
                    var $waypointUp = $waypoint.parent('article').prev('.bimber-url-waypoint');
                    if ($waypointUp.length > 0){
                        $waypoint = $waypointUp;
                    }
                }

                var url = $waypoint.attr('data-bimber-post-url');
                var title = $waypoint.attr('data-bimber-post-title');
                var currentUrl = window.location.href;
                if ( url !== currentUrl ){
                    var $article = $waypoint.next('article');
                    var $mashShare = $('.mashsb-container', $article);
                    var $shareBar = $('.g1-sharebar .g1-sharebar-inner');
                    if ( $mashShare.length >0 && $.trim($shareBar.html())) {
                        $shareBar.html($mashShare[0].outerHTML);
                    }
                    g1.customizeShareButtons();
                    window.history.replaceState( {} , '', url );
                    document.title = title;
                }
            });
        };

        bindEvents();
    };

})(jQuery);

/**********************
 *
 * Auto Play Video
 *
 **********************/

(function ($) {

    'use strict';

    var selectors = {
        'videoPost':         '.archive-body-stream .entry-tpl-stream .entry-featured-media:not(.entry-media-nsfw-embed)',
        'videoWrapper':      '.g1-fluid-wrapper-inner',
        'videoIframe':       '.g1-fluid-wrapper-inner iframe',
        'maceButton':        '.g1-fluid-wrapper-inner .mace-play-button',
        'embedly':           '.embedly-card iframe',
        'mejs':              '.mejs-video',
        'mejsButton':        '.mejs-video .mejs-overlay-button',
        'mejsPause':         '.mejs-video .mejs-pause',
        'mejsPlay':          '.mejs-video .mejs-play',
        'mejsMute':          '.mejs-video .mejs-mute button',
        'jsgif':             '.jsgif',
        'html5Video':         '.snax-native-video'
    };

    var isAutoPlayEnabled   = g1.config.auto_play_videos;
    var playingIds          = [];   // Ids of all posts currently playing.
    var playingQueue        = [];   // All "videPosts" currently playing.
    var playedIds           = [];   // Ids of all posts playing or played (if id is here, we resume it instead of play next time).

    g1.autoPlayVideo = function () {

        if ( ! isAutoPlayEnabled ) {
            return;
        }

        var addToQueue = function(element) {
            var postId = $(element).parents('article').attr('id');

            playingQueue.push(element);
            playingIds.push(postId);
            playedIds.push(postId);
        };

        var getFromQueue = function() {
            var element = playingQueue.pop();

            var postId = $(element).parents('article').attr('id');
            var index  = playingIds.indexOf(postId);

            if (index > -1) {
                playingIds.splice(index, 1);
            }

            return element;
        };

        var pauseAllVideos = function() {
            if (playingQueue.length === 0) {
                return;
            }

            g1.log('Pause all videos');
            g1.log(playingQueue);

            while (playingQueue.length > 0) {
                var element = getFromQueue();

                pause(element);
            }
        };

        var play = function(element) {
            var postId   = $(element).parents('article').attr('id');
            var $iframe  = $(selectors.videoIframe, element);
            var $embedly = $(selectors.embedly, element);
            var $mace    = $(selectors.maceButton, element);
            var $mejs    = $(selectors.mejsButton, element);
            var $jsgif   = $(selectors.jsgif, element);
            var $html5   = $(selectors.html5Video, element);
            var videosInPost = $iframe.length + $embedly.length + $mace.length + $mejs.length + $jsgif.length + $html5.length;

            // Element is a video to play?
            if (videosInPost > 0) {
                // Before playing this video we want to make sure that others video are paused too.
                pauseAllVideos();
            } else {
                return;
            }

            // IFRAME.
            if ($iframe.length > 0 ) {
                var iframesrc = false;

                if ($iframe.attr('data-src')) {
                    iframesrc= $iframe.attr('data-src');
                } else {
                    iframesrc= $iframe.attr('src');
                }

                if ( iframesrc ) {
                    var separator = '?';

                    if (iframesrc.indexOf('?') > 0){
                        separator = '&';
                    }

                    if (iframesrc.indexOf('youtu') > 0){
                        // Already played?
                        if (-1 !== playedIds.indexOf(postId)) {
                            // Resume.
                            $iframe[0].contentWindow.postMessage(JSON.stringify({
                                    'event': 'command',
                                    'func': 'playVideo',
                                    'args': ''}),
                                '*');
                        } else {
                            $iframe.on('load', function() {
                                // Mute on load.
                                $iframe[0].contentWindow.postMessage(JSON.stringify({
                                        'event': 'command',
                                        'func': 'mute',
                                        'args': ''}),
                                    '*');
                            });

                            $iframe.attr('src', iframesrc + separator + 'autoplay=1&enablejsapi=1');
                        }
                    }

                    if (iframesrc.indexOf('dailymotion') > 0){
                        // Already played?
                        if (-1 !== playedIds.indexOf(postId)) {
                            $iframe[0].contentWindow.postMessage('play', '*');
                        } else {
                            // Mute on load.
                            $iframe.attr('src', iframesrc + separator + 'autoplay=1&api=postMessage&mute=1');
                        }
                    }

                    if (iframesrc.indexOf('vimeo') > 0){
                        // Already played?
                        if (-1 !== playedIds.indexOf(postId)) {
                            // Resume playing.
                            $iframe[0].contentWindow.postMessage(JSON.stringify({
                                method: 'play'
                            }), '*');
                        } else {
                            // Mute on load.
                            $iframe.on('load', function() {
                                $iframe[0].contentWindow.postMessage(JSON.stringify({
                                    method: 'setVolume',
                                    value:  0
                                }), '*');
                            });

                            $iframe.attr('src', iframesrc + separator + 'autoplay=1&autopause=0');
                        }
                    }
                }
            }

            // Embedly player.
            if (typeof embedly !== 'undefined'){
                if ($embedly.length > 0 ) {
                    // the following iterates over all the instances of the player.
                    embedly('player', function(player){
                        if ($embedly[0] === $(player.frame.elem)[0]) {
                            player.play();
                            player.mute();
                        } else {
                            player.pause();
                        }
                    });
                } else {
                    embedly('player', function(player){
                        player.pause();
                    });
                }
            }

            // MediaAce YouTube lazy loader.
            if ($mace.length > 0) {
                var $maceWrapper = $mace.parent();

                // Mute on load.
                $maceWrapper.on('maceIframeLoaded', function(e, $iframe) {
                    $iframe[0].contentWindow.postMessage(JSON.stringify({
                            'event': 'command',
                            'func': 'mute',
                            'args': ''}),
                        '*');
                });

                $mace.trigger('click');
            }

            // MEJS player (MP4).
            if ($mejs.length > 0) {
                $mejs.trigger('click');

                // Mute on load.
                var playerId = $mejs.parents('.mejs-container').attr('id');

                if (playerId && mejs && typeof mejs.players !== 'undefined') {
                    var player = mejs.players[playerId];

                    player.setVolume(0);
                }
            }

            // GIF player.
            if ( $jsgif.length > 0 ) {
                setTimeout(function() {
                    $jsgif.trigger('bimberPlayGif');
                }, 500);
            }

            // Native HTML5 videos
            if ( $html5.length > 0 ) {
                $html5[0].play();
            }

            addToQueue(element);
        };

        var pause = function (element) {
            var $triggerediframe = $(selectors.videoIframe, element);

            if ($triggerediframe.length > 0 ) {
                var iframesrc=false;
                if ($triggerediframe.attr('data-src')) {
                    iframesrc= $triggerediframe.attr('data-src');
                } else {
                    iframesrc= $triggerediframe.attr('src');
                }
                if ( iframesrc ) {
                    if (iframesrc.indexOf('youtu') > 0){
                        $triggerediframe[0].contentWindow.postMessage(JSON.stringify({
                                'event': 'command',
                                'func': 'pauseVideo',
                                'args': ''}),
                            '*');
                    }
                    if (iframesrc.indexOf('dailymotion') > 0){
                        $triggerediframe[0].contentWindow.postMessage('pause', '*');
                    }
                    if (iframesrc.indexOf('vimeo') > 0){
                        $triggerediframe[0].contentWindow.postMessage(JSON.stringify({
                            method: 'pause'
                        }), '*');
                    }
                }
            }

            if (typeof embedly !== 'undefined'){
                var $embedly = $(selectors.embedly,element);
                if ($embedly.length > 0 ) {
                    embedly('player', function(player){
                        if ($embedly[0] === $(player.frame.elem)[0]) {
                            player.pause();
                        }
                    });
                }
            }

            $(selectors.mejsPause, element).trigger('click');

            var $jsgif   = $(selectors.jsgif, element);
            $jsgif.trigger('bimberPauseGif');

            var $html5 = $(selectors.html5Video, element);
            if ( $html5.length > 0 ) {
                $html5[0].pause();
            }
        };

        // If video post id is still in array, video is still in viewport and can be played.
        var canBeAutoPlayed = function(postId) {
            return isAutoPlayEnabled && -1 !== playingIds.indexOf(postId);
        };

        var bindEvents = function() {

            // Delay waypoint. User scroll activate events.
            var scrollEvents = 0;
            var allowPlaying = false;

            // Wait for user scroll. Not scroll event while page loading.
            $(document).scroll(function() {
                scrollEvents++;

                if (scrollEvents > 5) {
                    allowPlaying = true;
                }
            });

            // ENTER, while up to down scrolling.
            $(selectors.videoPost).waypoint(function(direction) {
                if ('down' === direction) {
                    if (allowPlaying) {
                        g1.log('Play video (enter, direction: down)');

                        play(this.element);
                    }

                }
            }, {
                // When the bottom of the element hits the bottom of the viewport.
                offset: 'bottom-in-view'
            });

            // ENTER, while down to up scrolling.
            $(selectors.videoPost).waypoint(function(direction) {
                if ('up' === direction) {
                    if (allowPlaying) {
                        g1.log('Play video (enter, direction: up)');

                        play(this.element);
                    }
                }
            }, {
                // When the top of the element hits the top of the viewport.
                offset: '0'
            });

            // EXIT, while up to down scrolling.
            $(selectors.videoPost).waypoint(function(direction) {
                if ('down' === direction) {
                    g1.log('Pause (exit, direction: down)');

                    pause(this.element);
                }
            }, {
                offset: function() {
                    // Fires when top of the element is (HALF OF ELEMENT HEIGHT)px from the top of the window.
                    return -Math.round(this.element.clientHeight / 2);
                }
            });

            // EXIT, while down to up scrolling.
            $(selectors.videoPost).waypoint(function(direction) {
                if ('up' === direction) {
                    g1.log('Pause (exit, direction: up)');

                    pause(this.element);
                }
            }, {
                offset: function() {
                    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

                    // Fires when top of the element is (HALF OF ELEMENT HEIGHT)px from the bottom of the window.
                    return viewportHeight - Math.round(this.element.clientHeight / 2);
                }
            });

            // Play GIF on load.
            $(document).on('bimberGifPlayerLoaded', function(e, $canvasWrapper) {
                var postId = $canvasWrapper.parents('article').attr('id');

                if (canBeAutoPlayed(postId)) {
                    $canvasWrapper.trigger('bimberPlayGif');
                }
            });
        };

        bindEvents();
    };

})(jQuery);

/**************************
 *
 * MyCred Notifications
 * (images, video)
 *
 **************************/

(function ($) {

    'use strict';

    g1.myCredNotifications = function () {

        var setTimeoutForFirstNotification = function() {
            if ( $('.g1-mycred-notice-overlay-standard').attr('data-g1-mycred-notice-timeout') && $('.g1-notification-standard').length > 0) {
                var timeout = $('.g1-mycred-notice-overlay-standard').attr('data-g1-mycred-notice-timeout');
                var firstNotification = $('.g1-notification-standard')[0];
                setTimeout(function() {
                    firstNotification.remove();
                    setTimeoutForFirstNotification();
                }, timeout * 1000);
            }
        };

        var bindStandardNotificationEvents = function() {
            if ($('.g1-mycred-notice-overlay').length > 0 || $('.g1-mycred-notice-overlay-standard').length < 1) {
                return;
            }
            $('.g1-notification-standard-close').on('click', function (e) {
                $(this).closest('.g1-notification-standard').remove();
                setTimeoutForFirstNotification();
            });
            setTimeoutForFirstNotification();
        };

        $('.g1-mycred-notice-close').on('click', function (e) {
            $(this).closest('g1-mycred-notice-overlay').remove();
            bindStandardNotificationEvents();
        });

        $('.g1-mycred-notice-overlay').on('click', function (e) {
            $(this).remove();
            bindStandardNotificationEvents();
        }).children().click(function(e) {
            if (!$(e.target).hasClass('g1-mycred-notice-close')){
                return false;
            }
        });

        bindStandardNotificationEvents();

        $('.g1-mycred-notice-share-twitter').on('click', function (e) {
            e.preventDefault();
            window.open($(this).attr('href'), 'Google', 'width=500,height=300');
        });

        var noticesTop = $('#wpadminbar').outerHeight() + $('.g1-sticky-top-wrapper').outerHeight();
        $('.g1-mycred-notice-overlay-standard').css('top', noticesTop);
    };

})(jQuery);

/**************************
 *
 * Archive filters
 *
 **************************/

(function ($) {

    'use strict';

    g1.archiveFilters = function () {
        $('#g1-archive-filter-select').on('change', function() {
            var $this = $(this);
            $('option:selected', $this).each(function() {
                window.location.href = $(this).attr('data-g1-archive-filter-url');
            });
        });
    };

})(jQuery);

/****************
 *
 * Popup/Slideup
 *
 ****************/

(function ($) {
    'use strict';
    g1.popup = function () {
		var
		HTMLBase          = $('html'),
		Popup             = $('.g1-popup-newsletter'),
		PopupCookie       = g1.readCookie('g1_popup_disabled'),
		PopupCloser       = $('.g1-popup-base, .g1-popup-closer');
		// If we dont have popup exit.
		if( PopupCookie ){ HTMLBase.addClass('exit-intent-disabled'); }
		if( Popup.length <= 0 ){ return; }
		$(document).on('mouseleave', function(e){
			if( e.clientY < 10 && ! HTMLBase.hasClass('exit-intent-disabled') && ! HTMLBase.hasClass('g1-slideup-visible') ){
				HTMLBase.addClass('g1-popup-visible').addClass('exit-intent-disabled');
			}
		});
		PopupCloser.on('click', function(e){
			e.preventDefault();
			HTMLBase.removeClass('g1-popup-visible');
	        g1.createCookie('g1_popup_disabled', 1, 24 * 60 * 60 * 1000);
		});
    }
    g1.slideup = function () {
		var
		HTMLBase           = $('html'),
		Slideup            = $('.g1-slideup-newsletter'),
		SlideupCloser      = $('.g1-slideup-newsletter-closer'),
		SlideupCookie      = g1.readCookie('g1_slideup_disabled'),
		ScrollPositon      = $(document).scrollTop(),
		ScrollTarget       = $('.single-post article .entry-content'),
		ScrollTargetOffset = ScrollTarget.offset(),
		ScrollTargetHeight = ScrollTarget.height(),
		ShowOn             = 50;
		// If we dont have popup exit.
		SlideupCloser.on('click', function(e){
			e.preventDefault();
			HTMLBase.removeClass('g1-slideup-visible').addClass('slideup-intent-disabled');
	        g1.createCookie('g1_slideup_disabled', 1, 24 * 60 * 60 * 1000);
		});
		if( SlideupCookie ){ HTMLBase.addClass('slideup-intent-disabled'); }
		if( Slideup.length <= 0 ){ return; }
		if( ScrollTarget.length <= 0 ){ return; }
		$(window).on('scroll', function(){
			ScrollPositon      = $(document).scrollTop();
			ScrollTargetOffset = ScrollTarget.offset();
			ScrollTargetHeight = ScrollTarget.height();
			if( ( (ScrollPositon - ScrollTargetOffset.top) / (ScrollTargetHeight) ).toFixed(6) * 100 >= ShowOn && ! HTMLBase.hasClass('slideup-intent-disabled') && ! HTMLBase.hasClass('g1-popup-visible') ){
				HTMLBase.addClass('g1-slideup-visible');
			}
		});
    }
})(jQuery);
