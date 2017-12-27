/*!
 * Google Publisher Tag Ads Catfish implementation
 *
 * @link https://github.com/nechehin/gpt-catfish
 */

/**
 * Google-tag catfish
 *
 * @version 0.0.11
 * @param {Object} gt GoogleTag object instance
 * @return {Object}
 */
function googletagCatfish(gt) {
    'use strict';

    var winWidth = window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;

    var debug = !!~location.search.indexOf('gpt-catfish-debug');
    var autoCloseTimeout = false;
    var backgroundColor = 'transparent';
    var zIndex = '999999';
    var defaultMode = false;

    var adsPlaceId = 'catfish-ads';

    var adsBox, adsCloseButton, adsPlace = null;

    var ADS_MODES = {
        FULLSCREEN: 'catfish-ads--fullscreen',
        BOTTOM: 'catfish-ads--bottom'
    }

    var SLOTS = {};
    var SLOTS_MODES = {};

    var EVENTS = {
        RENDERED: 'rendered',
        CLOSED: 'closed',
        EMPTY: 'empty'
    };

    var CLOSE_BUTTON_OPTIONS = {};
    CLOSE_BUTTON_OPTIONS[ADS_MODES.FULLSCREEN] = { position: { top: '5px', left: '5px' }, size: '25px'};
    CLOSE_BUTTON_OPTIONS[ADS_MODES.BOTTOM] = { position: { top: '-15px', left: '5px' }, size: '25px'};

    var adsRendered = false;


    /**
     * Log message if debug enabled
     *
     * @param {String} msg
     * @returns {Void}
     */
    function log(msg) {
        if (debug) {
            console.log('googletagCatfish: ' + msg);
        }
    }


    /**
     * Create ads box element
     *
     * @return {Void}
     */
    function createCatfishBox() {
        adsBox = document.createElement('div');
        adsBox.className = 'gt-catfish-box';

        adsPlace = document.createElement('div');
        adsPlace.className = 'gt-catfish__place';
        adsPlace.id = adsPlaceId;

        adsBox.appendChild(adsPlace);

        adsCloseButton = document.createElement('a');
        adsCloseButton.className = 'gt-catfish__button-close';
        adsCloseButton.onclick = hideAdsBox;
        adsBox.appendChild(adsCloseButton);

        document.body.appendChild(adsBox);
    }


    /**
     * Create ads box element
     *
     * @return {Void}
     */
    function createSlotBox(slot) {
        var slotBox = document.createElement('div');
        slotBox.id = slotId(slot);
        adsPlace.appendChild(slotBox);
        return slotBox;
    }


    /**
     * Load ads styles
     *
     * @return {Void}
     */
    function createCatfishStyle() {
        var css = '.gt-catfish-box { display: none; background-color: ' + backgroundColor + '; }';
        css += '.gt-catfish-box.catfish-ads--visible { display: flex; position: fixed; align-items: center; justify-content: center; z-index: ' + zIndex + '; }';
        css += '.catfish-ads--fullscreen { top: 0; right: 0; bottom: 0; left: 0; }';
        css += '.catfish-ads--bottom { right: 0; bottom: 0; left: 0; }';
        css += '.gt-catfish__button-close { display:block; position:absolute; background-color:#000; border-radius:50%; border:2px solid #fff; box-shadow:0 0 3px #666;background-size:100% 100%;background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDQ4IDQ4IiB3aWR0aD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTM4IDEyLjgzbC0yLjgzLTIuODMtMTEuMTcgMTEuMTctMTEuMTctMTEuMTctMi44MyAyLjgzIDExLjE3IDExLjE3LTExLjE3IDExLjE3IDIuODMgMi44MyAxMS4xNy0xMS4xNyAxMS4xNyAxMS4xNyAyLjgzLTIuODMtMTEuMTctMTEuMTd6IiBmaWxsPSIjZmZmZmZmIi8+Cjwvc3ZnPg==) }';
        css += '.gt-catfish__place, .gt-catfish__place div { position: relative; max-width: 100%; max-height: 100%; }';

        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        (document.head || document.getElementsByTagName('head')[0]).appendChild(style);
    }


    /**
     * Show ads in mode
     *
     * @param {String} mode
     * @returns {Void}
     */
    function showAdsBox(mode) {
        applyCloseButtonStyles(mode);
        adsBox.className += ' catfish-ads--visible ' + mode;
    }


    /**
     * Apply close button styles
     *
     * @param {String} mode
     */
    function applyCloseButtonStyles(mode) {
        for (var i in CLOSE_BUTTON_OPTIONS[mode].position) {
            if (CLOSE_BUTTON_OPTIONS[mode].position[i]) {
                adsCloseButton.style[i] = CLOSE_BUTTON_OPTIONS[mode].position[i];
            }
        }
        adsCloseButton.style.width = CLOSE_BUTTON_OPTIONS[mode].size;
        adsCloseButton.style.height = CLOSE_BUTTON_OPTIONS[mode].size;
    }


    /**
     * Hide ads
     *
     * @returns {Void}
     */
    function hideAdsBox() {
        adsBox.className = adsBox.className.replace('catfish-ads--visible', '');
        fireEvent(EVENTS.CLOSED);
    }


    /**
     * Get ID for slot container
     *
     * @param {String} slot
     * @return {String}
     */
    function slotId(slot) {
        return slot.replace(/[^\w]/gi,'');
    }


    /**
     * Create slot string key
     *
     * @param {String} slot
     * @param {Array} size Array of with and height, as [width, height]
     * @param {String} mode
     * @return {String}
     */
    function slotSizeKey(slot, size) {
        return slot + '-' + size.join('x');
    }


    /**
     * Check if mode exists
     *
     * @param {String} mode
     * @return {Boolean}
     */
    function verifyMode(mode) {
        for (var m in ADS_MODES) {
            if (ADS_MODES[m] === mode) {
                return true;
            }
        }
        return false;
    }


    /**
     * Add googletag slot
     *
     * @param {String} slot
     * @param {Array} size Array of with and height, as [width, height]
     * @param {String} mode
     * @returns {Boolean}
     */
    function addSlot(slot, size, mode) {

        if (!verifyMode(mode)) {
            log('Undefined mode: ' + mode);
            return false;
        }

        SLOTS[slot] = SLOTS[slot] || { sizes: [] };
        SLOTS[slot].sizes.push(size);
        SLOTS_MODES[slotSizeKey(slot, size)] = mode;
        return true;
    }


    /**
     * Define slots
     *
     * @returns {Void}
     */
    function initSlots() {
        gt.cmd.push(function() {
            for (var slot in SLOTS) {
                if (Object.prototype.hasOwnProperty.call(SLOTS, slot)) {
                    if (!SLOTS[slot].dom) {
                        SLOTS[slot].dom = createSlotBox(slot);
                    }
                    gt.defineSlot(slot, SLOTS[slot].sizes, SLOTS[slot].dom.id).addService(gt.pubads());
                }
            }
        });
    }


    /**
     * Try to display ads
     *
     * @return {Void}
     */
    function requestAds() {
        for (var slot in SLOTS) {
            if (Object.prototype.hasOwnProperty.call(SLOTS, slot) && SLOTS[slot].dom) {
                gt.display(SLOTS[slot].dom);
            }
        }
    }


    /**
     * Fire catfish event
     *
     * @param {String} eventName
     */
    function fireEvent(eventName) {
        var event = document.createEvent('Event');
        event.initEvent(eventName, true, true);
        document.dispatchEvent(event);
    }


    /**
     * slotRenderEnded gpt event listener
     *
     * @param {Object} event
     * @return {Void}
     */
    function onSlotRenderEnded(event) {

        if (!(event.slot.getAdUnitPath() in SLOTS)) {
            return;
        }

        if (event.isEmpty) {
            log('Empty ads response from slot ' + event.slot.getAdUnitPath());
            fireEvent(EVENTS.EMPTY);
            return;
        }

        if (adsRendered) {
            log('Warning: multiple ads was rendered');
        }

        var renderedSlotSizeKey = slotSizeKey(event.slot.getAdUnitPath(), event.size);

        if (renderedSlotSizeKey in SLOTS_MODES) {
            showAds(event, SLOTS_MODES[renderedSlotSizeKey]);
            return;
        }

        if (!defaultMode) {
            log('Undefined mode for slot ' + event.slot.getAdUnitPath() + ' size ' + event.size.join('x'));
            return;
        }

        log('Render slot ' + event.slot.getAdUnitPath() + ' size ' + event.size.join('x') + ' in default mode: ' + defaultMode);

        showAds(event, defaultMode);
    }


    /**
     * Show ads in mode
     *
     * @param {String} slot
     * @param {String} mode
     */
    function showAds(event, mode) {

        log('rendered slot ' + event.slot.getAdUnitPath() +
            ' size ' + event.size.join('x') +
            ' mode ' + mode);

        showAdsBox(mode);

        fireEvent(EVENTS.RENDERED);

        adsRendered = true;
    }


    /**
     * Set default ads mode
     *
     * @param {String} mode
     * @returns {boolean}
     */
    function setDefaultMode(mode) {

        if (!verifyMode(mode)) {
            log('Undefined mode: ' + mode);
            return false;
        }

        defaultMode = mode;
        return true;
    }



    return {

        EVENTS: EVENTS,
        MODES: ADS_MODES,

        addEventListener: function(eventName, listener) {
            document.addEventListener(eventName, listener);
            return this;
        },


        /**
         * Enable or disable debug
         *
         * @param {Boolean} enabled
         * @returns {Object}
         */
        debug: function(enabled) {
            debug = enabled;
            return this;
        },


        /**
         * Set autoclose timeout
         *
         * @param {Numeric} timeout Timeout in ms
         * @returns {Object}
         */
        autoCloseTimeout: function(timeout) {
            autoCloseTimeout = timeout;
            return this;
        },


        /**
         * Set background color
         *
         * @param {String} color Background color, #fff, rgba(0,0,0) etc (default transparent)
         * @returns {Object}
         */
        backgroundColor: function(color) {
            backgroundColor = color;
            return this;
        },


        /**
         * Set catfish zIndex
         *
         * @param {String} value new catfish zIndex
         * @returns {Object}
         */
        zIndex: function(value) {
            zIndex = value;
            return this;
        },


        /**
         * Get google tag instance
         *
         * @returns {Object}
         */
        googletag: function() {
            return gt;
        },


        /**
         * Add fullscreen mode googletag slot
         *
         * @param {String} slot
         * @param {Array} size
         * @returns {Object}
         */
        addFullscreenModeSlot: function(slot, size) {
            addSlot(slot, size, ADS_MODES.FULLSCREEN);
            return this;
        },


        /**
         * Add bottom mode googletag slot
         *
         * @param {String} slot
         * @param {Array} size
         * @returns {Object}
         */
        addBottomModeSlot: function(slot, size) {
            addSlot(slot, size, ADS_MODES.BOTTOM);
            return this;
        },


        /**
         * Execute if window size will match params
         *
         * @param {Number} minWidth
         * @param {Number} maxWidth
         * @param {Function} cb
         * @returns {Object}
         */
        addWidth: function(minWidth, maxWidth, cb) {

            if (winWidth < minWidth || winWidth > maxWidth ) {
                log('width ' + minWidth + '-' + maxWidth + ' (' + winWidth + ') - skiped');
                return this;
            }

            log('width ' + minWidth + '-' + maxWidth + ' - added');

            cb.call(this);

            return this;
        },


        /**
         * Set fullscreen mode as default
         *
         * @returns {Object}
         */
        setDefaultModeFullscreen: function() {
            setDefaultMode(ADS_MODES.FULLSCREEN);
            return this;
        },


        /**
         * Set bottom mode as default
         *
         * @returns {Object}
         */
        setDefaultModeBottom: function() {
            setDefaultMode(ADS_MODES.BOTTOM);
            return this;
        },


        /**
         * Render catfish ads
         *
         * @returns {Object}
         */
        render: function() {

            if (!Object.keys(SLOTS).length) {
                log('render skiped: no slots');
                return;
            }

            log('render');

            createCatfishStyle();
            createCatfishBox();

            initSlots();

            this.googletag().cmd.push((function() {

                this.googletag().pubads().enableSingleRequest();
                this.googletag().enableServices();

                // add event to sign the slot as rendered or not
                this.googletag().pubads().addEventListener('slotRenderEnded', onSlotRenderEnded);

                requestAds();

            }).bind(this));

            // Autoclose timeout
            if (autoCloseTimeout) {
                setTimeout(hideAdsBox, autoCloseTimeout);
            }

            return this;
        },


        bottomModeCloseButtonPosition: function(position) {
            CLOSE_BUTTON_OPTIONS[ADS_MODES.BOTTOM].position = position;
        },


        bottomModeCloseButtonSize: function(size) {
            CLOSE_BUTTON_OPTIONS[ADS_MODES.BOTTOM].size = size;
        },


        fullscreenModeCloseButtonPosition: function(position) {
            CLOSE_BUTTON_OPTIONS[ADS_MODES.FULLSCREEN].position = position;
        },


        fullscreenModeCloseButtonSize: function(size) {
            CLOSE_BUTTON_OPTIONS[ADS_MODES.FULLSCREEN].size = size;
        }

    };
}

// Async init
if ('google-tag-catfish' in window && 'googletag' in window) {
    window['google-tag-catfish'](googletagCatfish(window.googletag));
}
