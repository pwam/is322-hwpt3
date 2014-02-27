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
