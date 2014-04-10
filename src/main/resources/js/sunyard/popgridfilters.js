Ext.ns("Ext.ux.sunyard.filter");
Ext.ux.sunyard.filter.GridFilters = Ext.extend(Ext.util.Observable, {
	encode : true,
	paramPrefix : 'filter',
	width:400,
	height:300,
	constructor : function (config) {
        config = config || {};
        this.filters = new Ext.util.MixedCollection();
        this.filters.getKey = function (o) {
            return o ? o.dataIndex : null;
        };
        this.addFilters(config.filters);
        delete config.filters;
        Ext.apply(this, config);
    },
	init:function(grid){
		if (grid instanceof Ext.grid.GridPanel) {
            this.grid = grid;
            this.bindStore(this.grid.getStore(), true);
            // assumes no filters were passed in the constructor, so try and use ones from the colModel
            if(this.filters.getCount() == 0){
                this.addFilters(this.grid.getColumnModel());
            }
            this.grid.filters = this;

            this.grid.addEvents({'filterupdate': true});

            grid.on({
                scope: this,
                beforestaterestore: this.applyState,
                beforestatesave: this.saveState,
                beforedestroy: this.destroy,
                reconfigure: this.onReconfigure
            });

            if (grid.rendered){
                this.onRender();
            } else {
                grid.on({
                    scope: this,
//                    single: true,
                    render: this.onRender,
                    hide:this.hideQueryWin
                });
            }
            var cfg = {
	            text : '查询',
	            tooltip : '查询',
	            iconCls : 'showQueryWin',
	            handler : this.showQueryWin,
	            scope : this
		    };
            var tbar = grid.getTopToolbar(); 
	    	if(tbar){
	    		tbar.add(cfg);
	    	}else{
	    		grid.elements += ',tbar';
	            grid.topToolbar = grid.createToolbar([cfg]);	    	
		    }
        } else if (grid instanceof Ext.PagingToolbar) {
            this.toolbar = grid;
        }
	},
	applyState : function (grid, state) {
        var key, filter;
        this.applyingState = true;
        this.clearFilters();
        if (state.filters) {
            for (key in state.filters) {
                filter = this.filters.get(key);
                if (filter) {
                    filter.setValue(state.filters[key]);
                    filter.setActive(true);
                }
            }
        }
//        this.deferredUpdate.cancel();
        if (this.local) {
            this.reload();
        }
        delete this.applyingState;
        delete state.filters;
    },
    saveState : function (grid, state) {
        var filters = {};
        this.filters.each(function (filter) {
            if (filter.active) {
                filters[filter.dataIndex] = filter.getValue();
            }
        });
        return (state.filters = filters);
    },
    reload : function () {
        if (this.local) {
            this.grid.store.clearFilter(true);
            this.grid.store.filterBy(this.getRecordFilter());
        } else {
            var start,
                store = this.grid.store;
//                store.lastOptions.params[start] = 0;
//            this.deferredUpdate.cancel();
//            if (this.toolbar) {
              start = store.paramNames.start;
              if (store.lastOptions && store.lastOptions.params && store.lastOptions.params[start]) {
                  store.lastOptions.params[start] = 0;
              }
//            }
            store.reload();
        }
    },
    clearFilters : function () {
        this.filters.each(function (filter) {
            filter.setActive(false);
        });
    },
    getFilter : function (dataIndex) {
        return this.filters.get(dataIndex);
    },
	bindStore : function(store, initial){
        if(!initial && this.store){
            if (this.local) {
                store.un('load', this.onLoad, this);
            } else {
                store.un('beforeload', this.onBeforeLoad, this);
            }
        }
        if(store){
            if (this.local) {
                store.on('load', this.onLoad, this);
            } else {
                store.on('beforeload', this.onBeforeLoad, this);
            }
        }
        this.store = store;
    },
    onBeforeLoad : function (store, options) {
        options.params = options.params || {};
        this.cleanParams(options.params);        
        var params = this.buildQuery(this.getFilterData());
        Ext.apply(options.params, params);
    },
    onLoad : function (store, options) {
        store.filterBy(this.getRecordFilter());
//        this.win.collapse();
    },
    buildQuery : function (filters) {
        var p = {}, i, f, root, dataPrefix, key, tmp,
            len = filters.length;

        if (!this.encode){
            for (i = 0; i < len; i++) {
                f = filters[i];
                root = [this.paramPrefix, '[', i, ']'].join('');
                p[root + '[field]'] = f.field;

                dataPrefix = root + '[data]';
                for (key in f.data) {
                    p[[dataPrefix, '[', key, ']'].join('')] = f.data[key];
                }
            }
        } else {
            tmp = [];
            for (i = 0; i < len; i++) {
                f = filters[i];
                tmp.push(Ext.apply(
                    {},
                    {field: f.field},
                    f.data
                ));
            }
            // only build if there is active filter
            if (tmp.length > 0){
                p[this.paramPrefix] = Ext.util.JSON.encode(tmp);
            }
        }
        return p;
    },
    cleanParams : function (p) {
        // if encoding just delete the property
        if (this.encode) {
            delete p[this.paramPrefix];
        // otherwise scrub the object of filter data
        } else {
            var regex, key;
            regex = new RegExp('^' + this.paramPrefix + '\[[0-9]+\]');
            for (key in p) {
                if (regex.test(key)) {
                    delete p[key];
                }
            }
        }
    },
    getFilterData : function () {
        var filters = [], i, len;
        this.filters.each(function (f) {
            if (f.active) {
                var d = [].concat(f.serialize());
                for (i = 0, len = d.length; i < len; i++) {
                    filters.push({
                        field: f.dataIndex,
                        data: d[i]
                    });
                }
            }
        });
        return filters;
    },
    getRecordFilter : function () {
        var f = [], len, i;
        this.filters.each(function (filter) {
            if (filter.active) {
                f.push(filter);
            }
        });
        len = f.length;
        return function (record) {
            for (i = 0; i < len; i++) {
                if (!f[i].validateRecord(record)) {
                    return false;
                }
            }
            return true;
        };
    },
    onReconfigure : function () {
        this.bindStore(this.grid.getStore());
        this.store.clearFilter();
        this.removeAll();
        this.addFilters(this.grid.getColumnModel());
        
//        this.updateColumnHeadings();
    },
    removeAll : function () {
        if(this.filters){
            Ext.destroy.apply(Ext, this.filters.items);
            // remove all items from the collection
            this.filters.clear();
        }
    },
    getQueryWin:function(){
    	if(!this.form){
    		this.form = Ext.create({
				xtype:'form',
				autoScroll:true,
				frame:true,
		        bodyStyle: 'padding:2px;',
		        labelWidth:75,
		        border:false,
	       		defaults:{anchor:'95%'},
	       		items:[]
			});
    	}
    	if(!this.win){
    		this.win = Ext.create({
				xtype:'window',
				title:'查询条件',
				renderTo:this.grid.container,
				draggable :false,
				closeAction:'hide',
				collapsible:true,
				layout:'fit',
				items:this.form,
				bodyStyle: 'padding:1px;overflow-x:hidden;',
				width:this.width,
				height:this.height,
				buttons:[{
					text:'确定',
					handler:this.onSubmit,
					scope:this
				},{
					text:'重置',
					handler:this.onReset,
					scope:this
				}]
			});
			this.createForm();
    	}
    	var w = this.grid.getWidth()/2;
        w = w > this.width ? this.width : w;
    	var h = this.grid.getHeight()/2;
    	h = h > this.height ? this.height : h;
    	var p = this.grid.getPosition();
    	this.win.setSize(w,h);    	
    	this.win.setPagePosition(p[0]+((this.grid.getWidth())-w)/2,p[1]);
//    	this.win.show();
//    	this.form.doLayout();
    	return this.win;
    },
    onSubmit:function(){
    	this.grid.resetOptimize();
    	if(this.form.getForm().isValid()){ 
    		this.reload();
    		this.win.collapse();
    	}
    },
    onReset:function(){
    	this.form.getForm().reset();
    	this.filters.each(function (f) {
    		f.fireUpdate();
        });
    },
    showQueryWin:function(){
    	this.getQueryWin().show();
    },
    hideQueryWin:function(){
    	this.getQueryWin().hide();
    },
    onRender : function () {
    },
    destroy : function () {
    	this.removeAll();
        this.purgeListeners();
    	if(this.win){
    		this.win.destroy();
    		delete this.win;
    		delete this.form;
    	}
    },
    createForm:function(){
    	this.form.removeAll();
    	this.filters.each(function(item){
    		this.add(item.content);
    	},this.form);
    	this.form.doLayout();
    },
    addFilters : function (filters) {
        if (filters) {
            var i, len, filter, cm = false, dI;
            if (filters instanceof Ext.grid.ColumnModel) {
                filters = filters.config;
                cm = true;
            }
            for (i = 0, len = filters.length; i < len; i++) {
                filter = false;
                if (cm) {
                    dI = filters[i].dataIndex;
                    filter = filters[i].filter || filters[i].filterable;
                    if (filter){
                        filter = (filter === true) ? {} : filter;
                        Ext.apply(filter, {dataIndex:dI,header:filters[i].header});
                        // filter type is specified in order of preference:
                        //     filter type specified in config
                        //     type specified in store's field's type config
                        filter.type = filter.type || this.store.fields.get(dI).type.type;
                    }
                } else {
                    filter = filters[i];
                }
                // if filter config found add filter for the column
                if (filter) {
                    this.addFilter(filter);
                }
            }
//            this.createwin();
        }
    },
    addFilter : function (config) {
        var Cls = this.getFilterClass(config.type),
            filter = new Cls(config);
        this.filters.add(filter);

        Ext.util.Observable.capture(filter, this.onStateChange, this);
        return filter;
    },
    getFilterClass : function (type) {
        switch(type) {
            case 'auto':
              type = 'string';
              break;
            case 'int':
            case 'float':
              type = 'numeric';
              break;
            case 'bool':
              type = 'boolean';
              break;
        }
        return Ext.ux.sunyard.filter[type.substr(0, 1).toUpperCase() + type.substr(1) + 'Filter'];
    }
});
Ext.ux.sunyard.filter.Filter = Ext.extend(Ext.util.Observable, {
	active : false,
	dataIndex : null,
	content:null,
	updateBuffer : 500,
	constructor : function (config) {
        Ext.apply(this, config);            
        this.addEvents(
            'activate',
            'deactivate',
            'serialize',
            'update'
        );
        Ext.ux.sunyard.filter.Filter.superclass.constructor.call(this,config);
//        this.content = new Ext.menu.Menu();
        this.init(config);
        if(config && config.value){
            this.setValue(config.value);
            this.setActive(config.active !== false, true);
            delete config.value;
        }
    },
    destroy : function(){
        if (this.content){
            this.content.destroy();
        }
        this.purgeListeners();
    },
    init : Ext.emptyFn,
    getValue : Ext.emptyFn,
    setValue : Ext.emptyFn,
    isActivatable : function(){
        return true;
    },
    getSerialArgs : Ext.emptyFn,
    validateRecord : function(){
        return true;
    },
    serialize : function(){
        var args = this.getSerialArgs();
        this.fireEvent('serialize', args, this);
        return args;
    },
    fireUpdate : function(){
        if (this.active) {
            this.fireEvent('update', this);
        }
        this.setActive(this.isActivatable());
    },
    setActive : function(active, suppressEvent){
        if(this.active != active){
            this.active = active;
            if (suppressEvent !== true) {
                this.fireEvent(active ? 'activate' : 'deactivate', this);
            }
        }
    } 
});
Ext.ux.sunyard.filter.StringFilter = Ext.extend(Ext.ux.sunyard.filter.Filter,{
	emptyText: '输入查询条件..',
    selectOnFocus: true,
    init : function (config) {
        Ext.applyIf(config, {
            enableKeyEvents: true,
            emptyText: this.emptyText,
    		selectOnFocus: this.selectOnFocus,
    		fieldLabel : this.header||this.dataIndex||this.renderfield,
            listeners: {
                scope: this,
                keyup: this.onInputKeyUp,
                change : this.onChange
            }
        });

        this.content = new Ext.form.TextField(config); 
        this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
    },
    getValue : function () {
        return this.content.getValue().toString();
    },
    setValue : function (value) {
        this.content.setValue(value);
        this.fireEvent('update', this);
    },
    isActivatable : function () {
        return this.getValue().length > 0;
    },
    getSerialArgs : function () {
        return {type: 'string', value: this.getValue()};
    },
    validateRecord : function (record) {
        var val = record.get(this.dataIndex);

        if(typeof val != 'string') {
            return (this.getValue().length === 0);
        }

        return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
    },
    onInputKeyUp : function (field, e) {
        var k = e.getKey();
        if (k == e.RETURN && field.isValid()) {
            e.stopEvent();
//            this.menu.hide(true);
            return;
        }
        this.updateTask.delay(this.updateBuffer);
    },
    onChange:function(){
     //this.updateTask.delay(this.updateBuffer); 
    	this.setActive(this.isActivatable());
    }
});
Ext.ux.sunyard.filter.NumericFilter = Ext.extend(Ext.ux.sunyard.filter.Filter,{
	init:function(config){
		this.name = this.dataIndex||this.renderfield;
		this.createContent(config); 
        this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
	},
	onChange:function(){
    	this.updateTask.delay(this.updateBuffer);	
    },
	createContent:function(config){
		var defaultCfg = Ext.apply({},{
			xtype:'numberfield',
			flex : 1,
			enableKeyEvents: true,
			listeners: {
                scope: this,
                keyup: this.onInputKeyUp,
                change : this.onChange
            }
		});
		this.content = new Ext.form.CompositeField({
			fieldLabel : this.header||this.dataIndex||this.renderfield,			
			items:[Ext.apply({
				name:'gt'+this.name,
				emptyText:'大于'
			},defaultCfg),Ext.apply({
				name:'lt'+this.name,
				emptyText:'小于'
			},defaultCfg),Ext.apply({
				name:'eq'+this.name,
				emptyText:'等于'
			},defaultCfg)]
		});
	},
	getValue:function(){
		var v = {};
		this.content.eachItem(function(item) {
			if(''!==item.getValue())
            	v[item.getName().substring(0,2)] = item.getValue();
        });
        return v;
	},
	setValue:function(v){
		v = (v || '');
		var value = v;
		if(Ext.isString(v)){
			v = v.split(',');
			value = {
				gt:(v.length>0 ? v[0] : ''),
				lt:(v.length>1 ? v[1] : ''),
				eq:(v.length>2 ? v[2] : '')
			};
		}		
		this.content.eachItem(function(field) {
			field.setValue(value[field.getName().substring(0,2)]);            
        });
	},
	isActivatable : function () {
       var values = this.getValue();
       for (key in values) {
            if (values[key] !== undefined) {
                return true;
            }
        }
        return false;
    },
    getSerialArgs : function () {
        var key,
            args = [],
            values = this.getValue();
        for (key in values) {
            args.push({
                type: 'numeric',
                comparison: key,
                value: values[key]
            });
        }
        return args;
    },
    validateRecord : function (record) {
        var val = record.get(this.dataIndex),
            values = this.getValue();
        if (values.eq !== undefined && val != values.eq) {
            return false;
        }
        if (values.lt !== undefined && val >= values.lt) {
            return false;
        }
        if (values.gt !== undefined && val <= values.gt) {
            return false;
        }
        return true;
    },
    onInputKeyUp : function (field, e) {
        var k = e.getKey();
        if (k == e.RETURN && field.isValid()) {
            e.stopEvent();
//            this.menu.hide(true);
            return;
        }
        this.updateTask.delay(this.updateBuffer);
    }
});
Ext.ux.sunyard.filter.DateFilter = Ext.extend(Ext.ux.sunyard.filter.NumericFilter,{
	dateFormat:'Ymd',
	onSelect:function(){
    	this.updateTask.delay(this.updateBuffer);	
    },
	createContent:function(config){
		var defaultCfg = Ext.apply({},{
			format:this.dateFormat,
			xtype:'s_datefield',
			enableKeyEvents: true,
			flex : 1,
			listeners: {
                scope: this,
                select : this.onSelect,
                keyup: this.onInputKeyUp
            }
		});
		this.content = new Ext.form.CompositeField({
			fieldLabel : this.header||this.dataIndex||this.renderfield,			
			items:[Ext.apply({
				name:'gt'+this.name,
				emptyText:'大于'
			},defaultCfg),Ext.apply({
				name:'lt'+this.name,
				emptyText:'小于'
			},defaultCfg),Ext.apply({
				name:'eq'+this.name,
				emptyText:'等于'
			},defaultCfg)]
		});
	},
	getSerialArgs : function () {
        var key,
            args = [],
            values = this.getValue();
        for (key in values) {
            args.push({
                type: 'date',
                comparison: key,
                value: values[key]
            });
        }
        return args;
    },
    getValue:function(){
		var v = {};
		this.content.eachItem(function(item) {
			if(''!==item.getRawValue()){
            	v[item.getName().substring(0,2)] = item.getRawValue();
			}
        });
        return v;
	}
});
Ext.ux.sunyard.filter.ListFilter = Ext.extend(Ext.ux.sunyard.filter.StringFilter,{
	phpMode:true,
	init : function (config) {
        Ext.applyIf(config, {
            enableKeyEvents: true,
            emptyText: this.emptyText,
    		selectOnFocus: this.selectOnFocus,
    		fieldLabel : this.header||this.dataIndex||this.renderfield,
            listeners: {
                scope: this,
                select: this.onSelect,
                change: this.onSelect,
                keyup: this.onInputKeyUp
            }
        });
        this.createContent(config);
        this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
    },
    onSelect:function(){
    	this.updateTask.delay(this.updateBuffer);	
    },
    getSerialArgs : function () {
        var args = {type: 'list', value: this.phpMode ? this.getValue() : this.getValue(),dataType:this.dataType,dataField:this.dataField};
        return args;
    },
    validateRecord : function (record) {
        var val = record.get(this.dataField || this.dataIndex);
		return val == this.getValue();
    },
    createContent:function(config){
    	if(config.options){
    		this.content = Ext.create(Ext.applyIf({ 	
				xtype:"combo",
			    store:new Ext.data.SimpleStore({ 
			    	fields: config.fields ? config.fields : ['value','text'], 
			    	data : config.options 
				}), 
			    displayField:'text', 
			    valueField:'value',
			    typeAhead: true, 
			    mode: 'local', 
				triggerAction: 'all', 
				selectOnFocus:true 
			},config));    		
    	}else{
    		config.dataUrl = config.dataUrl || config.url;
    		this.content = Ext.create(Ext.applyIf({
    			xtype:'s_combo'
    		},config));
    	}
    }
});
Ext.ux.sunyard.filter.TreeFilter = Ext.extend(Ext.ux.sunyard.filter.StringFilter,{
	phpMode:true,
	init : function (config) {
        Ext.applyIf(config, {
            emptyText: this.emptyText,
    		selectOnFocus: this.selectOnFocus,
    		fieldLabel : this.header||this.dataIndex||this.renderfield,
            listeners: {
                scope: this,
                select: this.onSelect,
                change: this.onSelect
            }
        });
        this.createContent(config);
        this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
    },
    onSelect:function(){
    	this.updateTask.delay(this.updateBuffer);	
    },
    getSerialArgs : function () {
        var args = {type: 'list', value: this.phpMode ? this.getValue() : this.getValue(),dataType:this.dataType,dataField:this.dataField};
        return args;
    },
    validateRecord : function (record) {
        var val = record.get(this.dataField || this.dataIndex);
		return val == this.getValue();
    },
    createContent:function(config){
    	this.content = Ext.create(Ext.applyIf({ 	
			xtype:"s_combotree",
			hiddenName:Ext.id()
		},config));
    }
});