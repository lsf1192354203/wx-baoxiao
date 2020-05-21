//ѡ�ж��������
function selectText(element){
	//var range = document.createRange, sel = window.getSelection();
	//range.selectNodeContents(element);
	//sel.removeAllRanges();
	//sel.addRange(range);
}

//��ù��λ��
function getCursorPosition (element) {
  var caretOffset = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {//�ȸ衢���
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {//IE
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
}

//��ù��λ�ã����ڵ��У�,����{first:true, last:false, lines:2}
function getCursorLine (element) {
	var doc = element.ownerDocument || element.document;
	var win = doc.defaultView || doc.parentWindow;
	var sel, selNode, firstNode, lastNode ;

	if (typeof win.getSelection != "undefined") {//�ȸ衢�����ie9����
		sel = win.getSelection();
		selNode = sel.focusNode;
		var cns = element.childNodes;
		//for(var i=cns.length-1; i>=0; i--){if(cns[i].nodeName=="BR") cns[i].remove(); else break;}
		
		firstNode = cns[0];
		lastNode = cns[cns.length - 1];
		if(lastNode && lastNode.previousSibling!=null && (lastNode.nodeName == "BR" || lastNode.nodeType == 3))
			lastNode = lastNode.previousSibling;
		
		/*�޿��е������������*/
		var tempNode = selNode;
		while(tempNode != element){
			if(tempNode == firstNode && tempNode == lastNode)
				return {first:true, last:true, lines:1};
			else if(tempNode == firstNode)
				return {first:true, last:false, lines:cns.length};
			else if(tempNode == lastNode)
				return {first:false, last:true, lines:cns.length};
			tempNode = tempNode.parentNode;
		}
		//������BR���е����,ͨ�����λ����ǿ�ж�
		if(selNode == element){
			var range = sel.getRangeAt(0);
			var elementRange = range.cloneRange();
			elementRange.selectNodeContents(element);
			if(lastNode && (lastNode.nodeName == "BR" || lastNode.nodeType ==3 ))
				elementRange.setEnd(elementRange.endContainer, elementRange.endOffset - 1);

			if(range.endOffset == 0){//��һ��
				if(elementRange.endOffset == 0)
					return {first:true, last:true, lines:1};
				return {first:true, last:false, lines:cns.length};
			}
     	if(range.endOffset == elementRange.endOffset)
				return {first:false, last:true, lines:cns.length};
		}
		return {first:false, last:false, lines:cns.length};//���м���
	}
	else if ((sel = doc.selection) && sel.type != "Control") {//IE8����ǰ�������ã�
		var caretOffset = 0;
		var textRange = sel.createRange();
		var preCaretTextRange = doc.body.createTextRange();
		preCaretTextRange.moveToElementText(element);
		preCaretTextRange.setEndPoint("EndToEnd", textRange);
		caretOffset = preCaretTextRange.text.length;
	}
	return caretOffset;
}

//���ù���λ��
function setCaretPosition(element, pos) {
  var range, selection;
  if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
  {
		var i = 0, child = element.childNodes;
		for(; i < child.length; i++){
			var len = child[i].nodeType === 3 ? child[i].nodeValue.length : child[i].innerHTML.length;
			//var len = (child[i].nodeValue || child[i].innerHTML || "").length;	//textNodeȡnodeValue��ֵ
			if(len >= pos){
				if(child[i].nodeType === 3){//���ڵ�Ϊtext�ڵ�
					range = document.createRange();
					range.selectNode(child[i]);
					range.setStart(child[i], pos);
					range.collapse(true); 
					selection = window.getSelection();
					selection.removeAllRanges();
					selection.addRange(range);
					break;
				}	
				else setCaretPosition(child[i], pos);//��text�ڵ�ݹ����
			}	
			else pos = pos - len;
		}
  }
  else if (document.selection)//IE 8 and lower
  {
    range = document.body.createTextRange();
    range.moveToElementText(element);
    range.collapse(false);
    range.select();
  }
}