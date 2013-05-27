do ($ = jQuery) ->
    # Marquee 类
    class Marquee
        constructor: (element, options) ->
            # 获取元素对象
            @elements =
                wrap: element
                ul: element.children()
                li: element.children().children()
                
            # 继承并设置参数
            @settings = $.extend {}, $.fn.marquee.defaults, options
            
            # 缓存变量
            @cache = 
                allowMarquee: true
            
            return
        
        # 初始化
        init: ->
            @setStyle()
            @move()
            @bind()
            return
        
        # 设置样式
        setStyle: ->
            liOuterW = @elements.li.outerWidth true
            liOuterH = @elements.li.outerHeight true
            liMargin = Math.max( parseInt(@elements.li.css('margin-top'), 10), parseInt(@elements.li.css('margin-bottom'), 10) )

            switch @settings.type
                when 'horizontal'
                    wrapW = @settings.showNum * liOuterW
                    wrapH = liOuterH
                    ulW = 9999
                    ulH = 'auto'
                    floatStyle = 'left'
                    @cache.stepW = @settings.stepLen * liOuterW
                    @cache.prevAnimateObj = {left: - @cache.stepW}
                    @cache.nextAnimateObj = {left: 0}
                    @cache.leftOrTop = 'left'
                    
                when 'vertical'
                    wrapW = liOuterW
                    wrapH = @settings.showNum * liOuterH - liMargin
                    ulW = 'auto'
                    ulH = 9999
                    floatStyle = 'none'
                    @cache.stepW = @settings.stepLen * liOuterH - liMargin
                    @cache.prevAnimateObj = {top: - @cache.stepW}
                    @cache.nextAnimateObj = {top: 0}
                    @cache.leftOrTop = 'top'
                    
            @elements.wrap.css
                position: if 'static' then 'relative' else @elements.wrap.css 'position'
                width: wrapW
                height: wrapH
                overflow: 'hidden'
            
            @elements.ul.css
                position: 'relative'
                width: ulW
                height: ulH
            
            @elements.li.css
                float: floatStyle
                
            return
            
        # 绑定事件
        bind: ->
            _this = this
            @settings.prevElement?.click (ev) ->
                ev.preventDefault()
                _this.prev()
                return
                
            @settings.nextElement?.click (ev) ->
                ev.preventDefault()
                _this.next()
                return
                
            @settings.pauseElement?.click (ev) ->
                ev.preventDefault()
                _this.pause()
                return
                
            @settings.resumeElement?.click (ev) ->
                ev.preventDefault()
                _this.resume()
                return
                
            @elements.wrap?.hover ->
                _this.pause()
                return
            , ->
                _this.resume()
                return
            return
            
        # 移动
        move: ->
            _this = this
            
            if @settings.auto
                switch @settings.direction
                    when 'forward'
                        moveEvent = _this.prev
                    when 'backward'
                        moveEvent = _this.next
                interval = _this.settings.interval
                setTimeout ->
                    moveEvent.call _this
                    setTimeout arguments.callee, interval
                    return
                , interval
                
                @cache.moveBefore = @cache.moveAfter = ->
                    null
            else 
                @cache.moveBefore = ->
                    _this.cache.allowMarquee = false
                @cache.moveAfter = ->
                    _this.cache.allowMarquee = true
            return
            
        # 上一组
        prev: ->
            _this = this
            if @cache.allowMarquee
                @cache.moveBefore.call this
                @settings.prevBefore.call this
                ul = @elements.ul
                preEls = ul.children().slice 0, @settings.stepLen
                preEls.clone().appendTo ul
                ul.animate @cache.prevAnimateObj, @settings.speed, ->
                    ul.css _this.cache.leftOrTop, 0
                    preEls.remove()
                    _this.cache.moveAfter.call _this
                    _this.settings.prevAfter.call _this
                    return
            return
            
        # 下一组
        next: ->
            _this = this
            if @cache.allowMarquee
                @cache.moveBefore.call this
                @settings.nextBefore.call this
                ul = @elements.ul
                sufEls = ul.children().slice -@settings.stepLen
                sufEls.clone().prependTo ul
                ul.css(_this.cache.leftOrTop, -@cache.stepW)
                  .animate @cache.nextAnimateObj, @settings.speed, ->
                      sufEls.remove()
                      _this.cache.moveAfter.call _this
                      _this.settings.nextAfter.call _this
                      return
            return
            
        # 暂停
        pause: ->
            @settings.pauseBefore.call this
            @cache.allowMarquee = false
            @settings.pauseAfter.call this
            return
            
        # 继续
        resume: ->
            @settings.resumeBefore.call this
            @cache.allowMarquee = true
            @settings.resumeAfter.call this
            return
        
    # 在 fn 下注册插件名
    $.fn.marquee = (options) ->
        @each (key, value) ->
            marquee = new Marquee $(this), options
            marquee.init()
            return
        return
    
    # 默认参数
    $.fn.marquee.defaults = 
        auto: true              # 是否自动滚动
        interval: 3000          # 间隔时间（毫秒）
        direction: 'forward'    # 向前 -  forward / 向后 - backward
        
        speed: 500              # 移动速度（毫秒）
        showNum: 1              # 显示个数
        stepLen: 1              # 每次滚动步长
        type: 'horizontal'      # 水平滚动 - horizontal / 垂直滚动 - vertical
        
        prevElement: null       # 上一组按钮元素
        prevBefore: ->          # 上一组移动前回调
        prevAfter: ->           # 上一组移动后回调
        
        nextElement: null       # 下一组按钮元素
        nextBefore: ->          # 下一组移动前回调
        nextAfter: ->           # 下一组移动后回调
        
        pauseElement: null      # 暂停按钮元素
        pauseBefore: ->         # 暂停前回调
        pauseAfter: ->          # 暂停后回调
        
        resumeElement: null     # 继续按钮元素
        resumeBefore: ->        # 继续前回调
        resumeAfter: ->         # 继续后回调
    return