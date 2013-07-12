## 综述

>当前版本：1.1
>作者：莫痕<yongxin.myx@alibaba-inc.com>
>scrollAnim是一个处理页面滚动时元素的动画效果的gallery组件，可以用于视觉差等效果的场景中。该组件支持包括IE6在内的
所有主流浏览器，使用方便。
>目前仅有平滑滚动效果与线性变化的方法，后续可以加入圆弧形轨迹等其他常用的轨迹方法。

## 快速使用示例
### 初始化组件

    S.use('gallery/scrollAnim/1.1/index', function (S, ScrollAnim) {
         var scrollAnim = new ScrollAnim();
    });

### 使用示例
    S.use('gallery/scrollAnim/1.1/index', function (S, ScrollAnim) {
        //组件初始化
        var scrollAnim = new ScrollAnim();
        //分别调用smoothWheelScroll与smoothKeydownScroll方法，为鼠标滚动与键盘上下键滚动添加平滑处理
        scrollAnim.smoothWheelScroll(1.5);
        scrollAnim.smoothKeydownScroll(1.5);
        //调用scrollLineAnim方法，使‘#J_move1’这个元素的left属性在scroll值为0~500的范围内从200线性变化到600
        scrollAnim.scrollLineAnim('#J_move1', 'left', {
            start_scroll: 0,
            end_scroll: 500,
            start_value: 200,
            end_value: 600,
            isCallbackLoop: false
        }, function(){alert('hi')});
    });

## Demo
    Demo地址:[http://gallery.kissyui.com/scrollAnim/1.1/demo/index.html](http://gallery.kissyui.com/scrollAnim/1.1/guide/index.html)


## API说明

>smoothWheelScroll（speed）
>该方法为鼠标的滚轮事件添加平滑处理，一般在滚动视觉动画中均需要先做该平滑处理。
需要传入一个滚动速度的参数，其取值要求在1到3之间（包含1和3），取值最好为1、1.5、2、2.5和3。取值越大滚动速度越快。
>smoothKeydownScroll (speed)
>该方法为键盘的上下按键添加平滑处理，一般在滚动视觉动画中均需要先做该平滑处理。
需要传入一个滚动速度的参数，其取值要求在1到3之间（包含1和3），取值最好为1、1.5、2、2.5和3。取值越大滚动速度越快。
>scrollLineAnim (selector, attr, config[, callback])
>该方法为元素加上滚动动画效果。
>需要传入的参数依次为：第一个参数selector为元素选择器(同Kissy的选择器)；第二个参数attr为希望在滚动过程中变化的该元素的某个属性（注意这个属性
一定要在CSS中出现）；第三个参数config为一个json，该json必须包含start_scroll、end_scroll、start_value、end_value四个
key值，其值分别为希望触发元素参数变化的scroll值的起始值（start_scroll）与终点值（end_scroll），以及希望该元素的属性
在该滚动范围内变化的起始值（start_value）与终点值（end_value）。该json中可以包括一个可选值isCallbackLoop，该属性用来
设置是否允许该回调函数当再次滚到特定位置时再次触发，默认为true。最后一个参数callback为当元素到达end_scroll时的回调函数。
