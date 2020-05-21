function toUpper(lower){
	var num = lower.toString();
	if(isNull(num)){
		return '';
	}
	if(num.lastIndexOf(".") == num.length - 1 ){
		return ;
	}
	for ( var int = 0; int < num.length; int++) {
		if(checkNum(num)){
			break;
		}else{
			num = removeLastChar(num);
			int --;
		}
		if(isNull(num)) return '';
	}
	
	function isNull(num){
		if(num == null || num == ""){
			$("#"+lowerInputId).val("");
			$("#"+upperInputId).val("");
			return true;
		}
		return false;
	}
	return ToTrans(num);
}
//校验是否为正浮点数或正整数
function checkNum(str){
  var patrn=/^([+]?)\d*\.?\d+$/;
  return patrn.test(str);
};
 
//移除最后一个字符
function removeLastChar(str){
	if(str == null || str == ""){
		return str;
	}
	return str.substring(0,str.length-1);
}
 
function ToTrans(a) {
    var b = 9.999999999999E10,
    f = "\u96f6",//零
    h = "\u58f9",//壹
    g = "\u8d30",//贰
    e = "\u53c1",//叁
    k = "\u8086",//肆
    p = "\u4f0d",//伍
    q = "\u9646",//陆
    r = "\u67d2",//柒
    s = "\u634c",//捌
    t = "\u7396",//玖
    l = "\u62fe",//拾
    d = "\u4f70",//佰
    i = "\u4edf",//仟
    m = "\u4e07",//万
    j = "\u4ebf",//亿
    u = "人民币",
    o = "\u5143",//元
    c = "\u89d2",//角
    n = "\u5206",//分
    v = "\u6574";//整
    a = a.toString();
    if (a == "") {
        alert("转换内容不能为空!");
        return "";
    }
    if (a.match(/[^,.\d]/) != null) {
        alert("输入有误,请输入小数点和纯数字!");
        return "";
    }
    if (a.match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
        alert("输入有误,请输入小数点和纯数字!");
        return "";
    }
    a = a.replace(/,/g, "");
    a = a.replace(/^0+/, "");
    if (Number(a) > b) {
        alert("\u5bf9\u4e0d\u8d77,\u4f60\u8f93\u5165\u7684\u6570\u5b57\u592a\u5927\u4e86!\u6700\u5927\u6570\u5b57\u4e3a99999999999.99\uff01");
        return "";
    }
    b = a.split(".");
    if (b.length > 1) {
        a = b[0];
        b = b[1];
        b = b.substr(0, 2);
    } else {
        a = b[0];
        b = "";
    }
    h = new Array(f, h, g, e, k, p, q, r, s, t);
    l = new Array("", l, d, i);
    m = new Array("", m, j);
    n = new Array(c, n);
    c = "";
    if (Number(a) > 0) {
        for (d = j = 0; d < a.length; d++) {
            e = a.length - d - 1;
            i = a.substr(d, 1);
            g = e / 4;
            e = e % 4;
            if (i == "0") j++;
            else {
                if (j > 0)
                    c += h[0];
                j = 0;
                c += h[Number(i)] + l[e];
            }
            if (e == 0 && j < 4) c += m[g];
        }
        c += o;
    }
    if (b != "") for (d = 0; d < b.length; d++) {
        i = b.substr(d, 1);
        if (i != "0") c += h[Number(i)] + n[d];
        else if(i=="0"&&d==0)
            c += h[Number(i)]
    }
    if (c == "") c = f + o;
    if (b.length == 0) c += v;
    return c;
}