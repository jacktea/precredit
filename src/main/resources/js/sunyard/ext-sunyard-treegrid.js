Ext.override(Ext.ux.tree.TreeGridSorter,{
	sortAscText : '升序',
	sortDescText : '降序'
});
Ext.override(Ext.ux.tree.TreeGrid,{
	columnsText : '列'
});
Ext.override(Ext.ux.tree.TreeGridNodeUI,{
	renderElements : function(n, a, targetNode, bulkRender){
        var t = n.getOwnerTree(),
	    cb = Ext.isBoolean(a.checked),
            cols = t.columns,
            c = cols[0],
            i, buf, len;

        this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

        buf = [
             '<tbody class="x-tree-node">',
                '<tr ext:tree-node-id="', n.id ,'" class="x-tree-node-el x-tree-node-leaf ', a.cls, '">',
                    '<td ext:treegrid-col-index="',0,'" class="x-treegrid-col">',
                        '<span class="x-tree-node-indent">', this.indentMarkup, "</span>",
                        '<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow" />',
                        '<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon', (a.icon ? " x-tree-node-inline-icon" : ""), (a.iconCls ? " "+a.iconCls : ""), '" unselectable="on" />',
			cb ? ('<input class="x-tree-node-cb" type="checkbox" ' + (a.checked ? 'checked="checked" />' : '/>')) : '',
                        '<a hidefocus="on" class="x-tree-node-anchor" href="', a.href ? a.href : '#', '" tabIndex="1" ',
                            a.hrefTarget ? ' target="'+a.hrefTarget+'"' : '', '>',
                        '<span unselectable="on">', (c.tpl ? c.tpl.apply(a) : a[c.dataIndex] || c.text), '</span></a>',
                    '</td>'
        ];

        for(i = 1, len = cols.length; i < len; i++){
            c = cols[i];
            buf.push(
                    '<td ext:treegrid-col-index="',i,'" class="x-treegrid-col ', (c.cls ? c.cls : ''), '">',
                        '<div unselectable="on" class="x-treegrid-text"', (c.align ? ' style="text-align: ' + c.align + ';"' : ''), '>',
                            c.renderer ? c.renderer.call(c.scope,a[c.dataIndex],a) : a[c.dataIndex], //(c.tpl ? c.tpl.apply(a) : a[c.dataIndex]),
                        '</div>',
                    '</td>'
            );
        }

        buf.push(
            '</tr><tr class="x-tree-node-ct"><td colspan="', cols.length, '">',
            '<table class="x-treegrid-node-ct-table" cellpadding="0" cellspacing="0" style="table-layout: fixed; display: none; width: ', t.innerCt.getWidth() ,'px;"><colgroup>'
        );
        for(i = 0, len = cols.length; i<len; i++) {
            buf.push('<col style="width: ', (cols[i].hidden ? 0 : cols[i].width) ,'px;" />');
        }
        buf.push('</colgroup></table></td></tr></tbody>');

        if(bulkRender !== true && n.nextSibling && n.nextSibling.ui.getEl()){
            this.wrap = Ext.DomHelper.insertHtml("beforeBegin", n.nextSibling.ui.getEl(), buf.join(''));
        }else{
            this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf.join(''));
        }

        this.elNode = this.wrap.childNodes[0];
        this.ctNode = this.wrap.childNodes[1].firstChild.firstChild;
        var cs = this.elNode.firstChild.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        this.iconNode = cs[2];
        var index = 3;
        if(cb){
            this.checkbox = cs[3];
            // fix for IE6
            this.checkbox.defaultChecked = this.checkbox.checked;
            index++;
        }
        this.anchor = cs[index];
        this.textNode = cs[index].firstChild;
    },
    setCheck:function(checked){
    	if(this.checkbox){
    		this.checkbox.checked = checked;
    		this.checkbox.defaultChecked = checked;// fix for IE6
    		this.node.attributes.checked = checked;
    	}
    },
    setAttr:function(name,value){
    	this.node.attributes[name] = value;
    	var cols = this.node.getOwnerTree().columns,a = this.node.attributes;
    	var index;
    	var c;
    	for(var i=1 ;i < cols.length ; i++){
    		var c = cols[i];
    		if(c['dataIndex'] == name){
    			index = i;
    			break;
    		}
    	}
    	if(this.rendered){
    		if(index){
    			var dom = this.elNode.childNodes[index].firstChild;
    			dom.innerHTML = (c.renderer ? c.renderer.call(c.scope,a[c.dataIndex],a) : a[c.dataIndex]);
    		}
    	}
    }
});
Ext.override(Ext.tree.TreeEventModel,{
	delegateClick : function(e, t){
        if(this.beforeEvent(e)){
        	if(e.getTarget('.ui-icon', 1)){
            	this.onCheckboxClick(e, this.getNode(e));
            }else if(e.getTarget('input[type=checkbox]', 1)){
                this.onCheckboxClick(e, this.getNode(e));
            }else if(e.getTarget('.x-tree-ec-icon', 1)){
                this.onIconClick(e, this.getNode(e));
            }else if(e.getTarget('.x-treegrid-col', 5)){
            	var colIndex = Ext.fly(e.getTarget('.x-treegrid-col', 5)).getAttribute('treegrid-col-index', 'ext');
            	this.onColumnClick(e,colIndex,this.getNode(e));
            }else if(this.getNodeTarget(e)){
                this.onNodeClick(e, this.getNode(e));
            }
        }else{
            this.checkContainerEvent(e, 'click');
        }
    },
    onColumnClick:function(e,colIndex,node){
    	var tree = node.getOwnerTree();
    	var cols = tree.columns;
    	var c = cols[colIndex];
    	var data = node.attributes;
    	var dataIndex = cols[colIndex].dataIndex;
    	var v = data[dataIndex];
    	c.processEvent('click',e,tree,node,colIndex,v);
    },
    onNodeClick : function(e, node){
        node.ui.onClick(e);
    },
    getNodeTarget : function(e){
        var t = e.getTarget('.x-tree-node-icon', 1);
        if(!t){
            t = e.getTarget('.x-tree-node-el', 6);
        }
        return t;
    }
});

Ext.tree.Column = Ext.extend(Ext.grid.Column,{
	init : function() {    
        var types = Ext.data.Types,
            st = this.sortType;
                
        if(this.type){
            if(Ext.isString(this.type)){
                this.type = Ext.data.Types[this.type.toUpperCase()] || types.AUTO;
            }
        }else{
            this.type = types.AUTO;
        }
        if(Ext.isString(st)){
            this.sortType = Ext.data.SortTypes[st];
        }else if(Ext.isEmpty(st)){
            this.sortType = this.type.sortType;
        }
    },
    processEvent : function(name, e, tree, node, colIndex,value){
        return this.fireEvent(name, tree,node,this, colIndex,value, e);
    }
});
Ext.tree.BooleanColumn = Ext.extend(Ext.tree.Column, {
    trueText: '是',
    falseText: '否',
    undefinedText: '&#160;',
    constructor: function(cfg){
        Ext.tree.BooleanColumn.superclass.constructor.call(this, cfg);
        var t = this.trueText, f = this.falseText, u = this.undefinedText;
        this.renderer = function(v){
            if(v === undefined){
                return u;
            }
            if(!v || v === 'false'){
                return f;
            }
            return t;
        };
    }
});
Ext.tree.NumberColumn = Ext.extend(Ext.tree.Column, {
    format : '0,000.00',
    constructor: function(cfg){
        Ext.tree.NumberColumn.superclass.constructor.call(this, cfg);
        this.renderer = Ext.util.Format.numberRenderer(this.format);
    }
});
Ext.tree.DateColumn = Ext.extend(Ext.tree.Column, {
    format : 'm/d/Y',
    constructor: function(cfg){
        Ext.tree.DateColumn.superclass.constructor.call(this, cfg);
        this.renderer = Ext.util.Format.dateRenderer(this.format);
    }
});
Ext.tree.TemplateColumn = Ext.extend(Ext.tree.Column, {
    constructor: function(cfg){
        Ext.tree.TemplateColumn.superclass.constructor.call(this, cfg);
        var tpl = (!Ext.isPrimitive(this.tpl) && this.tpl.compile) ? this.tpl : new Ext.XTemplate(this.tpl);
        this.renderer = function(value, data){
            return tpl.apply(data);
        };
        this.tpl = tpl;
    }
});
Ext.tree.ActionColumn = Ext.extend(Ext.tree.Column, {
    header: '&#160;',
    actionIdRe: /x-action-col-(\d+)/,
    altText: '',
    constructor: function(cfg) {
        var me = this,
            items = cfg.items || (me.items = [me]),
            l = items.length,
            i,
            item;

        Ext.tree.ActionColumn.superclass.constructor.call(me, cfg);
        me.renderer = function(v, data) {
            v = Ext.isFunction(cfg.renderer) ? cfg.renderer.apply(this, arguments)||'' : '';

            //meta.css += ' x-action-col-cell';
            for (i = 0; i < l; i++) {
                item = items[i];
                v += '<img alt="' + me.altText + '" src="' + (item.icon || Ext.BLANK_IMAGE_URL) +
                    '" class="x-action-col-icon x-action-col-' + String(i) + ' ' + (item.iconCls || '') +
                    ' ' + (Ext.isFunction(item.getClass) ? item.getClass.apply(item.scope||this.scope||this, arguments) : '') + '"' +
                    ((item.tooltip) ? ' ext:qtip="' + item.tooltip + '"' : '') + ' />';
            }
            return v;
        };
    },

    destroy: function() {
        delete this.items;
        delete this.renderer;
        return Ext.tree.ActionColumn.superclass.destroy.apply(this, arguments);
    },
    processEvent : function(name, e, tree, node, colIndex,value){
        var m = e.getTarget().className.match(this.actionIdRe),
            item, fn;
        if (m && (item = this.items[parseInt(m[1], 10)])) {
            if (name == 'click') {
                (fn = item.handler || this.handler) && fn.call(item.scope||this.scope||this, tree,node,colIndex,value, e);
            } else if ((name == 'mousedown') && (item.stopSelection !== false)) {
                return false;
            }
        }
        return Ext.tree.ActionColumn.superclass.processEvent.apply(this, arguments);
    }
});
Ext.tree.CustActionColumn = Ext.extend(Ext.tree.Column, {
	actionRe : /x-custaction-col/,
    processEvent : function(name, e, tree, node, colIndex,value){
    	var el = e.getTarget();
		var m = el.className.match(this.actionRe), fn;
		if (m) {
			if (name == 'click' || name == 'mousedown') {
				var r = [tree, node, colIndex,value];
				r = m.slice(1) ? r.concat(m.slice(1)) : r;
				r = r.concat([el,e]);
				(fn = this.handler)
						&& fn.apply(this.scope || this, r);
			}
		}
        return Ext.tree.CustActionColumn.superclass.processEvent.apply(this, arguments);
    }
});
Ext.reg('tgcolumn', Ext.tree.Column);
Ext.reg('tgnumbercolumn', Ext.tree.NumberColumn);
Ext.reg('tgdatecolumn', Ext.tree.DateColumn);
Ext.reg('tgbooleancolumn', Ext.tree.BooleanColumn);
Ext.reg('tgtemplatecolumn', Ext.tree.TemplateColumn);
Ext.reg('tgactioncolumn', Ext.tree.ActionColumn);
Ext.reg('tgcustactioncolumn', Ext.tree.CustActionColumn);

Ext.sunyard.TreeGrid = Ext.extend(Ext.ux.tree.TreeGrid,{
	tbarable:true,//是否有工具按钮
	initComponent : function(){
		this.tbar = this.tbar ? this.tbar : [];
		this.initTbarBtn();
		if(this.tbar.length==0) delete this.tbar;
		Ext.sunyard.TreeGrid.superclass.initComponent.call(this);
		this.on('checkchange',this.onCheckChange,this);
	},
	initTbarBtn:function(){
		this.tbar = this.tbarable ? this.tbar.concat([{
	    	iconCls: 'icon-expand-all',
		   	tooltip: '展开全部',
		   	handler:function(){
		   		this.root.expand(true);
		   	},
		   	scope:this
		   },'-',{			   	
		   	iconCls: 'icon-collapse-all',
		   	tooltip: '关闭全部',
		   	handler:function(){
		   		this.root.collapse(true);
		   	},
		   	scope:this
		   },'-',{
		   	iconCls:'icon-refresh',
		   	tooltip: '刷新',
		   	handler:function(){
		   		this.root.reload();
		   	},
		   	scope:this
		}]) : this.tbar;
	},
	onCheckChange:function(node, checked){
		node.expand(true);
		node.eachChild(function(child){            		
			child.getUI().toggleCheck(checked);
		});
    	(function(parentNode){
    		var fn = arguments.callee;
    		if(parentNode.getDepth()>0){
        		var parentChecked = false;
        		parentNode.eachChild(function(child){
        			parentChecked = parentChecked || child.getUI().isChecked();
        		});
        		if(parentNode.getUI().isChecked()!==parentChecked){
        			parentNode.getUI().setCheck(parentChecked);
        			//parentNode.getUI().checkbox.checked = parentChecked;
					//parentNode.getUI().checkbox.defaultChecked = parentChecked;// fix for IE6
					//parentNode.getUI().node.attributes.checked = parentChecked;
					fn(parentNode.parentNode);
        		}
    		}else{
    			return;
    		}
    	})(node.parentNode);
    	this.fireEvent("aftercheckchange",node,checked,this);
	},
	getLeafChecked : function(a, startNode){
        startNode = startNode || this.root;
        var r = [];
        var f = function(){
            if(this.isLeaf()&&this.attributes.checked){
                r.push(!a ? this : (a == 'id' ? this.id : this.attributes[a]));
            }
        };
        startNode.cascade(f);
        return r;
    },
    getAllChecked : function(a, startNode){
        startNode = startNode || this.root;
        var r = [];
        var f = function(){
            if(this.attributes.checked){
                r.push(!a ? this : (a == 'id' ? this.id : this.attributes[a]));
            }
        };
        startNode.cascade(f);
        return r;
    }
});
Ext.reg('s_treegrid',Ext.sunyard.TreeGrid);