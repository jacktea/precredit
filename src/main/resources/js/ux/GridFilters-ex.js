Ext.override(Ext.ux.menu.ListMenu,{
    loadingText : '加载中...',
    checkChange : function (item, checked) {
        var value = [];
        var text = [];
        this.items.each(function(item){
            if (item.checked) {
                value.push(item.itemId);
                text.push(item.text);
            }
        },this);
        this.selected = value;
        this.selectedText = text;
        this.fireEvent('checkchange', item, checked);
    },
    getSelectedText : function () {
    	this.selectedText = [];
        this.items.each(function(item){
            if (item.checked) {
                this.selectedText.push(item.text);
            }
        },this);
        return this.selectedText;
    }
});
Ext.override(Ext.ux.grid.filter.ListFilter,{
	phpMode : true,
	getSerialArgs : function () {
        var args = {type: 'list', value: this.phpMode ? this.getValue().join(',') : this.getValue(),dataType:this.dataType,dataField:this.dataField};
        args['text'] = this.phpMode ? this.getValueText().join(';') : this.getValueText();
        return args;
    },
    validateRecord : function (record) {
        return (this.getValue().indexOf(record.get(this.dataIndex)) > -1) || (this.getValue().indexOf(record.get(this.dataField)) > -1);
    },
    getValueText : function () {
        return this.menu.getSelectedText();
    },
	init : function(config) {
		this.dt = new Ext.util.DelayedTask(this.fireUpdate, this);
		if (this.menu) {
			this.menu.destroy()
		}
		if(config.dataUrl){
			Ext.Ajax.request({
				url:config.dataUrl,
				success:function(response,options){
					var result = Ext.decode(response.responseText);
					result = result.results;
					var  o = [];
					if(result){
						for(var i = 0 ; i < result.length ; i++){
							o.push([result[i].value,result[i].text]);
						}
						config.options = o;
					}
					this.menu = new Ext.ux.menu.ListMenu(config);
					this.menu.on('checkchange', this.onCheckChange, this)
				},
				params:config.baseParams,
				scope:this
			});	
		}else{
			this.menu = new Ext.ux.menu.ListMenu(config);
			this.menu.on('checkchange', this.onCheckChange, this)
		}
	}
});