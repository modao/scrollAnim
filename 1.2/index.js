/**
 * @fileoverview 
 * @author mohen<yongxin.myx@alibaba-inc.com>
 * @module scrollAnim
 **/
KISSY.add('gallery/scrollAnim/1.2/index', function (S, Base) {
    var DOM = S.DOM, Event = S.Event;
    var AllSets=[], pre_scroll_fn;
    /**
     * 
     * @class ScrollAnim
     * @constructor
     * @extends Base
     */
    function ScrollAnim() {
        //调用父类构造函数
        ScrollAnim.superclass.constructor.call(this);
    }
    S.extend(ScrollAnim, Base, /** @lends ScrollAnim.prototype*/{
        /*
        *@smoothWheelScroll方法：为页面添加鼠标的平滑滚动
        *@speed：滚动的速度设置，其值为1——3之间，最好取1、2、3这样的整数或者小数点后一位的数字
        *@Note: 调用方法scrollAnim.smoothWheelScroll(...);
        */
        smoothWheelScroll: function(speed){
            if(!S.isNumber(speed) && (speed>=1 && speed<=3)){
                S.log('smoothScroll方法的参数必须为数字！！！');
                return null;
            }
            var scrollAnim;
            var scrollTimes = 1;
            var _scrollable = /webkit/i.test(navigator.userAgent) || document.compatMode == 'BackCompat' ? document.body : document.documentElement;
            Event.on(document, 'mousewheel', function(ev){
                //平滑滚动
                ev.halt();
                if(scrollAnim){
                    scrollAnim.stop();
                    scrollTimes++;
                    scrollTimes = scrollTimes > speed ? speed : scrollTimes; //限制速度
                }
                scrollAnim = S.Anim(_scrollable,{scrollTop: DOM.scrollTop() - scrollTimes * 100 * ev.deltaY}, 0.5, 'easeOut', function(){
                    scrollAnim = undefined;
                    scrollTimes = 1;
                }).run();
            });
        },
        /*
        *@smoothKeydownScroll方法：为页面添加键盘上下键的平滑滚动
        *@speed：滚动的速度设置，其值为1——3之间，最好取1、2、3这样的整数或者小数点后一位的数字
        *@Note:调用方法 scrollAnim.smoothKeydownScroll(...);
        */
        smoothKeydownScroll: function(speed){
            if(!S.isNumber(speed) && (speed>=1 && speed<=3)){
                S.log('smoothScroll方法的参数必须为数字！！！');
                return null;
            }
            var scrollAnim;
            var scrollTimes = 1;
            var _scrollable = /webkit/i.test(navigator.userAgent) || document.compatMode == 'BackCompat' ? document.body : document.documentElement;

            Event.on(document, 'keydown', function(ev){
                //平滑滚动
                if(ev.which==38){
                    ev.halt();
                    if(scrollAnim){
                        scrollAnim.stop();
                        scrollTimes++;
                        scrollTimes = scrollTimes > speed ? speed : scrollTimes; //限制速度
                    }
                    scrollAnim = S.Anim(_scrollable,{scrollTop: DOM.scrollTop() - scrollTimes * 100}, 0.5, 'easeOut', function(){
                        scrollAnim = undefined;
                        scrollTimes = 1;
                    }).run();
                }

                if(ev.which==40){
                    ev.halt();
                    if(scrollAnim){
                        scrollAnim.stop();
                        scrollTimes++;
                        scrollTimes = scrollTimes > speed ? speed : scrollTimes; //限制速度
                    }
                    scrollAnim = S.Anim(_scrollable,{scrollTop: DOM.scrollTop() + scrollTimes * 100}, 0.5, 'easeOut', function(){
                        scrollAnim = undefined;
                        scrollTimes = 1;
                    }).run();
                }
            });
        },

        /*
        *@scrollLineAnim方法：使元素的某个属性沿画面上的指定起始终止位置变化
        *@elem: 待运动的元素的选择器
        *@attr: 希望在滚动中变化的属性，目前仅支持元素属性仅为一个数值或一个数值+单位或者是多个数值+单位但仅要求第一个数值改变的情况
                例如：opacity（一个数值），top（一个数值+单位），background-position要求x方位的值改变的情况（多个数值+单位）
        *@config: 这个要传入一个json格式的数据，其包含五个参数，分别为：
                  start_scroll: 期望elem元素attr值开始变化的scroll值
                  end_scroll: 期望elem元素attr值停止变化的scroll值
                  start_value: 期望elem的attr属性变化的起始值
                  end_value: 期望elem的attr属性变化的最终值
                  isCallbackLoop: 设置回调函数是否在页面中仅执行一次（false），或者是当页面回滚再次滚下时再次触发（true），默认为true
                  isAnimLoop: 设置滚动动画是否可以重复执行，当设置为false时则在回调函数触发之后滚动动画将不再执行，默认为true。

          例：config= {
                start_scroll: 200,
                end_scroll: 1000,
                start_value: -100,
                end_value: 300,
                isCallbackLoop: false,
                isAnimLoop: false
          };
        *Note：调用方法：S.Event.on(window, 'scroll', scrollAnim.scrollLineAnim(...));
        */
        scrollLineAnim: function(elem, attr, config, callback){
            var obj_attr_list=['start_scroll', 'end_scroll', 'start_value', 'end_value'], index, input_data;

            if(!S.isString(elem)){
                S.log('请输入正确的选择器格式的字符串！！！');
                return null;
            }
            if(!S.isString(attr)){
                S.log('您输入的待变化的属性应为字符串格式！！！');
                return null;
            }
            if(!S.isObject(config)){
                S.log('您输入的配置信息应该为一个对象！！！');
                return null;
            }else{
                for(index=0;index<obj_attr_list.length;index++){
                    if(!config.hasOwnProperty(obj_attr_list[index])){
                        S.log('传入的json格式不正确！！！应该包含'+obj_attr_list[index]+'属性');
                        return null;
                    }
                }
                if(!config.hasOwnProperty('isCallbackLoop')){
                    config.isCallbackLoop=true;
                }
                if(!config.hasOwnProperty('isAnimLoop')){
                    config.isAnimLoop=true;
                }
            }

            if(callback!=undefined && !S.isFunction(callback)){
                S.log('您输入的回调参数必须是一个函数！！！');
                return null;
            }
            //将输入的参数封装成一个json并推入AllSets中，以便后面循环放入一个scroll的Event的回调函数中
            input_data={};
            input_data.elem=elem;
            input_data.attr=attr;
            input_data.config=config;
            input_data.callback=callback;
            //lock属性为决定回调函数是否重复执行的锁
            input_data.lock=false;
            //all_lock属性为决定整个动画是否能够一直重复执行，还是在回调函数触发后就不再执行的锁
            input_data.all_lock=false;
            AllSets.push(input_data);

            //要保证所有页面上调用该方法的元素均能在一个scroll事件的回调函数中，否则可能会有效率问题

            Event.on(window, 'scroll', pre_scroll_fn=function(ev){
                var scrollTop=DOM.scrollTop(window);
                var attr_value;
                var first_letter;
                var i, count;
                for(count=0;count<AllSets.length;count++){
                    attr_value=undefined;
                    first_letter=undefined;
                    if(!AllSets[count].all_lock){
                        if(scrollTop>=AllSets[count].config.start_scroll && scrollTop<=AllSets[count].config.end_scroll){
                            attr_value=DOM.css(AllSets[count].elem, AllSets[count].attr);

                            for(i=0; i<attr_value.length; i++){
                                if(!(attr_value.substr(i,1)>='0' && attr_value.substr(i,1)<='9') && attr_value.substr(i,1)!='-' && attr_value.substr(i,1)!='.'){
                                    first_letter=attr_value.substr(i,1);
                                    break;
                                }
                            }

                            if(S.isUndefined(first_letter)){
                                //此时该属性为一个数值且没有单位的情况
                                DOM.css(AllSets[count].elem, AllSets[count].attr, AllSets[count].config.start_value+(scrollTop-AllSets[count].config.start_scroll)*((AllSets[count].config.end_value-AllSets[count].config.start_value)/(AllSets[count].config.end_scroll-AllSets[count].config.start_scroll)));
                            }else{
                                //此时该属性为一个数值+一个单位或多个数值+单位且仅改变第一个元素值的情况
                                //这是绝对距离的算法
                                DOM.css(AllSets[count].elem, AllSets[count].attr, AllSets[count].config.start_value+(scrollTop-AllSets[count].config.start_scroll)*((AllSets[count].config.end_value-AllSets[count].config.start_value)/(AllSets[count].config.end_scroll-AllSets[count].config.start_scroll))+attr_value.substring(attr_value.indexOf(first_letter)));
                                attr_value=attr_value.substring(0,attr_value.indexOf(first_letter));
                            }
                            //当元素运动到end_value或比end_value小整个变化范围的5%范围内时，执行回调函数callback，lock保证回调函数只执行一次
                            if(Math.abs(attr_value-AllSets[count].config.end_value)<Math.abs((AllSets[count].config.end_value-AllSets[count].config.start_value)*0.01)){
                                if(!AllSets[count].lock){
                                    AllSets[count].callback && AllSets[count].callback();
                                    //这里是当设置isAnimLoop属性为true时，在回调函数执行后，all_lock属性上锁
                                    if(!AllSets[count].config.isAnimLoop){
                                        AllSets[count].all_lock=true;
                                    }
                                    AllSets[count].lock=true;
                                }
                            }else{
                                //根据用户输入是否允许重复回调函数的设置来判断
                                if(AllSets[count].config.isCallbackLoop){
                                    AllSets[count].lock=false;
                                }
                            }
                        }else if(scrollTop>AllSets[count].config.end_scroll && AllSets[count].lock==false){
                                AllSets[count].callback && AllSets[count].callback();
                                //这里是当设置isAnimLoop属性为true时，在回调函数执行后，all_lock属性上锁
                                if(!AllSets[count].config.isAnimLoop){
                                    AllSets[count].all_lock=true;
                                }
                                AllSets[count].lock=true;
                        }
                    }

                }
            });
        }

    });
    return ScrollAnim;
}, {requires:['base']});