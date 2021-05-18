

// updates
// handler reachment back animation
// dynamic handler height

{
    // html selectors
    let scroll = '.js-wheelScroll';
    let scroll__outer = '.js-wheelScroll__outer';
    let scroll__inner = '.js-wheelScroll__inner';
    let scroll__rail = '.js-wheelScroll__rail'
    let scroll__handler = '.js-wheelScroll__handler';

    class WheelScroll {
        constructor(selector) {
            // selectors
            this.sc = selector;
            this.sc_outer = $(this.sc).find(scroll__outer);
            this.sc_inner = $(this.sc).find(scroll__inner);
            this.sc_rail = $(this.sc).find(scroll__rail);
            this.sc_handler = $(this.sc).find(scroll__handler);

            this.events();
        }

        events() {
            // restore object pointer
            let obj = this;

            // hide & show rail
            obj.sc_outer.on({

                mouseenter: function () {
                    // if scroll__inner has overflowed
                    if ($(this).height() < obj.sc_inner.height()) {
                        obj.sc_rail.addClass('wheelScroll__rail-active');
                        obj.sc_handler.addClass('wheelScroll__handler-active');
                    }
                },

                mouseleave: function () {
                    obj.sc_rail.removeClass('wheelScroll__rail-active');
                    obj.sc_handler.removeClass('wheelScroll__handler-active');
                },

                // update handler pos by scrolling with mouse wheel
                scroll: function () {
                    let sc_percent = ($(this).scrollTop()) / ($(this).get(0).scrollHeight - $(this).innerHeight() + 17);
                    obj.sc_handler.css('top', sc_percent * (obj.sc_rail.height() - obj.sc_handler.height()));
                }
            })

            // scroll by moving handler
            obj.sc_handler.on('mousedown touchstart', function (e) {

                // add active class untile mouseup -> show rail & handler until mouseup
                obj.sc_rail.addClass('wheelScroll__rail-run-active');
                obj.sc_handler.addClass('wheelScroll__handler-run-active');

                // static vars
                let sc_height = obj.sc_rail.height() - obj.sc_handler.height() - 17;
                let con_height = obj.sc_inner.height() - obj.sc_outer.height() + 17;
                let last_top = parseInt($(this).css('top'));
                let first_touch = e.clientY || e.originalEvent.touches[0].pageY;

                $(document).mousemove(function (event) {

                    // dynamic vars
                    let now_touch = event.pageY || event.originalEvent.touches[0].pageY;
                    let delta_mouse = now_touch - first_touch;
                    let calc_sc = last_top + delta_mouse;
                    let sc_top_percent = calc_sc / sc_height;
                    let calc_con_top = sc_top_percent * con_height;

                    if (sc_top_percent >= 0 && sc_top_percent <= 1) {
                        // scroll__handler pos
                        obj.sc_handler.css('top', calc_sc);
                        // scroll__outer scrollTop pos
                        obj.sc_outer.scrollTop(calc_con_top);

                    } else if (sc_top_percent < 0 && sc_top_percent >= -0.8) {
                        // animation for top limitation reachment
                        obj.sc_handler.css('top', (obj.sc_handler.height() * sc_top_percent));

                    } else if (sc_top_percent > 1 && sc_top_percent <= 1.8) {
                        // animation for bottom limitation reachment
                        obj.sc_handler.css('top', (obj.calc_last_top() + obj.sc_handler.height() * (sc_top_percent - 1)));
                    }

                })
            });

            $(document).on('mouseup touchend', function () {
                $(document).off('mousemove touchmove');
                $('.wheelScroll__handler-run-active').removeClass('wheelScroll__handler-run-active');
                $('.wheelScroll__rail-run-active').removeClass('wheelScroll__rail-run-active');

                // rePos handler if reaches limitations
                if (obj.calc_now_top() < 0) {
                    obj.sc_handler.css('top', '0px');
                    obj.top_limit_reachment = false;
                } else if (obj.calc_last_top() < obj.calc_now_top()) {
                    obj.sc_handler.css('top', (obj.calc_last_top() + 'px'));
                    obj.bottom_limit_reachment = false;
                }
            })
        }

        calc_now_top() {
            return parseInt(this.sc_handler.css('top'));
        }

        calc_last_top() {
            return this.sc_rail.height() - this.sc_handler.height();
        }
    }

    // initilize
    document.querySelectorAll('.js-wheelScroll').forEach(function (item) {
        new WheelScroll(item);
    })
}