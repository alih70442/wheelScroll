

// updates
// dynamic handler height
// update values
// options
// horizanol scroll
// horizanol & vertical togather
// auto make

{
    // html selectors
    let scroll__y = '.js-wheelScroll__y';
    let scroll__outer__y = '.js-wheelScroll__outer__y';
    let scroll__inner__y = '.js-wheelScroll__inner__y';
    let scroll__rail__y = '.js-wheelScroll__rail__y'
    let scroll__handler__y = '.js-wheelScroll__handler__y';

    class WheelScroll {
        constructor(selector) {
            // selectors
            this.sc = selector;
            this.sc_outer;
            this.sc_inner;
            this.sc_rail;
            this.sc_handler;

            this.init_html();
            this.init_style();
            this.is_disable();
            this.events();
        }

        events() {
            // restore object pointer
            let obj = this;

            // hide & show rail
            obj.sc_outer.on({

                mouseenter: function () {
                    // if scroll__inner has overflowed
                    if (obj.is_disable() == false) {
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
                    let sc_percent = $(this).scrollTop() / ($(this).get(0).scrollHeight - $(this).height());
                    obj.sc_handler.css('top', sc_percent * (obj.sc_rail.height() - obj.sc_handler.height()));
                }
            });

            // scroll by moving handler
            obj.sc_handler.on('mousedown touchstart', function (e) {

                // add active class untile mouseup -> show rail & handler until mouseup
                obj.sc_rail.addClass('wheelScroll__rail-run-active');
                obj.sc_handler.addClass('wheelScroll__handler-run-active');

                // static vars
                let sc_height = obj.sc_rail.height() - obj.sc_handler.height();
                let con_height = obj.sc_inner.height() - obj.sc_outer.height();
                let last_top = parseInt($(this).css('top'));
                let first_touch = e.clientY || e.originalEvent.touches[0].pageY;

                $(document).on('mousemove touchmove', function (event) {

                    // dynamic vars
                    let now_touch = event.pageY || event.originalEvent.touches[0].pageY;
                    let delta_mouse = now_touch - first_touch;
                    let calc_sc = last_top + delta_mouse;
                    let sc_top_percent = calc_sc / sc_height;
                    let calc_con_top = sc_top_percent * con_height;

                    if (sc_top_percent > 0 && sc_top_percent < 1) {
                        // scroll__handler pos
                        obj.sc_handler.css('top', calc_sc);
                        // scroll__outer scrollTop pos
                        obj.sc_outer.scrollTop(calc_con_top);

                    } else if (sc_top_percent <= 0) {
                        // animation for top limitation reachment
                        console.log();
                        obj.sc_handler.css('top', -Math.sqrt((obj.sc_handler.height() * Math.abs(sc_top_percent))));

                    } else if (sc_top_percent >= 1) {
                        // animation for bottom limitation reachment
                        obj.sc_handler.css('top', obj.calc_last_top() + Math.sqrt((obj.sc_handler.height() * Math.abs(sc_top_percent - 1))));
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
            });

            // scroll by clicking on rail
            $(obj.sc_rail).click(function (e) {
                // var x = e.pageX - $(this).offset().left;
                var mouse_y = e.pageY - $(this).offset().top;
                var handler_top = $(obj.sc_handler).position().top

                if (handler_top > mouse_y)
                    obj.sc_outer.scrollTop(obj.sc_outer.scrollTop() - 150);
                else
                    obj.sc_outer.scrollTop(obj.sc_outer.scrollTop() + 150);
            });


        }

        init_html() {
            $(this.sc).wrapInner(`<div class="wheelScroll__outer js-wheelScroll__outer">
                <div class="wheelScroll__inner js-wheelScroll__inner"></div>
            <div>`);
            $(this.sc).find('.js-wheelScroll__outer').prepend(`
                <div class="wheelScroll__rail wheelScroll__rail-mobile js-wheelScroll__rail"></div>
                <div class="wheelScroll__handler wheelScroll__handler-mobile js-wheelScroll__handler"></div>
            `)

            // set pointers
            this.sc_outer = $(this.sc).find(scroll__outer__y);
            this.sc_inner = $(this.sc).find(scroll__inner__y);
            this.sc_rail = $(this.sc).find(scroll__rail__y);
            this.sc_handler = $(this.sc).find(scroll__handler__y);
        }

        init_style() {
            // set init height for handler
            this.sc_handler.css('height', this.calc_handler_height());
        }

        is_disable() {
            // if inner.height < outer.height
            if (this.sc_outer.height() > this.sc_inner.height()) {
                this.sc_rail.hide();
                this.sc_handler.hide();
                return true;
            }
            else {
                this.sc_rail.show();
                this.sc_handler.show();
                return false;
            }
        }

        calc_handler_height() {
            return this.sc_outer.height() * this.sc_rail.height() / this.sc_inner.height();
        }

        calc_now_top() {
            return parseInt(this.sc_handler.css('top'));
        }

        calc_last_top() {
            return this.sc_rail.height() - this.sc_handler.height();
        }
    }

    // initilize
    document.querySelectorAll('.js-wheelScroll__y').forEach(function (item) {
        new WheelScroll(item);
    })
}