Ext.data.JsonReaderEx = Ext.extend(Ext.data.JsonReader,Ext.applyIf({
	constructor:function(meta, recordType){
		var me = this, e = me.events;
	    if(me.listeners){
	        me.on(me.listeners);
	        delete me.listeners;
	    }
	    me.events = e || {};	    
		meta = meta || {};
	    this.tj = meta.tj;
	    Ext.data.JsonReaderEx.superclass.constructor.call(this, meta, recordType || meta.fields);
	    this.addEvents('readData');
	},
	read : function(response){
        var json = response.responseText;
        var o = Ext.decode(json);
        if(!o) {
            throw {message: 'JsonReader.read: Json object not found'};
        }
        return this.readRecords(o);
    },
	readRecords : function(o){
		this.fireEvent('readData',o);
        this.jsonData = o;
        if(o.metaData){
        	this.tj = o.metaData.tj;
            this.onMetaChange(o.metaData);
            Ext.each(o.metaData.fields,function(item){
            	for(var k in item){
            		if(Ext.isEmpty(item[k]))
            			delete item[k];
            	}
            });
        }
        var s = this.meta, Record = this.recordType,
            f = Record.prototype.fields, fi = f.items, fl = f.length, v;

        var root = this.getRoot(o), c = root.length, totalRecords = c, success = true;
        if(s.totalProperty){
            v = parseInt(this.getTotal(o), 10);
            if(!isNaN(v)){
                totalRecords = v;
            }
        }
        if(s.successProperty){
            v = this.getSuccess(o);
            if(v === false || v === 'false'){
                success = false;
            }
        }
        return {
            success : success,
            records : this.extractData(root, true), // <-- true to return [Ext.data.Record]
            totalRecords : totalRecords
        };
    }
},Ext.util.Observable.prototype));