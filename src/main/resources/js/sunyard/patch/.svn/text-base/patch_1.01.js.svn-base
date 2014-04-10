Ext.ns('Ext.sunyard.form');
Ext.ux.form.TimePickerField = function(config) {
	Ext.ux.form.TimePickerField.superclass.constructor.call(this, config);
};
/**
 * 时间选择器
 * 
 * @class Ext.ux.form.TimePickerField
 * @extends Ext.form.Field
 */
Ext.extend(Ext.ux.form.TimePickerField, Ext.form.Field, {
			defaultAutoCreate : {
				tag : 'div'
			},
			cls : 'x-form-timepickerfield',
			hoursSpinner : null,
			minutesSpinner : null,
			secondsSpinner : null,
			spinnerCfg : {
				width : 40
			},
			spinnerFixBoundries : function(value) {
				if (value < this.field.minValue) {
					value = this.field.maxValue;
				}
				if (value > this.field.maxValue) {
					value = this.field.minValue;
				}
				return this.fixPrecision(value);
			},
			onRender : function(ct, position) {
				Ext.ux.form.TimePickerField.superclass.onRender.call(this, ct,
						position);
				this.rendered = false;
				this.date = new Date();
				var values = {};
				if (this.value) {
					values = this._valueSplit(this.value);
					this.date.setHours(values.h);
					this.date.setMinutes(values.m);
					this.date.setSeconds(values.s);
					delete this.value;
				} else {
					values = {
						h : this.date.getHours(),
						m : this.date.getMinutes(),
						s : this.date.getSeconds()
					};
				}
				var spinnerWrap = Ext.DomHelper.append(this.el, {
							tag : 'div'
						});
				var cfg = Ext.apply({}, this.spinnerCfg, {
							renderTo : spinnerWrap,
							readOnly : this.readOnly,
							disabled : this.disabled,
							listeners : {
								spin : {
									fn : this.onSpinnerChange,
									scope : this
								},
								valid : {
									fn : this.onSpinnerChange,
									scope : this
								},
								afterrender : {
									fn : function(spinner) {
										spinner.wrap.applyStyles('float: left');
									},
									single : true
								}
							}
						});
				this.hoursSpinner = new Ext.ux.form.SpinnerField(Ext.apply({},
						cfg, {
							minValue : 0,
							maxValue : 23,
							cls : 'first',
							value : values.h
						}));
				this.minutesSpinner = new Ext.ux.form.SpinnerField(Ext.apply(
						{}, cfg, {
							minValue : 0,
							maxValue : 59,
							value : values.m
						}));
				this.secondsSpinner = new Ext.ux.form.SpinnerField(Ext.apply(
						{}, cfg, {
							minValue : 0,
							maxValue : 59,
							value : values.s
						}));
				Ext.DomHelper.append(spinnerWrap, {
							tag : 'div',
							cls : 'x-form-clear-left'
						});
				this.rendered = true;
			},
			_valueSplit : function(v) {
				var split = v.split(':');
				return {
					h : split.length > 0 ? split[0] : 0,
					m : split.length > 1 ? split[1] : 0,
					s : split.length > 2 ? split[2] : 0
				};
			},
			onSpinnerChange : function() {
				if (!this.rendered) {
					return;
				}
				this.fireEvent('change', this, this.getRawValue());
			},
			disable : function() {
				Ext.ux.form.TimePickerField.superclass.disable.call(this);
				this.hoursSpinner.disable();
				this.minutesSpinner.disable();
				this.secondsSpinner.disable();
			},
			enable : function() {
				Ext.ux.form.TimePickerField.superclass.enable.call(this);
				this.hoursSpinner.enable();
				this.minutesSpinner.enable();
				this.secondsSpinner.enable();
			},
			setReadOnly : function(r) {
				Ext.ux.form.TimePickerField.superclass.setReadOnly
						.call(this, r);
				this.hoursSpinner.setReadOnly(r);
				this.minutesSpinner.setReadOnly(r);
				this.secondsSpinner.setReadOnly(r);
			},
			clearInvalid : function() {
				Ext.ux.form.TimePickerField.superclass.clearInvalid.call(this);
				this.hoursSpinner.clearInvalid();
				this.minutesSpinner.clearInvalid();
				this.secondsSpinner.clearInvalid();
			},
			getRawValue : function() {
				if (!this.hoursSpinner) {
					this.date = new Date();
					return {
						h : this.date.getHours(),
						m : this.date.getMinutes(),
						s : this.date.getSeconds()
					};
				} else {
					return {
						h : this.hoursSpinner.getValue(),
						m : this.minutesSpinner.getValue(),
						s : this.secondsSpinner.getValue()
					};
				}
			},
			setRawValue : function(v) {
				this.hoursSpinner.setValue(v.h);
				this.minutesSpinner.setValue(v.m);
				this.secondsSpinner.setValue(v.s);
			},
			isValid : function(preventMark) {
				return this.hoursSpinner.isValid(preventMark)
						&& this.minutesSpinner.isValid(preventMark)
						&& this.secondsSpinner.isValid(preventMark);
			},
			validate : function() {
				return this.hoursSpinner.validate()
						&& this.minutesSpinner.validate()
						&& this.secondsSpinner.validate();
			},
			getValue : function() {
				var v = this.getRawValue();
				return String.leftPad(v.h, 2, '0') + ':'
						+ String.leftPad(v.m, 2, '0') + ':'
						+ String.leftPad(v.s, 2, '0');
			},
			setValue : function(value) {
				if (!this.rendered) {
					this.value = value;
					return;
				}
				value = this._valueSplit(value);
				this.setRawValue(value);
				this.validate();
			}
		});

Ext.sunyard.form.TimePickerField = Ext.ux.form.TimePickerField;
/**
 * 带时间的日期空间
 * 
 * @class Ext.sunyard.form.DateTimePicker
 * @extends Ext.DatePicker
 */
Ext.sunyard.form.DateTimePicker = Ext.extend(Ext.DatePicker, {
	timeFormat : 'g:i:s A',
	timeLabel : '\u65f6\u95f4',// 时间
	timeWidth : 100,
	initComponent : function() {
		Ext.sunyard.form.DateTimePicker.superclass.initComponent.call(this);
		this.id = Ext.id();
		if (!this.tf) {
			this.tf = new Ext.ux.form.TimePickerField();
			this.tf.ownerCt = this;
		}

	},
	onRender : function(container, position) {
		Ext.sunyard.form.DateTimePicker.superclass.onRender.apply(this,
				arguments);
		var table = Ext.get(Ext.DomQuery.selectNode('table tbody',
				container.dom));
		this.submetBtnId = Ext.id();
		this.tdId = Ext.id();
		var tfEl = Ext.DomHelper.insertAfter(table.last(), [{
							tag : 'tr',
							children : [{
										tag : 'td',
										cls : 'x-date-bottom',
										html : '时间',
										style : 'width:30;',
										colspan : '1'
									}, {
										tag : 'td',
										cls : 'x-date-bottom ux-timefield tx',
										colspan : '2'
									}]
						}, {
							tag : 'tr',
							children : [{
										tag : 'td',
										cls : 'x-date-bottom',
										id : this.tdId,
										colspan : '3',
										align : "center"
									}]
						}], true);

		new Ext.Button({
					renderTo : this.tdId,
					text : '确认',
					tooltip : '确认',
					handler : function() {
						this.value = this.getDateTime(this.value);
						this.fireEvent("select", this, this.value, true);
						this.ownerCt.hide();
					},
					scope : this
				});
		try {
			this.tf.render(table.child('td.ux-timefield'));
		} catch (e) {
			alert(e);
		}
		var p = this.getEl().parent('div.x-layer');
		if (p) {
			if (Ext.isIE) {
				p.setStyle("height", p.getHeight() + 35);
			}
		}
	},
	setMinDate : function(dt) {
		this.minDate = Date.parseDate(dt, this.dateFormat + ' '
						+ this.timeFormat);
		this.min = dt;
		this.dtI = Date.parseDate(dt, this.dateFormat + ' ' + this.timeFormat);
		this.update(this.value, true);
	},
	handleDateClick : function(e, t) {
		e.stopEvent();
		if (!this.disabled && t.dateValue
				&& !Ext.fly(t.parentNode).hasClass('x-date-disabled')) {
			this.cancelFocus = this.focusOnSelect === false;
			this.setValue(new Date(t.dateValue));
			delete this.cancelFocus;
			this.fireEvent('select', this, this.value);
		}
	},
	setMaxDate : function(dt) {
		this.maxDate = Date.parseDate(dt, this.dateFormat + ' '
						+ this.timeFormat);
		this.max = dt;
		this.dtA = Date.parseDate(dt, this.dateFormat + ' ' + this.timeFormat);
		this.update(this.value, true);
		// alert('赋值：' + this.maxDate)
	},

	getValue : function() {
		return this.value;
	},

	setValue : function(value) {
		var old = this.value;
		if (!this.tf) {
			this.tf = new Ext.ux.form.TimePickerField();
			this.tf.ownerCt = this;
		}
		this.value = this.getDateTime(value);
	},
	getDateTime : function(value) {
		if (this.tf) {
			var dt = new Date();
			var timeval = this.tf.getValue();
			value = Date.parseDate(value.format(this.dateFormat) + ' '
							+ this.tf.getValue(), this.format);
		}
		return value;
	},
	selectToday : function() {
		if (this.todayBtn && !this.todayBtn.disabled) {
			this.value = this.getDateTime(new Date());
			this.fireEvent("select", this, this.value);
		}
	},
	update : function(date, forceRefresh) {
		this.maxDate = this.dtA || '';
		this.minDate = this.dtI || '';
		if (this.rendered) {
			var vd = this.activeDate, vis = this.isVisible();
			this.activeDate = date;
			if (!forceRefresh && vd && this.el) {
				var t = date.getTime();
				if (vd.getMonth() == date.getMonth()
						&& vd.getFullYear() == date.getFullYear()) {
					this.cells.removeClass('x-date-selected');
					this.cells.each(function(c) {
								if (c.dom.firstChild.dateValue == t) {
									c.addClass('x-date-selected');
									if (vis && !this.cancelFocus) {
										Ext.fly(c.dom.firstChild).focus(50);
									}
									return false;
								}
							}, this);
					return;
				}
			}
			var days = date.getDaysInMonth(), firstOfMonth = date
					.getFirstDateOfMonth(), startingPos = firstOfMonth.getDay()
					- this.startDay;

			if (startingPos < 0) {
				startingPos += 7;
			}
			days += startingPos;

			var pm = date.add('mo', -1), prevStart = pm.getDaysInMonth()
					- startingPos, cells = this.cells.elements, textEls = this.textNodes,
			// convert everything to numbers so it's fast
			day = 86400000, d = (new Date(pm.getFullYear(), pm.getMonth(),
					prevStart)).clearTime(), today = new Date().clearTime()
					.getTime(), sel = date.clearTime(true).getTime(), min = this.minDate
					? this.minDate.clearTime(true)
					: Number.NEGATIVE_INFINITY, max = this.maxDate
					? this.maxDate.clearTime(true)
					: Number.POSITIVE_INFINITY, ddMatch = this.disabledDatesRE, ddText = this.disabledDatesText, ddays = this.disabledDays
					? this.disabledDays.join('')
					: false, ddaysText = this.disabledDaysText, format = this.format;

			if (this.showToday) {
				var td = new Date().clearTime(), disable = (td < min
						|| td > max
						|| (ddMatch && format && ddMatch.test(td
								.dateFormat(format))) || (ddays && ddays
						.indexOf(td.getDay()) != -1));

				if (!this.disabled) {
					this.todayBtn.setDisabled(disable);
					this.todayKeyListener[disable ? 'disable' : 'enable']();
				}
			}

			var setCellClass = function(cal, cell) {
				cell.title = '';
				var t = d.getTime();
				cell.firstChild.dateValue = t;
				if (t == today) {
					cell.className += ' x-date-today';
					cell.title = cal.todayText;
				}
				if (t == sel) {
					cell.className += ' x-date-selected';
					if (vis) {
						Ext.fly(cell.firstChild).focus(50);
					}
				}
				// disabling
				if (t < min) {
					cell.className = ' x-date-disabled';
					cell.title = cal.minText;
					return;
				}
				if (t > max) {
					cell.className = ' x-date-disabled';
					cell.title = cal.maxText;
					return;
				}
				if (ddays) {
					if (ddays.indexOf(d.getDay()) != -1) {
						cell.title = ddaysText;
						cell.className = ' x-date-disabled';
					}
				}
				if (ddMatch && format) {
					var fvalue = d.dateFormat(format);
					if (ddMatch.test(fvalue)) {
						cell.title = ddText.replace('%0', fvalue);
						cell.className = ' x-date-disabled';
					}
				}
			};

			var i = 0;
			for (; i < startingPos; i++) {
				textEls[i].innerHTML = (++prevStart);
				d.setDate(d.getDate() + 1);
				cells[i].className = 'x-date-prevday';
				setCellClass(this, cells[i]);
			}
			for (; i < days; i++) {
				var intDay = i - startingPos + 1;
				textEls[i].innerHTML = (intDay);
				d.setDate(d.getDate() + 1);
				cells[i].className = 'x-date-active';
				setCellClass(this, cells[i]);
			}
			var extraDays = 0;
			for (; i < 42; i++) {
				textEls[i].innerHTML = (++extraDays);
				d.setDate(d.getDate() + 1);
				cells[i].className = 'x-date-nextday';
				setCellClass(this, cells[i]);
			}

			this.mbtn.setText(this.monthNames[date.getMonth()] + ' '
					+ date.getFullYear());

			if (!this.internalRender) {
				var main = this.el.dom.firstChild, w = main.offsetWidth;
				this.el.setWidth(w + this.el.getBorderWidth('lr'));
				Ext.fly(main).setWidth(w);
				this.internalRender = true;
				// opera does not respect the auto grow header center column
				// then, after it gets a width opera refuses to recalculate
				// without a second pass
				if (Ext.isOpera && !this.secondPass) {
					main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth + main.rows[0].cells[2].offsetWidth))
							+ 'px';
					this.secondPass = true;
					this.update.defer(10, this, [date]);
				}
			}
		}
	}
});

if (parseInt(Ext.version.substr(0, 1), 10) > 2) {
	Ext.menu.DateTimeItem = Ext.sunyard.form.DateTimePicker;
	Ext.override(Ext.menu.DateMenu, {
				initComponent : function() {
					this.on('beforeshow', this.onBeforeShow, this);
					if (this.strict = (Ext.isIE7 && Ext.isStrict)) {
						this.on('show', this.onShow, this, {
									single : true,
									delay : 20
								});
					}
					Ext.apply(this, {
								plain : true,
								showSeparator : false,
								items : this.picker = new Ext.DatePicker(Ext
										.apply({
													internalRender : this.strict
															|| !Ext.isIE,
													ctCls : 'x-menu-date-item'
												}, this.initialConfig))
							});
					Ext.menu.DateMenu.superclass.initComponent.call(this);
					this.relayEvents(this.picker, ["select"]);
					this.on('select', this.menuHide, this);
					if (this.handler) {
						this.on('select', this.handler, this.scope || this);
					}
				}
			});
} else {
	Ext.menu.DateTimeItem = function(config) {
		Ext.menu.DateTimeItem.superclass.constructor.call(this,
				new Ext.sunyard.form.DateTimePicker(config), config);
		this.picker = this.component;
		this.addEvents('select');

		this.picker.on("render", function(picker) {
					picker.getEl().swallowEvent("click");
					picker.container.addClass("x-menu-date-item");
				});

		this.picker.on("select", this.onSelect, this);
		this.picker.on('beforeshow', this.beforeshow, this);
	};

	Ext.extend(Ext.menu.DateTimeItem, Ext.menu.DateMenu, {
				onSelect : function(picker, date) {
					this.fireEvent("select", this, date, picker);
					Ext.menu.DateTimeItem.superclass.handleClick.call(this);
				}
			});
}

Ext.menu.DateTimeMenu = function(config) {
	Ext.menu.DateTimeMenu.superclass.constructor.call(this, config);
	this.plain = true;
	var di = new Ext.menu.DateTimeItem(config);
	this.add(di);
	this.picker = di;
	this.relayEvents(di, ["select"]);

	this.on('beforeshow', function() {
				if (this.picker) {
					this.picker.hideMonthPicker(true);
				}
			}, this);
};
Ext.extend(Ext.menu.DateTimeMenu, Ext.menu.Menu, {
	cls : 'x-date-menu',
	beforeDestroy : function() {
		this.picker.destroy();
	},
	hide : function(deep) {
		if (this.picker.tf.innerList) {
			if ((Ext.EventObject.within(this.picker.tf.innerList))
					|| (Ext.get(Ext.EventObject.getTarget()) == this.picker.tf.innerList))
				return false;
		}
		if (this.el && this.isVisible()) {
			this.fireEvent("beforehide", this);
			if (this.activeItem) {
				this.activeItem.deactivate();
				this.activeItem = null;
			}
			this.el.hide();
			this.hidden = true;
			this.fireEvent("hide", this);
		}
		if (deep === true && this.parentMenu) {
			this.parentMenu.hide(true);
		}
	}
});
/**
 * 带时间的日期输入框
 * 
 * @class Ext.sunyard.form.DateTimeField
 * @extends Ext.form.DateField
 */
Ext.sunyard.form.DateTimeField = Ext.extend(Ext.form.DateField, {
	id : Ext.id(),
	dateFormat : 'Y-m-d',
	timeFormat : 'H:i:s',
	clickToSelect : true,
	defaultAutoCreate : {
		tag : "input",
		type : "text",
		size : "20",
		autocomplete : "off"
	},
	initComponent : function() {
		var min = new Array();
		var max = new Array();
		min = this.minValue ? this.minValue.split(' ') : this.minValue;
		max = this.maxValue ? this.maxValue.split(' ') : this.maxValue;
		this.max = this.maxValue;
		this.min = this.minValue;
		this.maxValue = max ? max[0] : max;
		this.minValue = min ? min[0] : min;
		Ext.sunyard.form.DateTimeField.superclass.initComponent.call(this);
		this.format = this.dateFormat + ' ' + this.timeFormat;
		this.afterMethod('afterRender', function() {
					this.getEl().applyStyles('top:0');
				});
	},
	getValue : function() {
		return Ext.form.DateField.superclass.getValue.call(this) || "";
	},
	getValueToSet : function() {
		return this
				.parseDate(Ext.form.DateField.superclass.getValue.call(this))
				|| '';
	},
	setMinValue : function(dt) {
		if (this.menu) {
			this.menu.picker.setMinDate(dt);
			this.menu.picker.minText = String.format(this.minText, this
							.formatDate(dt));
			this.min = dt;
		}
	},
	setMaxValue : function(dt) {
		if (this.menu) {
			this.menu.picker.setMaxDate(dt);
			this.menu.picker.maxText = String.format(this.maxText, this
							.formatDate(dt));
			this.max = dt;
		}
	},
	isValid : function(preventMark) {
		if (this.disabled) {
			return true;
		}
		if (this.getEl().hasClass(this.invalidClass)) {
			return false;
		}
		var restore = this.preventMark;
		this.preventMark = preventMark === true;
		var v = this.validateValue(this.processValue(this.getRawValue()));
		this.preventMark = restore;
		return v;
	},
	onSelect : function(m, d, flag) {
		if (this.clickToSelect || flag) {
			this.setValue(d);
		}
		this.fireEvent('select', this, d);
		if (this.min && Date.parseDate(this.min, this.format) > d) {
			this.markInvalid(String.format(this.minText, this
							.formatDate(this.min)));
		} else if (this.max && d > Date.parseDate(this.max, this.format)) {
			this.markInvalid(String.format(this.maxText, this
							.formatDate(this.max)));
		}
		this.menu.cells = this.menu.el.select('table.x-date-inner tbody td');
		this.menu.cells.removeClass('x-date-selected');
		var t = d.clearTime(true).getTime();
		this.menu.cells.each(function(c) {
					if (c.dom.firstChild.dateValue == t) {
						c.addClass('x-date-selected');
						return false;
					}
				}, this);
	},
	getErrors : function(value) {
		var errors = Ext.form.TextField.superclass.getErrors.apply(this,
				arguments);

		value = Ext.isDefined(value) ? value : this.processValue(this
				.getRawValue());

		if (Ext.isFunction(this.validator)) {
			var msg = this.validator(value);
			if (msg !== true) {
				errors.push(msg);
			}
		}

		if (value.length < 1 || value === this.emptyText) {
			if (this.allowBlank) {
				// if value is blank and allowBlank is true, there cannot be any
				// additional errors
				return errors;
			} else {
				errors.push(this.blankText);
			}
		}

		if (!this.allowBlank && (value.length < 1 || value === this.emptyText)) { // if
			// it's
			// blank
			errors.push(this.blankText);
		}

		if (value.length < this.minLength) {
			errors.push(String.format(this.minLengthText, this.minLength));
		}

		if (value.length > this.maxLength) {
			errors.push(String.format(this.maxLengthText, this.maxLength));
		}

		if (this.vtype) {
			var vt = Ext.form.VTypes;
			if (!vt[this.vtype](value, this)) {
				errors.push(this.vtypeText || vt[this.vtype + 'Text']);
			}
		}

		if (this.regex && !this.regex.test(value)) {
			errors.push(this.regexText);
		}

		return errors;
	},
	onTriggerClick : function() {
		if (this.disabled) {
			return;
		}
		if (this.menu == null) {
			this.menu = new Ext.menu.DateTimeMenu();
		}

		Ext.apply(this.menu.picker, {
					minDate : this.minValue,
					maxDate : this.maxValue,
					min : this.min,
					max : this.max,
					disabledDatesRE : this.ddMatch,
					disabledDatesText : this.disabledDatesText,
					disabledDays : this.disabledDays,
					disabledDaysText : this.disabledDaysText,
					format : this.format,
					timeFormat : this.timeFormat,
					dateFormat : this.dateFormat,
					textId : this.id,
					showToday : false,
					minText : String.format(this.minText, this
									.formatDate(this.min)),
					maxText : String.format(this.maxText, this
									.formatDate(this.max))
				});
		if (this.menuEvents) {
			this.menuEvents('on');
		} else {
			this.menu.on(Ext.apply({}, this.menuListeners, {
						scope : this
					}));
		}
		this.menu.picker.setValue(this.getValueToSet() || new Date());
		this.menu.show(this.el, "tl-bl?");
	},
	formatDate : function(date) {
		return Ext.isDate(date) ? date.dateFormat(this.dateFormat + ' '
				+ this.timeFormat) : date;
	},
	validateBlur : function() {
		return !this.getEl().hasClass(this.invalidClass);
	},
	validateValue : function(value) {

		if (value.length < 1 || value === this.emptyText) {
			if (!this.allowBlank) {
				this.markInvalid(this.blankText);
				return false;
			}
		}
		value = this.formatDate(value);
		if (value.length < 1) {
			return true;
		}
		var svalue = value;
		value = this.parseDate(value);
		if (!value) {
			this.markInvalid(String.format(this.invalidText, svalue,
					this.format));
			return false;
		}
		var time = value.getTime();
		if (this.minValue && value < Date.parseDate(this.min, this.format)) {
			this.markInvalid(String.format(this.minText, this
							.formatDate(this.min)));
			return false;
		}
		if (this.max && value > Date.parseDate(this.max, this.format)) {
			this.markInvalid(String.format(this.maxText, this
							.formatDate(this.max)));
			return false;
		}
		if (this.disabledDays) {
			var day = value.getDay();
			for (var i = 0; i < this.disabledDays.length; i++) {
				if (day === this.disabledDays[i]) {
					this.markInvalid(this.disabledDaysText);
					return false;
				}
			}
		}
		var fvalue = this.formatDate(value);
		if (this.disabledDatesRE && this.disabledDatesRE.test(fvalue)) {
			this.markInvalid(String.format(this.disabledDatesText, fvalue));
			return false;
		}
		return true;
	}
});

Ext.sunyard.form.CompositeDataTimeField = Ext.extend(Ext.form.CompositeField, {
	allowBlank : true,
	id : this.id || Ext.id(),
	anchor : '95%',
	initComponent : function() {
		var labels = [], items = this.items, item;
		this.fieldLabel = this.fieldLabel || this.buildLabel(labels);
		if (this.allowBlank === false && this.fieldLabel) {
			this.fieldLabel += '<font color=red>*</font>';
		}
		this.fieldErrors = new Ext.util.MixedCollection(true, function(item) {
					return item.field;
				});
		this.fieldErrors.on({
					scope : this,
					add : this.updateInvalidMark,
					remove : this.updateInvalidMark,
					replace : this.updateInvalidMark
				});
		Ext.form.CompositeField.superclass.initComponent.apply(this, arguments);
		this.startId = Ext.id();
		this.endId = Ext.id();
		this.innerCt = new Ext.Container({
					layout : 'hbox',
					items : [{
								xtype : 's_datetimefield',
								itemId : this.startId,
								id : Ext.id(),
								flex : 1,
								name : this.startName,
								allowBlank : this.allowBlank,
								dateFormat : this.dateFormat,
								timeFormat : this.timeFormat
							}, {
								xtype : 's_datetimefield',
								itemId : this.endId,
								name : this.endName,
								id : Ext.id(),
								flex : 1,
								allowBlank : this.allowBlank,
								dateFormat : this.dateFormat,
								timeFormat : this.timeFormat
							}],
					cls : 'x-form-composite',
					defaultMargins : '0 3 0 0'
				});

		this.innerCt.getComponent(this.startId).on('change', function() {
					this.isError();
				}, this);
		this.innerCt.getComponent(this.endId).on('change', function() {
					this.isError();
				}, this);
		this.innerCt.getComponent(this.startId).on('focus', function() {
			this.innerCt.getComponent(this.endId).getValue() ? this.innerCt
					.getComponent(this.startId).setMaxValue(this.innerCt
							.getComponent(this.endId).getValue()) : '';
		}, this);
		this.innerCt.getComponent(this.endId).on('focus', function() {
			this.innerCt.getComponent(this.startId).getValue() ? this.innerCt
					.getComponent(this.endId).setMinValue(this.innerCt
							.getComponent(this.startId).getValue()) : '';
		}, this);

		var fields = this.innerCt.findBy(function(c) {
					return c.isFormField;
				}, this);
		this.items = new Ext.util.MixedCollection();
		this.items.addAll(fields);
	},
	getValue : function() {
		var s = this.innerCt.getComponent(this.startId);
		var e = this.innerCt.getComponent(this.endId);
		return (s.isValid() && e.isValid())
				? s.getValue() + ';' + e.getValue()
				: '';
	},
	isError : function() {
		var startV = this.innerCt.getComponent(this.startId).getValue();
		var endV = this.innerCt.getComponent(this.endId).getValue();
		if (endV != '' && startV > endV) {
			this.markInvalid('前时间必须小于后时间！');
		} else {
			this.clearInvalid();
		}
	},
	isValid : function(preventMark) {
		if (this.disabled) {
			return true;
		}
		if (this.getEl().hasClass(this.invalidClass)) {
			return false;
		}
		var restore = this.preventMark;
		this.preventMark = preventMark === true;
		var v = this.validateValue(this.processValue(this.getRawValue()));
		this.preventMark = restore;
		return v;
	},
	setValue : function(v) {
		var vs = new Array();
		vs = v.split(';');
		this.innerCt.getComponent(this.startId).setValue(vs[0]);
		this.innerCt.getComponent(this.endId).setValue(vs[1]);
		this.isError();
	}
});
Ext.sunyard.form.CompositeDataField = Ext.extend(Ext.form.CompositeField, {
	allowBlank : true,
	id : this.id || Ext.id(),
	anchor : '95%',
	initComponent : function() {
		var labels = [], items = this.items, item;
		this.fieldLabel = this.fieldLabel || this.buildLabel(labels);
		if (this.allowBlank === false && this.fieldLabel) {
			this.fieldLabel += '<font color=red>*</font>';
		}
		this.fieldErrors = new Ext.util.MixedCollection(true, function(item) {
					return item.field;
				});
		this.fieldErrors.on({
					scope : this,
					add : this.updateInvalidMark,
					remove : this.updateInvalidMark,
					replace : this.updateInvalidMark
				});
		Ext.form.CompositeField.superclass.initComponent.apply(this, arguments);
		this.startId = Ext.id();
		this.endId = Ext.id();
		this.innerCt = new Ext.Container({
					layout : 'hbox',
					items : [{
								itemId : this.startId,
								id : Ext.id(),
								name : this.startName,
								allowBlank : this.allowBlank,
								xtype : 's_datefield',
								flex : 1,
								format : this.format
							}, {
								xtype : 's_datefield',
								itemId : this.endId,
								flex : 1,
								name : this.endName,
								id : Ext.id(),
								allowBlank : this.allowBlank,
								format : this.format
							}],
					cls : 'x-form-composite',
					defaultMargins : '0 3 0 0'
				});
		this.innerCt.getComponent(this.startId).on('focus', function() {
			this.innerCt.getComponent(this.endId).getValue() ? this.innerCt
					.getComponent(this.startId).setMaxValue(this.innerCt
							.getComponent(this.endId).getValue()) : '';
		}, this);
		this.innerCt.getComponent(this.startId).on('change', function() {
					this.isError();
				}, this);
		this.innerCt.getComponent(this.endId).on('change', function() {
					this.isError();
				}, this);
		this.innerCt.getComponent(this.endId).on('focus', function() {
			this.innerCt.getComponent(this.startId).getValue() ? this.innerCt
					.getComponent(this.endId).setMinValue(this.innerCt
							.getComponent(this.startId).getValue()) : '';
		}, this);

		var fields = this.innerCt.findBy(function(c) {
					return c.isFormField;
				}, this);
		this.items = new Ext.util.MixedCollection();
		this.items.addAll(fields);
	},
	isValid : function(preventMark) {
		if (this.disabled) {
			return true;
		}
		if (this.getEl().hasClass(this.invalidClass)) {
			return false;
		}
		var restore = this.preventMark;
		this.preventMark = preventMark === true;
		var v = this.validateValue(this.processValue(this.getRawValue()));
		this.preventMark = restore;
		return v;
	},
	isError : function() {
		var startV = this.innerCt.getComponent(this.startId).getValue();
		var endV = this.innerCt.getComponent(this.endId).getValue();
		if (endV != '' && startV > endV) {
			this.markInvalid('前时间必须小于后时间！');
		} else {
			this.clearInvalid();
		}
	},
	getValue : function() {
		var s = this.innerCt.getComponent(this.startId);
		var e = this.innerCt.getComponent(this.endId);
		return (s.isValid() && e.isValid())
				? s.getValue() + ';' + e.getValue()
				: '';
	},
	setValue : function(v) {
		var vs = new Array();
		vs = v.split(';');
		this.innerCt.getComponent(this.startId).setValue(vs[0]);
		this.innerCt.getComponent(this.endId).setValue(vs[1]);
		this.isError();
	}
});
/**
 * 时间选择插件
 * 
 * @class Ext.sunyard.form.CompositeTimeField
 * @extends Ext.form.CompositeField
 */
Ext.sunyard.form.CompositeTimeField = Ext.extend(Ext.form.CompositeField, {
	allowBlank : true,
	anchor : '-363',
	id : this.id || Ext.id(),
	msgTarget : 'side',
	initComponent : function() {
		var labels = [], items = this.items, item;
		this.fieldLabel = this.fieldLabel || this.buildLabel(labels);
		if (this.allowBlank === false && this.fieldLabel) {
			this.fieldLabel += '<font color=red>*</font>';
		}
		this.fieldErrors = new Ext.util.MixedCollection(true, function(item) {
					return item.field;
				});
		this.fieldErrors.on({
					scope : this,
					add : this.updateInvalidMark,
					remove : this.updateInvalidMark,
					replace : this.updateInvalidMark
				});
		Ext.form.CompositeField.superclass.initComponent.apply(this, arguments);
		this.hour = Ext.id();
		this.minute = Ext.id();
		this.second = Ext.id();
		this.hiddeField = Ext.id();
		this.date = new Date();
		this.innerCt = new Ext.Container({
					layout : 'hbox',
					items : [{
								xtype : 'spinnerfield',
								name : 'test',
								minValue : 0,
								maxValue : 23,
								itemId : this.hour,
								value : this.date.getHours(),
								width : 40
							}, {
								xtype : 'spinnerfield',
								name : 'test',
								minValue : 0,
								maxValue : 59,
								itemId : this.minute,
								value : this.date.getMinutes(),
								width : 40
							}, {
								xtype : 'spinnerfield',
								name : 'test',
								minValue : 0,
								maxValue : 59,
								itemId : this.second,
								value : this.date.getSeconds(),
								width : 40
							}, {
								xtype : 'hidden',
								itemId : this.hiddeField,
								name : this.name,
								value : this.date.format('H:i:s')
							}],
					cls : 'x-form-composite',
					defaultMargins : '0 3 0 0'
				});

		this.on('afterrender', function() {
					this.innerCt.getComponent(this.hour).on('spin',
							this.checkDate, this);
					this.innerCt.getComponent(this.minute).on('spin',
							this.checkDate, this);
					this.innerCt.getComponent(this.second).on('spin',
							this.checkDate, this);
				}, this);

		var fields = this.innerCt.findBy(function(c) {
					return c.isFormField;
				}, this);
		this.items = new Ext.util.MixedCollection();
		this.items.addAll(fields);
	},
	isValid : function(preventMark) {
		if (this.disabled) {
			return true;
		}
		if (this.getEl().hasClass(this.invalidClass)) {
			return false;
		}
		var restore = this.preventMark;
		this.preventMark = preventMark === true;
		var v = this.validateValue(this.processValue(this.getRawValue()));
		this.preventMark = restore;
		return v;
	},
	checkDate : function() {
		var hour = this.innerCt.getComponent(this.hour);
		var second = this.innerCt.getComponent(this.second);
		var minute = this.innerCt.getComponent(this.minute);
		var hidde = this.innerCt.getComponent(this.hiddeField);
		var time = (hour.getValue() >= 10 ? hour.getValue() : ('0' + hour
				.getValue()))
				+ ':'
				+ (minute.getValue() >= 10 ? minute.getValue() : ('0' + minute
						.getValue()))
				+ ':'
				+ (second.getValue() >= 10 ? second.getValue() : ('0' + second
						.getValue()));
		hidde.setValue(time);
		if (this.maxValue
				&& Date.parseDate(time, 'H:i:s') > Date.parseDate(
						this.maxValue, 'H:i:s')) {
			this.markInvalid('时间必须在' + this.maxValue + '前');
			// hidde.markInvalid('时间必须在' + this.maxValue + '前');
		} else if (this.minValue
				&& Date.parseDate(time, 'H:i:s') < Date.parseDate(
						this.minValue, 'H:i:s')) {
			this.markInvalid('时间必须在' + this.minValue + '后');
			// hidde.markInvalid('时间必须在' + this.minValue + '后');
		} else {
			this.clearInvalid();
			hidde.clearInvalid();
		}
	},

	getValue : function() {
		return this.innerCt.getComponent(this.hiddeField).getValue();
	},
	setValue : function(v) {
		var vs = new Array();
		vs = v.split(':');
		this.innerCt.getComponent(this.hiddeField).setValue(v);
		this.innerCt.getComponent(this.hour).setValue(vs[0]);
		this.innerCt.getComponent(this.minute).setValue(vs[1]);
		this.innerCt.getComponent(this.second).setValue(vs[2]);
		this.checkDate();
	}
});

/**
 * 域输入框 用来代替form
 * 
 * @class Ext.sunyard.form.territoryInput
 * @extends Ext.Panel
 */
Ext.sunyard.form.TerritoryInput = Ext.extend(Ext.Panel, {
			hiddenId : Ext.id(),
			isFormField : true,
			initComponent : function() {
				this.id ? this.id = this.id : this.id = Ext.id();
				Ext.sunyard.form.TerritoryInput.superclass.initComponent
						.call(this);
			},
			onRender : function(ct, position) {
				Ext.sunyard.form.TerritoryInput.superclass.onRender.call(this,
						ct, position);
				this.hiddenField = this.el.insertSibling({
							tag : 'input',
							type : 'hidden',
							// type : 'text',
							name : this.name,
							id : this.hiddenId
						}, 'before', true);
			},
			initFields : function() {
				var f = this.form;
				f.clear();
				var formPanel = this;
				var fn = function(c) {
					if (formPanel.isField(c)) {
						f.add(c);
					} else if (c.findBy && c != formPanel) {
						formPanel.applySettings(c);
						if (c.items && c.items.each) {
							c.items.each(fn, this);
						}
					}
				};
				this.items.each(fn, this);
			},
			getName : function() {
				return this.rendered && this.el.dom.name
						? this.el.dom.name
						: this.name || this.id || '';
			},
			isField : function(c) {
				return !!c.setValue && !!c.getValue && !!c.markInvalid
						&& !!c.clearInvalid;
			},
			isValid : function(preventMark) {
				if (this.disabled) {
					return true;
				}
				var v = true;
				var restore = this.preventMark;
				this.preventMark = preventMark === true;
				if (!!(this.items)) {
					this.items.each(function(item, i) {
								v = item.validateValue(item.processValue(item
										.getRawValue()));
								if (!v) {
									return;
								}
							});
				} else {
					v = this.validateValue(this
							.processValue(this.getRawValue()));
				}
				this.preventMark = restore;
				return v;
			},
			validate : function() {
				var r = true;
				var errorM = '';
				this.items.each(function(item, i) {
							if (!item.isValid()) {
								errorM += '【' + item.name + '】';
								r = false;
							};
						}, this);
				Ext.get(this.hiddenId).dom.value = this.getValue();
				if (!r) {
					MSG.alert(errorM + '输入校验失败！');
				}
				return r;
			},
			setValue : function(v) {
				var objs = Ext.isString(v) ? Ext.decode(v) : v;
				this.items.each(function(item, i) {
							item.setValue(objs[item.name]);
						}, this);
			},
			getValue : function() {
				var l = this.items.length - 1;
				var v = '';
				this.items.each(function(item, i) {
							if (i === 0) {
								v += '{';
							}
							if (item.xtype === 's_territoryInput') {
								v += '\'' + item.name + '\':' + item.getValue();
							} else {
								v += '\'' + item.name + '\':\''
										+ item.getValue() + '\'';
							}
							if (i === l) {
								v += '}';
							} else {
								v += ',';
							}
						}, this);
				return v;
			},
			markInvalid : function(msg) {
				if (this.rendered && !this.preventMark) {
					msg = msg || this.invalidText;
					var mt = this.getMessageHandler();
					if (mt) {
						mt.mark(this, msg);
					} else if (this.msgTarget) {
						this.el.addClass(this.invalidClass);
						var t = Ext.getDom(this.msgTarget);
						if (t) {
							t.innerHTML = msg;
							t.style.display = this.msgDisplay;
						}
					}
				}

				this.setActiveError(msg);
			},
			clearInvalid : function() {
				if (this.rendered && !this.preventMark) {
					this.el.removeClass(this.invalidClass);
					var mt = this.getMessageHandler();
					if (mt) {
						mt.clear(this);
					} else if (this.msgTarget) {
						this.el.removeClass(this.invalidClass);
						var t = Ext.getDom(this.msgTarget);
						if (t) {
							t.innerHTML = '';
							t.style.display = 'none';
						}
					}
				}
				this.unsetActiveError();
			}
		});

/**
 * 级联单选下拉框
 * 
 * @class Ext.sunyard.form.CascadeComboBox
 * @extends Ext.sunyard.form.ComboBox
 */

Ext.sunyard.form.CascadeComboBox = Ext.extend(Ext.sunyard.form.ComboBox, {
			initComponent : function() {
				this.itemId = this.itemId || this.hiddenName || this.name;
				this.effectParamName = this.effectParamName || this.hiddenName
						+ '_param' || this.name + "_param";
				Ext.sunyard.form.CascadeComboBox.superclass.initComponent
						.call(this);
			},
			onRender : function(ct, position) {
				Ext.sunyard.form.CascadeComboBox.superclass.onRender.call(this,
						ct, position);
				this.on("select", this.resetEx, this);
				this.store.on("beforeload", this.setEffectParam, this);
			},
			resetEx : function() {
				var c = this.getEffectField();
				if (c) {
					c.reset();
					c.store.removeAll(true);
					c.lastQuery = null;
				}
			},
			setEffectParam : function(store, o) {// 子关联set自己的约束条件
				var n = this.depend;
				if (!n) {
					return null;
				} else {
					var t = true;
					var v = {};
					for (var i = 0; i < n.length; i++) {
						var c = this.getDependField(n[i]);
						if(c)
						if (c.getValue()=="") {
							t = false;
							break;
						}else{
							v[n[i]] = c.getValue();
						}
					}
					if (t) {
						o.params[this.effectParamName] = Ext.encode(v);
					} else {
						MSG.alert('请先选择上级！');
						this.lastQuery = null;
						return false;
					}
				}
			},
			getCasadeCmp : function(itemId, t) {
				t = t || this;
				var o = t.ownerCt;
				if (o) {
					var c = o.getComponent(itemId);
					if (c) {
						return c;
					} else {
						this.getCasadeCmp(o);
					}
				} else {
					return null;
				}
			},
			getEffectField : function() {
				if (!this.effect) {
					return null;
				}
				if (!this.effectField) {
					this.effectField = this.getCasadeCmp(this.effect);
				}
				return this.effectField;
			},
			getDependField : function(v) {
				return this.getCasadeCmp(v);
			}
		});

Ext.reg('timepickerfield', Ext.sunyard.form.TimePickerField);
Ext.reg('datetimepickerfield', Ext.sunyard.form.DateTimePicker);
Ext.reg('s_datetimefield', Ext.sunyard.form.DateTimeField);// 带时间的日期输入框
Ext.reg('s_compositeTimeField', Ext.sunyard.form.CompositeTimeField);// 时间输入框
Ext.reg('s_compositeDataField', Ext.sunyard.form.CompositeDataField);// 普通双日期控件
Ext.reg('s_compositeDataTimeField', Ext.sunyard.form.CompositeDataTimeField);// 精确到时间的双日期控件
Ext.reg('s_territoryInput', Ext.sunyard.form.TerritoryInput);// 域输入框
Ext.reg('s_cascadeComboBox', Ext.sunyard.form.CascadeComboBox);// 级联单选下拉框
