(function(){

	var jQuery = function(selector){
		//实例化init方法
		return new jQuery.fn.init(selector);
	};

	function markAll(dom,that){
		var ret = that;
		//节点的遍历并且赋值到init对象中
		for(var i=0;i<dom.length;i++){
			ret[i] = dom[i];
		}
		that.length = dom.length;
		//必须返回init这个this，要不然后面的方法就不知道给谁加了
		return that;
	}

	jQuery.fn = jQuery.prototype = {

		init:function(selector){

			var dom = null;
			if( typeof selector!='string' ){
				//获取到非字符串的元素ex:window、this
				dom = [selector]
			}else{
				//获取到元素
				dom = document.querySelectorAll(selector);
			}
			return markAll(dom,this);

		},

	}

	window.jQuery = window.$ = jQuery;

})();