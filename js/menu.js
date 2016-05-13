/*
 * Copyright (C) 2015 by ShadowCat.
 * Depending on the jquery-1.11.2.min.js.
 * To cite this document, always state the source as shown above.
 *
*/

	function Menus(){
		this.cssStyle = 'default'; //默认风格
		this.target="_brank";
	    this.itemIcon = 'none';
	    // this.urlFile="url";//url列名
	    // this.textFile="text";
	    // this.listFile='list';
   }
    //jsonlist 菜单json数据；domID要绑定到DOM元素ID
	Menus.prototype.loadMenu=function(jsonlist,domID){
			var list=null;
			var buffer = new StringBuffer(); 
			buffer.append('<div class="menubox">'); 
			//加载数据
			for (var num in jsonlist) {
				buffer.append('<div class="menulist"><h1 class="menutitle"><a href="');
				buffer.append(typeof(jsonlist[num].url)=="undefined"?"javascript:void(0)":jsonlist[num].url);
				buffer.append('" titleId=');
				buffer.append(jsonlist[num].id);
				list=jsonlist[num].list;
				if (!list) {
					buffer.append(' style="background:none"');
				};
				if(!this.target){
					buffer.append(" target='");
					buffer.append(this.target);
				}
			
				buffer.append("'>");
				buffer.append(jsonlist[num].text);
				buffer.append('</a></h1><ul>');
				
				for (var i in list) {
					buffer.append("<li><a href='");
					buffer.append(list[i].url);
					buffer.append("' target='");
					buffer.append(this.target);
					buffer.append("'>");
					
					buffer.append(this.itemIcon=="none"?" ":'<img src="'+this.itemIcon+'"/>');
					buffer.append(list[i].text);
					buffer.append('</a></li>');
				};
				buffer.append('</ul></div>');
			};
			buffer.append('</div>');
			$(buffer.toString()).appendTo("#"+domID)

			this.addEvent();//加载事件
	}
		



	//加载事件
	Menus.prototype.addEvent=function(){
		$(".menutitle a").click(function(){
			if($(this).attr("href")!="javascript:void(0)"){
				return false;
			}
			var ul=$(this).parent().parent().find("ul");
			if(ul.css("display")=="none"){
				$(this).parent().addClass("menuselect");
			}else{
				$(this).parent().removeClass("menuselect");
			}
			ul.toggle();
			return false;
		});
	}

  
	function StringBuffer(){ 
		this.__strings__ = []; 
	}; 
	StringBuffer.prototype.append = function(str){ 
		this.__strings__.push(str); 
	}; 
	StringBuffer.prototype.toString = function(){ 
		return this.__strings__.join(''); 
	}; 


// function testObject(){
//     this.value = “I’m in constructed object”;
//     this.alertValue = function(){
//         alert(this.value);
//     }
// }

