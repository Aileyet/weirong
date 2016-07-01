define(['zepto'], function($) {
	(function($) {
		$.extend($.fn, {
			/**
			 *往input或textarea等在光标处插内容并被选中
			 *myValue 要插入的内容
			 *如果不想插入内容被选中 可以不传入t，k参数
			 *t插入内容从第几位开始被选中
			 *k插入内容从倒数第几位结束被选中
			 */
			insertContent: function(myValue, t, k) {
				var $t = $(this)[0];
				if (document.selection) { //ie 	
					this.focus();
					var sel = document.selection.createRange();
					sel.text = myValue;
					this.focus();
					sel.moveStart('character', -l);
					var wee = sel.text.length;
					//arguments.length,判断传来的参数的个数，如果不是3 说明不进行选中操作
					if (arguments.length == 3) {
						var l = $t.value.length;
						sel.moveEnd("character", wee + t);
						t <= 0 ? sel.moveStart("character", wee - 2 * t - myValue.length) : sel.moveStart("character", wee - t - myValue.length);
						sel.select();
					}
				} else if ($t.selectionStart || $t.selectionStart == '0') {
					var startPos = $t.selectionStart;
					// console.info("startPos" + startPos);
					var endPos = $t.selectionEnd;
					var scrollTop = $t.scrollTop;
					$t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
					this.focus();
					$t.selectionStart = startPos + myValue.length;
					$t.selectionEnd = startPos + myValue.length;
					$t.scrollTop = scrollTop;
					//arguments.length,判断传来的参数的个数，如果不是3 说明不进行选中操作
					if (arguments.length == 3) {
						$t.setSelectionRange(startPos + t, $t.selectionEnd + k);
						this.focus();
					}
				} 
				/*else if (window.getSelection) {
					//simona--modify
					// range = window.selection.createRange();
					this.focus();
					console.info("start2");
					var selection = window.getSelection ? window.getSelection() : document.selection;
					console.info(selection);
					var rng = selection.createRange ? selection.createRange() : selection.getRangeAt(0);
					rng.collapse(false); //合并范围至末尾  
					// var rng = window.getSelection().getRangeAt(0).cloneRange();
					//  rng.setStart($(this)[0],  -text.length);
					// rng.setEnd($(this)[0], start+text.length);
					start = rng.toString().length;
					console.info("start");
					// rng.setEnd($(this)[0], start+text.length);
					console.info(rng.startOffset)
					// if(arguments.length == 2){
					// 	rng.setStart($(this)[0],$(this)[0]+t);
					// 	console.info("ttttt"+t);	
					// }
					var fragment = rng.createContextualFragment(myValue);
					var oLastNode = fragment.lastChild; //获得DocumentFragment的末尾位置 
					console.info("oLastNode" + oLastNode);
					console.info(oLastNode);
					rng.insertNode(fragment);
					this.focus();
					if (arguments.length == 3) {
						// $t.setSelectionRange(startPos + t, $t.selectionEnd + k);
						rng.setStart(oLastNode, t);
						console.info(t);
						rng.setEnd(oLastNode, myValue.length + k);
						this.focus();
					} else {
						if (oLastNode) {
							rng.setEndAfter(oLastNode); //设置末尾位置  
							rng.setStartAfter(oLastNode); //设置开始位置
						}
					}

					selection.removeAllRanges(); //清除range  
					selection.addRange(rng); //设置range 
				}*/
				 else {
					this.value += myValue;
					this.focus();
				}
			}
		/*	getOffset: function() {
				var $t = $(this)[0];
				var offset = 0;

				if ($t.selectionStart || $t.selectionStart == '0') {
					this.focus();
					offset = $t.selectionStart;
				} else if (window.getSelection) {
					$(this)[0].focus();
					var selection = window.getSelection ? window.getSelection() : document.selection;

					var range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);
					// console.info(selection.createRange());
					console.info(range);
					offset = range.startOffset;
					console.info(offset);
				}

				return offset;
			}*/


		})
	})(Zepto);
});