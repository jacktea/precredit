package xg.framework.querychannel.support;

import xg.framework.domain.Criterions;
import xg.framework.domain.QueryCriterion;

public class BaseCdn implements WebQueryCdn {

	private String type;

	private String field;

	private String op;

	private Comparable<?> value;

	private String dataType;

	public BaseCdn() {

	}

	public static BaseCdn create(String type, String field, String op,
			Comparable<?> value) {
		return new BaseCdn(type, field, op, value);
	}

	public BaseCdn(String type, String field, String op, Comparable<?> value) {
		super();
		this.type = type;
		this.field = field;
		this.op = op;
		this.value = value;
		if (!type.toLowerCase().equals("list")) {
			this.dataType = type;
		}
	}

	public BaseCdn(String type, String field, String op, Comparable<?> value,
			String dataType) {
		super();
		this.type = type;
		this.field = field;
		this.op = op;
		this.value = value;
		this.dataType = dataType;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getField() {
		return field;
	}

	public void setField(String field) {
		this.field = field;
	}

	public String getOp() {
		return op;
	}

	public void setOp(String op) {
		this.op = op;
	}

	public Comparable<?> getValue() {
		return value;
	}

	public void setValue(Comparable<?> value) {
		this.value = value;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	@Override
	public String toString() {
		return "BaseCdn [type=" + type + ", field=" + field + ", op=" + op
				+ ", value=" + value + ", dataType=" + dataType + "]";
	}

	public QueryCriterion convert() {
		Criterions criterions = Criterions.singleton();
		if (op.equals("eq")) {
			return criterions.eq(field, value);
		} else if (op.equals("notEq")) {
			return criterions.notEq(field, value);
		} else if (op.equals("gt")) {
			return criterions.gt(field, value);
		} else if (op.equals("lt")) {
			return criterions.lt(field, value);
		} else if (op.equals("ge")) {
			return criterions.ge(field, value);
		} else if (op.equals("le")) {
			return criterions.le(field, value);
		} else if (op.equals("like")) {
			return criterions.containsText(field, (String) value);
		}
		return null;
	}

	/*
	 * public static WebQueryCdn create(Map<String, Object> data) { String type
	 * = (String)data.get("type"); String field = (String)data.get("field");
	 * String op = (String)data.get("op"); Comparable<?> value =
	 * (Comparable<?>)data.get("value"); String dataType =
	 * (String)data.get("dataType"); BaseCdn bcdn = new
	 * BaseCdn(type,field,op,value); if(dataType!=null){
	 * bcdn.setDataType(dataType); } return bcdn; }
	 */

}
