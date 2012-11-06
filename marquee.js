/**
 * @param description 基于 jQuery 的无缝滚动插件
 * @author WanGe
 * @version 0.1.1
 * @update 2012-11-06
**/

(function ($) {
	var Marquee = function(element, options) {
		var _this = this;
		// 继承参数
		_this.settings = $.extend({}, $.fn.marquee.defaults, options);
		
		var els = {
				wrap: element,
				ul: element.children(),
				li: element.children().children()
			},
			liOuterWidth = els.li.outerWidth(true),		// 单个元素宽度
			showWidth = _this.settings.showNum * liOuterWidth,	// 显示宽度
			curPosStyle = els.wrap.css('position'),		// 当前 position 的值
			opts = {
				groupWidth: _this.settings.stepLen * liOuterWidth, // 步长宽度
				allowMarquee: true
			};

		// 设置样式
		element.css({
			position: 'static' ? 'relative' : curPosStyle,
			width: showWidth,
			overflow: 'hidden'
		});
		els.ul.css({
			position: 'relative',
			width: 9999
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
		
		return _this;
	};
	
	// 校验参数
	Marquee.prototype._checkParams = function() {
		var _this = this,
			st = _this.settings,
			liLen = _this._getEls().li.length,
			errMsg = '';
		
		if (typeof st.auto !== 'boolean') {
			errMsg = 'auto';
		} else if (typeof st.interval !== 'number') {
			errMsg = 'interval';
		} else if (typeof st.speed !== 'number') {
			errMsg = 'speed';
		} else if (typeof st.prevBtnId !== 'string') {
			errMsg = 'prevBtnId';
		} else if (typeof st.nextBtnId !== 'string') {
			errMsg = 'nextBtnId';
		} else if (typeof st.pauseBtnId !== 'string') {
			errMsg = 'pauseBtnId';
		} else if (typeof st.resumeBtnId !== 'string') {
			errMsg = 'resumeBtnId';
		} else if (typeof st.showNum !== 'number' || st.showNum > liLen) {
			errMsg = 'showNum';
		} else if (typeof st.stepLen !== 'number' || st.stepLen > liLen) {
			errMsg = 'stepLen';
		} else if (typeof st.direction !== 'string') {
			errMsg = 'direction';
		} else if (typeof st.direction !== 'string') {
			errMsg = 'direction';
		} else if (!$.isFunction(st.afterMove)) {
			errMsg = 'afterMove';
		} else if (!$.isFunction(st.beforeMove)) {
			errMsg = 'beforeMove';
		}
		
		if (errMsg !== '') {
			Marquee.newErr(errMsg + ' is invalid.');
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
		var _this = this;
		if (_this._getOpts().allowMarquee) {
			_this._setOpts('allowMarquee', false);
			beforeMove.call(_this);
			var sufEls = _this._refreshEls().li.slice(-stepLen);
			
			sufEls.clone().prependTo(_this._getEls().ul);
			_this._refreshEls().ul.css('left', -_this._getOpts().groupWidth)
						.animate({
							left: 0
						}, speed, function() {
							sufEls.remove();
							_this._setOpts('allowMarquee', true);
							afterMove.call(_this);
						});
		}
	};
	
	// 上一页
	Marquee.prototype._toPrev = function(stepLen, speed, beforeMove, afterMove) {
		var _this = this;
		if (_this._getOpts().allowMarquee) {
			_this._setOpts('allowMarquee', false);
			beforeMove.call(_this);
			var preEls = _this._refreshEls().li.slice(0, stepLen);
			
			preEls.clone().appendTo(_this._getEls().ul);
			
			_this._refreshEls().ul.animate({
				left: - _this._getOpts().groupWidth
			}, speed, function() {
				_this._getEls().ul.css('left', 0);
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
		console.log(_this)
		_this._checkParams();
		if (st.auto) {
			var formatDirection = $.trim(st.direction.toLowerCase());
			switch(formatDirection) {
				case 'left':
					_this._move = _this._toPrev;
				break;
				
				case 'right':
					_this._move = _this._toNext;
				break;
				
				default:
					Marquee.newErr(formatDirection + ' is invalid.');
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
		auto: true,					// 自动滚动
		interval: 3000,				// 间隔时间
		speed: 500,					// 移动速度
		prevBtnId: '',				// 向前滚 id
		nextBtnId: '',				// 向后滚 id
		pauseBtnId: '',				// 暂停按钮 id
		resumeBtnId: '',			// 继续按钮 id
		showNum: 5,					// 显示个数
		stepLen: 5,					// 每次滚动步长
		direction: 'left',			// 移动方向
		afterMove: function() {},	// 每次移动后回调
		beforeMove: function() {}	// 每次移动前回调
	};
})(jQuery);