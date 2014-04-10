Ext.ns('Ext.sunyard','Ext.sunyard.form','CC');
CC = Ext;
Ext.form.Field.override({
	initComponent : Ext.form.Field.prototype.initComponent
			.createInterceptor(function() {
				if (this.allowBlank === false && this.fieldLabel) {
					if(this.fieldLabel.indexOf('<font color=red>*</font>')==-1)
						this.fieldLabel += '<font color=red>*</font>';
				}
			}),
	onRender : Ext.form.Field.prototype.onRender.createSequence(function(){
		if(this.el&&this.maxLength&&this.maxLength!=Number.MAX_VALUE){
			this.el.dom.maxLength = this.maxLength;
		}
	})
});
Ext.sunyard.form.TextField = Ext.extend(Ext.form.TextField,{});
Ext.sunyard.form.NumberField = Ext.extend(Ext.form.NumberField,{});
Ext.sunyard.form.EmailField = Ext.extend(Ext.form.TextField,{
	maskRe : /[a-z0-9_\.\-@\+]/i,
	stripCharsRe : /[^a-z0-9_\.\-@\+]/gi,
	baseRe:/^(\w+)([\-+.][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/,
	baseText : '必须使用如下格式的邮件地址 类似"user@example.com"',
    getErrors: function(value) {
        var errors = Ext.sunyard.form.EmailField.superclass.getErrors.apply(this, arguments);        
        value = Ext.isDefined(value) ? value : this.processValue(this.getRawValue());        
        if (value.length < 1) {
             return errors;
        }
        if(!this.baseRe.test(value)){
        	errors.push(this.baseText);
        }        
        return errors;
    }
});
Ext.sunyard.form.AmountField = Ext.extend(Ext.sunyard.form.EmailField,{
	maskRe : /[0-9\.\,\-]/i,
	stripCharsRe : /[^0-9\.\,\-]/gi,
	baseRe:/^(\-|\+)?((\d{1,3}(,\d{3})*)|(\d+))(\.\d+)?$/,
	baseText : '必须输入正确的金额',
	chgValueDelay:100,
	decimalPrecision:2,
	getName: function(){
        var hf = this.hiddenField;
        return hf && hf.name ? hf.name : this.hiddenName || Ext.sunyard.form.AmountField.superclass.getName.call(this);
    },
	initEvents:function(){
		Ext.sunyard.form.AmountField.superclass.initEvents.call(this);
		this.chgValueTask = new Ext.util.DelayedTask(this.chgValue, this);
		this.mon(this.el, 'blur',function(){
			this.chgValueTask.delay(this.chgValueDelay);
		}, this);
		this.mon(this.el, 'focus',function(){
			var rawValue = this.getRawValue();
			rawValue = rawValue.replace(/\,/gi,"");
			this.setRawValue(rawValue);
		}, this);
	},
	fmoney : function(s, n){
		n = n > 0 && n <= 20 ? n : 2;
		s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n)
				+ "";
		var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
		t = "";
		for (var i = 0; i < l.length; i++) {
			t += l[i]
					+ ((i + 1) % 3 == 0 && (i + 1) != l.length ? ","
							: "");
		}
		return t.split("").reverse().join("") + "." + r;
	},
	getChgValue:function(v){
		if(Ext.isEmpty(v))return v;
		return this.fmoney(v,this.decimalPrecision);
	},
	chgValue:function(){
		if(this.rendered){
			this._setValue(this.getRawValue());
		}
	},
	initValue : function(){
		Ext.sunyard.form.AmountField.superclass.initValue.call(this);
        if(this.hiddenField){
            this.hiddenField.value =
                Ext.value(Ext.isDefined(this.hiddenValue) ? this.hiddenValue : this.value, '');
        }
    },
    _setValue:function(v){
    	var text = this.getChgValue(v);
        v = text.replace(/\,/gi,'');
        if(this.hiddenField){
            this.hiddenField.value = Ext.value(v, '');
        }
        Ext.sunyard.form.AmountField.superclass.setValue.call(this, text);
        this.value = v;
        return this;
    },
	setValue : function(v){
        return this._setValue(v);
    },
    getValue:function(){
    	if(!this.rendered) {
            return this.value;
        }
        var v = this.el.getValue();
        if(this.hiddenName){
        	v = this.hiddenField.value;
        }
        if(v === this.emptyText || v === undefined){
            v = '';
        }
        return v;
    },
	onRender : function(ct, position){
		Ext.sunyard.form.AmountField.superclass.onRender.call(this, ct, position);
        if(this.hiddenName){
            this.hiddenField = this.el.insertSibling({tag:'input', type:'hidden', name: this.hiddenName,
                    id: (this.hiddenId || Ext.id())}, 'before', true);
        }
	},
	onDestroy: function(){
		if(this.chgValueTask){
			this.chgValueTask.cancel();
			this.chgValueTask = null;
		}
		Ext.sunyard.form.AmountField.superclass.onDestroy.call(this);
	}
});
Ext.sunyard.form.IpField = Ext.extend(Ext.sunyard.form.EmailField,{
	maskRe : /[0-9\.]/i,
	stripCharsRe : /[^0-9\.]/gi,
	baseRe :/^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/,
	baseText : '请输入正确的IP地址 类似"127.0.0.1"'
});
Ext.sunyard.form.IdcardField = Ext.extend(Ext.sunyard.form.EmailField,{
	maskRe : /[0-9xX]/i,
	stripCharsRe : /[^0-9xX]/gi,
	baseRe:/^(([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)))$/,
	baseText : '请输入正确的身份证号'
});
Ext.sunyard.form.PhoneField = Ext.extend(Ext.sunyard.form.EmailField,{
	maskRe : Ext.form.VTypes.phoneMask,
	stripCharsRe : /[^0-9\-]/gi,
	baseRe : Ext.form.VTypes.phoneRe,
	baseText : Ext.form.VTypes.phoneText
});
Ext.sunyard.form.PositivenumField = Ext.extend(Ext.form.NumberField,{
	allowDecimals:false,
	baseRe:/^\d+$/,
	baseText : Ext.form.VTypes.positivenumText,
    getErrors: function(value) {
        var errors = Ext.sunyard.form.PositivenumField.superclass.getErrors.apply(this, arguments);        
        value = Ext.isDefined(value) ? value : this.processValue(this.getRawValue());
        if (value.length < 1) {
             return errors;
        }
        if(!this.baseRe.test(value)){
        	errors.push(this.baseText);
        }        
        return errors;
    }
});
Ext.sunyard.form.NegativenumField = Ext.extend(Ext.sunyard.form.PositivenumField,{
	baseRe:/^\-\d+$/,
	baseText : Ext.form.VTypes.negativenumText
});
Ext.sunyard.form.PositivedbField = Ext.extend(Ext.sunyard.form.PositivenumField,{
	allowDecimals:true,
	baseRe:/^(\d+|\d+\.?\d+)$/,
	baseText : Ext.form.VTypes.positivedbText
});
Ext.sunyard.form.NegativedbField = Ext.extend(Ext.sunyard.form.PositivenumField,{
	allowDecimals:true,
	baseRe:/^(\-\d+|\-\d+\.?\d+)$/,
	baseText : Ext.form.VTypes.negativedbText
});
Ext.sunyard.form.DateField = Ext.extend(Ext.form.DateField,{
	altFormats:'Ymd|Y-m-d|Y/m/d|Y年m月d日',
	format:'Ymd',
	getValidateRawValue:function(value){
		var res = this.altFormats.split("|");
		res.splice(0,0,this.format);
		var arr ;
		Ext.each(res,function(pattern){
			var re = new RegExp(pattern.replace(/Y/g,"([0-9]{4})").replace(/m/g,"(0[1-9]|1[0-2])").replace(/d/g,"(0[1-9]|1[0-9]|2[0-9]|3[0-1])"));
			arr = value.match(re);
			if(arr){
				return false;
			}
		});
		return arr;
	},
	validateRawValue:function(value){
//			value = value.replace(/\-/g,"").replace(/\//g,"").replace(/年/g,"").replace(/月/g,"").replace(/日/g,"");
		var day1 = [31,29,31,30,31,30,31,31,30,31,30,31];
		var day2 = [31,28,31,30,31,30,31,31,30,31,30,31];
		var arr = this.getValidateRawValue(value);
		if(!arr){
			return "格式错误！";
		}
		var year = Number(arr[1]);
		var month = Number(arr[2]);
		var day = Number(arr[3]);
		if((year%4===0&&year%100!==0)||(year%400===0)){
			if(day>day1[month-1]){
				return "日期最大为"+day1[month-1]+"当前为"+day+"错误";
			}
		}else{
			if(day>day2[month-1]){
				return "日期最大为"+day2[month-1]+"当前为"+day+"错误";
			}
		}
		return true;
	},
	getErrors: function(value){
		var errors = Ext.sunyard.form.DateField.superclass.getErrors.call(this,value);		
		value = value || this.processValue(this.getRawValue());
        if (value.length < 1) {
             return errors;
        }
        var v = this.validateRawValue(value);
        if(v!==true){
        	errors.push(v);
        }
        return errors;
	},
	onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.menu == null){
            this.menu = new Ext.menu.DateMenu({
                hideOnClick: false,
                focusOnSelect: false
            });
        }
        this.onFocus();
        Ext.apply(this.menu.picker,  {
            minDate : this.minValue,
            maxDate : this.maxValue,
            disabledDatesRE : this.disabledDatesRE,
            disabledDatesText : this.disabledDatesText,
            disabledDays : this.disabledDays,
            disabledDaysText : this.disabledDaysText,
            format : this.format,
            showToday : this.showToday,
            startDay: this.startDay,
            minText : String.format(this.minText, this.formatDate(this.minValue)),
            maxText : String.format(this.maxText, this.formatDate(this.maxValue))
        });
        this.menu.picker.setValue(this.getDateValue() || new Date());
        this.menu.show(this.el, "tl-bl?");
        this.menuEvents('on');
    },
	getValue:function(){
		return Ext.form.DateField.superclass.getValue.call(this) || "";
	},
	getDateValue:function(){
		return this.parseDate(Ext.form.DateField.superclass.getValue.call(this)) || "";
	},
	beforeBlur : function(){
		if(this.getErrors(this.getRawValue()).length===0){
			var v = this.parseDate(this.getRawValue());
	        if(v){
	            this.setValue(v);
	        }
		}        
    }
});
Ext.sunyard.form.ComboBox = Ext.extend(Ext.form.ComboBox,{
	typeAhead: true,
	submitValue:true,
	forceSelection: true,
	emptyText:'请选择...',
    minChars:1,
    selectOnFocus:true,
    autoSelect:true,
    displayField:'text',
	valueField:'value',
	initQueryFlag:false,
	chgModeAfterInitQuery:true,
	triggerAction:'all',
    initComponent:function(){
    	if(!this.store){
    		if(this.dataUrl){
	    		this.store = {
					xtype:'jsonstore',
		            url:this.dataUrl ? this.dataUrl : '',
		            root:this.root ? this.root :'results',
		            fields:this.fields ? this.fields : [{name:'value'},{name:'text'}],
		            baseParams:this.baseParams ?  this.baseParams : {}
				};
    		}else if(this.combodata){
    			this.store = {
    				xtype:'arraystore',
    				fields: this.fields ? this.fields : ['value', 'text'], 
			    	data : this.combodata
    			};
    			this.mode = 'local';
    		}
    	}
		Ext.sunyard.form.ComboBox.superclass.initComponent.call(this);
    },
    setValue : function(v){
    	var value = v;
    	var text;
    	if(Ext.isObject(v)){
    		value = v.value;
    	}
	    Ext.sunyard.form.ComboBox.superclass.setValue.call(this,value);
    	if(this.store.getCount() == 0 && this.store instanceof Ext.data.JsonStore){
    		this.setValueEx(v);
    	}
    	return this;
    },
    setValueEx:function(v){
    	if(!Ext.isEmpty(v)){
    		if(Ext.isObject(v)&&v.text){
    			this.setRawValue(v.text);
    			return;
    		}else{
    			var o = this;
				var params = Ext.apply({},this.store.baseParams);
				params[this.queryParam] = v;
				Ext.Ajax.request({
					url:this.firstUrl || this.dataUrl+"/first",
					success:function(response,options){
						var result = Ext.decode(response.responseText);
						if(result.success){
							for(var key in result.data){
								if(Ext.isString(key)){
									if(key.trim()==String(v).trim())
										o.setRawValue(result.data[key]);
								}else{
									o.setRawValue(result.data[v]);
								}
							}						
						}else{
							Ext.Msg.alert('提示信息',result.errorMessage);
						}
					},
					params:params
				});	
    		}
    	}
    },
    afterRender:function(){
    	Ext.sunyard.form.ComboBox.superclass.afterRender.call(this);
    	if(this.initQueryFlag) {
    		this.doQuery(this.allQuery,true);
    		if(this.chgModeAfterInitQuery) this.mode = 'local';
    	}
    },
    getZIndex : function(listParent){
        listParent = listParent || Ext.getDom(this.getListParent() || Ext.getBody());
        var zindex = parseInt(Ext.fly(listParent).getStyle('z-index'), 10);
        if(!zindex){
            zindex = this.getParentZIndex();
        }
        zindex = zindex || 1;
        zindex = zindex > 12000 ? zindex :12000;
        return zindex + 5;
    }
});
Ext.sunyard.form.CheckboxGroup = Ext.extend(Ext.form.CheckboxGroup,{
	constructor:function(config){
		config = config || {};
		if(config.dataUrl){
			Ext.Ajax.request({   
	            url: config.dataUrl, 
	            scope: this, 
	            success: function(response){
	            	delete config.dataUrl;	
	            	var items = Ext.decode(response.responseText);
	            	Ext.each(items,function(item){
	            		item.name = item.name || this.name;
	            	},config);
	            	config.items = items;
	            	Ext.sunyard.form.CheckboxGroup.superclass.constructor.call(this,config);
	            },
			   failure: function(response, opts) {
			      Ext.Msg.alert('提示信息','数据加载失败！');
			   }   
	        });
		}else{
			Ext.sunyard.form.CheckboxGroup.superclass.constructor.call(this,config);
		}
		delete config.dataUrl;				
	}
});
Ext.sunyard.form.RadioGroup = Ext.extend(Ext.form.RadioGroup,{
	constructor:function(config){
		config = config || {};
		if(config.dataUrl){
			Ext.Ajax.request({   
	            url: config.dataUrl, 
	            scope: this, 
	            success: function(response){
					delete config.dataUrl;				
	            	var items = Ext.decode(response.responseText);
	            	Ext.each(items,function(item){
	            		item.name = item.name || this.name;
	            	},config);
	            	config.items = items;
	            	Ext.sunyard.form.RadioGroup.superclass.constructor.call(this,config);
	            },
			   failure: function(response, opts) {
			      Ext.Msg.alert('提示信息','数据加载失败！');
			   }   
	        });
		}else{
			Ext.sunyard.form.RadioGroup.superclass.constructor.call(this,config);
		}
	}
});
Ext.override(Ext.ux.form.MultiSelect,{
	onRender: function(ct, position){
        Ext.ux.form.MultiSelect.superclass.onRender.call(this, ct, position);		
        var fs = this.fs = new Ext.form.FieldSet({
            renderTo: this.el,
            title: this.legend,
            height: this.height,
            width: this.width,
            style: "padding:0;background:white;",
            tbar: this.tbar
        });
        fs.body.addClass('ux-mselect');

        this.view = new Ext.ListView({
            multiSelect: true,
            store: this.store,
            columns: [{ header: 'Value', width: 1, dataIndex: this.displayField }],
            hideHeaders: true
        });		
        fs.add(this.view);		
        this.view.on('click', this.onViewClick, this);
        this.view.on('beforeclick', this.onViewBeforeClick, this);
        this.view.on('dblclick', this.onViewDblClick, this);		
        this.hiddenName = this.name || Ext.id();
        var hiddenTag = { tag: "input", type: "hidden", value: "", name: this.hiddenName };
        this.hiddenField = this.el.createChild(hiddenTag);
        this.hiddenField.dom.disabled = this.hiddenName != this.name;
        fs.doLayout();
    }
});
Ext.sunyard.form.ItemSelector = Ext.extend(Ext.ux.form.ItemSelector,{
	leftLegend:'候选值',
	rightLegend:'已选值',
	iconRightAll:"rightAll.gif",
	iconLeftAll:"leftAll.gif",
	onRender: function(ct, position){
        Ext.ux.form.ItemSelector.superclass.onRender.call(this, ct, position);
        var msConfig = [{
            legend: this.leftLegend,
            draggable: true,
            droppable: true,
            width: 100,
            height: 100,
            store: {
				xtype:'jsonstore',
				autoLoad:true, 
	            url:this.dataUrl,
	            baseParams:this.baseParams || {},
	            root:'results',
	            fields:this.dataFields || [{name:'value'},{name:'text'}]
			},
			displayField: 'text',
            valueField: 'value'
        },{
            legend: this.rightLegend,
            droppable: true,
            draggable: true,
            width: 100,
            height: 100,
			displayField: 'text',
            valueField: 'value',
            store:this.valueDataUrl ? {
            	xtype:'jsonstore',
				autoLoad:true, 
	            url:this.valueDataUrl,
	            baseParams:this.baseParams || {},
	            root:'results',
	            fields:this.dataFields || [{name:'value'},{name:'text'}]
            } : new Ext.data.ArrayStore({
		        fields:this.dataFields ||  ['value','text']
		    })
        }];

        this.fromMultiselect = new Ext.ux.form.MultiSelect(Ext.applyIf(this.multiselects[0], msConfig[0]));
        this.fromMultiselect.on('dblclick', this.onRowDblClick, this);

        this.toMultiselect = new Ext.ux.form.MultiSelect(Ext.applyIf(this.multiselects[1], msConfig[1]));
        this.toMultiselect.on('dblclick', this.onRowDblClick, this);

        var p = new Ext.Panel({
            bodyStyle:this.bodyStyle,
            border:this.border,
            layout:"table",
            layoutConfig:{columns:3}
        });

        p.add(this.fromMultiselect);
        var icons = new Ext.Panel({header:false});
        p.add(icons);
        p.add(this.toMultiselect);
        p.render(this.el);
        icons.el.down('.'+icons.bwrapCls).remove();

        // ICON HELL!!!
        if (this.imagePath!="" && this.imagePath.charAt(this.imagePath.length-1)!="/")
            this.imagePath+="/";
        this.iconUp = this.imagePath + (this.iconUp || 'up2.gif');
        this.iconDown = this.imagePath + (this.iconDown || 'down2.gif');
        this.iconLeft = this.imagePath + (this.iconLeft || 'left2.gif');
        this.iconRight = this.imagePath + (this.iconRight || 'right2.gif');
        this.iconTop = this.imagePath + (this.iconTop || 'top2.gif');
        this.iconBottom = this.imagePath + (this.iconBottom || 'bottom2.gif');
        this.iconLeftAll = this.imagePath + (this.iconLeftAll || 'leftAll.gif');
        this.iconRightAll = this.imagePath + (this.iconRightAll || 'leftAll.gif');
        var el=icons.getEl();
        this.toTopIcon = el.createChild({tag:'img', src:this.iconTop, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.toRightAllIcon = el.createChild({tag:'img', src:this.iconRightAll, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.upIcon = el.createChild({tag:'img', src:this.iconUp, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.addIcon = el.createChild({tag:'img', src:this.iconRight, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.removeIcon = el.createChild({tag:'img', src:this.iconLeft, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.downIcon = el.createChild({tag:'img', src:this.iconDown, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.toLeftAllIcon = el.createChild({tag:'img', src:this.iconLeftAll, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.toBottomIcon = el.createChild({tag:'img', src:this.iconBottom, style:{cursor:'pointer', margin:'2px'}});       
        
        this.toTopIcon.on('click', this.toTop, this);
        this.upIcon.on('click', this.up, this);
        this.downIcon.on('click', this.down, this);
        this.toBottomIcon.on('click', this.toBottom, this);
        this.addIcon.on('click', this.fromTo, this);
        this.removeIcon.on('click', this.toFrom, this);
        this.toLeftAllIcon.on('click',this.toLeftAll,this);
        this.toRightAllIcon.on('click',this.toRightAll,this);
        if (!this.drawUpIcon || this.hideNavIcons) { this.upIcon.dom.style.display='none'; }
        if (!this.drawDownIcon || this.hideNavIcons) { this.downIcon.dom.style.display='none'; }
        if (!this.drawLeftIcon || this.hideNavIcons) { this.addIcon.dom.style.display='none'; }
        if (!this.drawRightIcon || this.hideNavIcons) { this.removeIcon.dom.style.display='none'; }
        if (!this.drawTopIcon || this.hideNavIcons) { this.toTopIcon.dom.style.display='none'; }
        if (!this.drawBotIcon || this.hideNavIcons) { this.toBottomIcon.dom.style.display='none'; }

        var tb = p.body.first();
        this.el.setWidth(p.body.first().getWidth());
        p.body.removeClass();

        this.hiddenName = this.name;
        var hiddenTag = {tag: "input", type: "hidden", value: "", name: this.name};
        this.hiddenField = this.el.createChild(hiddenTag);
    },
    toLeftAll:function(){
    	this.reset();
    },
    toRightAll:function(){
    	range = this.fromMultiselect.store.getRange();
        this.fromMultiselect.store.removeAll();
        this.toMultiselect.store.add(range);
        var si = this.toMultiselect.store.sortInfo;
        if (si){
            this.toMultiselect.store.sort(si.field, si.direction);
        }
    }
});
Ext.sunyard.TabPanel = Ext.extend(Ext.TabPanel,{});
Ext.sunyard.Window= Ext.extend(Ext.Window,{
	closeAction:'hide'
});
MSG = Ext.apply({},{
	title:'提示信息',
	show:function(config){
		Ext.Msg.show(config);
	},
	common:function(msg,title,icon,fn,scope){
		Ext.Msg.show({
           title: title,
           msg: msg,
           buttons: Ext.MessageBox.OK,
           fn: fn,
           scope:scope||window,
           icon: icon
       });
	},
	alert:function(msg,title,fn,scope){
		title = title || this.title;
		Ext.Msg.alert(title,msg,fn,scope);
	},
	info:function(msg,title,fn,scope){
		title = title || this.title;
		MSG.common(msg,title,Ext.MessageBox.INFO,fn,scope);
	},
	warning:function(msg,title,fn,scope){
		title = title || '警告信息';
		MSG.common(msg,title,Ext.MessageBox.WARNING,fn,scope);
	},
	error:function(msg,title,fn,scope){
		title = title || '错误信息';
		MSG.common(msg,title,Ext.MessageBox.ERROR,fn,scope);
	},
	question:function(msg,title,fn,scope){
		title = title || '信息';
		MSG.common(msg,title,Ext.MessageBox.QUESTION,fn,scope);
	},
	confirm:function(msg,title,fn,scope){
		title = title || this.title;
		Ext.Msg.confirm(title,msg,fn,scope);
	},
	prompt:function(msg,title,fn,scope,multiline,value){
		title = title || this.title;
		Ext.Msg.prompt(title,msg,fn,scope,multiline,value);
	},
	multiprompt:function(msg,title,fn,scope,value){
		title = title || this.title;
		Ext.Msg.prompt(title,msg,fn,scope,true,value);
	},
	dialog:function(msg,title,fn,scope){
		Ext.MessageBox.show({
           title:title || this.title,
           msg: msg,
           buttons: Ext.MessageBox.YESNOCANCEL,
           fn: fn,
           scope:this
       });
	},
	progress:function(msg,num,fn,scope,title,progressText,width,closable){
		 Ext.MessageBox.show({
           title: title||this.title,
           msg: msg,
           progressText: progressText||'初始化...',
           width:width||300,
           progress:true,
           closable:closable || false
       });
       var f = function(v){
            return function(){
                if(v == num){
                    Ext.MessageBox.hide();
                    if(fn) fn.call(scope||window);
                }else{
                    var i = v/(num-1);
                    Ext.MessageBox.updateProgress(i, Math.round(100*i)+'% 完成');
                }
           };
       };
       for(var i = 1; i < num+1; i++){
           setTimeout(f(i), i*500);
       }
	},
	wait:function(msg,title){
		Ext.Msg.wait(msg,title||this.title);
	}
});
Ext.sunyard.form.FileUploadField =  Ext.extend(Ext.ux.form.FileUploadField,{
	buttonText:'浏览'
});
Ext.sunyard.form.TextArea =  Ext.extend(Ext.form.TextArea,{});
Ext.sunyard.form.HtmlEditor =  Ext.extend(Ext.form.HtmlEditor,{});

Ext.reg('s_textfield', Ext.sunyard.form.TextField);
Ext.reg('s_numberfield', Ext.sunyard.form.NumberField);
Ext.reg('s_emailfield', Ext.sunyard.form.EmailField);
Ext.reg('s_amountfield', Ext.sunyard.form.AmountField);
Ext.reg('s_ipfield', Ext.sunyard.form.IpField);
Ext.reg('s_idcardfield', Ext.sunyard.form.IdcardField);
Ext.reg('s_phonefield', Ext.sunyard.form.PhoneField);
Ext.reg('s_positivenumfield', Ext.sunyard.form.PositivenumField);
Ext.reg('s_negativenumfield', Ext.sunyard.form.NegativenumField);
Ext.reg('s_positivedbfield', Ext.sunyard.form.PositivedbField);
Ext.reg('s_negativedbfield', Ext.sunyard.form.NegativedbField);
Ext.reg('s_datefield',Ext.sunyard.form.DateField);
Ext.reg('s_combo',Ext.sunyard.form.ComboBox);
Ext.reg('s_checkboxgroup',Ext.sunyard.form.CheckboxGroup);
Ext.reg('s_radiogroup',Ext.sunyard.form.RadioGroup);
Ext.reg("s_itemselector",Ext.sunyard.form.ItemSelector);
Ext.reg("s_tabpanel",Ext.sunyard.TabPanel);
Ext.reg("s_window",Ext.sunyard.Window);
Ext.reg("s_fileuploadfield",Ext.sunyard.form.FileUploadField);
Ext.reg("s_textarea",Ext.sunyard.form.TextArea);
Ext.reg("s_htmleditor",Ext.sunyard.form.HtmlEditor);