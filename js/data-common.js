var bumen, shixiang, shoukuan, renyuan, didian;
$(function(){
    //loadTxt();
    //loadBuMen('["开发部", "采购部", "财务部"]');
    //loadShouKuan('[{"MingCheng":"文鑫","KaiHuHang":"建行","YinHangZhangHao":"1223434"},{"MingCheng":"宋梨彩","KaiHuHang":"中行","YinHangZhangHao":"348343"}]');
    //loadRenYuan('[{"BuMen":"采购部","XingMing":"建行","ZhiWu":"AAAA"},{"BuMen":"开发部","XingMing":"宋梨彩","ZhiWu":"BBB"}]');
    //loadDiDian('[{"ChuFaDi":"郑州","DaoDaDi":"洛阳"},{"ChuFaDi":"郑州","DaoDaDi":"南阳"}]');
	//pagesetup_null();
})
function loadBxrq(){	
var myDate = new Date();
var y = myDate.getFullYear(), m = myDate.getMonth()+1, d = myDate.getDate();
	//$('.curdate').html(y+'年&nbsp;'+m+'月&nbsp;'+d+'日');
	$('.curdate').eq(0).text(y);
	$('.curdate').eq(1).text(m);
	$('.curdate').eq(2).text(d);
}
function setMoneyNumber(el,money,rowIndex,colEndIndex){
	var jine = parseFloat(money).toFixed(2).toString();
	var jineNum = jine.replace('.', '');
	if (jineNum.length<9)
	    el.eq(rowIndex).find("td").eq(colEndIndex - jineNum.length).text("￥");
	if (jineNum.length > 9)
	    alert('总金额已超过百万无法正常显示！');
	for(var j=jineNum.length-1; j>=0; j--){
		var k = jineNum.length-1-j;
		el.eq(rowIndex).find("td").eq(colEndIndex-k).text(jineNum[j]);
	}
}
//function loadbumen1() {
//    $('#inputBuMen').keyup(function () {
//        var inputValue = $('#inputBuMen').text();
//        $('.dropList ul li').remove();
//        if (bumen && inputValue) {
//            $(bumen).each(function () {
//                if (this.indexOf(inputValue) >= 0 && $('.dropList ul li').length < 10)
//                    $('.dropList ul').append('<li>' + this + '</li>');
//            });
//            if ($('.dropList ul li').length > 0) {
//                loadBuMenEven();
//                $('#buMenList').show();
//            }
//        }
//    });
//}
function loadBuMen(data) {
    if (data!='')
        bumen = JSON.parse(data);
    $('#inputBuMen').keyup(function (ev) {
        loadDrop(ev, bumen);
    }).click(function (ev) {
        loadDrop(ev, bumen);
    });
}
function loadShiXiang(data) {
    if (data != '')
        shixiang = JSON.parse(data);
    $('.shiXiang').keyup(function (ev) {
        loadDrop(ev, shixiang);
    }).click(function (ev) {
        loadDrop(ev, shixiang);
    });
}
var moreTpl = { value:'', text: ''};
function loadShouKuan(data) {
    if (data != '')
        shoukuan = JSON.parse(data);
    //alert(data);
    $('#inputMingCheng').keyup(function (ev) {
        var mingcheng = [];
        if (shoukuan)
        {
            $(shoukuan).each(function () {
                var moreValue = $.extend({}, moreTpl);
                moreValue.value = this.MingCheng + ' ' + this.KaiHuHang + ' ' + this.YinHangZhangHao;
                moreValue.text = this.MingCheng;
                mingcheng.push(moreValue);
            });
            loadDrop(ev, mingcheng, 1);
        }
    });
}

/*加载下拉列表
moreFileType:1收款，2人员，3地点
**/
function loadDrop(ev, data, moreFileType) {
    var inputValue = $(ev.target).text(), el = $(ev.target).closest('td'), li = el.find('.dropList ul li');
    li.remove();// && inputValue
    var allowEmptyDrop = true;
    if (moreFileType == 1 && !inputValue)
        allowEmptyDrop = false;
    if (data && allowEmptyDrop) {
        $(data).each(function () {
            if (moreFileType) {
                if (this.text.indexOf(inputValue) >= 0 && el.find('.dropList ul li').length < 8) {
                    var curBuMen = $("#inputBuMen").text();
                    if (moreFileType == 2 && curBuMen) {
                        var arrayValue = this.value.split(' ');
                        if(arrayValue[0] == curBuMen)
                            el.find('.dropList ul').append('<li data-value="' + this.value + '">' + this.text + '</li>');
                    }
                    else
                        el.find('.dropList ul').append('<li data-value="' + this.value + '">' + this.text + '</li>');
                }
            }
            else {
                if (this.indexOf(inputValue) >= 0 && el.find('.dropList ul li').length < 8) {
                    el.find('.dropList ul').append('<li>' + this + '</li>');
                }
            }
        });
        li = el.find('.dropList ul li')
        if (li.length > 0) {
            loadDropListEven(el, moreFileType);
            el.find('.dropList').show();
        }
        else
            el.find('.dropList').hide();
    }
    if (inputValue == '' && moreFileType == 1)
        el.find('.dropList').hide();
}
var onSelect = false;
/*加载下拉列表点击事件
moreFileType:1收款，2人员，3地点
**/
function loadDropListEven(el, moreFileType) {
    el.find('.editable').blur(function () {
        if (!onSelect) {
            onSelect = false;
            el.find('.dropList').hide();
        }
    });
    el.find('li').click(function () {
        var selectValue = $(this).text();
        el.find('.editable').text($(this).text());
        zoomFont(el.find('.editable'));
        if (moreFileType) {
            var moreValue = $(this).attr("data-value");
            var arrayValue = moreValue.split(' ');
            if (moreFileType == 1) {
                $('#inputKaiHuHang').text(arrayValue[1]);
                $('#inputZhangHao').text(arrayValue[2]);
                zoomFont($('#inputKaiHuHang'));
                zoomFont($('#inputZhangHao'));
            }
            else if (moreFileType == 2) {
                $(this).closest("tr").find(".edit-1").text(arrayValue[1]);
                $(this).closest("tr").find(".edit-16").text(arrayValue[2]);
                loadRenYuanShouKuan(arrayValue[1]);
            }
            else if (moreFileType == 3) {
                $(this).closest("tr").find(".edit-2").text(arrayValue[0]);
                $(this).closest("tr").find(".edit-3").text(arrayValue[1]);
            }
        }
        el.find('.dropList').hide();
    }).mouseover(function () {
        onSelect = true;
    }).mouseout(function () {
        onSelect = false;
    });
}
function setBuMen(value) {
    $('#inputBuMen').text(value);
}
var hkey_root,hkey_path,hkey_key
hkey_root="HKEY_CURRENT_USER"
hkey_path="\\Software\\Microsoft\\Internet Explorer\\PageSetup\\"
//设置网页打印的页眉页脚为空
function pagesetup_null(){
try{
var RegWsh = new ActiveXObject("WScript.Shell")
hkey_key="header" 
RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"")
hkey_key="footer"
RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"")
}catch(e){}
}

function loadRenYuan(data) {
    if (data != '')
        renyuan = JSON.parse(data);
    var mingcheng = [];
    if (renyuan) {
        $(renyuan).each(function () {
            var moreValue = $.extend({}, moreTpl);
            moreValue.value = this.BuMen + ' ' + this.XingMing + ' ' + this.ZhiWu;
            moreValue.text = this.XingMing;
            mingcheng.push(moreValue);
        });
    }
    $('.edit-1').keyup(function (ev) {
        loadDrop(ev, mingcheng, 2);
    }).click(function (ev) {
        loadDrop(ev, mingcheng, 2);
    });
}

function loadDiDian(data) {
    if (data != '')
        didian = JSON.parse(data);
    var mingcheng = [];
    if (didian) {
        $(didian).each(function () {
            var moreValue = $.extend({}, moreTpl);
            moreValue.value = this.ChuFaDi + ' ' + this.DaoDaDi;
            moreValue.text = moreValue.value;
            mingcheng.push(moreValue);
        });
    }
    $('.edit-2').keyup(function (ev) {
        loadDrop(ev, mingcheng, 3);
    }).click(function (ev) {
        loadDrop(ev, mingcheng, 3);
    });
}


function setClfXc(value, isJtqy) {
    if (!value)
        return;
    var data = value.split('|');
    var xingMing = data[0].split('#$#');
    $(xingMing).each(function (i) {
        $('.edit-1').eq(i).text(this);
        $('.edit-2').eq(i).text(data[1].split('#$#')[i]);
        $('.edit-3').eq(i).text(data[2].split('#$#')[i]);
        if (isJtqy)
            $('.edit-16').eq(i).text(data[3].split('#$#')[i]);
        if (i == 0)
            loadRenYuanShouKuan(this);
    });
}

function loadRenYuanShouKuan(xingMing)
{
    if (!shoukuan)
        return;
    $('#inputMingCheng').text(xingMing);
    $('#inputKaiHuHang').text('');
    $('#inputZhangHao').text('');
    $(shoukuan).each(function () {
        if (this.MingCheng == xingMing) {
            $('#inputMingCheng').text(this.MingCheng);
            $('#inputKaiHuHang').text(this.KaiHuHang);
            $('#inputZhangHao').text(this.YinHangZhangHao);
        }
    });
}
function loadElrq(el){	
var myDate = new Date();
var y = myDate.getFullYear(), m = myDate.getMonth()+1, d = myDate.getDate();
	//$('.curdate').html(y+'年&nbsp;'+m+'月&nbsp;'+d+'日');
     $(el).find('.setDate').eq(0).text(y);
	 $(el).find('.setDate').eq(1).text(m);
	 $(el).find('.setDate').eq(2).text(d);
}
function zoomFont(t) {
    var format = t.attr("format"), zcount = 0;
    if (!format)
        return;
    if (format.indexOf('Z') >= 0)
        zcount = Number(format.substr(format.indexOf('Z') + 1));
    if (zcount == 0)
        return;
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