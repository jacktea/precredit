var cascadeTreeData = function(treeData,fn, scope, args){	
    if(fn.apply(scope || treeData, args || [treeData]) !== false){
        var cs = treeData.children;
        if(cs)
        for(var i = 0, len = cs.length; i < len; i++) {
        	cascadeTreeData(cs[i],fn,scope,args);
        }
    }
};
Ext.override(Ext.tree.TreeEventModel,{
	delegateClick : function(e, t){
        if(this.beforeEvent(e)){
            if(e.getTarget('.ui-icon', 1)){
            	this.onCheckboxClick(e, this.getNode(e));
            }else if(e.getTarget('.x-tree-ec-icon', 1)){
                this.onIconClick(e, this.getNode(e));
            }else if(this.getNodeTarget(e)){
                this.onNodeClick(e, this.getNode(e));
            }
        }else{
            this.checkContainerEvent(e, 'click');
        }
    }
});
Ext.override(Ext.tree.TreeNodeUI,{
	_doCheck : function(){
		if(this.rendered){
			var cbEl = Ext.fly(this.checkbox);
			cbEl.removeClass("ui-icon-uncheck");
			cbEl.removeClass("ui-icon-halfcheck");
			cbEl.addClass("ui-icon-check");
        }  
	},
	_doHalfCheck : function(){
		if(this.rendered){
			var cbEl = Ext.fly(this.checkbox);
			cbEl.removeClass("ui-icon-uncheck");
			cbEl.removeClass("ui-icon-check");
			cbEl.addClass("ui-icon-halfcheck");
        }  
	},
	_doUnCheck : function(){
		if(this.rendered){
			var cbEl = Ext.fly(this.checkbox);
			cbEl.removeClass("ui-icon-halfcheck");
			cbEl.removeClass("ui-icon-check");
			cbEl.addClass("ui-icon-uncheck");
        }  
	},
	_cascadeUpdateCheck:function(a){
		var leaf = a.leaf,cb = a.checked,c = a.children;
		if(Ext.isDefined(cb)){
			cb = cb===true ? 2 : cb===false ? 0 : cb;
			if(!leaf&&c&&c.length>0){
				var m = {0:0,1:0,2:0};
				for(var i = 0 ; i < c.length ; i ++){
					switch(this._cascadeUpdateCheck(c[i])){
					case 0 :
						m[0]++;
						break;
					case 1 :
						m[1]++;
						break;
					case 2 :
						m[2]++;
						break;
					}								
				}
				cb = m[0]==c.length ? 0 : m[2]==c.length ? 2 : 1;
			}else if((!leaf&&c&&c.length===0) || (!leaf&&!c)){
				
			}else if(leaf){
				cb = cb==0 ? 0 : 2;
			}
			//a.checked = cb;
			return cb;
		}else{
			return -1;
		}
	},
	/**
	* 0 未选中 1半选中 2选中
	*/
	_checkIconEl : function(a){
		var cb = a.checked;
		if(Ext.isDefined(cb)){
			cb = this._cascadeUpdateCheck(a);
			a.checked = cb;
			switch(cb){
			case 0:
				return '<img src="'+this.emptyIcon+'" class="ui-icon ui-icon-uncheck" />';
			case 1:
				return '<img src="'+this.emptyIcon+'" class="ui-icon ui-icon-halfcheck" />';
			case 2:
				return '<img src="'+this.emptyIcon+'" class="ui-icon ui-icon-check" />';
			}
		}else{
			return "";
		}
	},
	onCheckChange : function(){
		var a = this.node.attributes;
		var cb = a.checked;
		cb = cb === 0 ? 2 : 0;
		this.node.attributes.checked = cb;
		function cascadeTreeData(treeData,fn, scope, args){	
		    if(fn.apply(scope || treeData, args || [treeData]) !== false){
		        var cs = treeData.children;
		        if(cs)
		        for(var i = 0, len = cs.length; i < len; i++) {
		        	cascadeTreeData(cs[i],fn,scope,args);
		        }
		    }
		};
		var treeData = this.node.attributes;
		cascadeTreeData(treeData,function(){
			this.checked = cb;
		});
		this.node.cascade(function(){
			this.attributes.checked = cb;
			if(this.rendered)
				this.getUI()._setCheck(cb);
		});
		
		(function(parentNode){
    		var fn = arguments.callee;
    		if(parentNode.getDepth()>0){
        		var parentChecked,
        			cn = parentNode.childNodes,
        			len = cn.length,
        			m = {0:0,1:0,2:0};
        		for(var i = 0 ; i < len ; i ++){
        			var cbc= cn[i].attributes.checked;
        			switch(cbc){
					case 0 :
						m[0]++;
						break;
					case 1 :
						m[1]++;
						break;
					case 2 :
						m[2]++;
						break;
					}
        		}
        		parentChecked = m[0]==len ? 0 : m[2]==len ? 2 : 1;
        		//if(parentNode.attributes.checked!==parentChecked){
					parentNode.getUI()._setCheck(parentChecked);
					fn(parentNode.parentNode);
        		//}
    		}else{
    			return;
    		}
    	})(this.node.parentNode);
        this.fireEvent('checkchange', this.node, cb);
    },
    _setCheck:function(cb){
    	cb = cb===true ? 2 : cb===false ? 0 : cb;
    	this.node.attributes.checked = cb;
    	switch(cb){
		case 0 : 
			this._doUnCheck();
			break;
		case 1 :
			this._doHalfCheck();
			break;
		case 2 :
			this._doCheck();
			break;
		}
	},
	renderElements : function(n, a, targetNode, bulkRender){
        this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';
        var cb = Ext.isDefined(a.checked),
            nel,
            href = this.getHref(a.href),
            buf = ['<li class="x-tree-node"><div ext:tree-node-id="',n.id,'" class="x-tree-node-el x-tree-node-leaf x-unselectable ', a.cls,'" unselectable="on">',
            '<span class="x-tree-node-indent">',this.indentMarkup,"</span>",
            '<img alt="" src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow" />',
            '<img alt="" src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon',(a.icon ? " x-tree-node-inline-icon" : ""),(a.iconCls ? " "+a.iconCls : ""),'" unselectable="on" />',
            
            this._checkIconEl(a),		
            //cb ? ('<input class="x-tree-node-cb" type="checkbox" ' + (a.checked ? 'checked="checked" />' : '/>')) : '',
            '<a hidefocus="on" class="x-tree-node-anchor" href="',href,'" tabIndex="1" ',
             a.hrefTarget ? ' target="'+a.hrefTarget+'"' : "", '><span unselectable="on">',n.text,"</span></a></div>",
            '<ul class="x-tree-node-ct" style="display:none;"></ul>',
            "</li>"].join('');

        if(bulkRender !== true && n.nextSibling && (nel = n.nextSibling.ui.getEl())){
            this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel, buf);
        }else{
            this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf);
        }

        this.elNode = this.wrap.childNodes[0];
        this.ctNode = this.wrap.childNodes[1];
        var cs = this.elNode.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        this.iconNode = cs[2];
        var index = 3;
        if(cb){
        	this.checkNode = cs[3];
            this.checkbox = cs[3];
            this.checkbox.checked = a.checked;
            index++;
        }
        this.anchor = cs[index];
        this.textNode = cs[index].firstChild;
    }
});
/*Ext.override(Ext.tree.TreeNode,{
	updateCheck:function(checked){
		this.attributes.checked = checked;
		var treeData = this.attributes;
		cascadeTreeData(treeData,function(){
			this.checked = checked;
		});
		this.cascade(function(){
			this.attributes.checked = checked;
			if(this.rendered)
				this.getUI()._setCheck(checked);
		});
	}
});
Ext.override(Ext.tree.TreeNodeUI,{
	_setCheck:function(checked){
		if(!this.checkbox)
			return;
		this.checkbox.checked = checked;
		this.checkbox.defaultChecked = checked;
        this.node.attributes.checked = checked;
	}
});*/
Ext.sunyard.TbarTree = Ext.extend(Ext.tree.TreePanel,{
	filterPlugin:true,
	expandAllPlugin:true,
	collapseAllPlugin:true,
	refreshPlugin:true,
	filterFieldWidth:75,
	initComponent:function(){
		Ext.sunyard.TbarTree.superclass.initComponent.call(this);
		//this.addEvents("aftercheckchange");
		//this.on('checkchange',this.onCheckChange,this);
		if(this.plugins){
	        if(!Ext.isArray(this.plugins)){
	        	this.plugins = [this.plugins];
	        }
	    }else{
	    	this.plugins = [];
	    }
		if(this.filterPlugin){
			if(Ext.isBoolean(this.filterPlugin)){
				this.plugins.splice(0,0,new Ext.sunyard.filter.TreeFilterPlugin({
					filterFieldWidth:this.filterFieldWidth,
					ignoreFolder:false
				}));
			}else{
				this.plugins.splice(0,0,this.filterPlugin);
			}
		}
		if(this.expandAllPlugin){
			if(Ext.isBoolean(this.expandAllPlugin)){
				this.plugins.push(new Ext.sunyard.filter.TreeExpendAllPlugin());
			}else{
				this.plugins.push(this.expandAllPlugin);
			}
		}
		if(this.collapseAllPlugin){
			if(Ext.isBoolean(this.collapseAllPlugin)){
				this.plugins.push(new Ext.sunyard.filter.TreeCollapseAllPlugin());
			}else{
				this.plugins.push(this.collapseAllPlugin);
			}
		}
		if(this.refreshPlugin){
			if(Ext.isBoolean(this.refreshPlugin)){
				this.plugins.push(new Ext.sunyard.filter.TreeRefreshPlugin());
			}else{
				this.plugins.push(this.refreshPlugin);
			}
		}
	},
	onCheckChange:function(node, checked){
/*		node.updateCheck(checked);
    	(function(parentNode){
    		var fn = arguments.callee;
    		if(parentNode.getDepth()>0){
        		var parentChecked = false;
        		parentNode.eachChild(function(child){
        			parentChecked = parentChecked || child.getUI().isChecked();
        		});
        		if(parentNode.getUI().isChecked()!==parentChecked){
					parentNode.getUI()._setCheck(parentChecked);
					fn(parentNode.parentNode);
        		}
    		}else{
    			return;
    		}
    	})(node.parentNode);*/
    	this.fireEvent("aftercheckchange",node,checked,this);
	}
});
/*
Ext.sunyard.TbarTree = Ext.extend(Ext.tree.TreePanel,{
	filterable:true,//是否可筛选
	filterFieldWidth:150,//筛选按钮宽度
	tbarable:true,//是否有工具按钮
	initComponent : function(){
		this.tbar = this.tbar ? this.tbar : [];
		this.initFilterField();
		this.initTbarBtn();
		if(this.tbar.length==0) delete this.tbar;
		Ext.sunyard.TbarTree.superclass.initComponent.call(this);
		this.addEvents("aftercheckchange");
		this.on('checkchange',this.onCheckChange,this);
	},
	initFilterField:function(){
		var field = new Ext.form.TextField({
			width: this.filterFieldWidth,
			emptyText:'查询...',
            enableKeyEvents: true,
			listeners:{
				render: function(f){
                	this.filter = new Ext.tree.TreeFilter(this, {
                		clearBlank: true,
                		autoClear: true
                	});
				},
                keydown: {
                    fn: this.filterTree,
                    buffer: 350,
                    scope: this
                },
                scope: this
			}
		});
		if(this.filterable===true) this.tbar.splice(0,0,field);
	},
	initTbarBtn:function(){
		this.tbar = this.tbarable ? this.tbar.concat(['-',{
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
	filterTree:function(t,e){
		var text = t.getValue();
		Ext.each(this.hiddenPkgs, function(n){
			n.ui.show();
		});
		if(!text){
			this.filter.clear();
			return;
		}
		this.expandAll();		
		var re = new RegExp('^' + Ext.escapeRe(text), 'i');
		this.filter.filterBy(function(n){
			return !n.isLeaf() || re.test(n.text);
		});
		this.hiddenPkgs = [];
		this.root.cascade(function(n){
			if(!n.isLeaf() && n.ui.ctNode.offsetHeight < 3){
				n.ui.hide();
				this.hiddenPkgs.push(n);
			}
		},this);
	},
	onCheckChange:function(node, checked){
		node.updateCheck(checked);
    	(function(parentNode){
    		var fn = arguments.callee;
    		if(parentNode.getDepth()>0){
        		var parentChecked = false;
        		parentNode.eachChild(function(child){
        			parentChecked = parentChecked || child.getUI().isChecked();
        		});
        		if(parentNode.getUI().isChecked()!==parentChecked){
					parentNode.getUI()._setCheck(parentChecked);
					fn(parentNode.parentNode);
        		}
    		}else{
    			return;
    		}
    	})(node.parentNode);
    	this.fireEvent("aftercheckchange",node,checked,this);
	}
});
*/
Ext.sunyard.form.ComboTree = Ext.extend(Ext.form.TriggerField,{
	editable: false,
	maxHeight : 300,
	minHeight : 90,
	minChars : 4,
	triggerAction : 'all',
	queryParam : 'query',
	loadingText : '加载中...',
	allQuery: '',
	minListWidth : 70,
	clearFilterOnReset : true,
	submitValue: undefined,
	lazyInit : true,
	listClass : '',
	initComponent : function(){
        Ext.sunyard.form.ComboTree.superclass.initComponent.call(this);
        this.addEvents(
            'expand',
            'collapse',
            'beforeselect',
            'select',
            'beforequery'
        );
    },
    onRender : function(ct, position){
        if(this.hiddenName && !Ext.isDefined(this.submitValue)){
            this.submitValue = false;
        }
        Ext.form.ComboBox.superclass.onRender.call(this, ct, position);
        if(this.hiddenName){
            this.hiddenField = this.el.insertSibling({tag:'input', type:'hidden', name: this.hiddenName,
                    id: (this.hiddenId || Ext.id())}, 'before', true);
        }
        if(Ext.isGecko){
            this.el.dom.setAttribute('autocomplete', 'off');
        }
        if(!this.lazyInit){
            this.initList();
        }else{
            this.on('focus', this.initList, this, {single: true});
        }
    },
    initValue : function(){
        Ext.sunyard.form.ComboTree.superclass.initValue.call(this);
        if(this.hiddenField){
            this.hiddenField.value =
                Ext.value(Ext.isDefined(this.hiddenValue) ? this.hiddenValue : this.value, '');
        }
    },
    getParentZIndex : function(){
        var zindex;
        if (this.ownerCt){
            this.findParentBy(function(ct){
                zindex = parseInt(ct.getPositionEl().getStyle('z-index'), 10);
                return !!zindex;
            });
        }
        return zindex;
    },   
    getZIndex : function(listParent){
        listParent = listParent || Ext.getDom(this.getListParent() || Ext.getBody());
        var zindex = parseInt(Ext.fly(listParent).getStyle('z-index'), 10);
        if(!zindex){
            zindex = this.getParentZIndex();
        }
        return (zindex || 12000) + 5;
    },
    getListParent : function() {
        return document.body;
    },
    initList : function(){
        if(!this.list){
            var cls = 'x-combo-list',
                listParent = Ext.getDom(this.getListParent() || Ext.getBody());

            this.list = new Ext.Layer({
                parentEl: listParent,
                shadow: this.shadow,
                cls: [cls, this.listClass].join(' '),
                constrain:false,
                zindex: this.getZIndex(listParent)
            });

            var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
            this.list.setSize(lw, 0);
            this.list.swallowEvent('mousewheel');
            this.assetHeight = 0;
            if(this.syncFont !== false){
                this.list.setStyle('font-size', this.el.getStyle('font-size'));
            }
            if(this.title){
                this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
                this.assetHeight += this.header.getHeight();
            }

            this.innerList = this.list.createChild({cls:cls+'-inner'});
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
            this.innerList.applyStyles({'overflow':'hidden'});
            this.initTree();
            if(this.resizable){
                this.resizer = new Ext.Resizable(this.list,  {
                   pinned:true, handles:'se'
                });
                this.mon(this.resizer, 'resize', function(r, w, h){
                    this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
                    this.listWidth = w;
                    this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                    this.restrictHeight();
                }, this);
            }
        }
    },
    initTree:function(){
    	this.treeCfg = this.treeCfg || {};
    	this.treeCfg = Ext.applyIf(this.treeCfg,{
            	renderTo:this.innerList,
	            autoScroll:true,
	            bodyStyle:'padding:0px',            
			    rootVisible:false,
			    height:this.maxHeight,
			    lines:false,
			    animCollapse:false,
			    animate: false,
			    border:false,
			    filterFieldWidth:this.filterFieldWidth||100,
			    plugins:[new Ext.sunyard.filter.TreeIconPlugin({
			    	iconCls: 'clean-field',
				   	tooltip: '清理',
					iconClick:this.clearValue,
					scope:this
		    	})],
			   loader:this.loader||new Ext.tree.TreeLoader({
	                dataUrl: this.dataUrl,
	                requestMethod: this.requestMethod,
	                listeners:{
	                	"beforeload":function(o){
	            			Ext.apply(o.baseParams,this.baseParams||{});
	            		},
	            		scope:this
	                }
	            }),
			    //构造根节点
				root: new Ext.tree.AsyncTreeNode({
				    id: this.rootNode||'',
					expanded: false
				})
			});
    	this.innerTree = new Ext.sunyard.TbarTree(this.treeCfg);
/*    	this.innerTree = new Ext.sunyard.TbarTree({
            	renderTo:this.innerList,
	            autoScroll:true,
	            bodyStyle:'padding:0px',            
			    rootVisible:false,
			    height:this.maxHeight,
			    lines:false,
			    animCollapse:false,
			    animate: false,
			    border:false,
			    filterFieldWidth:this.filterFieldWidth||100,
			    tbar:['-',{
			    	iconCls: 'clean-field',
				   	tooltip: '清理',
				   	handler:function(){
				   		this.clearValue();
				   	},
				   	scope:this
			   }],
			   loader:this.loader||new Ext.tree.TreeLoader({
	                dataUrl: this.dataUrl,
	                requestMethod: this.requestMethod,
	                listeners:{
	                	"beforeload":function(o){
	            			Ext.apply(o.baseParams,this.baseParams||{});
	            		},
	            		scope:this
	                }
	            }),
			    //构造根节点
				root: new Ext.tree.AsyncTreeNode({
				    id: this.rootNode||'',
					expanded: false
				})
			});*/
			this.mon(this.innerTree,{
				scope:this,
				click:this.onSelect
			});
    },
    setBaseParams:function(params){
    	this.baseParams = params || {};
    	if(this.innerTree){
    		var loader = this.innerTree.getLoader();
			if(loader) loader.baseParams = this.baseParams || {};
    	}    	
    },
    onSelect : function(node,e){
    	e.stopEvent();
        if(this.fireEvent('beforeselect', this, node) !== false){
            this.setValue(node.id||node.text);
            this.collapse();
            this.fireEvent('select', this, node);
        }
    },
    getName: function(){
        var hf = this.hiddenField;
        return hf && hf.name ? hf.name : this.hiddenName || Ext.form.ComboBox.superclass.getName.call(this);
    },
    getValue : function(){
        if(this.hiddenField){
            return Ext.isDefined(this.value) ? this.value : '';
        }else{
            return Ext.form.ComboBox.superclass.getValue.call(this);
        }
    },
    clearValue : function(){
        if(this.hiddenField){
            this.hiddenField.value = '';
        }
        this.setRawValue('');
        this.lastSelectionText = '';
        this.applyEmptyText();
        this.value = '';
    },
    setValue : function(v){
        var text = v;
        this.value = v;
        if(this.hiddenField){
            this.hiddenField.value = Ext.value(v, '');
        }
        Ext.sunyard.form.ComboTree.superclass.setValue.call(this, text);
        var node = this.innerTree ? this.innerTree.getNodeById(v) : null;
        if(node){
            text = node.text;
            this.setRawValue(text);	        
        }else{
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
				var params = Ext.apply({},this.baseParams);
				params[this.queryParam||'node'] = v;
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
    onDestroy : function(){
        if (this.dqTask){
            this.dqTask.cancel();
            this.dqTask = null;
        }
        Ext.destroy(
            this.resizer,
            this.innerTree,
            this.list
        );
        Ext.destroyMembers(this, 'hiddenField');
        Ext.sunyard.form.ComboTree.superclass.onDestroy.call(this);
    },
    initQuery : function(){
        this.doQuery(this.getRawValue());
    },
    // private
    fireKey : function(e){
        if (!this.isExpanded()) {
            Ext.sunyard.form.ComboTree.superclass.fireKey.call(this, e);
        }
    },

    // private
    onResize : function(w, h){
        Ext.sunyard.form.ComboTree.superclass.onResize.apply(this, arguments);
        if(!isNaN(w) && this.isVisible() && this.list){
            this.doResize(w);
        }else{
            this.bufferSize = w;
        }
    },

    doResize: function(w){
        if(!Ext.isDefined(this.listWidth)){
            var lw = Math.max(w, this.minListWidth);
            this.list.setWidth(lw);
            lw = lw - this.list.getFrameWidth('lr');
            this.innerList.setWidth(lw);
            this.innerTree.setWidth(lw);
        }
    },

    // private
    onEnable : function(){
        Ext.sunyard.form.ComboTree.superclass.onEnable.apply(this, arguments);
        if(this.hiddenField){
            this.hiddenField.disabled = false;
        }
    },

    // private
    onDisable : function(){
        Ext.sunyard.form.ComboTree.superclass.onDisable.apply(this, arguments);
        if(this.hiddenField){
            this.hiddenField.disabled = true;
        }
    },
    // private
    restrictHeight : function(){
        this.innerList.dom.style.height = '';
        var inner = this.innerList.dom,
            pad = this.list.getFrameWidth('tb') + (this.resizable ? this.handleHeight : 0) + this.assetHeight,
            h = Math.max(inner.clientHeight, inner.offsetHeight, inner.scrollHeight),
            ha = this.getPosition()[1]-Ext.getBody().getScroll().top,
            hb = Ext.lib.Dom.getViewHeight()-ha-this.getSize().height,
            space = Math.max(ha, hb, this.minHeight || 0)-this.list.shadowOffset-pad-5;

        h = Math.min(h, space, this.maxHeight);

        this.innerList.setHeight(h);
        this.list.beginUpdate();
        this.list.setHeight(h+pad);
        this.list.alignTo.apply(this.list, [this.el].concat(this.listAlign));
        this.list.endUpdate();
    },
    isExpanded : function(){
        return this.list && this.list.isVisible();
    },
    collapse : function(){
        if(!this.isExpanded()){
            return;
        }
        this.list.hide();
        Ext.getDoc().un('mousewheel', this.collapseIf, this);
        Ext.getDoc().un('mousedown', this.collapseIf, this);
        this.fireEvent('collapse', this);
    },

    // private
    collapseIf : function(e){
        if(!this.isDestroyed && !e.within(this.wrap) && !e.within(this.list)){
            this.collapse();
        }
    },
    expand : function(){
        if(this.isExpanded() || !this.hasFocus){
            return;
        }

        if(this.title || this.pageSize){
            this.assetHeight = 0;
            if(this.title){
                this.assetHeight += this.header.getHeight();
            }
            if(this.pageSize){
                this.assetHeight += this.footer.getHeight();
            }
        }

        if(this.bufferSize){
            this.doResize(this.bufferSize);
            delete this.bufferSize;
        }
        this.list.alignTo.apply(this.list, [this.el].concat(this.listAlign));

        // zindex can change, re-check it and set it if necessary
        this.list.setZIndex(this.getZIndex());
        this.list.show();
        if(Ext.isGecko2){
            this.innerList.setOverflow('auto'); // necessary for FF 2.0/Mac
        }
        this.mon(Ext.getDoc(), {
            scope: this,
            mousewheel: this.collapseIf,
            mousedown: this.collapseIf
        });
        this.fireEvent('expand', this);
    },
    onKeyUp : function(e){
        var k = e.getKey();
        if(this.editable !== false && this.readOnly !== true && (k == e.BACKSPACE || !e.isSpecialKey())){
            this.expand();                
            this.restrictHeight();
        }else if(k==e.ENTER){
    		this.dqTask.delay(300);
        }
        
        Ext.sunyard.form.ComboTree.superclass.onKeyUp.call(this, e);
    },
    initEvents : function(){
    	Ext.sunyard.form.ComboTree.superclass.initEvents.call(this);
    	this.dqTask = new Ext.util.DelayedTask(function(){
            this.expand();                
            this.restrictHeight();
            this.filterTree(this.getRawValue());
			//this.innerTree.filter.filter(this.getRawValue());
    	}, this);
    	if(!this.enableKeyEvents){
            this.mon(this.el, 'keyup', this.onKeyUp, this);
        }
    },
    filterTree:function(value){
		this.innerTree.body.mask("处理中...");
		(function(){
			this.innerTree.body.dom.style.visibility = 'hidden';
			this.innerTree.filter.filter(value,this.filterAttr);
			this.innerTree.body.dom.style.visibility = 'visible';
			this.innerTree.body.unmask();
		}).defer(100,this);
	},
    onTriggerClick : function(){
        if(this.readOnly || this.disabled){
            return;
        }
        if(this.isExpanded()){
            this.collapse();
            this.el.focus();
        }else {
            this.onFocus({});
            if(this.triggerAction == 'all') {
                this.doQuery(this.allQuery, true);
            } else {
                this.doQuery(this.getRawValue());
            }
            this.el.focus();
        }
    },
    doQuery : function(q, forceAll){
        q = Ext.isEmpty(q) ? '' : q;
        var qe = {
            query: q,
            forceAll: forceAll,
            combo: this,
            cancel:false
        };
        if(this.fireEvent('beforequery', qe)===false || qe.cancel){
            return false;
        }
        q = qe.query;
        forceAll = qe.forceAll;
        if(forceAll === true || (q.length >= this.minChars)){
            if(this.lastQuery !== q){
                this.lastQuery = q;
                this.innerTree.getLoader().baseParams[this.queryParam] = q;
                this.innerTree.root.reload();
                this.innerTree.root.expand(this.expandAll===true);
                this.expand();                
                this.restrictHeight();
//                this.onLoad();
            }else{
                this.onLoad();
            }
        }
    },
    onLoad : function(){
        if(!this.hasFocus){
            return;
        }
        if(this.innerTree.root.hasChildNodes()|| this.listEmptyText){
            this.expand();
            this.restrictHeight();
            if(this.lastQuery == this.allQuery){
                if(this.editable){
                    this.el.dom.select();
                }
            }
        }else{
            this.collapse();
        }

    },
    destroy:function(){
    	if(this.innerTree) this.innerTree.destroy();
    	Ext.sunyard.form.ComboTree.superclass.destroy.call(this);
    },
    reloadTree:function(){
    	if(this.innerTree){
			this.innerTree.root.reload();
			this.innerTree.root.expand(this.expandAll===true);
		}
    }
});
Ext.sunyard.form.TreeField = Ext.extend(Ext.form.Field,{
	valueSeparator:',',
	defaultAutoCreate : {tag: "div"},
	rootVisible:false,
	width:300,
	height:400,
	delayTime:500,
	submitAll:true,
	getAllData:false,
	allowBlank:true,
	blankText:'该项为必输项',
	initComponent:function(){
		Ext.sunyard.form.TreeField.superclass.initComponent.call(this);
//		this.valueTask = new Ext.util.DelayedTask(this.onTreeToField, this);
		this.valueTask = new Ext.util.DelayedTask(this.validate, this);
//		if(this.ownerCt)
		this.on('resize',function(){
			this.innerTree.setWidth(this.el.getWidth());
		},this);
	},
	onRender : function(ct, position){
		Ext.sunyard.form.TreeField.superclass.onRender.call(this,ct,position);
		this.initTree();
		this.hiddenField = this.el.insertSibling({tag:'input', type:'hidden', name: this.name||this.hiddenName,
            id: (this.hiddenId || Ext.id())}, 'before', true);
	},
	afterRender : function(){
        Ext.sunyard.form.TreeField.superclass.afterRender.call(this);
    },
	initTree:function(){
		if(!this.innerTree){
			this.treeCfg = this.treeCfg || {};
	    	this.treeCfg = Ext.applyIf(this.treeCfg,{
	        	renderTo:this.el,
	            autoScroll:true,
	            bodyStyle:'background-color:white;border:1px solid #B5B8C8',            
			    rootVisible:this.rootVisible,
			    height:this.height,
			    width:this.width,
			    lines:false,
			    animCollapse:false,
			    animate: false,
			    border:true,
			    filterFieldWidth:this.filterFieldWidth||100,
			    loader:this.loader||new Ext.tree.TreeLoader({
	                dataUrl: this.dataUrl,
	                requestMethod: this.requestMethod,
	                listeners:{
	                	"beforeload":function(o){
	            			Ext.apply(o.baseParams,this.baseParams||{});
	            		},
	            		scope:this
	                }
	            }),
			    //构造根节点
			    root: this.root || new Ext.tree.AsyncTreeNode({
				    id: this.rootNode||'root',
					expanded: false
			    })
			});
	    	this.innerTree = new Ext.sunyard.TbarTree(this.treeCfg);
		}
/*    	this.innerTree = new Ext.sunyard.TbarTree({
        	renderTo:this.el,
            autoScroll:true,
            bodyStyle:'background-color:white;border:1px solid #B5B8C8',            
		    rootVisible:this.rootVisible,
		    height:this.height,
		    width:this.width,
		    lines:false,
		    animCollapse:false,
		    animate: false,
		    border:true,
		    filterFieldWidth:this.filterFieldWidth||100,
		    loader:this.loader||new Ext.tree.TreeLoader({
                dataUrl: this.dataUrl,
                requestMethod: this.requestMethod,
                listeners:{
                	"beforeload":function(o){
            			Ext.apply(o.baseParams,this.baseParams||{});
            		},
            		scope:this
                }
            }),
		    //构造根节点
		    root: this.root || new Ext.tree.AsyncTreeNode({
			    id: this.rootNode||'root',
				expanded: false
		    })
		});*/
		this.mon(this.innerTree,{
			scope:this,
			checkchange:this.onAfterCheckChange,
			click:this.onClick
		});
    },
    setBaseParams:function(params){
    	this.baseParams = params || {};
    	if(this.innerTree){
    		var loader = this.innerTree.getLoader();
			if(loader) loader.baseParams = this.baseParams || {};
    	}    	
    },
    onAfterCheckChange:function(node,checked,tree){
		this.valueTask.delay(this.delayTime);
	},
	onClick:function(node,e){
		e.stopEvent();
	},
	getAsyncChecked:function(a, startNode){
		startNode = startNode || this.root || this.innerTree.root;
        var r = [];
        var submitAll = this.submitAll;
        var f = function(){
        	if(this.attributes.checked==2 || (submitAll&&this.attributes.checked!=0)){
        		r.push(!a ? this : a=='id' ? this.id : this.attributes[a]);
        	}
        	/*if((submitAll||this.isLeaf())&&this.attributes.checked){
        		r.push(!a ? this : a=='id' ? this.id : this.attributes[a]);
    		}*/
        };
        startNode.cascade(f);
        return r;
	},
	getChecked : function(a, startNode){
        startNode = startNode || this.root || this.innerTree.root;
        var r = [];
        var submitAll = this.submitAll;
        if(startNode==this.innerTree.root){
        	startNode.eachChild(function(n){
        		cascadeTreeData(n.attributes,function(){
        			if(this.checked==2 || (submitAll&&this.checked!=0)){
        				r.push(a=='id' ? this.id : this[a]);
                	}        			
		        	/*if((submitAll||(this.leaf==true))&&this.checked){
		        		r.push(a=='id' ? this.id : this[a]);
		        	}*/
		        });
        	});
        }else{
        	cascadeTreeData(startNode.attributes,function(){
        		if(this.checked==2 || (submitAll&&this.checked!=0)){
    				r.push(a=='id' ? this.id : this[a]);
            	}
	        });
        }		        
        return r;
    },
    onResize : function(w, h){
		Ext.sunyard.form.TreeField.superclass.onResize.call(this, w, h);
        if(Ext.isNumber(w)){
            this.innerTree.setWidth(w);
        }
        if(Ext.isNumber(h)){
            this.innerTree.setHeight(h);
        }
    },
    onTreeToField:function(){
		if(this.rendered&&this.innerTree.rendered) {
			if(this.getAllData){
				this.hiddenField.value = this.getChecked("id").join(this.valueSeparator);
			}else{
				this.hiddenField.value = this.getAsyncChecked("id").join(this.valueSeparator);
			}
        }
//        this.validate();
	},
	validate:function(){
		if(this.rendered&&this.innerTree.rendered) {
			if(this.getAllData){
				this.hiddenField.value = this.getChecked("id").join(this.valueSeparator);
			}else{
				this.hiddenField.value = this.getAsyncChecked("id").join(this.valueSeparator);
			}
        }
		return Ext.sunyard.form.TreeField.superclass.validate.call(this);
	},
	initValue : function(){
        if(this.value !== undefined){
            this.setValue(this.value);
        }else if(!Ext.isEmpty(this.hiddenField.value) && this.hiddenField.value != this.emptyText){
            this.setValue(this.hiddenField.value);
        }
        this.originalValue = this.getValue();
    },
    setValue:function(v){
		this.value = v;
		var _arrV = v ? v.split(',') : [];
		if(this.rendered&&this.innerTree.rendered){
			this.innerTree.root.eachChild(function(n){
				cascadeTreeData(n.attributes,function(){
					if(_arrV.indexOf(this.id)!=-1){
						this.checked = 2;
						//this.checked = true;
					}else{
						this.checked = 0;
//						this.checked = false;
					}
				});
			});
			this.innerTree.root.cascade(function(){
				if(this.rendered)
					//this.getUI()._setCheck(this.attributes.checked);
					this.getUI()._setCheck(_arrV.indexOf(this.id)!=-1);
			});
			this.hiddenField.value = (Ext.isEmpty(v) ? '' : v);
		}
	},
	getValue:function(){
		if(this.rendered&&this.innerTree.rendered) {
			if(this.getAllData){
				return this.getChecked("id").join(this.valueSeparator);
			}else{
				return this.getAsyncChecked("id").join(this.valueSeparator);
			}
        }else{
	        return this.value;
	    }
	},
	getRawValue:function(){
		return this.getValue();
	},
	getErrors: function(value) {
        var errors = Ext.sunyard.form.TreeField.superclass.getErrors.apply(this, arguments);        
        value = Ext.isDefined(value) ? value : this.processValue(this.getRawValue());                
        if (Ext.isFunction(this.validator)) {
            var msg = this.validator(value);
            if (msg !== true) {
                errors.push(msg);
            }
        }        
        if (value.length < 1 || value === this.emptyText) {
            if (this.allowBlank) {
                return errors;
            } else {
                errors.push(this.blankText);
            }
        }        
        if (!this.allowBlank && (value.length < 1 || value === this.emptyText)) { // if it's blank
            errors.push(this.blankText);
        }        
        return errors;
    },
    destroy:function(){
    	if(this.innerTree) this.innerTree.destroy();
    	Ext.sunyard.form.TreeField.superclass.destroy.call(this);
    },
    reloadTree:function(){
    	if(this.innerTree){
			this.innerTree.root.reload();
		}
    }
});
Ext.sunyard.AccordionTree = Ext.extend(Ext.Panel,{
	dataUrl:null,
	rootNode:'root',
	layout:'accordion',
	afterRender : function(){
		Ext.sunyard.AccordionTree.superclass.afterRender.call(this);
		this.loadMask = new Ext.LoadMask(this.bwrap);
		this.loadMask.show();
		Ext.Ajax.request({   
            url: this.dataUrl, 
            scope: this, 
            params:{node:this.rootNode},
            success: function(response){
            	var list = Ext.decode(response.responseText);
            	this.addCardItems(list);
            	this.doLayout();  
                this.loadMask.hide();   
            },
		   failure: function(response, opts) {
		      this.loadMask.hide();
		      Ext.Msg.alert('提示信息','数据加载失败！');
		   }   
        });
	},
	addCardItems : function(items){
		if(Ext.isArray(items)){
			Ext.each(items,function(item){
				this.addCardItems(item);
			},this);
		}else{
			this.createInnerTree(items);
		}
	},
	createInnerTree:function(item){
		var _tree = new Ext.sunyard.TbarTree({
			title:item.text,
            autoScroll:true,           
		    rootVisible:false,
		    lines:true,
		    border:false,
		    dataUrl:this.dataUrl,
			root: new Ext.tree.AsyncTreeNode({
			    id: item.id,
			    text: item.text,
				expanded: true
			})
		});
		this.add(_tree);
		this.relayEventsEx(_tree,['click','close','collapse',
		'collapsenode','containerclick','containercontextmenu',
		'contextmenu','dblclick','destroy','expand','expandnode','iconchange']);
	},
	relayEventsEx : function(o, events) {
		var me = this;
		function createHandler(ename) {
			return function() {
				var arr = Array.prototype.slice.call(
										arguments, 0);
				return me.fireEvent.apply(me, [ename]
								.concat(arr));
			};
		}
		for (var i = 0, len = events.length; i < len; i++) {
			var ename = events[i];
			var otherename = 'tree'+ename;
			me.events[otherename] = me.events[otherename] || true;
			o.on(ename, createHandler(otherename), me);
		}
	}     
});
Ext.reg('s_tbartree',Ext.sunyard.TbarTree);
Ext.reg('s_combotree',Ext.sunyard.form.ComboTree);
Ext.reg('s_treefield',Ext.sunyard.form.TreeField);
Ext.reg('s_accordiontree',Ext.sunyard.AccordionTree);