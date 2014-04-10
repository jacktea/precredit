Ext.ns('Ext.sunyard.data','Ext.sunyard.data.PagingMemoryProxy');
Ext.sunyard.data.PagingMemoryProxy = Ext.extend(Ext.data.MemoryProxy,{
	constructor : function(config){
		config = config || {};
        Ext.sunyard.data.PagingMemoryProxy.superclass.constructor.call(this);
        this.data = config.data;
        this.url = config.dataUrl||config.url;
        var actions = Ext.data.Api.actions;
	    this.activeRequest = {};
	    for (var verb in actions) {
	        this.activeRequest[actions[verb]] = undefined;
	    }
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
        return Ext.sunyard.data.PagingMemoryProxy[type.substr(0, 1).toUpperCase() + type.substr(1) + 'Filter'];
    },
    doRequest : function(action, rs, params, reader, callback, scope, options){
    	if(this.data||this.responseData){
    		this.doRequestLocal(action, rs, params, reader, callback, scope, options);
    	}else{
    		this.doRequestRemote(action, rs, params, reader, callback, scope, options);
    	}
    },
    doRequestLocal:function(action, rs, params, reader, callback, scope, options){
    	params = params ||{};
        var result;
        try {
        	if(this.data){
        		result = reader.readRecords(this.data);
        		this.totalResult = reader.readRecords(this.data);
        	}else if(this.responseData){
        		var json = this.responseData.responseText;
                var o = Ext.decode(json);
                if(!o) {
                    throw {message: 'JsonReader.read: Json object not found'};
                }
                this.data = o;
        		//result = reader.read(this.responseData);
        		//this.totalResult = reader.read(this.responseData);
        		result = reader.readRecords(this.data);
        		this.totalResult = reader.readRecords(this.data);
        		if (result.success === false) {
        			delete this.responseData;
		            this.fireEvent('loadexception', this, options, this.responseData);
		            var res = reader.readResponse(action, this.responseData);
		            this.fireEvent('exception', this, 'remote', action, options, res, null);
		        }else {		        	
		            //this.fireEvent('load', this, o, options);
		        }
        	}
        } 
        catch (e) {
            this.fireEvent('loadexception', this, options, null, e);
            callback.call(scope, null, options, false);
            if(this.responseData) delete this.responseData;
            return;
        }
        // filtering
        if (params.filter !== undefined) {
        	var filters = [];
        	var arr = Ext.decode(params.filter);
        	for(var i = 0 ; i < arr.length ; i++){
        		var cls = this.getFilterClass(arr[i].type);
        		if(cls)
        		filters.push(new cls(arr[i]));
        	}
        	var tmp = [];
        	Ext.each(result.records,function(el){
        		var flag = true;
            	for(var i = 0 ; i < filters.length ; i++){
            		flag = flag && filters[i].validateRecord(el);
            		if(!flag) break;
            	}
            	if(flag)
            		tmp.push(el);
        	});
        	result.records = tmp;
        	tmp = null;
            /*result.records = result.records.filter(function(el){
            	var flag = true;
            	for(var i = 0 ; i < filters.length ; i++){
            		return flag && filters[i].validateRecord(el);
            	}
                if (typeof(el) == 'object') {
                    var att = params.filterCol || 0;
                    return String(el.data[att]).match(params.filter) ? true : false;
                }
                else {
                    return String(el).match(params.filter) ? true : false;
                }
            });*/
            result.totalRecords = result.records.length;
        }
        
        var sort = params.sort || this.data.metaData.sortInfo.field;
        var dir = params.dir || this.data.metaData.sortInfo.direction;
        // sorting
        if (sort !== undefined) {
        	this.data.metaData.sortInfo.field = sort;
        	this.data.metaData.sortInfo.direction = dir;
            // use integer as params.sort to specify column, since arrays are not named
            // params.sort=0; would also match a array without columns
            var dir = String(dir).toUpperCase() == 'DESC' ? -1 : 1;
            var fn = function(v1, v2){
                return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
            };
            result.records.sort(function(a, b){
                var v = 0;
                if (typeof(a) == 'object') {
                    v = fn(a.data[params.sort], b.data[params.sort]) * dir;
                }
                else {
                    v = fn(a, b) * dir;
                }
                if (v == 0) {
                    v = (a.index < b.index ? -1 : 1);
                }
                return v;
            });
        }
        
        // paging (use undefined cause start can also be 0 (thus false))
        if (params.start !== undefined && params.limit !== undefined) {
            result.records = result.records.slice(params.start, params.start + params.limit);
        }
        callback.call(scope, result, options, true);
    },
    doRequestRemote:function(action, rs, params, reader, cb, scope, arg){
    	params = params || {};
    	 var  o = {
            method: (this.api[action]) ? this.api[action]['method'] : undefined,
            url:this.url,
            request: {
                callback : cb,
                scope : scope,
                params : params,
                arg : arg
            },
            reader: reader,
            callback : this.createCallback(action, rs),
            scope: this
        };
        if (params.jsonData) {
            o.jsonData = params.jsonData;
        } else if (params.xmlData) {
            o.xmlData = params.xmlData;
        } else {
        	o.params = Ext.apply({},params);
        }
        delete o.params.start;
        delete o.params.limit;
        this.activeRequest[action] = Ext.Ajax.request(o);
    },
    createCallback : function(action, rs) {
        return function(o, success, response) {
            this.activeRequest[action] = undefined;
            if (!success) {
                if (action === Ext.data.Api.actions.read) {
                    this.fireEvent('loadexception', this, o, response);
                }
                this.fireEvent('exception', this, 'response', action, o, response);
                o.request.callback.call(o.request.scope, null, o.request.arg, false);
                return;
            }
            if (action === Ext.data.Api.actions.read) {
                this.onRead(action, o, response);
            }
        };
    },
    onRead : function(action, o, response) {
    	this.responseData = response;
    	this.doRequestLocal(action, null, o.request.params, o.reader, o.request.callback, o.request.scope, o.request.arg);
    },
    destroy: function(){
        if(this.activeRequest){
            var actions = Ext.data.Api.actions;
            for (var verb in actions) {
                if(this.activeRequest[actions[verb]]){
                    Ext.Ajax.abort(this.activeRequest[actions[verb]]);
                }
            }
        }
        Ext.sunyard.data.PagingMemoryProxy.superclass.destroy.call(this);
    }
});

Ext.sunyard.data.PagingMemoryProxy.Filter = Ext.extend(Ext.util.Observable,{
	constructor:function(config){
		this.dataIndex = config.field;
		Ext.apply(this, config); 
		Ext.sunyard.data.PagingMemoryProxy.Filter.superclass.constructor.call(this,config);
		this.init(config);
	},
	init:Ext.emptyFn,
    validateRecord : function(){
    	return true;
    }
});
Ext.sunyard.data.PagingMemoryProxy.StringFilter = Ext.extend(Ext.sunyard.data.PagingMemoryProxy.Filter,{
	init:function(config){
		this.dataIndex = config.field;
		this.value = config.value;
	},
	validateRecord : function (record) {
        var val = record.get(this.dataIndex);
        if(typeof val != 'string') {
            return (this.value.length === 0);
        }
        return val.toLowerCase().indexOf(this.value.toLowerCase()) > -1;
    }
});
Ext.sunyard.data.PagingMemoryProxy.NumericFilter = Ext.extend(Ext.sunyard.data.PagingMemoryProxy.Filter,{
    validateRecord : function (record) {
        var val = record.get(this.dataIndex);
        if (this.comparison === 'eq' && val != this.value) {
            return false;
        }
        if (this.comparison === 'lt' && val >= this.value) {
            return false;
        }
        if (this.comparison === 'gt' && val <= this.value) {
            return false;
        }
        return true;
    }
});
Ext.sunyard.data.PagingMemoryProxy.DateFilter = Ext.extend(Ext.sunyard.data.PagingMemoryProxy.NumericFilter,{});
Ext.sunyard.data.PagingMemoryProxy.ListFilter = Ext.extend(Ext.sunyard.data.PagingMemoryProxy.Filter,{
	validateRecord : function (record) {
        var val = record.get(this.dataIndex);
        return val == this.value;
    }
});
