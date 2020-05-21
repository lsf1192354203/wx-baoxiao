/*
Constructor， 建立编辑组件，一个页面上可以有多个实例，实例与container容器关联
对container内部具有editable类的元素进行编辑。通过元素的format属性指定编辑格式
如：format="N,L3"表示数字，长度为3。format="S,R10"表示字符串，可以有10行。
format完整的正则表达式格式为："[N|D|S],L\d+,R\d+"。L:一行长度，R:总行数。

实例：
<div class="editable" format="S,R10" style="width:400px; height:200px;"></div>
<td class="editable" format="N,L3"></td>
*/
var Editor = function(container){
	this.EditFormatName = "ef";
	this.EditOrderName = "edit-order";
	this.container = $(container);
	this.imeMode = false;
	
	/***********************内部功能——开始**********************/
	this._parseFormat = function(targets){
		for(var i=0; i<targets.length; i++){
			var target = $(targets[i]);
			var ef = this._convertFormat(target.attr("format"))
			if(ef.type != "S"){
				target.css("ime-mode", "disabled");
				target.attr('type', 'number');
			}
			target.prop(this.EditFormatName, ef);
			target.attr(this.EditOrderName, i);//设置tab键跳转次序
		}
	}
	this._convertFormat = function(formatStr){
	    var ef = { type: "S", length: 0, rows: 0, zcount: 0, qianfen: false };//zcount:字数大于此数量字号缩小,qianfen:包含千分符
		if(formatStr == null)
			return ef;
	
		var fs = formatStr.split(",");
		for(var i=0; i<fs.length; i++){
			var t = fs[i].toUpperCase();
			if (t == "N" || t == "S" || t == "D")
			    ef.type = t;
			else if (t.indexOf("L") == 0)
			    ef.length = Number(t.substring(1));
			else if (t.indexOf("R") == 0)
			    ef.rows = Number(t.substring(1));
			else if (t.indexOf("Z") == 0)
			    ef.zcount = Number(t.substring(1));
			else if (t.indexOf("QF") == 0)
			    ef.qianfen = true;
		}
		return ef;
	}
	
	this._getEf = function(target){
		return target.prop(this.EditFormatName);
	}
	this._getInput = function(ef){
		switch(ef.type){
		case 'N':
			return this.numberInput;
		case 'D':
			return this.dateInput;
		case 'S':
			return ef.rows > 1 ? this.mutiRowInput : this.stringInput;
		}
	}
	this._next = function(ev, flag){
		var next = Number($(ev.target).attr(this.EditOrderName));
		next += (flag === false ? -1 : 1);
		var nextCell = this.container.find(".editable[" + this.EditOrderName + "="+ next +"]");
		if(nextCell.length > 0){
			nextCell.focus();
		}
		ev.preventDefault();
	}
	/*
	this._down = function(ev, flag){
		var td = $(ev.target).parent();
		if(td.is("td")){
			var row = td.parent(), ci = td.index();
			if(row.index()<1) return;
			row = row.prev();
		}
		ev.preventDefault();
	}
	*/
	this._keydown = function(ev){
		var k = ev.key, kc = ev.keyCode, t  = $(ev.target), ef = this._getEf(t), v = t.text();

		if(kc == 13){//Enter
		    if (this._getEf(t).rows < 2) this._next(ev);
		    else {//允许多行控制
		        var r = this._getTextRow(t.html());
		        if(r==this._getEf(t).rows)
		            this._next(ev);
		    }
		}
		else if(kc == 37){//Left Arrow
			if(getCursorPosition(ev.target) == 0) this._next(ev, false);
		}
		else if(kc == 38){//Up Arrow
			if(getCursorPosition(ev.target) == 0) this._next(ev, false);
		}
		else if(kc == 39){//Right Arrow
			if(getCursorPosition(ev.target) == v.length) this._next(ev);
		}
		else if(kc == 40){//Down Arrow
			if(getCursorPosition(ev.target) == v.length) this._next(ev);
		}
		else if ((kc > 48 && kc < 111) || (kc > 186 && kc < 222)) {
			if(this.imeMode == true) return;
			var ef = this._getEf(t), v = t.text();
			if (ef.length != 0 && ef.length < v.length) {
			    if (ef.type == "N")
			    {
			        if (!this._numberLengthCheck(v, ef.length)) {
			            ev.preventDefault();
			            return false;
			        }
			    }
			    else {
			        ev.preventDefault();
			        return false;
			    }
			}
		}
	}
	this._formatInput = function(ev){
		var t  = $(ev.target), ef = this._getEf(t), v = t.text();
		if (ef.length != 0 && ef.length < v.length) {
		    if (ef.type == "N") {	        
		        if (!this._numberLengthCheck(v, ef.length)) {
		            var fd = v.indexOf('.') > 0 ? v.substr(v.indexOf('.')) : "";
		            v = v.replace(/,/g, '').substr(0, ef.length);
		            t.text(v + fd);
		        }
		    }
		    else {
		        v = v.substr(0, ef.length);
		        t.text(v);
		    }
		}

		if (ef.type == "N") {//数字
		    if(ef.qianfen){v = v.replace(/,/g, '')}
		    if (v != "-" && isNaN(v)) { t.text(""); return; }
		    if (ef.length == 1 && v.length == 1 && v >= '0' && v <= '9') { this._next(ev); return; }//1位自动进下一格
		    else if (ef.length == 2 && v.length == 2 && v >= '0' && v <= '99') { this._next(ev); return; }//2位自动进下一格
		    if (v.indexOf('.') > 0) {//小数最多两位截取
		        var xx = v.split('.')[1].length;
		        if (xx > 2)
		            t.text(v.substr(0, v.length-(xx-2)));
		    }
		}

		if(ef.type == "D" && isNaN(v)){//日期
		}
		if (ef.zcount > 0) {//字数过多缩小字体
		    this._zoomFont(t, ef.zcount);
		}
		//setCaretPosition(ev.target, t.html().length);
	}
	this._keyup = function(ev){
		if(this.imeMode == true) return;
		
		if(ev.type == "keyup"){//在ie下以onkeyup事件调用，在其他浏览器下以oninput事件调用
			var kc = ev.keyCode;
			if (kc == 9 || kc == 16 || kc == 13 || (kc >= 37 && kc <= 40)) return;
		}
		this._formatInput(ev);
	}
	this._compositionStart = function(ev){//输入法开始输入时触发
		this.imeMode = true;
	}
	this._compositionEnd = function(ev){//输入法选择输入的汉字后触发
		this._formatInput(ev);
		this.imeMode = false;
	}
	this._focus = function(ev){
		selectText(ev.target);
		this.oldValue = $(ev.target).text();
	}
	this._blur = function(ev){
	    var value = $(ev.target).text();
		if(this.oldValue != value)
			this.dataChanged(ev.target, value, this.oldValue);
	}

	this._numberLengthCheck = function (v, maxlength) {//数字判断不超过最大数，2位最大数位100	
	    if (v.indexOf('.') > 0)
	        v = v.split('.')[0];	    
	    if (maxlength > 0 && v.replace(/,/g, '').length > maxlength)
	        return false;
	    return true;
	}
	this._getTextRow = function (v) {
	    //v = 'a<div>b</div><div>c</div>';
	    var reg = /<div>|<p>/ig;
	    var result = v.match(reg);
	    var rows = 0;
	    if (result != null)
	    {
	        rows = result.length;
	        //var result = v.find('div');
	        var i = v.indexOf(result[0]);
	        if (i > 0)
	            rows += 1;
	    }
	    return rows;
	}
    /**TODO: paste 事件处理粘贴*修改粘贴中从excel中带入的table等*********************/
	this._onPaste = function(ev) {
	    var t = $(ev.target);
	    setTimeout(function () {
	        t.html(t.text().replace(/\n| /g, ""));
	    }, 10);
	}
	this._zoomFont = function (t, zcount) {
	    var v = t.text();
	    var reg = /[^\x00-\xff]/;//双字节判断,一个汉字两个字节
	    var textLength = 0;
	    for (var i = 0; i < v.length; i++) {
	        if (reg.test(v[i]))
	            textLength += 2;
	        else
	            textLength += 1;
	    }
	    if (textLength > zcount + 4) {
	        t.removeClass('font_11');
	        if (!t.hasClass('font_10'))
	            t.addClass('font_10');
	    }
	    else if (textLength > zcount) {
	        t.removeClass('font_10');
	        if (!t.hasClass('font_11'))
	            t.addClass('font_11');
	    }
	    else {
	        t.removeClass('font_10');
	        t.removeClass('font_11');
	    }
	}
	this._formatNumber = function(num) {//金额添加千分符
	    if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(num)) {
	        return num;
	    }
	    var a = RegExp.$1, b = RegExp.$2, c = RegExp.$3;
	    var re = new RegExp().compile("(\\d)(\\d{3})(,|$)");
	    while (re.test(b)) {
	        b = b.replace(re, "$1,$2$3");
	    }
	    return a + "" + b + "" + c;
	}

	/***********************内部功能——结束**********************/
	
	var targets = this.container.find(".editable");
	targets.attr("contenteditable", "true");//内容可编辑
	this._parseFormat(targets);//解析编辑格式
	
	/*关联事件，为了在代码中引用this时能够执行该对象而使用了jquery代理*/
	var _kd = $.proxy(this._keydown, this),
		_fc = $.proxy(this._focus, this),
		_bl = $.proxy(this._blur, this),
		_ku = $.proxy(this._keyup, this),
        _ps = $.proxy(this._onPaste, this),
		_imeStart = $.proxy(this._compositionStart, this),
		_imeEnd = $.proxy(this._compositionEnd, this);
		
	targets.keydown(_kd).focus(_fc).blur(_bl);
	targets.on("compositionstart", _imeStart);
	targets.on("compositionend", _imeEnd);
	targets.on("paste", _ps);
	//console.log(navigator.userAgent);
	if(navigator.userAgent.indexOf("Chrome")>=0)//chrome 在ime-mode下无法收到enter键的keyup事件
		targets.on("input", _ku);
	else
		targets.keyup(_ku);
	
}//var Editor = function(container){

/*重写此函数，实现业务计算*/
Editor.prototype.dataChanged = function (target, value, oldValue) {
    var t = $(target), ef = this._getEf(t);
    if (ef.qianfen && value) {//千分符格式化
        value = value.replace(/,/g, '');
        if (!isNaN(value))
        {
            value = this._formatNumber(parseFloat(value).toFixed(2));
            t.text(value);
        }
        else
            t.text('');
    }
    else if(ef.type=='N' && isNaN(value))
        t.text('');
}