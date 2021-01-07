// Dom加载
$(function(){
// 初始化
	game.init( $('#container') )
});

var game = {
	//关卡
	round:[
		{
			map:[
				1,1,2,2,2,1,1,1,
				1,1,2,3,2,1,1,1,
				1,1,2,0,2,2,2,2,
				2,2,2,0,0,0,3,2,
				2,3,0,0,0,2,2,2,
				2,2,2,2,0,2,1,1,
				1,1,1,2,3,2,1,1,
				1,1,1,2,2,2,1,1
			],
			box:[
				{x:3,y:3},
				{x:5,y:3},
				{x:3,y:4},
				{x:4,y:5}
			],
			person:{x:4,y:4}
		},
		{
			map:[
				1,1,2,2,2,2,1,1,
				1,1,2,3,3,2,1,1,
				1,2,2,0,3,2,2,1,
				1,2,0,0,0,3,2,1,
				2,2,0,0,0,0,2,2,
				2,0,0,2,0,0,0,2,
				2,0,0,0,0,0,0,2,
				2,2,2,2,2,2,2,2
			],
			box:[
				{x:4,y:3},
				{x:3,y:4},
				{x:4,y:5},
				{x:5,y:5}
			],
			person:{x:4,y:6}
		}
	],
	//初始化
	init:function( selector ){
		//把selector设置成对象的属性使其他方法使用
		this.selector = selector;
		//绘制地图
		this.createMap( 0 );
	},
	//创建地图
	createMap:function( num ){
		this.selector.empty();
		document.title = '第'+(num+1)+'关';
		this.newMap = this.round[num];
		this.selector.css('width',Math.sqrt(this.newMap.map.length) * 50 );
		//添加子元素添加东西
		$.each(this.newMap.map,$.proxy(function(index,item){
			this.selector.append('<div class="pos'+ item +'"></div>');

		},this));
		//创建箱子
		this.createBox();
		//创建人物
		this.createPerson();
	},

	//创建箱子
	createBox:function(){
		$.each( this.newMap.box , $.proxy(function(index,item){
			var oBox = $('<div class="box"></div>');
			oBox.css('left', item.x * 50 );
			oBox.css('top', item.y * 50 );
			this.selector.append(oBox);
		},this));
	},
	//创建人物
	createPerson:function(){
		var oPerson = $('<div class="person"></div>');
		oPerson.css('left',this.newMap.person.x * 50);
		oPerson.css('top',this.newMap.person.y * 50);

		//保存人物的位置
		oPerson.data('x',this.newMap.person.x);
		oPerson.data('y',this.newMap.person.y);
		this.selector.append(oPerson);

		//人物移动
		this.bindPerson( oPerson );
	},

	//人物移动
	bindPerson:function(oPerson){
		$(document).keydown($.proxy(function(e){
			var code = e.keyCode;
			switch(code){
				case 37:
					oPerson.css('backgroundPosition','-150px 0');
					this.movePerson(oPerson,{x:-1});
					break;
				case 38:
					oPerson.css('backgroundPosition','0 0');
					this.movePerson(oPerson,{y:-1});
					break;
				case 39:
					oPerson.css('backgroundPosition','-50px 0');
					this.movePerson(oPerson,{x:1});
					break;
				case 40:
					oPerson.css('backgroundPosition','-100px 0');
					this.movePerson(oPerson,{y:1});
					break;
			}
		},this))
	},

	//移动函数
	movePerson:function(oPerson,obj){
		var xValue = obj.x || 0;
		var yValue = obj.y || 0;

		if(  this.newMap.map[ (oPerson.data('y') + yValue ) * Math.sqrt( this.newMap.map.length) + (oPerson.data('x') + xValue)  ] !=2 ){
			oPerson.data('x',oPerson.data('x') + xValue );
			oPerson.data('y',oPerson.data('y') + yValue );

			//位置移动
			oPerson.css('left',oPerson.data('x') * 50 );
			oPerson.css('top',oPerson.data('y') * 50 );

			//箱子移动
			$('.box').each($.proxy(function(index,ele){
				//箱子和人物是否碰撞
				if( this.nohit( oPerson,$(ele) ) && this.newMap.map[ (oPerson.data('y') + yValue ) * Math.sqrt( this.newMap.map.length) + (oPerson.data('x') + xValue)  ] !=2  ){
					$(ele).css('left',(oPerson.data('x') + xValue)*50);
					$(ele).css('top',(oPerson.data('y') + yValue)*50);

					//俩箱子是否碰撞
					$('.box').each($.proxy(function( i ,element ){
						if( this.nohit( $(ele),$(element) ) && ele != element ){
							$(ele).css('left',oPerson.data('x') * 50);
							$(ele).css('top',oPerson.data('y') * 50);

							oPerson.data('x',oPerson.data('x') - xValue );
							oPerson.data('y',oPerson.data('y') - yValue );

							oPerson.css('left',oPerson.data('x') * 50);
							oPerson.css('top',oPerson.data('y') * 50);
						}
					},this))

				//人物进墙或箱子
				}else if(  this.nohit( oPerson,$(ele) )   ){
					oPerson.data('x', oPerson.data('x') - xValue );
					oPerson.data('y', oPerson.data('y') - yValue );

					oPerson.css('left' , oPerson.data('x') * 50 );
					oPerson.css('top' , oPerson.data('y') * 50 );
				}
			},this));
		}
		//下一关
		this.nextShow();
	},

// 碰撞函数
	nohit:function( obj1,obj2 ){
//人
		var L1 = obj1.offset().left;
		var R1 = obj1.offset().left + obj1.width();
		var T1 = obj1.offset().top;
		var B1 = obj1.offset().top + obj1.height();
//箱子
		var L2 = obj2.offset().left;
		var R2 = obj2.offset().left + obj2.width();
		var T2 = obj2.offset().top;
		var B2 = obj2.offset().top + obj2.height();
// 不能撞墙跟箱子
		if(R1 <= L2||L1 >= R2||T1>=B2||B1 <= T2){
			return false;
		}else{
			return true;
		}
	},
	//下一关
	nextShow:function(){
		var isNum = 0;
		$('.box').each($.proxy(function(index,ele){
			$('.pos3').each($.proxy(function( i , element ){
				if( this.nohit( $(ele) ,$(element) ) ){
					isNum++;
				}
			},this))
		},this))
		// 箱子全部归位
		if(  isNum == this.newMap.box.length ){
			this.createMap( 1 );
		}
	}
}