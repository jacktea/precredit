package xg.framework.querychannel.support;

import java.util.List;
import java.util.Map;

import xg.framework.domain.Entity;

import xg.framework.util.JacksonUtil;

public class PagingParam {

	private Integer start;

	private Integer limit;

	private Class<?> entityClass;

	private String query;

	private WebQueryCdn webQueryCdn;

	@SuppressWarnings("unchecked")
	public <T extends Entity> Class<T> getEntityClass() {
		return (Class<T>) entityClass;
	}

	public <T extends Entity> void setEntityClass(Class<T> entityClass) {
		this.entityClass = entityClass;
	}

	public Integer getStart() {
		return start;
	}

	public void setStart(Integer start) {
		this.start = start;
	}

	public Integer getLimit() {
		return limit;
	}

	public void setLimit(Integer limit) {
		this.limit = limit;
	}

	public String getQuery() {
		return query;
	}

	public void setQuery(String query) {
		this.query = query;
	}

	public WebQueryCdn getWebQueryCdn() {
		if(webQueryCdn==null){
			return create(query);
		}
		return webQueryCdn;
	}

	public void setWebQueryCdn(WebQueryCdn webQueryCdn) {
		this.webQueryCdn = webQueryCdn;
	}

	public static WebQueryCdn create(String query) {
		if(null==query || "".equals(query.trim())){
			return null;
		}
		Map<String, Object> data = JacksonUtil.deserializeJsonToMap(query,
				String.class, Object.class);
		return create(data);
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static WebQueryCdn create(Map<String, Object> data) {
		String type = (String) data.get("type");
		if (type.equals("and") || type.equals("or")) {
			CompositeCdn ccdn = CompositeCdn.create(type);
			for (Object item : (List) data.get("data")) {
				ccdn.addCdn(create((Map) item));
			}
			return ccdn;
		} else {
			String field = (String) data.get("field");
			String op = (String) data.get("op");
			Comparable<?> value = (Comparable<?>) data.get("value");
			String dataType = (String) data.get("dataType");
			BaseCdn bcdn = new BaseCdn(type, field, op, value);
			if (dataType != null) {
				bcdn.setDataType(dataType);
			}
			return bcdn;
		}
	}

}
