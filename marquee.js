/**
 * @param description 基于 jQuery 的无缝滚动插件
 * @author WanGe
 * @version 0.1
 * @update 2012-11-05
 * @log 0.1.2 即将更新 1.参数格式校验 2.开放暂停、继续等方法 
**/

(function ($) {
	var Marquee = function(element, options) {
		// 继承参数
		this.settings = $.extend({}, $.fn.marquee.defaults, options);
		this.element = element;
		this.els = {
			ul: element.children(),
			li: element.children().children()
		};
		this.opts = {
			toDirection: function() {},
			showWidth: this.settings.showNum * this.els.li.outerWidth(true),	// 显示宽度
			groupWidth: this.settings.stepLen * this.els.li.outerWidth(true), // 步长宽度
			allowMarquee: true
		}

		// 设置样式
		this.element.css({
			position: 'static' ? 'relative' : this.element.css('position'),
			width: this.opts.showWidth,
			overflow: 'hidden'
		});
		this.els.ul.css({
			position: 'relative',
			width: 9999
		});

		
		// 事件绑定
		var eventBind = function() {
			getElement(settings.prevBtnId).live('click', function() {
				toPrev.call(this);
			});
			getElement(settings.nextBtnId).live('click', function() {
				toNext.call(this);
			});
			getElement(settings.pauseBtnId).live('click', function() {
				pause.call(this);
			});
			getElement(settings.resumeBtnId).live('click', function() {
				resume.call(this);
			});
		};
		
		
		return this;
	};
	
	// 获取元素
	Marquee.prototype._getEls = function(str) {
		return (typeof str === 'string') ? $('#' + $.trim(str)) : $();
	};
	
	// 事件绑定
	Marquee.prototype._eventBind = function() {
		var _this = this;
		_this._getEls(_this.settings.prevBtnId).live('click', function() {
			_this._toPrev.call(_this);
		});
		_this._getEls(_this.settings.nextBtnId).live('click', function() {
			_this._toNext.call(_this);
		});
		_this._getEls(_this.settings.pauseBtnId).live('click', function() {
			_this._pause.call(_this);
		});
		_this._getEls(_this.settings.resumeBtnId).live('click', function() {
			_this._resume.call(_this);
		});
	};
	
	Marquee.prototype._newEls = function() {
		this.els.ul = this.element.children();
		this.els.li = this.element.children().children();
		
		return this.els;
	};
	
	// 下一页
	Marquee.prototype._toNext = function() {
		var _this = this;
			if (this.opts.allowMarquee) {
				this.opts.allowMarquee = false;
				this.settings.beforeMove.call(this);
				var sufEls = this._newEls().li.slice(-this.settings.stepLen);
				
				sufEls.clone().prependTo(this.els.ul);
				this._newEls().ul.css('left', -this.opts.groupWidth)
							.animate({
								left: 0
							}, _this.settings.speed, function() {
								sufEls.remove();
								_this.opts.allowMarquee = true;
								_this.settings.afterMove.call(_this);
							});
			}
	};
	
	// 上一页
	Marquee.prototype._toPrev = function() {
		var _this = this;
		if (this.opts.allowMarquee) {
			this.opts.allowMarquee = false;
			this.settings.beforeMove.call(this);
			var preEls = this._newEls().li.slice(0, this.settings.stepLen);
			
			preEls.clone().appendTo(this.els.ul);
			
			this._newEls().ul.animate({
				left: - _this.opts.groupWidth
			}, _this.settings.speed, function() {
				_this.els.ul.css('left', 0);
				preEls.remove();
				_this.opts.allowMarquee = true;
				_this.settings.afterMove.call(_this);
			});
		}
	};
	
	// 继续
	Marquee.prototype._resume = function() {
		this.opts.allowMarquee = true;
	};
	
	// 暂停
	Marquee.prototype._pause = function() {
		this.opts.allowMarquee = false;
	};
	
	// 初始化
	Marquee.prototype._init = function() {
		var _this = this,
			st = this.settings;
		
		if (st.auto) {
			var formatDirection = $.trim(st.direction.toLowerCase());
			switch(formatDirection) {
				case 'left':
					this.toDirection = this._toPrev;
				break;
				
				case 'right':
					this.toDirection = this._toNext;
				break;
				
				default:
					Marquee.newErr(formatDirection + ' is invalid.');
				break;
			}
			
			setInterval(function() {
				_this.toDirection();
			}, st.interval);
		}
		
		this._eventBind();
	};
	
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