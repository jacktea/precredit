package xg.framework.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.annotate.JsonSerialize;
import org.codehaus.jackson.map.annotate.JsonSerialize.Inclusion;

/**
 * 表单或AJAX处理的返回对象
 * 
 * @author XIAOGANG
 * 
 * @param <T>返回对象所包含的数据的类型，可能前台要根据此数据进行特殊处理
 */
@JsonSerialize(include = Inclusion.NON_NULL)
public class JsonFormResult<T> {
	public boolean success = true;
	public T data;
	private List<T> results;
	public Map<String, String> errors;
	public String errorMessage;

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
		if (null == results)
			results = new ArrayList<T>();
		results.add(data);
	}

	public Map<String, String> getErrors() {
		return errors;
	}

	public void setErrors(Map<String, String> errors) {
		this.errors = errors;
	}

	public void setError(String field, String msg) {
		if (null == errors)
			errors = new HashMap<String, String>();
		errors.put(field, msg);
	}

	public List<T> getResults() {
		return results;
	}

	public void setResults(List<T> results) {
		this.results = results;
	}
}
