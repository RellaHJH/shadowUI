(function($){
    var CurrentDomain = 'product.auto.163.com';
    var cCar = {};
    cCar.tools = {};
    cCar.tools.loadScript = function (url, callback, coding){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.charset = coding;
        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" || script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Others
            script.onload = function(){
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    };
    
    cCar.tools.templateStr = function (temp, data, regexp){
        if(!(Object.prototype.toString.call(data) === "[object Array]")) data = [data];
        var ret = [];
        for(var i=0,j=data.length;i<j;i++){
            ret.push(replaceAction(data[i]));
        }
        return ret.join("");
        function replaceAction(object){
            return temp.replace(regexp || (/\\?\{([^}]+)\}/g), function(match, name){
                if (match.charAt(0) == '\\') return match.slice(1);
                return (object[name] != undefined) ? object[name] : '';
            });
        }
    };
    cCar.app = {};
    cCar.app.searchBarnew = function(o){
        var content = o.NTES("p").NTES(0),
            oSelect0 = content.NTES("select").NTES(0), 
            oSelect1 = content.NTES("select").NTES(1), 
            oInput = content.NTES("input").NTES(0), 
            dText1 = oSelect1.NTES("option").NTES(0).innerHTML;
        //初始化品牌选择 
        cCar.tools.loadScript(
            "http://" + CurrentDomain + "/auto/json/brandlist.js", 
            function(){
                if(typeof data == 'undefined' || !data){return;}
                var dataObj = data;data='undefined';        
                dataObj.len = dataObj.length;
                for (var i = 0; i < dataObj.len; i++){
                    var objOption = new Option(dataObj[i].name,dataObj[i].cid + "--" + dataObj[i].autoid);
                    if(NTES.browser.msie){objOption.setAttribute("title",dataObj[i].name);}                 
                    oSelect0.options.add(objOption);
                }
            },
            'gbk'
        );
        //品牌选择后选车系
        var Select0Check = function(){
            if(oSelect1.length != 1){oSelect1.innerHTML = '';oSelect1.options.add(new Option(dText1,"0"));} 
            if(oSelect0.selectedIndex == 0){return}
            
            cCar.tools.loadScript(
                "http://" + CurrentDomain + "/auto/json/select/" + oSelect0.value.split("--")[0] + ".js",
                function() {
                    if(typeof data == 'undefined' || !data){return;}
                    var dataObj = data;data = 'undefined';
                    dataObj.len = dataObj.length;
                    for (var i = 0; i < dataObj.len; i++){
                        var Optgroup = document.createElement("optgroup");   
                        Optgroup.label = dataObj[i].name;  
                        oSelect1.appendChild(Optgroup);
                        var arr = dataObj[i].value; arr.len = arr.length;
                        for(var j = 0; j < arr.len; j++){
                            var objOption = document.createElement("option");
                            objOption.setAttribute("value",arr[j].cid + "--" + arr[j].autoid);
                            if(NTES.browser.msie){objOption.setAttribute("title",arr[j].firstchar + "--" + arr[j].name);}
                            objOption.innerHTML = arr[j].name;
                            oSelect1.appendChild(objOption);
                        }
                    }
                },
                'gbk'
            );
        };
        oSelect0.addEvent('change',Select0Check);
        oInput.onclick = function(){
            var blankUrl = "";
            if(oSelect0.selectedIndex == 0 && oSelect1.selectedIndex == 0){
                blankUrl = "";
            }else if(oSelect0.selectedIndex != 0 && oSelect1.selectedIndex == 0){
                blankUrl = "brand/" + oSelect0.value.split("--")[1] + ".html";
            }else{
                blankUrl = "series/" + oSelect1.value.split("--")[1] + ".html";
            }
            window.open("http://" + CurrentDomain + "/" + blankUrl + "#YS1001", "_blank");
        }
    };
    cCar.app.carList = function(o){
        var carList = o.NTES("ul").NTES(0),
            hotCar = o.NTES(".autopro-classify").NTES(0);
        cCar.tools.loadScript(
            "http://" + CurrentDomain + "/auto/json/163/select/pricerank_v2.js", 
            function(){
                if(typeof data == 'undefined' || !data){return;}
                for(var i in data){
                    if(data[i].label == 'suv'){
                        data.unshift(data.splice(i,1)[0]);
                    }
                }
                hot_car(data);  //热门车型
                car_list(data); //区间列表
                cCar.app.searchBarnew($('#auto_choose'));   //选车
            },
            'gbk'
        );
        function car_list(data){
            var titleArr = {
                'suv':'SUV',
                '8-10':'8-10万',
                '10-15':'10-15万',
                '15-20':'15-20万',
                'hot_brands':'热门品牌'
            };
            var tml = {
                list : '<dl><dt><a href="{url}">{label}</a></dt><dd class="autopro-classify-con">{listStr}</dd><dd class="autopro-classify-more"><a href="{url}">&gt;&gt;</a></dd></dl>',
                listDt : '<dl><dt><a href="{url}">{label}<i>H</i></a></dt><dd class="autopro-classify-con">{listStr}</dd><dd class="autopro-classify-more"><a href="{url}">&gt;&gt;</a></dd></dl>',
                item : '<a href="{auto_url}" title="{auto_name}">{auto_name}</a>'
            }
            for(var i = 0; i < data.length; i++) {
                for(var key in titleArr){
                    if(key == data[i].label){
                        data[i].label = titleArr[key];
                        break;
                    }
                }
                for(var j = 0; j < data[i].auto_list.length; j++) {
                    data[i].auto_url = data[i].auto_list[j].auto_url;
                    data[i].auto_name = data[i].auto_list[j].auto_name;
                }
                data[i]["listStr"] = cCar.tools.templateStr(tml.item,data[i].auto_list);
            }
            hotCar.innerHTML = cCar.tools.templateStr(tml.list, data.slice(0,4)) + cCar.tools.templateStr(tml.listDt, data.slice(5,6));
        }
        function hot_car(data){
            var tml = {
                list : '<li class="list-figure"><div class="m-img"><a href="{auto_url}"><img src="{img_src}" data-original-src="{img_src}" class="js_lazyload_common" alt="{auto_name}" title="{auto_name}" width="130" height="90"><p>{auto_name}<span>{lowprice}</span></p></a></div></li>',
                item : '<li><a href="{auto_url}"><span>{lowprice}</span>{auto_name}</a></li>'
            }
            for(var i in data){
                if(data[i].label == 'hot_series'){
                    carList.innerHTML = cCar.tools.templateStr(tml.list, data[i].auto_list.slice(0,1)) + cCar.tools.templateStr(tml.item, data[i].auto_list.slice(1,6));
                }
            }
        }
    };
    cCar.app.carList($('#js_car_list'));
})(NTES);