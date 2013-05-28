# Marquee-Slide 基于 jQuery 的多功能无缝滚动插件

## 简介
Marquee-Slide 是一款基于 jQuery 的多功能无缝滚动插件，它可以配置的主要功能有：
* 是否自动滚动
* 自动滚动时的间隔时间
* 移动速度
* 显示个数
* 每次移动的步长
* 水平 / 垂直滚动
* 向前 / 向后（水平）以及向上 / 向下（垂直）自动滚动
* 暂停 / 继续滚动
* 上一组 / 下一组移动前 / 后的回调方法
* 暂停 / 继续滚动前 / 后的回调方法

## DEMO 预览
[Marquee Slide 功能展示] (http://wange.im/demo/marquee-slide/marquee_slide.html)

## 使用方法

### 引入 jQuery 1.3+ 和 marquee.js
    <script type="text/javascript" src="jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="marquee.js"></script>
    
### HTML 结构
    <div id="marquee_slide">
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
            <li>7</li>
            <li>8</li>
            <li>9</li>
        </ul>
    </div>

### 配置参数并调用方法
    <script type="text/javascript">
        $(function() {
            $('#marquee_slide').marquee({
                auto: true,
                interval: 3000,
                speed: 500,
                showNum: 5,
                stepLen: 5
            });
        })
    </script>
    
## 参数列表
    {
        auto: true,                     // 是否自动滚动
        interval: 3000,                 // 间隔时间（毫秒）
        direction: 'forward',           // 向前 -  forward / 向后 - backward
        speed: 500,                     // 移动速度（毫秒）
        showNum: 1,                     // 显示个数
        stepLen: 1,                     // 每次滚动步长
        type: 'horizontal',             // 水平滚动 - horizontal / 垂直滚动 - vertical
        prevElement: null,              // 上一组按钮元素
        prevBefore: function() {},      // 上一组移动前回调
        prevAfter: function() {},       // 上一组移动后回调
        nextElement: null,              // 下一组按钮元素
        nextBefore: function() {},      // 下一组移动前回调
        nextAfter: function() {},       // 下一组移动后回调
        pauseElement: null,             // 暂停按钮元素
        pauseBefore: function() {},     // 暂停前回调
        pauseAfter: function() {},      // 暂停后回调
        resumeElement: null,            // 继续按钮元素
        resumeBefore: function() {},    // 继续前回调
        resumeAfter: function() {}      // 继续后回调
    }

## 意见建议
欢迎各位使用本款插件，如果在使用中有任何问题或者意见建议，请移步到[我的博客](http://wange.im/marquee-js-jquery-scroll-plugin.html)留言，您也可以直接发邮件给我：i@wange.im，我会第一时间给您答复，谢谢 :-)
