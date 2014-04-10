package xg.framework.querychannel.support;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * GRID响应头
 * 
 * @author XIAOGANG
 * 
 */
public class MetaData {
	
	private String idProperty;
	
	private String root = "results";
	
	private String totalProperty = "count";
	
	private String successProperty = "success";
	
	private Map<String, String> sortInfo;
	
	private List<GridField> fields;

	public String getIdProperty() {
		return idProperty;
	}

	public void setIdProperty(String idProperty) {
		this.idProperty = idProperty;
	}

	public String getRoot() {
		return root;
	}

	public void setRoot(String root) {
		this.root = root;
	}

	public String getTotalProperty() {
		return totalProperty;
	}

	public void setTotalProperty(String totalProperty) {
		this.totalProperty = totalProperty;
	}

	public String getSuccessProperty() {
		return successProperty;
	}

	public void setSuccessProperty(String successProperty) {
		this.successProperty = successProperty;
	}

	public Map<String, String> getSortInfo() {
		return sortInfo;
	}

	public void setSortInfo(Map<String, String> sortInfo) {
		this.sortInfo = sortInfo;
	}

	public List<GridField> getFields() {
		return fields;
	}

	public void addField(GridField... fs) {
		if (null == fields)
			fields = new ArrayList<GridField>();
		for (GridField field : fs)
			if (fields.indexOf(field) == -1)
				fields.add(field);
	}
	
	public void removeField(String... name){
		if(null==fields) return;
		for(String n : name){
			removeField(new GridField(n, n));
		}
	}

	public void removeField(GridField... fs) {
		if (null == fields) return;
		for (GridField field : fs) {
			int index = -1;
			if ((index = fields.indexOf(field)) != -1)
				fields.remove(index);
		}

	}

}
