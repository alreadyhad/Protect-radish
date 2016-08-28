$(function(){
	//仿保卫萝卜游戏
	var Game = {
		arrMap : [   //地图数组
			1,1,3,1,1,1,1,1,6,1,1,6,1,1,1,5,1,1,1,1,
			1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,2,2,2,2,2,2,2,2,1,1,1,7,8,1,1,5,1,1,
			1,1,1,1,1,1,1,1,1,2,1,1,1,9,10,1,1,1,1,5,
			1,1,6,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,6,1,1,1,2,2,2,2,2,2,2,2,1,1,1,
			1,1,5,1,1,1,1,1,1,1,6,1,1,1,1,1,2,1,1,1,
			1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,1,1,1,
			1,5,1,1,1,1,2,1,1,1,1,1,1,1,1,5,1,1,1,1,
			1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,5
		],
		arrRoute : [  //运动方向数组
			0,0,'1B',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,'2R',0,0,0,0,0,0,'3B',0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,'4R',0,0,0,0,0,0,'5B',0,0,0,
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,'7B',0,0,0,0,0,0,0,0,0,'6L',0,0,0,
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,'8B',0,0,0,0,0,0,0,0,0,0,0,0,0
		],
		routeDir:[], // 路线方向
		routeSpeed:[], //路线速度
		routeTarget:[], //路线目标点
		gridWidth:50, // 网格宽高
		colNum:20, //一行网格个数
		$startElem:null, //起始网格
		$endElem:null, //结束网格
		monsterSpeed:5, //怪物移动速度
		monsterStyle:'monster1', //怪物样式
		monsterBlood:100,  //怪物HP
		monsterMoney:10,	// 怪物价值
		cannonMoney:50, 	//加农炮价值
		cannonStyle:'cannon1', //加农炮样式
		bulletRange : 100,       //子弹攻击范围
		bulletStyle : 'bullet1',    //子弹样式
		bulletSpeed : 10,       //子弹速度
		bulletPower : 10,       //子弹攻击力

		init:function(){ //初始化游戏
			this.elements();
			this.creatMap();
			this.events();
			this.listens();
		},
		elements:function(){  //获取DOM元素
			this.$startBtn = $('#start1');  //获取开始按钮
			this.$moneyNum = $('#money1');	//获取金钱按钮
			this.$parent = $('#div1');	// 获取画布
		},
		creatMap:function(){ //创建地图
			var This = this;
			this.$parent.css('width',this.gridWidth*this.colNum); // 设置画布宽度为 网格宽度*每行网格个数
			$.each(this.arrMap,function(i,value){
				var $div = $('<div class="box'+ value +'"></div>'); //创建地图网格
				if(value==3){
					//$div.html('Start');
					This.$startElem = $div;   //存储起始网格
				}else if(value==4){
					//$div.html('End')
					This.$endElem = $div;	//存储结束网格
				}
				This.$parent.append($div)   //把网格添加到画布中
			});
			this.routes();   //调用寻路方法
		},
		routes:function(){  //寻路方法
			var This = this;
			var arr = [];
			var $aDiv = this.$parent.find('div'); //获取所有网格
			$.each(this.arrRoute,function(i,value){ // 遍历方向数组
				if(value!=0){
					arr.push({dir:value,xy:i});  //存储目标点到 arr
				}
			});
			arr.sort(function(val1,val2){
				return val1.dir.substring(0,val1.dir.length-1)-val2.dir.substring(0,val2.dir.length-1);   //对目标点按首字符数字大小进行排序
			});
			$.each(arr,function(i,value){
				var dir = value.dir.substring(value.dir.length-1);    //获取目标点 第二个字符
				if(i == arr.length-1){
					return false;
				}
				switch(dir){  //判断方向
					case 'B':
						This.routeDir.push('top'); 
						This.routeSpeed.push(This.monsterSpeed);
						This.routeTarget.push( $aDiv.eq(arr[i+1].xy).position().top); // 获取目标点
					break;
					case 'L':
						This.routeDir.push('left');
						This.routeSpeed.push(-This.monsterSpeed);
						This.routeTarget.push( $aDiv.eq(arr[i+1].xy).position().left);
					break;
					case 'T':
						This.routeDir.push('top');
						This.routeSpeed.push(-This.monsterSpeed);
						This.routeTarget.push( $aDiv.eq(arr[i+1].xy).position().top);
					break;
					case 'R':
						This.routeDir.push('left');
						This.routeSpeed.push(This.monsterSpeed);
						This.routeTarget.push( $aDiv.eq(arr[i+1].xy).position().left);
					break;
				}
			});
		},
		events:function(){
			var This = this;
			this.$startBtn.on('click',function(){
				This.creatListMonster();
			});
			this.$parent.delegate('.box1','mouseover',function(){
				$(this).addClass('active');
			});
			this.$parent.delegate('.box1','mouseout',function(){
				$(this).removeClass('active');
			});
			this.$parent.delegate('.box1','click',function(){
				This.creatCannon(this); 
			});
		},
		creatCannon:function(elem){   //创建加农炮塔！
			if(parseInt(this.$moneyNum.val())>=this.cannonMoney){  //判断钱包里的钱是否足够购买
				$(elem).attr('class',this.cannonStyle);    // 修改网格 样式 为加农炮样式
				this.changeMoney(-this.cannonMoney);   
			}
		},
		changeMoney:function(money){ // 修改钱包里的钱
			var num = parseInt(this.$moneyNum.val())+money;  
			this.$moneyNum.val(num+'￥');
		},
		creatListMonster:function(){ //创建怪物列表
			var This = this;
			var iNum = 10;
			var timer = setInterval(function(){
				if(iNum==0){
					clearInterval(timer);
				}else{
					This.creatMonster();
					iNum--;
				}
			},500);
		},
		creatMonster:function(){ //创建怪物
			var $div = $('<div class="'+this.monsterStyle+'"></div>'); //创建一个怪物容器
			var x = this.$startElem.position().left;   //怪物起始位置left值为起始网格left
			var y = this.$startElem.position().top;		//怪物起始位置top值为起始网格right
			$div.css({left:x,top:y});
			$div.get(0).blood = this.monsterBlood;   //设置怪物血量
			$div.get(0).money = this.monsterMoney;	//设置怪物价值
			this.$parent.append($div); //在网格上生成怪物
			this.runMonster($div); 
		},
		runMonster:function($monster){
			var This = this;
			var iNow = 0;
			var nowVal = 0; //初始值
			$monster.get(0).timer = setInterval(function(){
				 if(Math.abs(nowVal-This.routeTarget[iNow])<=1){ //如果当前位置和目标点位置相差小于1
				 	if (iNow==This.routeTarget.length-1) {  //如果到达最后一个目标点
				 		clearInterval($monster.get(0).timer);
				 		alert('Game over');
				 		$("."+This.monsterStyle).remove();
				 	}else{
				 		iNow++;
				 	}
				 }
				 nowVal = $monster.position()[This.routeDir[iNow]] +This.routeSpeed[iNow];  //计算要到达的位置值
				 $monster.css(This.routeDir[iNow],nowVal); 
			},30);
		},
		listens:function(){
			var This = this;
			var $cannon = this.$parent.find('.'+this.cannonStyle);
			$cannon.each(function(){
				This.listenMonster(this);
			});
			setTimeout(function(){
				This.listens();
			},100);
		},
		listenMonster:function(cannon){
			var This = this; 
			var $monster = this.$parent.find('.'+this.monsterStyle);
			cannon.arr = [];
			$monster.each(function(i,elem){
				if (This.disRange($(cannon),$(elem))<=This.bulletRange) { // 判断加农炮和怪物的距离
					cannon.arr.push(elem)
				}
			});
			this.creatBullet(cannon);
		},
		disRange : function($obj1,$obj2){     //计算距离
			var a = $obj1.offset().left - $obj2.offset().left;
			var b = $obj1.offset().top - $obj2.offset().top;
			return Math.sqrt(a*a + b*b);
		},
		creatBullet:function(cannon){ 
			if(cannon.arr.length){
				var $bu =$('<div class="'+this.bulletStyle+'"></div>'); // 创建子弹
				$bu.css({left:$(cannon).position().left+$(cannon).width()/2,top:$(cannon).position().top+$(cannon).height()/2});
				// 设置子弹起始位置为加农炮中心点
				$(cannon).append($bu);
				this.runBullet(cannon,$bu);
			}
		},
		runBullet:function(cannon,$bu){
			var This = this;
			var timer = setInterval(function(){
				if (!cannon.arr.length) { //判断怪物是否进入攻击范围
					clearInterval(timer);
					cannon.innerHTML = '';
					return false;
				}
				var a = ($(cannon.arr[cannon.arr.length-1]).offset().left+This.gridWidth/2)-$bu.offset().left; //计算x轴距离
				var b = ($(cannon.arr[cannon.arr.length-1]).offset().top+This.gridWidth/2)-$bu.offset().top;	//计算Y轴距离
				var c = Math.sqrt(a*a+b*b);  //两点距离
				var argX = a/c;
				var argY = b/c;
				$bu.css({left:$bu.position().left+argX*This.bulletSpeed,top:$bu.position().top+argY*This.bulletSpeed});//子弹要去的位置
				if(This.pz($bu,$(cannon.arr[cannon.arr.length-1]))){ //碰撞检测
					$bu.remove(); //发生碰撞后移除子弹
					clearInterval(timer);
					cannon.arr[cannon.arr.length-1].blood = cannon.arr[cannon.arr.length-1].blood-This.bulletPower; //计算怪物血量
					if (!cannon.arr[cannon.arr.length-1].blood) {  //怪物血量为0时
						clearInterval(cannon.arr[ cannon.arr.length-1].timer);
						/*This.clearMonster($(cannon.arr[cannon.arr.length-1]));*/
						$(cannon.arr[cannon.arr.length-1]).remove(); //移除怪物
						This.changeMoney(cannon.arr[cannon.arr.length-1].money); //增加钱包金额
					}
				}
			},30);
		},
/*		clearMonster:function($monster){
			var arr=[10,-10,10,-10,10,-10,10,-10];
			var num=0;
			var timer = setInterval(function(){
				$monster.css({left:$monster.position().left+arr[num]});
				num++;
				if(num = arr.length-1){
					clearInterval(timer);
					$monster.remove();
				}
			},300);			
		},*/
		pz : function($obj1,$obj2){  //碰撞检测
			var T1 = $obj1.offset().top;
			var B1 = $obj1.offset().top + $obj1.height();
			var L1 = $obj1.offset().left;
			var R1 = $obj1.offset().left + $obj1.width();
			var T2 = $obj2.offset().top;
			var B2 = $obj2.offset().top + $obj2.height();
			var L2 = $obj2.offset().left;
			var R2 = $obj2.offset().left + $obj2.width();
			if(T1>B2 || B1<T2 || L1>R2 || R1<L2){
				return false;
			}
			else{
				return true;
		}
		}


	}
	Game.init(); //执行游戏
});