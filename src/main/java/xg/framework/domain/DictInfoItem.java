package xg.framework.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="xg_dict_info")
public class DictInfoItem extends AbstractEntity{

	private static final long serialVersionUID = 9060284786900941043L;

	@Column
	private String dictType;
	
	@Column
	private String dictValue;
	
	@Column
	private String dictText;

	public DictInfoItem() {
		
	}

	public DictInfoItem(String dictType, String dictValue, String dictText) {
		this.dictType = dictType;
		this.dictValue = dictValue;
		this.dictText = dictText;
	}

	public String getDictType() {
		return dictType;
	}

	public void setDictType(String dictType) {
		this.dictType = dictType;
	}

	public String getDictValue() {
		return dictValue;
	}

	public void setDictValue(String dictValue) {
		this.dictValue = dictValue;
	}

	public String getDictText() {
		return dictText;
	}

	public void setDictText(String dictText) {
		this.dictText = dictText;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((dictText == null) ? 0 : dictText.hashCode());
		result = prime * result
				+ ((dictType == null) ? 0 : dictType.hashCode());
		result = prime * result
				+ ((dictValue == null) ? 0 : dictValue.hashCode());
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
		DictInfoItem other = (DictInfoItem) obj;
		if (dictText == null) {
			if (other.dictText != null)
				return false;
		} else if (!dictText.equals(other.dictText))
			return false;
		if (dictType == null) {
			if (other.dictType != null)
				return false;
		} else if (!dictType.equals(other.dictType))
			return false;
		if (dictValue == null) {
			if (other.dictValue != null)
				return false;
		} else if (!dictValue.equals(other.dictValue))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "DictInfoItem [dictType=" + dictType + ", dictValue=" + dictValue + ", dictText="
				+ dictText +  "]";
	}
	
}
