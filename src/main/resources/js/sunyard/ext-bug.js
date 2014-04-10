Ext.apply(Ext, {
	getPath : function() {
		var System = {};
		var t = document.getElementsByTagName("SCRIPT");
		for ( var i = 0; i < t.length; i++) {
			if ((t[i].src).indexOf("loadAllJavaScript") != -1) {
				t = (System.scriptElement = t[i]).src.replace(/\\/g, "/");
				break;
			}
		}
		System.path = (t.lastIndexOf("/") < 0) ? "." : t.substring(0, t
				.lastIndexOf("/"));
		return System.path + "/..";
	},
	add : function(arg1, arg2) {
		var r1, r2, m, n;
		arg1 = arg1.toString().replace(/\,/g, "");
		arg2 = arg2.toString().replace(/\,/g, "");
		try {
			r1 = arg1.toString().split(".")[1].length;
		} catch (e) {
			r1 = 0;
		}
		;
		try {
			r2 = arg2.toString().split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}
		;
		m = Math.pow(10, Math.max(r1, r2));
		n = (r1 >= r2) ? r1 : r2;
		return ((arg1 * m + arg2 * m) / m).toFixed(n);
	},
	sub : function(arg1, arg2) {
		var r1, r2, m, n;
		arg1 = arg1.toString().replace(/\,/g, "");
		arg2 = arg2.toString().replace(/\,/g, "");
		try {
			r1 = arg1.toString().split(".")[1].length;
		} catch (e) {
			r1 = 0;
		}
		try {
			r2 = arg2.toString().split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}
		m = Math.pow(10, Math.max(r1, r2));
		// 动态控制精度长度
		n = (r1 >= r2) ? r1 : r2;
		return ((arg1 * m - arg2 * m) / m).toFixed(n);
	},
	mul : function(arg1, arg2) {
		arg1 = arg1.toString().replace(/\,/g, "");
		arg2 = arg2.toString().replace(/\,/g, "");
		var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length;
		} catch (e) {
		}
		try {
			m += s2.split(".")[1].length;
		} catch (e) {
		}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", ""))
				/ Math.pow(10, m);
	},
	div : function(arg1, arg2) {
		arg1 = arg1.toString().replace(/\,/g, "");
		arg2 = arg2.toString().replace(/\,/g, "");
		var t1 = 0, t2 = 0, r1, r2;
		try {
			t1 = arg1.toString().split(".")[1].length;
		} catch (e) {
		}
		;
		try {
			t2 = arg2.toString().split(".")[1].length;
		} catch (e) {
		}
		;
		with (Math) {
			r1 = Number(arg1.toString().replace(".", ""));
			r2 = Number(arg2.toString().replace(".", ""));
			return (r1 / r2) * pow(10, t2 - t1);
		}
	}
});
Ext.override(Ext.form.ComboBox, {
	assertValue : function() {
		if (this.readOnly)
			return;// add
		var val = this.getRawValue(), rec = this.findRecord(this.displayField,
				val);
		if (!rec && this.forceSelection) {
			if (val.length > 0 && val != this.emptyText) {
				this.el.dom.value = Ext.value(this.lastSelectionText, '');
				this.applyEmptyText();
			} else {
				this.clearValue();
			}
		} else {
			if (rec) {
				if (val == rec.get(this.displayField)
						&& this.value == rec.get(this.valueField)) {
					return;
				}
				val = rec.get(this.valueField || this.displayField);
			}
			this.setValue(val);
		}
	}
});

Ext.override(Ext.data.Store,
		{
			sortData : function() {
				var sortInfo = this.hasMultiSort ? this.multiSortInfo
						: this.sortInfo, direction = sortInfo.direction
						|| "ASC", sorters = sortInfo.sorters, sortFns = [];
				if (!this.hasMultiSort) {
					sorters = [ {
						direction : direction,
						field : sortInfo.field
					} ];
				}
				for ( var i = 0, j = sorters.length; i < j; i++) {
					if (sorters[i].field)// add
						sortFns.push(this.createSortFunction(sorters[i].field,
								sorters[i].direction));
				}
				if (sortFns.length == 0) {
					return;
				}
				var directionModifier = direction.toUpperCase() == "DESC" ? -1
						: 1;
				var fn = function(r1, r2) {
					var result = sortFns[0].call(this, r1, r2);
					if (sortFns.length > 1) {
						for ( var i = 1, j = sortFns.length; i < j; i++) {
							result = result || sortFns[i].call(this, r1, r2);
						}
					}
					return directionModifier * result;
				};
				this.data.sort(direction, fn);
				if (this.snapshot && this.snapshot != this.data) {
					this.snapshot.sort(direction, fn);
				}
			}
		});
Ext.util.Format.stripTags = function(v, fn) {
	var stripTagsRE = /<\/?[^>]+>/gi;
	if (fn && Ext.isFunction(fn)) {
		return !v ? v : String(v).replace(stripTagsRE, fn);
	}
	return !v ? v : String(v).replace(stripTagsRE, "");
};
Ext.util.Format.stripScripts = function(v, fn) {
	var stripScriptsRe = /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig;
	if (fn && Ext.isFunction(fn)) {
		return !v ? v : String(v).replace(stripScriptsRe, fn);
	}
	return !v ? v : String(v).replace(stripScriptsRe, "");
};
Ext.util.Format.stripAll = function(v) {
	v = Ext.util.Format.stripTags(v);
	v = Ext.util.Format.stripScripts(v, function(a, b, c, d) {
		return b;
	});
	return v;
};

(function(){
var ua = navigator.userAgent.toLowerCase(), check = function(r) {
	return r.test(ua);
}
Ext.isIE10 = Ext.isIE && check(/msie 10/);
Ext.isIE6 = Ext.isIE && !Ext.isIE7 && !Ext.isIE8 && !Ext.isIE9 && !Ext.isIE10;
Ext.useShims = Ext.isIE6 || (Ext.isMac && Ext.isGecko2);

Ext.Shadow.Pool = function() {
	var p = [], markup = Ext.isIE && !Ext.isIE10 ? '<div class="x-ie-shadow"></div>'
			: '<div class="x-shadow"><div class="xst"><div class="xstl"></div><div class="xstc"></div><div class="xstr"></div></div><div class="xsc"><div class="xsml"></div><div class="xsmc"></div><div class="xsmr"></div></div><div class="xsb"><div class="xsbl"></div><div class="xsbc"></div><div class="xsbr"></div></div></div>';
	return {
		pull : function() {
			var sh = p.shift();
			if (!sh) {
				sh = Ext.get(Ext.DomHelper.insertHtml("beforeBegin",
						document.body.firstChild, markup));
				sh.autoBoxAdjust = false;
			}
			return sh;
		},

		push : function(sh) {
			p.push(sh);
		}
	};
}();
Ext.override(Ext.layout.MenuLayout,{
	doAutoSize : function() {
		var ct = this.container, w = ct.width;
		if (ct.floating) {
			if (w) {
				ct.setWidth(w);
			} else if (Ext.isIE) {
				ct.setWidth(Ext.isStrict
					&& (Ext.isIE7 || Ext.isIE8
					|| Ext.isIE9 || Ext.isIE10) ? 'auto'
				: ct.minWidth);
				var el = ct.getEl(), t = el.dom.offsetWidth; // force
															// recalc
				ct.setWidth(ct.getLayoutTarget().getWidth()
					+ el.getFrameWidth('lr'));
			}
		}
	}
});
})();