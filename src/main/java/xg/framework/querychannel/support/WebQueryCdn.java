package xg.framework.querychannel.support;

import xg.framework.domain.QueryCriterion;


public interface WebQueryCdn {
	
	/**
	 * 获取类型
	 * @return
	 */
	public String getType();
	/**
	 * 转换为标准的查询
	 * @return
	 */
	public QueryCriterion convert();
	
}
