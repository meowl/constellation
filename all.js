// 初始化入口函数
window.onload = function(){
	// 初始化多选框待选项
	initionalSelOption();
	// 初始化元素
	initionalElement();
	// 初始化元素事件方法
	initionalMethod();
};

// 生成类型
var types = new Array("自定义","全部随机","已选随机");
// 星座
var stars = new Array("白羊座","金牛座","双子座","巨蟹座","狮子座","处女座","天秤座","天蝎座","射手座","摩羯座","水瓶座","双鱼座");
// 排名方式
var title_type = new Array("简洁(NO.)","数字(1.)","中文(第一名)","无排名"); //,"自定义"
// 排名方式 中文
var title_type_zh = new Array("第一名","第二名","第三名","第四名","第五名","第六名","第七名","第八名","第九名","第十名","第十一名","第十二名");
// 排名方式 数字
var title_type_num = new Array(1,2,3,4,5,6,7,8,9,10,11,12);
// 星座描述数组
var desc_span_arr = new Array(12);
// 星座生成计数器 初始化为1
var startCount = 1;
//***************初始化************************
// 初始化多选框待选项
function initionalSelOption() {
	// 初始化生成类型
	var typs_sel = document.getElementById("type_sel");
	for (var i = 0; i < types.length; i++) {
		typs_sel.add(createOption(types[i],i));
	}
	// 待选星座
	var star_sel = document.getElementById("star_sel");
	for (var i = 0; i < stars.length; i++) {
		star_sel.add(createOption(stars[i],i));
	}
	// 排名方式
	var title_type_sel = document.getElementById("title_type_sel");
	for (var i = 0; i < title_type.length; i++) {
		title_type_sel.add(createOption(title_type[i],i));
	}
	title_type_sel.onchange = function() {
		// 自定义模式
		//if (title_type_sel.selectedIndex == title_type.length - 1) {
		//}
	};
}

// 初始化元素事件方法
function initionalMethod() {
	// 排行榜类型选择按钮
	var type_btn = document.getElementById("type_btn");
	type_btn.onclick = typeSelect;
	// 排行榜重置按钮
	var clean_btn = document.getElementById("clean_btn");
	clean_btn.onclick = clearAll;
	
	//*************************************	
	// 左栏 待选栏
	var star_sel = document.getElementById("star_sel"); 
	// 右栏 排序栏
	var star_sort_sel = document.getElementById("star_sort_sel");
	// 选中星座
	var addOpt_btn = document.getElementById("addOpt_btn");
	addOpt_btn.onclick = function(){
		// 被选中的option被添加到该数组中 从多选框中移除
		for (var i = 0; i < star_sel.options.length; i++) {
			var opt = star_sel.options[i];
			if (opt.selected) {
				// 将左栏中选中的option添加到右栏中
				star_sort_sel.add(opt);
				addStarDesc(opt);
				opt.selected = false;
				i--;
			}
		}
	};
	
	// 移除星座
	var removeOpt_btn = document.getElementById("removeOpt_btn");
	removeOpt_btn.onclick = function() {
		if (star_sort_sel.options.length) {
			for (var i = 0; i < star_sort_sel.options.length; i++) {
				if (star_sort_sel.options[i].selected) {
					delStarDesc(star_sort_sel.options[i]);
					star_sel.add(star_sort_sel.options[i]);
					i--;
				}
			}
		}	
	};
	
	// 星座排序
	// 向上
	var up_btn = document.getElementById("up_btn");
	up_btn.onclick = function() {sortOpts(true, star_sort_sel);};
	// 向下
	var down_btn = document.getElementById("down_btn");
	down_btn.onclick = function() {sortOpts(false, star_sort_sel);};
	
	// 生成预览结果
	var res_btn = document.getElementById("res_btn");
	res_btn.onclick = function() {
		// 星座榜名称
		var title = document.getElementById("title_star");
		if (!(title.value && title.value.trim().length)) {
			alert("请输入正确的星座排行榜标题！");
			title.value = "";
			title.focus();
			return;
		}		
		// 最终结果数组
		var res_arr = new Array();
		// 右侧排序栏内星座
		var arrs = star_sort_sel.options;
		if (arrs.length == 0) {
			alert("请先选择星座！");
			return;
		}
		// 判断排序类型
		var title_type_sel = document.getElementById("title_type_sel");
		var type = title_type_sel.selectedIndex;
		// 将生成结果添加到结果数组中
		for (var i = 0; i < arrs.length; i++) {
			var title_num = ".";
			if (type == 0) { // NO.
				title_num = "NO" + (i + 1) + title_num;
			} else if (type == 1) {// 数字
				title_num = (i + 1) + title_num;
			} else if (type == 2) {// 中文
				title_num = title_type_zh[i] + title_num;
			} else if (type == 3) {// 无排名
				title_num = "";
			}
			// 星座描述
			var input = desc_span_arr[i].getElementsByTagName("input")[0];
			// 判断星座描述栏是否为空
			if (input.value && input.value.trim().length) {
				res_arr.push(title_num + arrs[i].text + "（" + input.value + "）");
			} else {
				res_arr.push(title_num + arrs[i].text);
			}
			
		}
		// 预览结果
		var res_text = document.getElementById("res_text");
		res_text.value = "【" + title.value + "】" + res_arr.join("；") + "。";
	};
}

// 元素初始化
function initionalElement() {
	// 初始化星座描述信息输入框
	// 默认星座描述输入信息disabled
	initionalStarDesc(true);
	// 对输入框添加自定义属性 用于排序
	var desc_input_arr = findObj("des_con_div", new Array("input", "label"));
	setAttribute(desc_input_arr,"sortNum", title_type_num.concat(title_type_num));
	// 将描述信息span数组放置到固定数组中
	desc_span_arr = document.getElementById("des_con_div").getElementsByTagName("span");
}

// 设定星座描述输入栏状态
function initionalStarDesc(isDisabled) {
	// 默认星座描述输入信息disabled
	var desc_arr = findObj("des_con_div", "input");
	setAttribute(desc_arr, "disabled", isDisabled);
}//******************方法函数*********************

// 类型选择
function typeSelect() {
	var typeSel = document.getElementById("type_sel");
	var idx = typeSel.selectedIndex;
	// 星座待选栏
	var star_options = document.getElementById("star_sel").options;
	// 星座排序栏
	var sort_options = document.getElementById("star_sort_sel").options;
	if (idx == 0) { // 自定义
		// do nothing
	} else if (idx == 1) { // 全部随机
		// 先移除所有已选星座
		for (var i = 0; i < sort_options.length; i++) {
			sort_options.selected = false;
			delStarDesc(sort_options[i]);
			star_sel.add(sort_options[i]);
			i--;
		}
		// 随机选择星座待选栏中星座
		var num = getRandom(5,13); // 随机个数
		while (num != 0) {
			var x = getRandom(0,star_options.length); // 随机下标
			// 将随机选中的星座添加到排序栏中
			if (star_options[x]) {
				addStarDesc(star_options[x]);
				star_options[x].selected = false;
				star_sort_sel.add(star_options[x]);
				num--;
			}
		}
	} else if (idx == 2) { // 对已经选择的星座随机
		// 排序栏
		var sort_sel = document.getElementById("star_sort_sel");
		// 将排序栏中星座及对应的星座描述删除
		var len = sort_options.length;
		var sort_opts_arr = new Array();
		if (len > 1) {
			while (len != 0) {
				sort_opts_arr.push(sort_options[len - 1]);
				delStarDesc(sort_options[len - 1]);
				sort_sel.remove(len - 1);
				len--;
			}
			// 获取随机数组下标
			for (var i = 0; i < sort_opts_arr.length; i++) {
				var optIdx = getRandom(0, sort_opts_arr.length);
				while (sort_opts_arr[optIdx] == null) {
					optIdx = getRandom(0, sort_opts_arr.length);
				}
				// 添加到排序栏
				sort_sel.add(sort_opts_arr[optIdx]);
				// 添加到描述栏
				addStarDesc(sort_opts_arr[optIdx]);
				sort_opts_arr[optIdx] = null;
			}
		}
	}
}

// 重置
function clearAll() {
	var isReset = confirm("确定要重置所有操作吗？");
	if (!isReset) {
		return;
	}
	// 初始化待选星座
	var star_sel = document.getElementById("star_sel");
	var len = star_sel.options.length;
	while(len != 0) {
		star_sel.remove(--len);
	}
	for (var i = 0; i < stars.length; i++) {
		star_sel.add(createOption(stars[i],i));
	}
	// 清空排序星座
	var star_sort_sel = document.getElementById("star_sort_sel");
	for (var i = 0; i < star_sort_sel.options.length; i++) {
		star_sort_sel.remove(i);
		i--;
	}
	var desc_spans = findObj("des_con_div", "span");
	for (var i = 0; i < desc_spans.length; i++) {
		var input = desc_spans[i].getElementsByTagName("input")[0];
		var label = desc_spans[i].getElementsByTagName("label")[0];
		input.value = "";
		input.disabled = true;
		label.innerHTML = "星座榜";
	}
	// 清空最终结果
	document.getElementById("res_text").value = "";
}

// 星座排序
function sortOpts(isUp, selObj) {
	if (selObj.options.length) {
		if (isUp) {
			for (var i = 0; i < selObj.options.length; i++) {
				var opt = selObj.options[i];
				var opt_bef = selObj.options[i - 1];
				var opt_aft = selObj.options[i + 1];
				if (opt.selected && i != 0 && (opt_bef && !opt_bef.selected)) {
					selObj.add(opt,star_sort_sel.options[i - 1]);
					swapIt(i, i - 1);
				}
			}
		} else {
			var opts = new Array(selObj.options.length);
			for (var i = selObj.options.length - 1; i >= 0; i--) {
				var opt = selObj.options[i];
				var selected = selObj.options[i].selected;
				opts[i] = opt;
				selObj.remove(i);		
				if (selected && i < opts.length - 1 && (opts[i + 1] && !opts[i + 1].selected)) {
					var temp = opts[i + 1];
					opts[i + 1] = opts[i];
					opts[i] = temp;
					swapIt(i, i + 1);
				}	
			}
			for (var i = 0; i < opts.length; i++) {
				selObj.add(opts[i]);
			}
		}
	}
}

// 向右栏增加星座选项时 描述栏的动作
function addStarDesc(addedOpt) {
	var spans = desc_span_arr;
	var isExists = false;
	for (var j = 0; j < spans.length; j++) {
		var input = spans[j].getElementsByTagName("input")[0];
		var label = spans[j].getElementsByTagName("label")[0];
		if (label.innerHTML == addedOpt.text) {
			isExists = true;
			input.removeAttribute("disabled");
			break;
		}
	}
	if (!isExists) {
		for (var j = 0; j < spans.length; j++) {
			var input = spans[j].getElementsByTagName("input")[0];
			var label = spans[j].getElementsByTagName("label")[0];
			if (input.disabled && label.innerHTML == "星座榜") {
				label.innerHTML = addedOpt.text;
				input.removeAttribute("disabled");
				break;
			}
		}
	}
	sortStarDesc();
}

// 向右栏删除星座选项时 描述栏的动作
function delStarDesc(opt) {
	var spans = desc_span_arr;
	for (var j = 0; j < spans.length; j++) {
		if (spans[j].getElementsByTagName("label")[0].innerHTML == opt.text) {
			spans[j].getElementsByTagName("input")[0].disabled = true;
		}
	}
	sortStarDesc();
}

// 根据星座排序栏选项 对星座描述进行排序
function sortStarDesc() {
	desc_span_arr = document.getElementById("des_con_div").getElementsByTagName("span");
	for (var i = 0; i < desc_span_arr.length; i++) {
		if (!desc_span_arr[i].getElementsByTagName("input")[0].disabled) {
			var ii = i;
			for (var j = ii - 1; j >= 0; j--) {
				if (desc_span_arr[j].getElementsByTagName("input")[0].disabled) {
					swapIt(ii, j, true);
					ii--;
				}
			}
		}
	}
}

// 交换
function swapIt(i, j, disabled) {
	var labelA = desc_span_arr[i].getElementsByTagName("label")[0];
	var inputA = desc_span_arr[i].getElementsByTagName("input")[0];
	
	var labelB = desc_span_arr[j].getElementsByTagName("label")[0];
	var inputB = desc_span_arr[j].getElementsByTagName("input")[0];
	
	var temp = "";
	
	temp = labelA.innerHTML;
	labelA.innerHTML = labelB.innerHTML;
	labelB.innerHTML = temp;
	
	temp = inputA.value;
	inputA.value = inputB.value;
	inputB.value = temp;
	// 是否需要disable输入框
	if (disabled) {
		if (inputA.disabled) {
			inputA.removeAttribute("disabled");
			inputB.disabled = true;
		} else {
			inputB.removeAttribute("disabled");
			inputA.disabled = true;
		}
	}
}

//******************功能函数*********************
// 生成Option对象
function createOption(text,val) {
	var opt = create("option");
	opt.text = text;
	opt.value = val;
	return opt;
}

// 生成任意DOM元素
function create(tag) {
	var obj = null;
	if (tag != null) {
		obj = document.createElement(tag);
	}
	return obj;
}

function resetAll(obj) {
		if (obj != null) {
			alert(obj.childNodes.length);
			for (var i = 0; i < obj.childNodes.length; i++) {
				var o = obj.childNodes[i];
				alert(o.tagName);
			}
		}
}

// 获取指定id节点下是否包含指定类型的对象数组，若没有，返回指定id的节点自己
function findObj(tagId, tagNameArr) {
	var obj = document.getElementById(tagId);
	var arr = new Array();
	if (obj && obj.childNodes.length) {
		if (typeof tagNameArr == "string") {
			arr = obj.getElementsByTagName(tagNameArr);
		} else if (typeof tagNameArr == "object" && tagNameArr.length) {
			for (var i = 0; i < tagNameArr.length; i++) {
				var temp = obj.getElementsByTagName(tagNameArr[i]);
				for (var j = 0; j < temp.length; j++) {
					arr.push(temp[j]);
				}
			}
		}
	}
	return arr.length ? arr : obj;
}

// 设定对象的某个属性值
function setAttribute(objArr, attr, attrVal){
	for (var i = 0; i < objArr.length; i++) {
		if (typeof attrVal == "object" && attrVal.length) { // 数组类型
			if (i < attrVal.length) {
				objArr[i].setAttribute(attr, attrVal[i]);
			}
		} else if (!attrVal) {
			objArr[i].removeAttribute(attr);
		} else {
			objArr[i].setAttribute(attr, "selected");
		}
	}
}

// 获取随机数 min ~ max-1
function getRandom(min, max) {
	var res = 0;
	do {
		res = Math.round(Math.random() * 100) % max;
	} while (res < min);
	return res;
}