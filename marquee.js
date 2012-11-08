/**
 * @description 基于 jQuery 的无缝滚动插件
 * @param     auto {boolean} 是否自动滚动
 *            interval {number} 间隔时间（毫秒）
 *            speed {number} 移动速度（毫秒）
 *            prevBtnId {string} 向前滚按钮 id
 *            nextBtnId {string} 向后滚按钮 id
 *            pauseBtnId {string} 暂停按钮 id
 *            resumeBtnId {string} 继续按钮 id
 *            showNum {number} 显示个数
 *            stepLen {number} 每次滚动步长
 *            type {string} 水平滚动 - horizontal / 垂直滚动 - vertical
 *            direction {string} 向前 -  forward / 向后 - backward
 *            afterMove {function} 每次移动后回调
 *            beforeMove {function} 每次移动前回调
 * @author i@wange.im
 * @version 0.3.1
**/

(function ($) {
    var Marquee = function(element, options) {
        var _this = this,
            defaultOptions = $.fn.marquee.defaults;
        // 继承参数
        _this.settings = $.extend({}, defaultOptions, options);
        var els = {
                wrap: element,
                ul: element.children(),
                li: element.children().children()
            },
            marqueeType = _this.settings.type,
            liOuterWidth = els.li.outerWidth(true),        // 单个元素宽度
            liOuterHeight = els.li.outerHeight(true),        // 单个元素高度
            liMarginMax = Math.max(parseInt(els.li.css('margin-top'), 10), parseInt(els.li.css('margin-bottom'), 10)),
            wrapWidth = wrapHeight = ulWidth = ulHeight = 0,
            floatStyle = 'none',
            curPosStyle = els.wrap.css('position'),        // 当前 position 的值
            opts = {
                lt: '',
                groupSize: 0, // 步长宽度
                allowMarquee: true
            };
        switch (marqueeType) {
            // 如果是水平的
            case 'horizontal':
                wrapWidth = _this.settings.showNum * liOuterWidth;
                wrapHeight = ulHeight = 'auto';
                ulWidth = 9999;
                floatStyle = 'left';
                
                opts.groupSize = _this.settings.stepLen * liOuterWidth;
                opts.lt = 'left';
            break;
            
            // 如果是垂直的
            case 'vertical':
                wrapWidth = ulWidth = 'auto';
                wrapHeight = _this.settings.showNum * liOuterHeight - liMarginMax;
                ulHeight = 9999;
                floatStyle = 'none';
                
                opts.groupSize = _this.settings.stepLen * liOuterHeight - liMarginMax;
                opts.lt = 'top';
            break;
            
            default:
                Marquee.newErr('type: ' + marqueeType + ' is an invalid value.');
            break;
        }

        // 设置样式
        element.css({
            position: 'static' ? 'relative' : curPosStyle,
            width: wrapWidth,
            height: wrapHeight,
            overflow: 'hidden'
        });
        els.ul.css({
            position: 'relative',
            width: ulWidth,
            height: ulHeight
        });
        els.li.css({
            float: floatStyle
        });
        
        // 特权方法 获取元素
        _this._getEls = function() {
            return els;
        };
        // 特权方法 设置元素
        _this._setEls = function(prop, value) {
            els[prop] = value;
        };
        // 特权方法 获取设置
        _this._getOpts = function() {
            return opts;
        };
        // 特权方法 获取设置
        _this._setOpts = function(prop, value) {
            opts[prop] = value;
        };
        // 特权方法 获取默认参数
        _this.getDefaultOpts = function() {
            return defaultOptions;
        };
        return _this;
    };
    
    // 校验参数
    Marquee.prototype._checkParams = function() {
        var _this = this,
            st = _this.settings,
            liLen = _this._getEls().li.length,
            options = _this.getDefaultOpts();
        
        for (var i in options) {
            if (typeof options[i] !== typeof st[i]) {
                Marquee.newErr(i + ': ' + st[i] + ' is an invalid value.');
            }
        }
        
        if (st.showNum > liLen || st.showNum <= 0) {
            Marquee.newErr('showNum: ' + st.showNum + ' is an invalid value.');
        }
        if (st.stepLen > liLen || st.stepLen <= 0) {
            Marquee.newErr('stepLen: ' + st.stepLen + ' is an invalid value.');
        }
    };
    
    // 获取元素
    Marquee.prototype._getBtnEl = function(str) {
        return (typeof str === 'string' && str !== '') ? $('#' + $.trim(str)) : false;
    };
    
    // 事件绑定
    Marquee.prototype._eventBind = function() {
        var _this = this,
            st = _this.settings;

        var eventObj = {
            prevBtnId: _this._toPrev,
            nextBtnId: _this._toNext,
            pauseBtnId: _this._pause,
            resumeBtnId: _this._resume
        };
        
        for (var i in eventObj) {
            (function(i) {
                var el = _this._getBtnEl(_this.settings[i]);
                if (el) {
                    el.live('click', function() {
                        eventObj[i].call(_this, st.stepLen, st.speed, st.beforeMove, st.afterMove);
                    });
                }
            })(i)
        }
    };
    
    // 刷新元素
    Marquee.prototype._refreshEls = function() {
        var _this = this;
        _this._setEls('ul', _this._getEls().wrap.children());
        _this._setEls('li', _this._getEls().wrap.children().children());
        
        return _this._getEls();
    };
    
    // 下一页
    Marquee.prototype._toNext = function(stepLen, speed, beforeMove, afterMove) {
        var _this = this,
            type = _this.settings.type,
            animateObj = {};
        if (_this._getOpts().allowMarquee) {
            _this._setOpts('allowMarquee', false);
            beforeMove.call(_this);
            var sufEls = _this._refreshEls().li.slice(-stepLen);
            
            sufEls.clone().prependTo(_this._getEls().ul);
            if (type === 'horizontal') {
                animateObj = {left: 0};
            } else if (type === 'vertical') {
                animateObj = {top: 0};
            }
            
            _this._refreshEls().ul.css(_this._getOpts().lt, -_this._getOpts().groupSize).animate(animateObj, speed, function() {
                sufEls.remove();
                _this._setOpts('allowMarquee', true);
                afterMove.call(_this);
            });
        }
    };
    
    // 上一页
    Marquee.prototype._toPrev = function(stepLen, speed, beforeMove, afterMove) {
        var _this = this,
            type = _this.settings.type,
            animateObj = {};
        if (_this._getOpts().allowMarquee) {
            _this._setOpts('allowMarquee', false);
            beforeMove.call(_this);
            var preEls = _this._refreshEls().li.slice(0, stepLen);
            
            preEls.clone().appendTo(_this._getEls().ul);
            if (type === 'horizontal') {
                animateObj = {left: - _this._getOpts().groupSize};
            } else if (type === 'vertical') {
                animateObj = {top: - _this._getOpts().groupSize};
            }
            _this._refreshEls().ul.animate(animateObj, speed, function() {
                _this._getEls().ul.css(_this._getOpts().lt, 0);
                preEls.remove();
                _this._setOpts('allowMarquee', true);
                afterMove.call(_this);
            });
        }
    };
    
    // 继续
    Marquee.prototype._resume = function() {
        this._setOpts('allowMarquee', true);
    };
    
    // 暂停
    Marquee.prototype._pause = function() {
        this._setOpts('allowMarquee', false);
    };
    
    // 初始化
    Marquee.prototype._init = function() {
        var _this = this,
            st = _this.settings;
        _this._checkParams();
        if (st.auto) {
            switch(st.direction) {
                case 'forward':
                    _this._move = _this._toPrev;
                break;
                
                case 'backward':
                    _this._move = _this._toNext;
                break;
                
                default:
                    Marquee.newErr('direction: ' + st.direction + ' is an invalid value.');
                break;
            }
            
            setInterval(function() {
                _this._move(st.stepLen, st.speed, st.beforeMove, st.afterMove);
            }, st.interval);
        }
        
        _this._eventBind();
    };
    
    // 错误提示
    Marquee.newErr = function(msg) {
        throw new Error(msg);
    };
    
    $.fn.marquee = function(options) {
        return this.each(function(key, value) {
            var marquee = new Marquee($(this), options);
            
            marquee._init();
        });
    };
    
    // 默认设置
    $.fn.marquee.defaults = {
        auto: true,                // 是否自动滚动
        interval: 3000,            // 间隔时间（毫秒）
        speed: 500,                // 移动速度（毫秒）
        prevBtnId: '',             // 向前滚按钮 id
        nextBtnId: '',             // 向后滚按钮 id
        pauseBtnId: '',            // 暂停按钮 id
        resumeBtnId: '',           // 继续按钮 id
        showNum: 1,                // 显示个数
        stepLen: 1,                // 每次滚动步长
        type: 'horizontal',        // 水平滚动 - horizontal / 垂直滚动 - vertical
        direction: 'forward',      // 向前 -  forward / 向后 - backward
        afterMove: function() {},  // 每次移动后回调
        beforeMove: function() {}  // 每次移动前回调
    };
})(jQuery);