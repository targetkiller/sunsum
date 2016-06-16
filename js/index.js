/*
 * @author:tq;
 * @date:2016/06/16;
 * @content:sunsum鲜橙官网主逻辑
*/

$(function () {
	var page_num = $('.top-nav a').length+1;
	var myScroll = null;
	//图片路径
	var imgPath = "img/";
	// 当前导航下标
	var NAVIGATION_INDEX = 0;
	// json数据
	var JSON_ITEMLIST;
	var BROWSER_HEIGHT = $(window).height();
	var BROWSER_WIDTH = $(window).width();
	var isLayoutListPage = false;

	$(window).resize(function(){ 
		console.log('Window resize!');
		var page_index = parseInt($(this).attr('data-index'));
		BROWSER_WIDTH = $(window).width();
		BROWSER_HEIGHT = $(window).height();

		$('.about .title-wrap').css({'width':BROWSER_WIDTH,'height':BROWSER_HEIGHT});
		$('.detail .title-wrap').css({'width':BROWSER_WIDTH,'height':BROWSER_HEIGHT});
		$('.page5 .inner').css('height',$('.top-idx-list').height()+500);
		$('.container').css({
			'-webkit-transform':'translate3d(0,-'+parseInt(NAVIGATION_INDEX-1)*BROWSER_HEIGHT+'px,0)',
			'transform':'translate3d(0,-'+parseInt(NAVIGATION_INDEX-1)*BROWSER_HEIGHT+'px,0)'
		});

	});

	// 导航监听
	$('.top-nav a').click(function(){
		var page_index = parseInt($(this).attr('data-index'));
		var page_now_index = NAVIGATION_INDEX;
		var direction = page_now_index > page_index? 1:-1;

		$(this).addClass('icon-wrap-active')
			   .siblings()
			   .removeClass('icon-wrap-active');
		$('.page'+page_index).addClass('active').siblings().removeClass('active');
		$('body').attr('class','index-'+page_index);

		Jump_to_page(page_index,direction);
	});

	// 监听滚轮
	var FLAG_IS_MOVING = false;
	var FLAG_SWITCH_SCROLL = false;
	function bodyBindMouse(){
		$('body').mousewheel(function(e) {
			// 把列表页布局放在第一次跳转，是为了避免获取列表高度出问题
			if(!isLayoutListPage){
				$('.page5 .inner').css('height',$('.top-idx-list').height()+500);
				isLayoutListPage = true;
			}

			// 如果是项目列表页，停止监听
			if(FLAG_SWITCH_SCROLL){return;}

			e.preventDefault();

			// 如果正在上一个滚动，则暂时抛弃其他滚动，1400ms后可以接受其他滚动（解决mac下trackpad问题）
			if(FLAG_IS_MOVING){return;}
			else{FLAG_IS_MOVING = true;}
			setTimeout(function(){
				FLAG_IS_MOVING = false;
			},1400);

			var direction = e.deltaY;
			var page_index = $('.icon-wrap-active').attr('data-index');
			
			// 下翻
			if(direction < 0){
				page_index++;
			}
			// 上翻
			else{
				page_index--;
			}

			// 若到顶或者到尾部则返回
			if(page_index==0||page_index==page_num){return;}

			Jump_to_page(page_index,direction);
		});
	}

	// 处理哈希
	function addHash(str){
		if(location.hash!==undefined){
			location.hash = str;
		}
	}
	function clearHash(){
		if(location.hash!==undefined){
			location.hash = "";
		}	
	}

	// page5页切换绑定监听
	function Switch_to_scroll(){
		FLAG_SWITCH_SCROLL = true;

		setTimeout(function(){
			if(myScroll == null){
				myScroll = new IScroll('#scrollPage',{
					scrollbars: false,
					mouseWheel: true,
					probeType: 3
				});
			}

			myScroll.on('scroll', function(){
				console.log(this.y);
				if(parseInt(this.y) > -1){
					FLAG_SWITCH_SCROLL = false;
					clearHash();
					Jump_to_page(page_num-2,-1);
				}
			});
		},1400);
	}

	// 到达列表页面，检查hash
	function checkPage5Hash(){
		if(location.hash!==undefined){
			var hash = location.hash;
			var hash_index = 0;
			$('.top-idx-list').css({'opacity':0}).hide();
			switch(hash){
				case '#all': 
					$('.top-idx-list-item').hide(0);
					$('.top-idx-list-item').show(0);
					hash_index = 0;
					break;
				case '#cate1': 
					$('.top-idx-list-item').hide(0);
					$(".top-idx-list-item[data-cate=1]").show(0);
					hash_index = 1;
					break;
				case '#cate2':
					$('.top-idx-list-item').hide(0);
					$(".top-idx-list-item[data-cate=2]").show(0);
					hash_index = 2;
					break;
				case '#cate3':
					$('.top-idx-list-item').hide(0);
					$(".top-idx-list-item[data-cate=3]").show(0);
					hash_index = 3;
					break;
				default:
					$('.top-idx-list-item').removeClass('hide');
					break;
			}
			$('.top-idx-list').show();
			setTimeout(function(){
				$('.top-idx-list').css('opacity',1);
			},100);
			var $son = $(".js_filterBtn[data-cate='"+hash_index+"'");
			var $parent = $son.parent('li');
			$son.addClass('current');
			$parent.siblings().find('a').removeClass('current');
		}
	}

	// hash路由
	function checkInitHash(){
		if(location.hash!==undefined){
			var hash = location.hash;
			// 进入hash页
			if(hash == '#about'){
				$('.js_aboutus').click();
			}
		}
		resetPage();
	}

	// 重置页面位置
	function resetPage(){
		setTimeout(function(){
			$('body').scrollTop(0);
			$('.container').css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)'});
		},0);
	}

	// 跳到目标页面
	function Jump_to_page(page_index,direction){
		$('body').attr('class','index-'+page_index);

		// 滑动页面
		$('.container').css({
			'-webkit-transform':'translate3d(0,-'+parseInt(page_index-1)*BROWSER_HEIGHT+'px,0)',
			'transform':'translate3d(0,-'+parseInt(page_index-1)*BROWSER_HEIGHT+'px,0)'
		});

		// 线动画
		Animate_line(page_index,direction);

		// 更新导航图标
		$(".top-nav a[data-index='"+page_index+"']").addClass('icon-wrap-active')
			   .siblings()
			   .removeClass('icon-wrap-active');

		$('.page'+page_index).addClass('active').siblings().removeClass('active');

		// 到列表页后调用hash
		if(page_index==page_num-1){
			Switch_to_scroll();
			checkPage5Hash();
		}
	}

	// 线动画
	function Animate_line(index,direction){
		var $lineTop = $('.top-workLineT');
		var $lineBottom = $('.top-workLineB');
		var $sideLink = $('.top-head-link');
		var line_duration_time = 1000;

		// 上下线方向动画
		// 下滑
		if(direction < 0){
			$lineTop.addClass('js_lineNext').addClass('js_scrolled');
			$lineBottom.addClass('js_lineNext');
			setTimeout(function(){
				$lineTop.removeClass('js_lineNext');
				$lineBottom.removeClass('js_lineNext');
			},line_duration_time);
		}
		// 上滑
		else{
			if(index===1){
				$lineTop.addClass('js_linePrev_top').removeClass('js_scrolled');
				$lineBottom.addClass('js_linePrev_top');
				setTimeout(function(){
					$lineTop.removeClass('js_linePrev_top');
					$lineBottom.removeClass('js_linePrev_top');
				},line_duration_time);
			}
			else{
				$lineTop.addClass('js_linePrev');
				$lineBottom.addClass('js_linePrev');
				setTimeout(function(){
					$lineTop.removeClass('js_linePrev');
					$lineBottom.removeClass('js_linePrev');
				},line_duration_time);
			}
		}

		// 移动侧边线
		$sideLink.removeClass('js_showLink');
		setTimeout(function(){
			$sideLink.addClass('js_showLink');
		},line_duration_time);
	}

	// 查找json中制定id
	function SearchForIdInJson(_id){
		for(var i = 0; i < JSON_ITEMLIST.length; i++){
			if(JSON_ITEMLIST[i].id==_id){
				return i;
			}
		}
		return -1;
	}

	// 展开按钮内容
	$('.btn-expand').hover(function(){
		var $btn = $(this).parents('.page');
		if($btn.hasClass('expand')){
			$btn.removeClass('expand');
		}
		else{
			$btn.addClass('expand');
		}
	});

	// 查看更多按钮
	$('.js_showLink').click(function(){
		// 获取当前页面位置
		var page_now_index = NAVIGATION_INDEX;
		// 分类目录是页面位置－1
		var index = page_now_index - 1;

		if(index == 0){
			addHash('#all');
		}
		else{
			addHash('#cate'+index);
		}

		Jump_to_page(page_num-1,-1);
	});

	// 点击返项目详情
	$('.js_allproject').click(function(){
		$('.detail').addClass('leave');
		// 初始化
		$('body').css('background-image','none').attr('class','index-5').scrollTop(0);

		setTimeout(function(){
			$('.page5,.container').removeClass('hide');
			$('.detail').addClass('hide');

			FLAG_SWITCH_SCROLL = false;
			$('html,body').css('overflow-y','hidden');

			$('.detail').removeClass('leave');
		},1000);
	});

	//  点击开启关于页
	$('.js_aboutus').click(function(){
		addHash('#about');

		$('.about').addClass('active');

		FLAG_SWITCH_SCROLL = true;
		$('html,body').css('overflow-y','auto');
		$('body,.about').scrollTop(0);

		$('.about .title-wrap').css({'width':BROWSER_WIDTH,'height':BROWSER_HEIGHT});
		$('.about .title-wrap .bg').css({'background-image':'url(img/intro.jpg)'});

		$('body').addClass('body-about');
		$('.page5,.container').addClass('hide');

		// scroll监听
		$('body').mousewheel(function(){
			if($(this).scrollTop()>1200){
				setTimeout(function(){
					$('.cooperation-wrap .company-list').addClass('active');
				},200);
			}
		})
	});

	// 关于返回
	$('.js_leaveabout').click(function(){
		clearHash();

		$('.about').removeClass('active');
		// 初始化
		$('body').css('background-image','none').removeClass('body-about').scrollTop(0);

		FLAG_SWITCH_SCROLL = false;
		$('.page5,.container').removeClass('hide');
		$('html,body').css('overflow-y','hidden');

		$('.detail').removeClass('leave');
		$('.cooperation-wrap .company-list').removeClass('active');
	});

	// 分类选择
	$('.js_filterBtn').click(function(){
		addHash($(this).attr('href'));
		checkPage5Hash();
	});

	// 关于页标题文字处理
	$('.about .title-wrap h1').text($('.about .title-wrap h1').text().split('').join('\xa0\xa0'));

	// 强制复位，检查哈希跳转
	checkInitHash();
	bodyBindMouse();

	// 获取项目列表
	$.getJSON("config.json", function(data){
		JSON_ITEMLIST = data.itemList;
		for(var i = 0; i < JSON_ITEMLIST.length; i++){
			// 项目名
			var name = JSON_ITEMLIST[i].name;
			// 客户
			var client = JSON_ITEMLIST[i].client;
			// 标记id
			var id = JSON_ITEMLIST[i].id;
			// 类型id在于项目的第一位，例如10003的类型id就是1
			var cateId = Math.floor(id/10000);
			// 封面图
			var thumbImg = JSON_ITEMLIST[i].thumbImg;
			

			var template = "<li class='top-idx-list-item leftCycle js_showIndexItems js_showFinish' data-id='"+id+"' data-cate='"+cateId+"'>\
					<a href='##' class='js_indexBtn js_internal-link'>\
						<img src='img/"+thumbImg+"' class='indexImg'>\
						<div class='indexLineT'></div>\
						<div class='indexLineR'></div>\
						<div class='indexLineB'></div>\
						<div class='indexLineL'></div>\
					</a>\
					<p class='indexProject js_indexProject'>\
						<span class='indexProject-title'>"+name+"</span>\
						<span class='indexProject-client'>"+client+"</span>\
					</p>\
				</li>";

			$('.top-idx-list').append(template);
		}

		// 点击项目到detail
		$('.top-idx-list li').click(function(){
			// 禁止滑动
			FLAG_SWITCH_SCROLL = true;
			$('html,body').css('overflow-y','auto');

			// 项目id
			var id = $(this).attr('data-id');
			// id所在目录
			var index = SearchForIdInJson(id);
			// 项目标题
			var title = $(this).find('.indexProject-title').text();
			// 客户
			var client = $(this).find('.indexProject-client').text();
			// 图片列表
			var imgList = [];
			$('#detail-imgWrap').empty();
			if(JSON_ITEMLIST[index].imgNum>0){
				for(var i = 1; i < JSON_ITEMLIST[index].imgNum+1; i++){
					// forexample：img/detail/10001-1.jpg
					imgList[i] = imgPath+"detail/"+id+"-"+i+".jpg";
					$('#detail-imgWrap').append("<img src='"+imgList[i]+"' />");
				}
			}

			$('.detail').removeClass('hide');
			$('body, .detail').scrollTop(0);

			$('.detail .title-wrap').css({'width':BROWSER_WIDTH,'height':BROWSER_HEIGHT});
			$('.detail .title-wrap .bg').css({'background-image':'url('+imgPath+"detail/"+JSON_ITEMLIST[index].coverImg+')'});
			$('#detail-Title').text(title);
			$('#detail-Titlesmall').text(title);
			$('#detail-Client').text(title);

			// 获取介绍文本
			$.getJSON("description.json", function(data){
				$('#detail-descrption').html(data[id]);
			});

			$('body').addClass('body-detail');
			$('.page5,.container').addClass('hide');
		});
		
		setTimeout(function(){
			$('.page5 .inner').css('height',$('.top-idx-list').height()+500);
			isLayoutListPage = true;
		},1500);
	});
});

