(function($) {
  var Marquee;

  Marquee = (function() {
    function Marquee(element, options) {
      this.elements = {
        wrap: element,
        ul: element.children(),
        li: element.children().children()
      };
      this.settings = $.extend({}, $.fn.marquee.defaults, options);
      this.cache = {
        allowMarquee: true
      };
      return;
    }

    Marquee.prototype.init = function() {
      this.setStyle();
      this.move();
      this.bind();
    };

    Marquee.prototype.setStyle = function() {
      var floatStyle, liMargin, liOuterH, liOuterW, ulH, ulW, wrapH, wrapW;

      liOuterW = this.elements.li.outerWidth(true);
      liOuterH = this.elements.li.outerHeight(true);
      liMargin = Math.max(parseInt(this.elements.li.css('margin-top'), 10), parseInt(this.elements.li.css('margin-bottom'), 10));
      switch (this.settings.type) {
        case 'horizontal':
          wrapW = this.settings.showNum * liOuterW;
          wrapH = liOuterH;
          ulW = 9999;
          ulH = 'auto';
          floatStyle = 'left';
          this.cache.stepW = this.settings.stepLen * liOuterW;
          this.cache.prevAnimateObj = {
            left: -this.cache.stepW
          };
          this.cache.nextAnimateObj = {
            left: 0
          };
          this.cache.leftOrTop = 'left';
          break;
        case 'vertical':
          wrapW = liOuterW;
          wrapH = this.settings.showNum * liOuterH - liMargin;
          ulW = 'auto';
          ulH = 9999;
          floatStyle = 'none';
          this.cache.stepW = this.settings.stepLen * liOuterH - liMargin;
          this.cache.prevAnimateObj = {
            top: -this.cache.stepW
          };
          this.cache.nextAnimateObj = {
            top: 0
          };
          this.cache.leftOrTop = 'top';
      }
      this.elements.wrap.css({
        position: 'static' ? 'relative' : this.elements.wrap.css('position'),
        width: wrapW,
        height: wrapH,
        overflow: 'hidden'
      });
      this.elements.ul.css({
        position: 'relative',
        width: ulW,
        height: ulH
      });
      this.elements.li.css({
        float: floatStyle
      });
    };

    Marquee.prototype.bind = function() {
      var _ref, _ref1, _ref2, _ref3, _ref4, _this;

      _this = this;
      if ((_ref = this.settings.prevElement) != null) {
        _ref.click(function(ev) {
          ev.preventDefault();
          _this.prev();
        });
      }
      if ((_ref1 = this.settings.nextElement) != null) {
        _ref1.click(function(ev) {
          ev.preventDefault();
          _this.next();
        });
      }
      if ((_ref2 = this.settings.pauseElement) != null) {
        _ref2.click(function(ev) {
          ev.preventDefault();
          _this.pause();
        });
      }
      if ((_ref3 = this.settings.resumeElement) != null) {
        _ref3.click(function(ev) {
          ev.preventDefault();
          _this.resume();
        });
      }
      if ((_ref4 = this.elements.wrap) != null) {
        _ref4.hover(function() {
          _this.pause();
        }, function() {
          _this.resume();
        });
      }
    };

    Marquee.prototype.move = function() {
      var interval, moveEvent, _this;

      _this = this;
      if (this.settings.auto) {
        switch (this.settings.direction) {
          case 'forward':
            moveEvent = _this.prev;
            break;
          case 'backward':
            moveEvent = _this.next;
        }
        interval = _this.settings.interval;
        setTimeout(function() {
          moveEvent.call(_this);
          setTimeout(arguments.callee, interval);
        }, interval);
        this.cache.moveBefore = this.cache.moveAfter = function() {
          return null;
        };
      } else {
        this.cache.moveBefore = function() {
          return _this.cache.allowMarquee = false;
        };
        this.cache.moveAfter = function() {
          return _this.cache.allowMarquee = true;
        };
      }
    };

    Marquee.prototype.prev = function() {
      var preEls, ul, _this;

      _this = this;
      if (this.cache.allowMarquee) {
        this.cache.moveBefore.call(this);
        this.settings.prevBefore.call(this);
        ul = this.elements.ul;
        preEls = ul.children().slice(0, this.settings.stepLen);
        preEls.clone().appendTo(ul);
        ul.animate(this.cache.prevAnimateObj, this.settings.speed, function() {
          ul.css(_this.cache.leftOrTop, 0);
          preEls.remove();
          _this.cache.moveAfter.call(_this);
          _this.settings.prevAfter.call(_this);
        });
      }
    };

    Marquee.prototype.next = function() {
      var sufEls, ul, _this;

      _this = this;
      if (this.cache.allowMarquee) {
        this.cache.moveBefore.call(this);
        this.settings.nextBefore.call(this);
        ul = this.elements.ul;
        sufEls = ul.children().slice(-this.settings.stepLen);
        sufEls.clone().prependTo(ul);
        ul.css(_this.cache.leftOrTop, -this.cache.stepW).animate(this.cache.nextAnimateObj, this.settings.speed, function() {
          sufEls.remove();
          _this.cache.moveAfter.call(_this);
          _this.settings.nextAfter.call(_this);
        });
      }
    };

    Marquee.prototype.pause = function() {
      this.settings.pauseBefore.call(this);
      this.cache.allowMarquee = false;
      this.settings.pauseAfter.call(this);
    };

    Marquee.prototype.resume = function() {
      this.settings.resumeBefore.call(this);
      this.cache.allowMarquee = true;
      this.settings.resumeAfter.call(this);
    };

    return Marquee;

  })();
  $.fn.marquee = function(options) {
    this.each(function(key, value) {
      var marquee;

      marquee = new Marquee($(this), options);
      marquee.init();
    });
  };
  $.fn.marquee.defaults = {
    auto: true,
    interval: 3000,
    direction: 'forward',
    speed: 500,
    showNum: 1,
    stepLen: 1,
    type: 'horizontal',
    prevElement: null,
    prevBefore: function() {},
    prevAfter: function() {},
    nextElement: null,
    nextBefore: function() {},
    nextAfter: function() {},
    pauseElement: null,
    pauseBefore: function() {},
    pauseAfter: function() {},
    resumeElement: null,
    resumeBefore: function() {},
    resumeAfter: function() {}
  };
})(jQuery);
