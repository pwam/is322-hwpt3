 (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                    window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                        timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());

    var PullToRefresh = (function() {
        function Main(container, slidebox, slidebox_icon, handler) {
            var self = this;

            this.breakpoint = 80;

            this.container = container;
            this.slidebox = slidebox;
            this.slidebox_icon = slidebox_icon;
            this.handler = handler;

            this._slidedown_height = 0;
            this._anim = null;
            this._dragged_down = false;

            this.hammertime = Hammer(this.container)
                .on("touch dragdown release", function(ev) {
                    self.handleHammer(ev);
                });
        };
        Main.prototype.handleHammer = function(ev) {
            var self = this;

            switch(ev.type) {
                // reset element on start
                case 'touch':
                    this.hide();
                    break;

                // on release we check how far we dragged
                case 'release':
                    if(!this._dragged_down) {
                        return;
                    }

                    // cancel animation
                    cancelAnimationFrame(this._anim);

                    // over the breakpoint, trigger the callback
                    if(ev.gesture.deltaY >= this.breakpoint) {
                        container_el.className = 'pullrefresh-loading';
                        pullrefresh_icon_el.className = 'icon loading';

                        this.setHeight(60);
                        this.handler.call(this);
                    }
                    // just hide it
                    else {
                        pullrefresh_el.className = 'slideup';
                        container_el.className = 'pullrefresh-slideup';

                        this.hide();
                    }
                    break;

                // when we dragdown
                case 'dragdown':
                    this._dragged_down = true;

                    // if we are not at the top move down
                    var scrollY = window.scrollY;
                    if(scrollY > 5) {
                        return;
                    } else if(scrollY !== 0) {
                        window.scrollTo(0,0);
                    }

                    // no requestAnimationFrame instance is running, start one
                    if(!this._anim) {
                        this.updateHeight();
                    }

                    // stop browser scrolling
                    ev.gesture.preventDefault();

                    // update slidedown height
                    // it will be updated when requestAnimationFrame is called
                    this._slidedown_height = ev.gesture.deltaY * 0.4;
                    break;
            }
        };
