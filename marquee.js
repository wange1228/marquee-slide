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
		var settings = $.extend({}, $.fn.marquee.defaults, options);
		
		// 元素
		var els = {
			ul: element.children(),
			li: element.children().children()
		};
		
		// 变量们
		var vars = {
			showWidth: settings.showNum * els.li.outerWidth(true),	// 显示宽度
			groupWidth: settings.stepLen * els.li.outerWidth(true), // 步长宽度
			allowMarquee: true		// 为防止连续点击操作
		};
		
		// 设置样式
		var setStyle = function() {
			element.css({
				position: 'static' ? 'relative' : element.css('position'),
				width: vars.showWidth,
				overflow: 'hidden'
			});
			els.ul.css({
				position: 'relative',
				width: 9999
			});
		};
		
		// 获取 id 元素
		var getElement = function(str) {
			return (typeof str === 'string' && str !== '') ? $('#' + $.trim(str)) : $();
		};
		
		// 节点变更后，需要刷新元素变量
		var newEls = function() {
			els.ul = element.children();
			els.li = element.children().children();
			
			return els;
		};
		
		// 下一页
		var toNext = function() {
			if (vars.allowMarquee) {
				vars.allowMarquee = false;
				settings.beforeMove.call(this);
				var sufEls = newEls().li.slice(-settings.stepLen);
				
				sufEls.clone().prependTo(els.ul);
				newEls().ul.css('left', - vars.groupWidth)
							.animate({
								left: 0
							}, settings.speed, function() {
								sufEls.remove();
								vars.allowMarquee = true;
								settings.afterMove.call(this);
							})
			}
		};
		
		// 上一页
		var toPrev = function() {
			if (vars.allowMarquee) {
				vars.allowMarquee = false;
				settings.beforeMove.call(this);
				var preEls = newEls().li.slice(0, settings.stepLen);
				
				preEls.clone().appendTo(els.ul);
				
				newEls().ul.animate({
					left: - vars.groupWidth
				}, settings.speed, function() {
					els.ul.css('left', 0);
					preEls.remove();
					vars.allowMarquee = true;
					settings.afterMove.call(this);
				});
			}
		};
		
		// 暂停
		var pause = function() {
			vars.allowMarquee = false;
		};
		
		// 继续
		var resume = function() {
			vars.allowMarquee = true;
		};
		
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
		
		// 初始化
		this.init = function() {
			setStyle();
			// 如果设置了自动播放
			if (settings.auto) {
				var toDirection;
				switch($.trim(settings.direction.toLowerCase())) {
					case 'left':
						toDirection = toPrev;
					break;
					
					case 'right':
						toDirection = toNext;
					break;
					
					default:
						toDirection = toPrev;
					break;
				}
				
				setInterval(function() {
					toDirection();
				}, settings.interval);
			}
			
			eventBind();
		};
		
		return this;
	};
	
	$.fn.marquee = function(options) {
		return this.each(function(key, value) {
			var marquee = new Marquee($(this), options);
			
			marquee.init();
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