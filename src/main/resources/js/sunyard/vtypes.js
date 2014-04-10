Ext.apply(Ext.form.VTypes,{
	//正整数
	positivenum:function(v){
		return /^\d+$/.test(v);
	},
	positivenumText:'必须输入大于0的整数',
	positivenumMask:/[0-9]/i,
	//负整数
	negativenum:function(v){
		return /^-\d+$/.test(v);
	},
	negativenumText:'必须输入小于0的整数',
	negativenumMask:/[\-0-9]/i,
	//正浮点数
	positivedb:function(v){
		return /^\d+\.?\d+$/.test(v);
	},
	positivedbText:'必须输入大于0的数字',
	positivedbMask:/[0-9\.]/i,
	//负浮点数
	negativedb:function(v){
		return /^-\d+\.?\d+$/.test(v);
	},
	negativedbText:'必须输入小于0的数字',
	negativedbMask:/[\-0-9\.]/i,
	//IP地址
	ip:function(v){
		return /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/.test(v);
	},
	ipText:'请输入正确的IP地址',
	ipMask:/[0-9\.]/i,
	//身份证号
	idcard:function(v){
		return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/.test(v)||/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)$/.test(v);
	},
	idcardText:'请输入正确的身份证号',
	idcardMask:/[0-9xX]/i,
	//电话手机号码
	phone:function(v){
		return Ext.form.VTypes.phoneRe.test(v);
	},
	phoneRe:/^(([0-1]\d{10})|0\d{11}|(\d{7,8})|((\d{4}|\d{3})-\d{7,8}))$/,
	phoneText:'请输入正确的电话(手机)号码',
	phoneMask:/[0-9\-]/i
	
	
});