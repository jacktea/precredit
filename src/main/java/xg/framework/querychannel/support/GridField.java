package xg.framework.querychannel.support;

import xg.framework.domain.ValueObject;

/**
 * 响应头中数据映射字段
 * @author XIAOGANG
 *
 */
public class GridField implements ValueObject{
	
	private static final long serialVersionUID = -670280868717833872L;

	private String name;
	
	private String mapping;
	
	private String text;

	public GridField(String name, String mapping) {
		super();
		this.name = name;
		this.mapping = mapping;
		this.text = name;
	}
	

	public GridField(String name, String mapping, String text) {
		super();
		this.name = name;
		this.mapping = mapping;
		this.text = text;
	}


	public String getName() {
		return name;
	}

	public String getMapping() {
		return mapping;
	}

	public String getText() {
		return text;
	}


	public void setText(String text) {
		this.text = text;
	}


	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		return result;
	}


	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		GridField other = (GridField) obj;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		return true;
	}



	
	
	

}
