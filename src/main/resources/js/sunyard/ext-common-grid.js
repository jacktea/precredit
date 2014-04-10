Ext.ns('Ext.sunyard.grid');
Ext.sunyard.grid.DynamicGridPanel = Ext.extend(Ext.grid.GridPanel,{
	stripeRows:true,
	hasRender:false,
	filterable:true,
	autoQuery:true,
	optimizeQuery:false,
	start:0,
	limit:20,
	initComponent:function(){
		this.extraColumn = this.extraColumn || this.columns;
		Ext.sunyard.grid.DynamicGridPanel.superclass.initComponent.apply(this, arguments);
		this.plugins = this.plugins ? (Ext.isArray(this.plugins) ? this.plugins : [this.plugins]) : [];
		if(this.filterable===true){
			this.filtersPlugin = this.filtersPlugin || new Ext.ux.grid.GridFilters({
				menuFilterText:"过滤",
				updateBuffer : 1000,
				encode:true,
				filters:this.filterCols || []
			});
			this.plugins.push(this.filtersPlugin);
		}
		if(this.expanderRow){
			this.plugins.push(this.expanderRow);
		}
	},
	resetOptimize:function(){
		if(this.optimizeCache && this.optimizeCache.params){
			delete this.optimizeCache.params;
		}
	},
	onRender: function(ct, position){
		Ext.sunyard.grid.DynamicGridPanel.superclass.onRender.call(this, ct, position);
		this.el.mask('数据加载中...');
		this.relayEvents(this.store.reader,['readData']);
		this.relayEvents(this.store.proxy,['beforeload','load','loadexception','exception']);
		var appendParam = function(optimize,k,v){
			var params = (optimize.params = optimize.params ? optimize.params : {});
			params[k] = v;
		}
		var getParamValue = function(optimize,k){
			var params = (optimize.params = optimize.params ? optimize.params : {});
			return params[k];
		}
		var removeParam = function(optimize,k){
			var params = (optimize.params = optimize.params ? optimize.params : {});
			delete params[k];
		}
		this.optimizeCache = {};
		
		this.store.on("beforeload",function(store,options){
			options.params = options.params || {};
			var optimize = this.optimizeCache;			
			var loadtime = getParamValue(optimize,"loadtime") || 0;
			loadtime += 1;
			appendParam(optimize,"loadtime",loadtime);
			if(this.optimizeQuery){
				appendParam(optimize,"sumup",false);
				appendParam(optimize,"totalSize",store.getTotalCount());
			}
			Ext.apply(options.params,optimize.params);
		},this);
		
		this.store.on('loadexception',function(proxy,option,response,e){
			this.el.unmask();
			var respError = null;
			if(response.responseText){
				respError = Ext.decode(response.responseText)['errorMessage'];
			}
			if(e){
				var message = respError || 'reader 读取返回数据出错.. ';
				MSG.error(message);
			}else{			
				var message = respError || 'Ajax请求数据出错!!';
				MSG.error(message);
			}
		},this);
		this.store.on('metachange', function(){
			this.el.unmask();
			var groupField = this.store.groupField;
			if(this.optimizeCache.params&&(this.optimizeCache.params.loadtime!=1)&&(!this.store.reader.jsonData.columns))return;			
			var _serviceColumn = this.store.reader.jsonData.columns;
			_serviceColumn = Ext.isEmpty(_serviceColumn) ? [] : Ext.decode(_serviceColumn);
			if(typeof(_serviceColumn) === 'object'){
				var columns = []; 
				if(this.expanderRow){columns.push(this.expanderRow);};
				if(this.rowNumberer) { columns.push(new Ext.grid.RowNumberer()); }
				if(this.checkboxSelModel) { columns.push(this.checkboxSelModel); }				
				Ext.each(_serviceColumn, function(column){
					for(var k in column){
	            		if(Ext.isEmpty(column[k]))
	            			delete column[k];
	            	}
	            	if(column['hidden']===true)delete column['align'];
	            	if(!column['dataIndex'])column['dataIndex']=column['name'];
	            	if(column['dataIndex']===groupField)column['hidden']=true;
					columns.push(column);
				});
				if(this.actionColumn)
					if(Ext.isArray(this.actionColumn)){
						columns = columns.concat(this.actionColumn);
					}else{
						columns.push(this.actionColumn);
					}
				
				if(this.extraColumn){
					if(Ext.isArray(this.extraColumn)){
						for(var i = 0 ; i < this.extraColumn.length ; i++){
							var column = this.extraColumn[i];
							var columnIndex = column.columnIndex==undefined ? columns.length : column.columnIndex;
							columnIndex = columnIndex > columns.length ? columns.length : columnIndex;
							columns.splice(columnIndex,0,column);
//							delete column.columnIndex;
						}
					}else{
						var column = this.extraColumn;
						var columnIndex = column.columnIndex==undefined ? columns.length : column.columnIndex;
						columnIndex = columnIndex > columns.length ? columns.length : columnIndex;
						columns.splice(columnIndex,0,column);
//						delete column.columnIndex;
					}
				}				
				Ext.each(columns,function(column){
					if(column['renderfield']){
	            		column['renderer'] = function(value, metaData, record, rowIndex, colIndex, store){
	            			return record.get(column['renderfield']);
	            		};
	            	}
				});	
				
				this.getColumnModel().setConfig(columns);
				
				if(!this.store.groupField&&this.groupField){
					this.store.groupField = this.groupField;
					delete this.groupField;
				}
				if(this.filters)
					if(this.filters.filters.getCount() == 0){
						this.filters.addFilters(this.getColumnModel());
					}			
			}
		},this);
		if(this.autoQuery===true){
			this.store.load({params:{start: this.start, limit: this.limit||this.pageSize||20}});
		}else{
			this.el.unmask(); 
		}
	}
});
Ext.sunyard.grid.CommonGrid = Ext.extend(Ext.sunyard.grid.DynamicGridPanel,{
	pageSize:20,
	limit:null,
	dataUrl:null,	
//	columns : [],
	forceFitColumn : true,
	store:null,
	storeCfg:null,
   	memoryPaging:false,
	initComponent:function(){
		this.columns = this.columns || [];
		this.limit = this.limit || this.pageSize;
		var storeCfg = this.storeCfg || {};
		Ext.applyIf(storeCfg,{
			xtype:'groupingstore',
			url:this.dataUrl || this.storeUrl||this.url,
			autoDestroy: true,
			groupDir : this.groupDir ? this.groupDir : "ASC",
			reader : new Ext.data.JsonReaderEx(),
			baseParams : this.baseParams ? this.baseParams : {}
		});
		if(this.memoryPaging){
			delete storeCfg.url;
			storeCfg.proxy = new Ext.sunyard.data.PagingMemoryProxy({
				dataUrl:this.dataUrl || this.storeUrl||this.url,
				data:this.storeData
			});
		}
		var store = this.store || Ext.create(storeCfg);
		storeCfg = null;
		delete this.storeCfg;
		this.plugins = this.plugins ? (Ext.isArray(this.plugins) ? this.plugins : [this.plugins]) : [];
		this.plugins.push(this.summaryPlugin||new Ext.ux.grid.GroupSummary());
		Ext.apply(this,{
			store:store,
			sm: this.checkboxSelModel || new Ext.grid.RowSelectionModel({singleSelect:true}),
			pageSize:this.pageSize || this.limit,
			view: this.view || new Ext.grid.GroupingView({
				hideGroupedColumn : true,
            	forceFit: this.forceFitColumn,
	            groupByText:"按这个字段分组",
	            showGroupsText:"通过分组显示"
	        }),
	        loadMask : {msg:"数据加载中..."}
		});
		this.bbar = this.bbar || new Ext.PagingToolbar({
	        pageSize: this.pageSize || this.limit,
	        store: store,
	        displayInfo: true,
	        displayMsg : "第{0}条到{1}条,共{2}条",
	        emptyMsg:"没有记录",
	        plugins : new Ext.ux.PagingToolbar.PageCount(),
	        items:['-',{
	        	text : '过滤配置',
	        	menu : {
	        		items:[{
			        	text:'自动过滤:打开',
			        	enableToggle: true,
			        	handler:this.setAutoFilter,
						scope:this
			        },'-',{
						text:'本地过滤:关闭' ,
						enableToggle: true,
						handler: this.setLocalFilter,
						scope : this
					},'-',{
			            text: '查看过滤条件',
			            tooltip: '查看所有的过滤条件',
			            handler: this.filterCondition,
			            scope : this
			        },'-',{
			            text: '清除过滤条件',
			            tooltip: '清除所有的过滤条件',
			            handler: this.clearfilter,
			            scope : this
			        },'-',{
			        	text:'进行过滤',
			        	handler:this._doFilter,
			        	scope:this
			        }]		        	
	        	}
	        },'-',{
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
	        },'-',{
				text:'远程排序:关闭',
				enableToggle: true,
				handler:this.setRemoteSort,
				scope:this
			}]
	    });
		Ext.sunyard.grid.CommonGrid.superclass.initComponent.apply(this, arguments);
	},
	setRemoteGroup:function(button,state){
		var store = this.store;
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
		var store = this.store;
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
		 this.store.clearGrouping();
	},
	setRemoteSort:function(button, state){
		var store = this.store;
		var sortLocal = store.remoteSort = !store.remoteSort;
		var text = '远程排序:' + (sortLocal ? '打开' : '关闭');
		button.setText(text);
		store.hasMultiSort = true;
		store.lastOptions.params["start"] = 0;
		store.reload();
	},
	setAutoFilter:function(button, state){
		var filterPlugin = this.filters;
		var autoFilter = filterPlugin.autoReload = !filterPlugin.autoReload;
		var text = '自动过滤:' + (autoFilter ? '打开' : '关闭');
		button.setText(text);
	},
	setLocalFilter:function(button,state){
		var filterPlugin = this.filters;
		var local = filterPlugin.local = !filterPlugin.local;
        var text = '本地过滤:' + (local ? '打开' : '关闭');
        filterPlugin.bindStore(this.getStore());
        button.setText(text);
        this.getStore().reload();
	},
	filterCondition:function(){
    	var _filterData = this.filters.getFilterData();
    	var comparisons = {'gt':'大于','lt':'小于','eq':'等于'};
    	var cm = this.getColumnModel();
    	var _s = "";
    	var v ;
    	Ext.each(_filterData,function(obj){
    		var cson = obj.data.comparison ? comparisons[obj.data.comparison] : '';
    		if(obj.data.type=='list'){
    			v = cson+obj.data.text;
    		}else{
    			v = cson+obj.data.value;
    		}
    		_s += cm.getColumnHeader(cm.findColumnIndex(obj.field))+":"+v+"<br/>";
    	});
        Ext.Msg.alert('过滤条件',_s);
	},
	clearfilter:function(){
    	var filterPlugin = this.filters;
        filterPlugin.clearFilters();
        if(!filterPlugin.autoReload)
        	filterPlugin.deferredUpdate.delay(filterPlugin.updateBuffer);
	},
	_doFilter:function(){
   		var filterPlugin = this.filters;
		filterPlugin.deferredUpdate.delay(filterPlugin.updateBuffer);
	}
});
Ext.sunyard.FormPanel = Ext.extend(Ext.FormPanel,{
	api:{"PUT":"create","POST":"update","DELETE":"delete","LOAD":"load"},
	initComponent : function(){
        Ext.sunyard.FormPanel.superclass.initComponent.call(this);
        this.addEvents('beforeSubmit','afterSuccess','afterFailure','loadRemoteRecord');
    },
    getApiUrl:function(o){
    	var oper = this.api[o] || "";
    	var url = this[oper+"Url"] || this.submitUrl + "/" + oper;
    	return url;
    },
    onRemoteLoad:function(rec){
		this.getForm().load({
			//url:this.loadUrl || this.submitUrl+"/load",
			url:this.getApiUrl("LOAD"),
			scope:this,
			params:rec.data,
			waitTitle :'提示信息',
			waitMsg :'数据加载中请稍候。。',
			success:function(form,action){
				this.fireEvent("loadRemoteRecord",form,action);
			},
			failure:function(form, action){
				try{
					var errorMessage = action.result.errorMessage;
					MSG.error(errorMessage||'数据加载失败！！');
				}catch(e){
					MSG.error('数据加载失败！！');
				}
			}
		});	
	},
	idFieldValidate:function(oriData,fields){
		fields = fields || this.idFields || [];
		if(Ext.isString(fields)){
			var f = this.getForm().findField(fields);
			if((String(oriData[fields])).trim()!=(String(f.getValue())).trim()) {
				f.markInvalid("主键不允许修改!");
				return false;
			}
		}else{
			for(var i=0,len=fields.length ; i < len ; i++){
				var fname = fields[i];
				var f = this.getForm().findField(fname);
				if((String(oriData[fname])).trim()!=(String(f.getValue())).trim()) {
					f.markInvalid("主键不允许修改!");
					return false;
				}
			}
		}
	},
    onSubmit:function(cfg){
    	cfg = cfg ? cfg : {};
    	Ext.applyIf(cfg,{
			clientValidation :true,
			waitTitle :'提示信息',
			waitMsg :'提交中请稍候。。',
			url:this.getApiUrl(cfg._method),
			//url:this.submitUrl,
			success:function(form,action){
				Ext.Msg.alert('提示信息','操作成功',function(){
					this.fireEvent('afterSuccess',form,action,cfg._method);
				},this);
			},
			failure:function(form,action){
				if(action.failureType==Ext.form.Action.CLIENT_INVALID){
					var errMsg = [];
					form.items.each(function(f){
						if(f.activeError){
							errMsg.push((f.fieldLabel||f.name||f.hiddenName)+":"+f.activeError);
						}
					});
					MSG.error(errMsg.join("<br/>"));
				}else{
					var errMsg = action.result&&!Ext.isEmpty(action.result.errorMessage) ? action.result.errorMessage :  '操作失败！！';
					MSG.error(errMsg);
				}
				this.fireEvent('afterFailure',form,action,cfg._method);
			},
			scope:this
		});
		if(this.fireEvent('beforeSubmit',this,this.getForm(),cfg)!==false){
    		this.getForm().submit(cfg);
		}
    }
});
Ext.sunyard.grid.CRUDGrid = Ext.extend(Ext.sunyard.grid.CommonGrid,{
	remoteFormLoad : false,
	processCRUD:Ext.emptyFn,
	addedable:true,
	editable:true,
	deleteable:true,
	prevable:true,
	initComponent : function(){
		var actionColumn = [];
		if(this.editable!==false){
			actionColumn.push({
				xtype: 'actioncolumn',
	            header:'修改',
	            align:'center',
	            dataIndex:'',
	            width: 40,
	            items:[{
	                iconCls: 'edit',   
	                tooltip: '修改',
	                handler: function(grid, rowIndex, colIndex) {
	                	var args = Array.prototype.slice.call(arguments,0);
	                	args.splice(0,0,'edit');
	                	if(false===this.processCRUD.apply(this,args))
	                		return;
	                    var rec = this.store.getAt(rowIndex);
	                    this.onShowEditWin(rec);
	                },
	                scope:this
	            }]
			});
		}
		if(this.deleteable!==false){
			actionColumn.push({
				xtype: 'actioncolumn',
	            header:'删除',
	            align:'center',
	            dataIndex:'',
	            width: 40,
	            items:[{
	                iconCls: 'delete',  
	                tooltip: '删除',
	                handler: function(grid, rowIndex, colIndex) {
	                	var args = Array.prototype.slice.call(arguments,0);
	                	args.splice(0,0,'delete');
	                	if(false===this.processCRUD.apply(this,args))
	                		return;
	                    var rec = this.store.getAt(rowIndex);
	                    this.onShowDelWin(rec);
	                },
	                scope:this
	            }]
			});
		}
		if(this.prevable!==false){
			actionColumn.push({
				xtype: 'actioncolumn',
	            header:'查看',
	            align:'center',
	            dataIndex:'',
	            width: 40,
	            items:[{
	                iconCls: 'preview',   
	                tooltip: '查看',
	                handler: function(grid, rowIndex, colIndex) {
	                	var args = Array.prototype.slice.call(arguments,0);
	                	args.splice(0,0,'preview');
	                	if(false===this.processCRUD.apply(this,args))
	                		return;
	                    var rec = this.store.getAt(rowIndex);
	                    this.onShowViewWin(rec);
	                },
	                scope:this
	            }]
			});
		}
		this.actionColumn = this.actionColumn || actionColumn;
		/*
		var _items = [];
		if(this.editable!==false){
			_items.push({
                iconCls: 'edit',   
                tooltip: '修改',
                handler: function(grid, rowIndex, colIndex) {
                	var args = Array.prototype.slice.call(arguments,0);
                	args.splice(0,0,'edit');
                	if(false===this.processCRUD.apply(this,args))
                		return;
                    var rec = this.store.getAt(rowIndex);
                    this.onShowEditWin(rec);
                },
                scope:this
            });
		}
		if(this.deleteable!==false){
			_items.push({
                iconCls: 'delete',  
                tooltip: '删除',
                handler: function(grid, rowIndex, colIndex) {
                	var args = Array.prototype.slice.call(arguments,0);
                	args.splice(0,0,'delete');
                	if(false===this.processCRUD.apply(this,args))
                		return;
                    var rec = this.store.getAt(rowIndex);
                    this.onShowDelWin(rec);
                },
                scope:this
            });
		}
		if(this.prevable!==false){
			_items.push({
                iconCls: 'preview',   
                tooltip: '查看',
                handler: function(grid, rowIndex, colIndex) {
                	var args = Array.prototype.slice.call(arguments,0);
                	args.splice(0,0,'preview');
                	if(false===this.processCRUD.apply(this,args))
                		return;
                    var rec = this.store.getAt(rowIndex);
                    this.onShowViewWin(rec);
                },
                scope:this
            });
		}
		Ext.applyIf(this,{
			actionColumn:{
                xtype: 'actioncolumn',
                header:'操作',
                align:'center',
                dataIndex:'',
                width: 80,
                items: _items
            }
		});
		*
		*/
		this.tbar = this.tbar ? this.tbar : [];
		if(this.addedable===false){			
		}else{
			this.tbar = this.tbar.concat({
				text:'新增',
				iconCls: 'silk-add',
				handler:this.onShowNewWin,
				tooltip: '新增',
				scope:this
			});
		}		
		Ext.sunyard.grid.CRUDGrid.superclass.initComponent.apply(this, arguments);
		this.addEvents("loadformrecord","preprocessnew","preprocessedit","preprocessdel","preprocessprev");
	},
	onNew:function(){
		var ct = this;
		var baseFormFieldValues = Ext.apply({operType:1,_method:'PUT'},ct.baseFormFieldValues);
		ct.loadFormData(baseFormFieldValues);
		ct.form.onSubmit({_method:'PUT'});
	},
	onEdit:function(){
		var ct = this;
		var baseFormFieldValues = Ext.apply({operType:2,_method:'POST'},ct.baseFormFieldValues);
		ct.loadFormData(baseFormFieldValues);
		if(false!==ct.form.idFieldValidate(this.getRecordData()))
			ct.form.onSubmit({_method:'POST'});
	},
	onDel:function(){
		var ct = this;		
		var baseFormFieldValues = Ext.apply({operType:3,_method:'DELETE'},ct.baseFormFieldValues);
		ct.loadFormData(baseFormFieldValues);
		if(false!==ct.form.idFieldValidate(this.getRecordData()))
			ct.form.onSubmit({_method:'DELETE'});
	},
	onReset:function(){
		this.form.getForm().reset();
		var gridsm = this.getSelectionModel();
		gridsm.clearSelections();
	},
	onReloadData:function(){
		if(this._selectedRecord){
			this.loadFormRecord(this._selectedRecord);
		}
	},
	initForm:function(){
		if(!this.form){
			this.formCfg = this.formCfg ? this.formCfg : {};
			Ext.applyIf(this.formCfg,{
				submitUrl:this.submitUrl
			});
			Ext.apply(this.formCfg,{
				border:false
			});
			var _items = this.formCfg.items;
			if(_items)
				_items.push({
			    	xtype:'hidden',
			    	name:'operType'
			    },{
			    	xtype:'hidden',
			    	name:'_method'
			    });
			this.form = this.form ? this.form : this.formCfg ? Ext.create(this.formCfg) : null;
			delete this.formCfg;
			this.form.on("afterSuccess",this.formSubmitSuc,this);
			this.form.on('loadRemoteRecord',function(form,action){
				this.fireEvent('loadformrecord',form,action.result.data);
			},this);
		}
		return this.form;
	},
	formSubmitSuc:function(){
		this.onReset();
		this.store.reload();
		this.win.hide();
	},
	initWin:function(){
		if(!this.win){
			this.winCfg = this.winCfg ? this.winCfg : {};
			Ext.apply(this.winCfg,{
				plain:true
			});
			Ext.applyIf(this.winCfg,{
				xtype:'window',
				width:600,
				height:400,
				shadow : true,
				modal : true,
				closeAction:'hide',
				layout:'fit',
				defaults:{autoScroll :true},
				bodyStyle: 'padding:1px;overflow-x:hidden;'				
			});
			this.winTitle = this.winCfg.winTitle || this.winCfg.title || '';
			this.win = Ext.create(this.winCfg);
			if(this.formCfg) this.win.add(this.initForm());
			this.win.addButton({
					text:'新增',
					handler:this.onNew,
					itemId:'new',
					hidden:true,
					scope:this
				});
			this.win.addButton({
					text:'修改',
					handler:this.onEdit,
					itemId:'edit',
					hidden:true,
					scope:this
				});
			this.win.addButton({
					text:'删除',
					handler:this.onDel,
					itemId:'del',
					hidden:true,
					scope:this
				});
			this.win.addButton({
					text:'重置',
					handler:this.onReset,
					itemId:'reset',
					hidden:true,
					scope:this
				});
			this.win.addButton({
					text:'重载',
					handler:this.onReloadData,
					itemId:'reloadData',
					hidden:true,
					scope:this
				});
			this.win.on('hide',function(){
	//			this.onReset();
			},this);
			delete this.winCfg;
		}
		return this.win;
	},
	setWinTitle:function(title){
		this.initWin().setTitle(title);
	},
	showWin:function(btn,fn,scope){
		this.initWin().show(btn,fn,scope);
	},
	hideWinBtn:function(){
		var fbar = this.win.getFooterToolbar();
		fbar.getComponent('new').hide();
		fbar.getComponent('edit').hide();
		fbar.getComponent('del').hide();
		fbar.getComponent('reset').hide();
		fbar.getComponent('reloadData').hide();
	},
	onShowNewWin:function(btn){
		this.showWin(btn);
		this.setWinTitle('新增-'+this.winTitle);
		this.hideWinBtn();
		this.win.getFooterToolbar().getComponent('new').show();
		this.win.getFooterToolbar().getComponent('reset').show();
		this.onReset();
		this.setReocrd(null);
		this.fireEvent('preprocessnew',this.form,this.win,this);
	},
	onShowEditWin:function(rec){
		this.showWin();
		this.setWinTitle('修改-'+this.winTitle);
		this.hideWinBtn();
		this.win.getFooterToolbar().getComponent('edit').show();
		this.win.getFooterToolbar().getComponent('reloadData').show();
		this.loadFormRecord(rec);
		this.fireEvent('preprocessedit',this.form,this.win,this);
//		this.loadFormData(rec.data)
	},
	onShowDelWin:function(rec){
		this.showWin();
		this.setWinTitle('删除-'+this.winTitle);
		this.hideWinBtn();
		this.win.getFooterToolbar().getComponent('del').show();
		this.win.getFooterToolbar().getComponent('reloadData').show();
		this.loadFormRecord(rec);
		this.fireEvent('preprocessdel',this.form,this.win,this);
//		this.loadFormData(rec.data)
	},
	onShowViewWin:function(rec){
		this.showWin();
		this.setWinTitle('查看-'+this.winTitle);
		this.hideWinBtn();
		this.win.getFooterToolbar().getComponent('reloadData').show();
		this.loadFormRecord(rec);
		this.fireEvent('preprocessprev',this.form,this.win,this);
//		this.loadFormData(rec.data)
	},
	isSelected:function(){
		if(this.getSelectionModel().getCount()==0){
			Ext.Msg.alert('提示信息','请选择一条记录');
			return false;
		}
		return true;
	},
	setReocrd:function(rec){
		this._selectedRecord = rec;
	},
	getRecord:function(){		
		return this._selectedRecord || this.getSelectionModel().getSelected();
	},
	getRecordData:function(){
		var rec = this.getRecord();
		return rec ? rec.data : {};
	},
	loadFormRecord:function(rec){
		this.setReocrd(rec);
		if(this.form){
			if(this.remoteFormLoad)
				this.form.onRemoteLoad(rec);
			else{
				this.form.getForm().loadRecord(rec);
				this.fireEvent('loadformrecord',this.form.getForm(),rec.data);
			}
		}
	},
	loadSelectedRecord:function(){
		if(this.isSelected()&&this.form){
			this.loadFormRecord(this.getSelectionModel().getSelected());
		}
	},
	load:function(cfg){
		this.store.load(cfg);
	},
	loadFormData:function(values){
		if(this.form)
			this.form.getForm().setValues(values);
	},
	destroy:function(){
		if(this.win){
			this.win.destroy();
			delete this.win;
		}
		delete this.form;
		delete this._selectedRecord;
		Ext.sunyard.grid.CRUDGrid.superclass.destroy.call(this);
	}
});

Ext.sunyard.grid.EditorGrid = Ext.extend(Ext.grid.EditorGridPanel,{
	pageSize:20,
	limit:null,
	dataUrl:null,	
	//columns : [],
	forceFitColumn : true,
	store:null,
	storeCfg:null,
   	memoryPaging:false,
   	autoSave:true,
   	writeAllFields:true,
   	addedable:true,
   	deleteable:true,
   	autoQuery:true,
   	batchCommit:true,
   	initComponent:function(){
		this.limit = this.limit || this.pageSize;
		var storeCfg = this.storeCfg || {};
		Ext.applyIf(storeCfg,{
			xtype:'jsonstore',
			autoSave:this.autoSave,
			api:{
				'read':this.dataUrl || this.storeUrl||this.url,
				'create':this.createUrl || this.submitUrl+"/create",
				'update':this.updateUrl || this.submitUrl+"/update",
				'destroy':this.deleteUrl || this.submitUrl+"/delete"
			},
			autoDestroy: true,
			reader : new Ext.data.JsonReaderEx(),
			baseParams : this.baseParams ? this.baseParams : {},
			writer : new Ext.data.JsonWriter({
			    encode: true,
			    listful:true,
			    writeAllFields: this.writeAllFields // write all fields, not just those that changed
			}),
			listeners:{
				beforewrite:function(store,action, rs, options){
					var m = {'create':'PUT','update':'POST','destroy':'DELETE'};
					options.params._method = m[action];
				},
				exception:function(proxy,type,action,option,response,e){
					if(type=='remote'){
						var respError = null;
						if(response.responseText){
							respError = Ext.decode(response.responseText)['errorMessage'];
						}
						var message = respError || '服务端业务出错！';
						//var respError = response.responseText ? response.responseText.errorMessage : '';
						//respError = response.responseText.errorMessage;
						//var message = respError&&''!=respError ? respError : '服务端业务出错！';
						MSG.error(message);
					}else{//type='response'
						if(e){
							MSG.error('reader 读取返回数据出错..');
						}else{
							MSG.error('Ajax请求数据出错!!');
						}
					}
				},
				loadexception:function(proxy,option,resp,e){
					if(e){
						MSG.error('reader 读取返回数据出错.. ');
					}else{
						var respError = null;
						if(response.responseText){
							respError = Ext.decode(response.responseText)['errorMessage'];
						}
						var message = respError || 'Ajax请求数据出错!!';
						//var respError = response.responseText ? response.responseText.errorMessage : '';
						//var message = respError&&''!=respError ? respError : 'Ajax请求数据出错!!';
						MSG.error(message);
					}
				}
			}
		});
		if(this.memoryPaging){
			delete storeCfg.url;
			storeCfg.proxy = new Ext.sunyard.data.PagingMemoryProxy({
				dataUrl:this.dataUrl || this.storeUrl||this.url,
				data:this.storeData
			});
		}
		var store = this.store || Ext.create(storeCfg);
		storeCfg = null;
		delete this.storeCfg;
		
		var tbar = [];
		if(this.addedable){
			tbar.push({
				text:'新增',
				iconCls: 'silk-add',
				handler:this.onNew,
				tooltip: '新增',
				scope:this
			});
			tbar.push('-');
		}
		if(this.deleteable){
			tbar.push({
				text:'删除',
				iconCls:'silk-delete',
				handler:this.onDelete,
				tooltip: '删除',
				scope:this
			});
			tbar.push('-');
		}
		if(!this.autoSave){
			if(this.batchCommit){
				tbar.push({
					text:'批量提交',
					iconCls: 'silk-add',
					handler:this.onBatchSubmit,
					tooltip: '批量提交',
					scope:this
				});
				tbar.push('-');
			}
		}
		this.tbar = this.tbar ? this.tbar : [];
		this.tbar = tbar.concat(this.tbar);
		
		Ext.apply(this,{
			store:store,
			pageSize:this.pageSize || this.limit,
			bbar:new Ext.PagingToolbar({
		        pageSize: this.pageSize || this.limit,
		        store: store,
		        displayInfo: true,
		        displayMsg : "第{0}条到{1}条,共{2}条",
		        emptyMsg:"没有记录",
		        plugins : new Ext.ux.PagingToolbar.PageCount(),
		        items:['-',{
					text:'本地过滤:关闭' ,
					enableToggle: true,
					handler: this.setLocalFilter,
					scope : this
				},'-',{
					text:'远程排序:关闭',
					enableToggle: true,
					handler:this.setRemoteSort,
					scope:this
				}]
		    }),
		    viewConfig:this.viewConfig || {
            	forceFit: this.forceFitColumn
		    },
	        loadMask : {msg:"数据加载中..."}
		});
		Ext.each(this.columns,function(column){
			if(column['renderfield']){
        		column['renderer'] = function(value, metaData, record, rowIndex, colIndex, store){
        			return record.get(column['renderfield']);
        		};
        	}
		});
			Ext.sunyard.grid.CommonGrid.superclass.initComponent.apply(this);
			this.on('afterrender',function(){
				if(this.autoQuery===true)
					this.store.load({params:{start:0,limit:this.pageSize}});
				if(this.filters){
					if(this.filters.filters.getCount() == 0){
						this.filters.addFilters(this.getColumnModel());
					}
				}
			},this);
   	},      	
   	onRender:function(){
   		Ext.sunyard.grid.EditorGrid.superclass.onRender.apply(this, arguments);
   	},
   	onNew:function(){
   		var Plant = this.store.recordType;
        var p = new Plant({});
        this.stopEditing();
        this.store.insert(0, p);
        this.startEditing(0, 0);
   	},
   	onDelete:function(){
   		var sm = this.getSelectionModel();
   		if(sm.getCount()<1){
   			MSG.error('没有选中要删除的行！');
   		}
   		var r = sm.getSelected();
   		this.store.remove(r);
   	},
   	onBatchSubmit:function(){
   		this.store.save();
   	},
   	onEditComplete : function(ed, value, startValue){
        this.editing = false;
        this.lastActiveEditor = this.activeEditor;
        this.activeEditor = null;

        var r = ed.record,
            field = this.colModel.getDataIndex(ed.col);
        value = this.postEditValue(value, startValue, r, field);
        var rawValue = ed.field.getRawValue();
        if(this.forceValidation === true || String(value) !== String(startValue)){
            var e = {
                grid: this,
                record: r,
                field: field,
                renderfield:this.colModel.config[ed.col].renderfield,
                originalValue: startValue,
                value: value,
                rawValue:rawValue,
                row: ed.row,
                column: ed.col,
                cancel:false
            };
            if(this.fireEvent("validateedit", e) !== false && !e.cancel && String(value) !== String(startValue)){
                r.set(field, e.value);
                if(e.renderfield) r.set(e.renderfield,e.rawValue);
                delete e.cancel;
                this.fireEvent("afteredit", e);
            }
        }
        this.view.focusCell(ed.row, ed.col);
    },
	setRemoteSort:function(button, state){
		var store = this.store;
		var sortLocal = store.remoteSort = !store.remoteSort;
		var text = '远程排序:' + (sortLocal ? '打开' : '关闭');
		button.setText(text);
		store.hasMultiSort = false;
		store.lastOptions.params["start"] = 0;
		store.reload();
	},
	setAutoFilter:function(button, state){
		var filterPlugin = this.filters;
		var autoFilter = filterPlugin.autoReload = !filterPlugin.autoReload;
		var text = '自动过滤:' + (autoFilter ? '打开' : '关闭');
		button.setText(text);
	},
	setLocalFilter:function(button,state){
		var filterPlugin = this.filters;
		var local = filterPlugin.local = !filterPlugin.local;
        var text = '本地过滤:' + (local ? '打开' : '关闭');
        filterPlugin.bindStore(this.getStore());
        button.setText(text);
        this.getStore().reload();
	},
	filterCondition:function(){
    	var _filterData = this.filters.getFilterData();
    	var comparisons = {'gt':'大于','lt':'小于','eq':'等于'};
    	var cm = this.getColumnModel();
    	var _s = "";
    	var v ;
    	Ext.each(_filterData,function(obj){
    		var cson = obj.data.comparison ? comparisons[obj.data.comparison] : '';
    		if(obj.data.type=='list'){
    			v = cson+obj.data.text;
    		}else{
    			v = cson+obj.data.value;
    		}
    		_s += cm.getColumnHeader(cm.findColumnIndex(obj.field))+":"+v+"<br/>";
    	});
        Ext.Msg.alert('过滤条件',_s);
	},
	clearfilter:function(){
    	var filterPlugin = this.filters;
        filterPlugin.clearFilters();
        if(!filterPlugin.autoReload)
        	filterPlugin.deferredUpdate.delay(filterPlugin.updateBuffer);
	},
	_doFilter:function(){
   		var filterPlugin = this.filters;
		filterPlugin.deferredUpdate.delay(filterPlugin.updateBuffer);
	}
});


Ext.sunyard.grid.CustActionColumn = Ext.extend(Ext.grid.Column, {
	actionRe : /x-custaction-col/,
    processEvent : function(name, e, grid, rowIndex, colIndex){
    	var el = e.getTarget();
		var m = el.className.match(this.actionRe), fn;
		if (m) {
			if (name == 'click') {
				var r = [grid,rowIndex,colIndex];
				r = m.slice(1) ? r.concat(m.slice(1)) : r;
				r = r.concat([el,e]);
				(fn = this.handler)
						&& fn.apply(this.scope || this, r);
			}
		}
        return Ext.sunyard.grid.CustActionColumn.superclass.processEvent.apply(this, arguments);
    }
});
Ext.sunyard.grid.ProgressColumn = Ext.extend(Ext.grid.Column,{
	topText: null,
	bottomText: null,
	ceiling : 100,
	colored : true,
	invertedColor : false,
	textPst : '%',
	cls: 'x-list-progresscol',
	getStyle: function(v){
	    var style = '';
	    if (this.colored == true) {
	      if(this.invertedColor == true) {
	        if (v > (this.ceiling * 0.66)) style = '-red';
	        if (v < (this.ceiling * 0.67) && v > (this.ceiling * 0.33)) style = '-orange';
	        if (v < (this.ceiling * 0.34)) style = '-green';
	      } else {
	        if (v <= this.ceiling && v > (this.ceiling * 0.66)) style = '-green';
	        if (v < (this.ceiling * 0.67) && v > (this.ceiling * 0.33)) style = '-orange';
	        if (v < (this.ceiling * 0.34)) style = '-red';
	      }
	    }
	    return style;
  	},  
	getTopText: function(v) {
		if(this.topText) {
		  return String.format('<div class="x-progress-toptext">{0}</div>', this.topText);
		}
		return '';
	},
	getBottomText: function(v) {
	    if(this.bottomText) {
	      return String.format('<div class="x-progress-bottomtext">{0}</div>', this.bottomText);
	    }
	    return '';
  	},
	getText: function(v) {
		var textClass = (v < (this.ceiling / 1.818)) ? 'x-progress-text-back' : 'x-progress-text-front' + (Ext.isIE ? '-ie' : '');    
		var text = String.format('</div><div class="x-progress-text {0}" ext:qtip="{1}" >{1}</div></div>',
		  textClass, 
		  v + this.textPst
		);       
		return (v < (this.ceiling / 1.031)) ? text.substring(0, text.length - 6) : text.substr(6);    
	},
	constructor: function(cfg){
        Ext.sunyard.grid.ProgressColumn.superclass.constructor.call(this, cfg);
        this.renderer = function(v){
        	return String.format(
		      '{0}<div class="x-progress-wrap' + (Ext.isIE ? ' x-progress-wrap-ie">' : '">') +
		        '<!-- --><div class="x-progress-inner">' +
		          '<div class="x-progress-bar x-progress-bar{1}" style="width:{2}%;" >{3}' +
		        '</div>' +
		      '</div>{4}',
		      this.getTopText(v),
		      this.getStyle(v), 
		      (v / this.ceiling) * 100,
		      this.getText(v),
		      this.getBottomText(v)
		    );
        };
    }
});
Ext.reg('sunyardform',Ext.sunyard.FormPanel);
Ext.reg('commongrid',Ext.sunyard.grid.CommonGrid);
Ext.reg('crudgrid',Ext.sunyard.grid.CRUDGrid);
Ext.reg("s_editorgrid",Ext.sunyard.grid.EditorGrid);
Ext.grid.Column.types['custactioncolumn'] = Ext.sunyard.grid.CustActionColumn;
Ext.grid.Column.types['progresscolumn'] = Ext.sunyard.grid.ProgressColumn;