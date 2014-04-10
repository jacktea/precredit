Ext.ns("Ext.ux.sunyard","Ext.ux.PagingToolbar");

Ext.sunyard.BatchPlugin = Ext.extend(Ext.util.Observable,{
	batchText:'批量处理',
	batchTip:'批量处理',
	iconCls:'updateGridAll',
	constructor:function(config){
		Ext.apply(this,config||{});
	},
	init:function(grid){
		this.grid = grid;
		var cfg = [{
			text : this.batchText,
            tooltip : this.batchTip,
            iconCls : this.iconCls,
            handler : this.batchProcess,
            scope : this
		}];
		var tbar = grid.getTopToolbar(); 
    	if(tbar){
    		tbar.add(cfg);
    	}else{
    		grid.elements += ',tbar';
            grid.topToolbar = grid.createToolbar(cfg);	    	
	    }
    	this.addEvents("afterProcess");
		this.on("afterProcess",this.onAfterProcess,this);
		grid.on("destroy",this.onDestroy,this);
		grid.checkboxSelModel = new Ext.grid.CheckboxSelectionModel();
		grid.selModel = grid.checkboxSelModel;
	},
	getBatchWin:function(){
		if(!this.batchWin){
			if(this.formCfg){
				var winCfg = Ext.applyIf(this.winCfg||{},{
					xtype:'window',
					width:600,
					height:400,
					shadow : true,
					modal : true,
					closeAction:'hide',
					layout:'fit',
					defaults:{autoScroll :true},
					bodyStyle: 'padding:1px;overflow-x:hidden;',
					items:[CC.create(this.formCfg)],
					buttons:[{
						text:'处理',
						handler:this.onBatchWinProcess,
						scope:this
					},{
						text:'关闭',
						handler:function(){
							this.batchWin.hide();
						},
						scope:this
					}]
				});
				delete this.winCfg;
				this.batchWin = CC.create(winCfg);
			}
		}
		return this.batchWin;
	},
	batchProcess:function(){
		var sm = this.grid.getSelectionModel();
		if(0==sm.getCount()){
			MSG.error("当前没有选中记录！");
			return;
		}else{
			if(!this.getBatchWin()){
				MSG.confirm("确定要进行此操作","警告",function(btn){
					if(btn=='yes'){
						this.batchSubmit(this.url||this.grid.batchUrl,sm.getSelections());
					}
				},this);	
			}else{
				this.getBatchWin().show();
			}
		}
	},
	onBatchWinProcess:function(){
		var form = this.batchWin.form.getForm();
		if(form.isValid()){
			var sm = this.grid.getSelectionModel();
			this.batchSubmit(this.url||this.grid.batchUrl,sm.getSelections(),form.getValues());
		}
	},
	batchSubmit:function(url,arr,params){
		Ext.MessageBox.show({
			title: '正在处理',
			msg: '处理中，请稍候。。。',
			width:300,
			progress:true,
			closable:false
		});
		var len = arr.length;
		var suc = 0 ;
		var grid = this.grid;
		var obj = this;
		(function(index){
			var fn = arguments.callee;
			if(index<len){
				var data = Ext.apply({},arr[index]['data']);
				Ext.Ajax.request({						
					url:url,
					params:Ext.apply(data,params||{}),
					callback :function(options,success,response){
						if(success&&Ext.decode(response.responseText)['success']){
							suc++;
						}
						index = index+1;
						Ext.MessageBox.updateProgress((index/len), index+'条已完成，共'+len+'条');
						if(len==index){
							Ext.Msg.alert('提示信息','提交'+len+'条成功'+suc+'条');
							grid.store.reload();
							obj.fireEvent('afterProcess',grid);
						}
						fn(index);
					}
				});
			}
		})(0);
	},
	onAfterProcess:function(){
		if(this.batchWin) this.batchWin.hide();
	},
	onDestroy:function(){
		if(this.batchWin){
			this.batchWin.destroy();
			delete this.batchWin;
		}
		this.purgeListeners();
	}
});

Ext.ux.sunyard.ExportPlugin = Ext.extend(Ext.util.Observable,{
	fileName:'sunyard',
	constructor: function(config){
       Ext.apply(this, config);
       Ext.ux.sunyard.ExportPlugin.superclass.constructor.call(this);
    },
    init:function(grid){
    	this.grid = grid;
    	var cfg = [{
            text : '导出当前页',
            tooltip : '导出当前页',
            iconCls : 'exportExcel',
            handler : this._exportCurrPage,
            scope : this
	    },{
	    	text: '导出全部',
            tooltip: '导出全部',
            iconCls : 'exportExcelAll',
            handler: this._exportAllPage,
            scope : this
	    }];
    	var tbar = grid.getTopToolbar(); 
    	if(tbar){
    		tbar.add(cfg);
    	}else{
    		grid.elements += ',tbar';
            grid.topToolbar = grid.createToolbar(cfg);	    	
	    }
	    this.addEvents("afterSelectExportField");
		this.on("afterSelectExportField",this.onAfterSelectExportField,this);
		grid.on("destroy",this.onDestroy,this);
    },
	onAfterSelectExportField:function(form,values){
		var header = this.exportHeader;
		var exportField = [];
		if(values["exportFieldcheckbox"])
		for(var i = 0 ; i < values["exportFieldcheckbox"].length ; i ++){
			exportField.push(header.item(values["exportFieldcheckbox"][i]));
		}
		Ext.apply(this.exportParam,{"exportFields":Ext.encode(exportField),exportFileName:values['fileName']});
		var fd = this.getExportForm(this.exportParam);
	    fd.dom.submit();
	},
	_onPrint:function(){
		Ext.ux.Printer.print(this.grid);
	},
	getExportItem:function(){
		var grid = this.grid;
		var cm = grid.getColumnModel();
		var count = cm.getColumnCount();			
		this.exportHeader = this.exportHeader ? this.exportHeader : new Ext.util.MixedCollection (false,function(obj){return obj.name;});
		this.exportHeader.clear();
		var items = [{
			xtype:'textfield',
			fieldLabel: '导出文件名',
			anchor : '90%',
			name:'fileName',
			value:this.fileName
		}];
		if(grid.selColumnable!==false){
			var checkboxitems = [];
			for(var i = 0 ; i < count ; i++){
				var c = cm.getColumnAt(i);
				if(c instanceof Ext.grid.ActionColumn || c instanceof Ext.sunyard.grid.CustActionColumn || !cm.getDataIndex(i)) continue;					
				var fieldName = cm.config[i]['renderfield'] || cm.getDataIndex(i);
				checkboxitems.push({boxLabel: cm.getColumnHeader(i), name: 'exportFieldcheckbox', inputValue:fieldName, checked: true});	
				this.exportHeader.add({header:cm.getColumnHeader(i),name:fieldName});
			}
			items.splice(0,0,{
				xtype: 'checkboxgroup',
	            fieldLabel: '字段选择',
	            itemCls: 'x-check-group-alt',
	            columns: 4,
	            vertical: true,
	            items: checkboxitems
			});
		}
		return items;
	},
	_getExportWin:function(){
		var o = this.getExportItem();
		if(!this._exportWin){
			var _form = Ext.create({
					xtype:'form',
					plain:true,
					frame:true,
					labelWidth: 75,
					items:o
				});
			this._exportWin = new Ext.Window({
				width:600,
				height:250,
				title:'数据导出',
				shadow : true,
				modal : true,
				closeAction:'hide',
				layout:'fit',
				plain:true,
				defaults:{autoScroll :true},
				bodyStyle: 'padding:1px;overflow-x:hidden;',
				items:[_form],
				buttons:[{
					text:'确定',
					handler:function(){
						this.fireEvent("afterSelectExportField",_form,_form.getForm().getValues());
					},
					scope:this
				},{
					text:'关闭',
					handler:function(){
						this._exportWin.hide();
					},
					scope:this
				}]
			});
		}else{
			var form = this._exportWin.getComponent(0);
			form.removeAll(true);
			form.add(o);
			form.doLayout();
		}
		return this._exportWin;
	},
	exportParam:{},
	_exportCurrPage:function(){
		this.exportParam={};
		Ext.apply(this.exportParam,this.grid.getStore().baseParams);
		Ext.apply(this.exportParam,this.grid.getStore().lastOptions.params);
		this._getExportWin().show();
	},
	_exportAllPage:function(){
		this.exportParam={};
		Ext.apply(this.exportParam,this.grid.getStore().baseParams);
		Ext.apply(this.exportParam,this.grid.getStore().lastOptions.params);
		delete this.exportParam['start'];
	    delete this.exportParam['limit'];
	    this._getExportWin().show();
	},
	getExportForm : function(param){
		var fd=Ext.get('frmDummy');
        if (!fd) {
            fd=Ext.DomHelper.append(Ext.getBody(),
            	{tag:'form',method:'post',id:'frmDummy', 
            	target:'_blank',name:'frmDummy',cls:'x-hidden'},
            	true);
        }
        fd.dom.action = this.exportURL||this.grid.exportURL||this.grid.dataUrl+"/export";
        fd.dom.reset();
        for(var k in param){
        	if(!fd.child('input[name='+k+']')){
        		Ext.DomHelper.append(fd,{tag:'input',name:k,type:'hidden'},true);
        	}
        	fd.child('input[name='+k+']').set({value:param[k]});
        }
        try{
        	return fd;
        }finally{
        	fd = null;
        }
	},
	onDestroy:function(){
		if(this._exportWin){
			this._exportWin.destroy();
			delete this._exportWin;
		}
		this.purgeListeners();
	}
});

Ext.ux.PagingToolbar.PageCount = Ext.extend(Ext.util.Observable,{
	constructor: function(config){
       Ext.apply(this, config);
       Ext.ux.PagingToolbar.PageCount.superclass.constructor.call(this);
    },
    init : function(ptb){
    	var len = ptb.items.length;
    	var index = len;
    	if(len>2) index = index-2;
    	index = 11;
    	ptb.insert(index++,'-');
    	ptb.insert(index++,'每页显示数  ');
    	ptb.insert(index, { 	
				xtype:"combo",
			    store:new Ext.data.SimpleStore({ 
			    	fields: ['abbr', 'state'], 
			    	data : [[5,5],[10,10],[15,15],[20,20],[25,25],[30,30],[40,40],[50,50],[100,100],[500,500]] 
				}), 
				width:50, 
			    displayField:'state', 
			    typeAhead: true, 
			    mode: 'local', 
				value:ptb.pageSize, 
				triggerAction: 'all', 
				selectOnFocus:true, 
				listeners:{ 
					select:{ 
						fn:function(combo, value){
							ptb.pageSize = parseInt(combo.getValue());
							var store = ptb.store;
							store.lastOptions.params["start"] = 0;
							store.lastOptions.params["limit"] = combo.getValue();
							store.reload();
							//ptb.store.reload({params:{start:0,limit:combo.getValue()}});       
						} 
					}  
				} 
			});
    }
});
Ext.ns('Ext.sunyard.PagingToolbar');
Ext.sunyard.PagingToolbarPlugin = Ext.extend(Ext.PagingToolbar,{
	constructor:function(config){
		Ext.apply(this,config||{});
	},
	init:function(grid){
		this.grid = grid;
		var bbar = grid.getBottomToolbar();
		if(bbar){
			grid.toolbars.remove(bbar);
		}else{
			this.grid.elements += ',bbar';
		}
		grid.bottomToolbar = new Ext.PagingToolbar({
			pageSize: this.grid.pageSize || this.grid.limit,
	        store: this.grid.getStore(),
	        displayInfo: true,
	        displayMsg : "第{0}条到{1}条,共{2}条",
	        emptyMsg:"没有记录",
	        plugins:this.plugins
		});
		grid.toolbars.push(grid.bottomToolbar);
		grid.on("destroy",this.onDestroy,this);
	},
	onDestroy:function(){
		delete this.grid;
	}
});
Ext.sunyard.PagingToolbar.PageCount = Ext.extend(Ext.util.Observable,{
	constructor: function(config){
       Ext.apply(this, config);
       Ext.sunyard.PagingToolbar.PageCount.superclass.constructor.call(this,config);
    },
    init : function(ptb){
    	var index = this.index || 11;
    	index = ptb.items.length < index ? ptb.items.length:index;
    	ptb.insert(index++,'-');
    	ptb.insert(index++,'每页显示数  ');
    	ptb.insert(index++, { 	
				xtype:"combo",
			    store:new Ext.data.SimpleStore({ 
			    	fields: ['abbr', 'state'], 
			    	data : this.data || [[5,5],[10,10],[15,15],[20,20],[25,25],[30,30],[40,40],[50,50],[100,100],[500,500]] 
				}), 
				width:50, 
			    displayField:'state', 
			    typeAhead: true, 
			    mode: 'local', 
				value:ptb.pageSize, 
				triggerAction: 'all', 
				selectOnFocus:true, 
				listeners:{ 
					select:{ 
						fn:function(combo, value){
							ptb.pageSize = parseInt(combo.getValue());
							var store = ptb.store;
							store.lastOptions.params["start"] = 0;
							store.lastOptions.params["limit"] = combo.getValue();
							store.reload();     
						} 
					}  
				} 
			});
    }
});
Ext.sunyard.FilterConfigPlugin = Ext.extend(Ext.util.Observable,{
	constructor:function(config){
		Ext.apply(this,config||{});
		Ext.sunyard.FilterConfigPlugin.superclass.constructor.call(this,config);
	},
	init:function(grid){
		this.grid = grid;
		var bbar = grid.getBottomToolbar();
		if(bbar){
			var index= this.index || 11;
			index = bbar.items.length < index ? bbar.items.length:index;
			bbar.insert(index++,'-');
			bbar.insert(index++,{
				text:'本地过滤:关闭' ,
				enableToggle: true,
				handler: this.setLocalFilter,
				scope : this
			});				
		}
		grid.on("destroy",this.onDestroy,this);
	},
	setLocalFilter:function(button,state){
		var filterPlugin = this.grid.filters;
		var local = filterPlugin.local = !filterPlugin.local;
        var text = '本地过滤:' + (local ? '打开' : '关闭');
        filterPlugin.bindStore(this.grid.getStore());
        button.setText(text);
        this.grid.getStore().reload();
	},
	onDestroy:function(){
		delete this.grid;
	}
});
Ext.sunyard.GroupConfigPlugin = Ext.extend(Ext.util.Observable,{
	constructor:function(config){
		Ext.apply(this,config||{});
		Ext.sunyard.GroupConfigPlugin.superclass.constructor.call(this,config);
	},
	init:function(grid){
		this.grid = grid;
		var bbar = grid.getBottomToolbar();
		if(bbar){
			var index= this.index || 11;
			index = bbar.items.length < index ? bbar.items.length:index;
			bbar.insert(index++,'-');
			bbar.insert(index++,{
	        	text : '分组配置',
	        	menu : {
	        		items:[{
						text:'远程分组:关闭',
						enableToggle: true,
						handler:this.setRemoteGroup,
						scope:this
					},'-',{
						text:'分组方向：升序',
						handler:this.setGroupDir,
						scope:this
					},'-',{
						text:'清除分组',
						handler:this.clearGroup,
						scope:this
					}]
	        	}
	        });
		}
		grid.on("destroy",this.onDestroy,this);
	},
	setRemoteGroup:function(button,state){
		var store = this.grid.store;
		var sortLocal = store.remoteGroup = !store.remoteGroup;
		var text = '远程分组:' + (sortLocal ? '打开' : '关闭');
		button.setText(text);
		store.lastOptions.params["start"] = 0;
		store.applyGroupField();
		if(!sortLocal){
			if(store.baseParams){
                delete store.baseParams.groupBy;
                delete store.baseParams.groupDir;
            }
            var lo = store.lastOptions;
            if(lo && lo.params){
                delete lo.params.groupBy;
                delete lo.params.groupDir;
            }
		}
		store.reload();
	},
	setGroupDir:function(button,state){
		var store = this.grid.store;
		store.groupDir = store.groupDir == "ASC" ? "DESC" : "ASC";
		var text = '分组方向:' + (store.groupDir == "ASC" ? '升序' : '降序');
		button.setText(text);
		if(store.remoteGroup){
			store.lastOptions.params.groupDir = store.groupDir;
			store.reload();
			store.sort();
		}else{
			store.sort();
			store.fireEvent('datachanged', store);
		}
	},
	clearGroup:function(){
		 this.grid.store.clearGrouping();
	},
	onDestroy:function(){
		delete this.grid;
	}
});
Ext.sunyard.SortConfigPlugin = Ext.extend(Ext.util.Observable,{
	constructor:function(config){
		Ext.apply(this,config||{});
		Ext.sunyard.SortConfigPlugin.superclass.constructor.call(this,config);
	},
	init:function(grid){
		this.grid = grid;
		var bbar = grid.getBottomToolbar();
		if(bbar){
			var index= this.index || 11;
			index = bbar.items.length < index ? bbar.items.length:index;
			bbar.insert(index++,'-');
			bbar.insert(index++,{
				text:'远程排序:关闭',
				enableToggle: true,
				handler:this.setRemoteSort,
				scope:this
			});
		}
		grid.on("destroy",this.onDestroy,this);
	},
	setRemoteSort:function(button, state){
		var store = this.grid.store;
		var sortLocal = store.remoteSort = !store.remoteSort;
		var text = '远程排序:' + (sortLocal ? '打开' : '关闭');
		button.setText(text);
		store.hasMultiSort = true;
		store.lastOptions.params["start"] = 0;
		store.reload();
	},
	onDestroy:function(){
		delete this.grid;
	}
});