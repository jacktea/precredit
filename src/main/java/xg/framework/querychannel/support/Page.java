package xg.framework.querychannel.support;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

/**
 * 功能描述: 分页对象. 包含当前页数据及分页信息如总记录数.
 * 
 */
public class Page<T> implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5859907455479273251L;

	public static int DEFAULT_PAGE_SIZE = 10;

	private int limit = DEFAULT_PAGE_SIZE; // 每页的记录数

	private int start; // 当前页第一条数据在List中的位置,从0开始

	private List<T> data; // 当前页中存放的记录,类型一般为List

	private long count; // 总记录数

	/**
	 * 构造方法，只构造空页.
	 */
	public Page() {
		this(0, 0, DEFAULT_PAGE_SIZE, new ArrayList<T>());
	}

	public Page(int limit) {
		this(0, 0, limit, new ArrayList<T>());
	}

	/**
	 * 默认构造方法.
	 * 
	 * @param start
	 *            本页数据在数据库中的起始位置
	 * @param totalSize
	 *            数据库中总记录条数
	 * @param pageSize
	 *            本页容量
	 * @param data
	 *            本页包含的数据
	 */
	public Page(int start, long count, int limit, List<T> data) {
		this.limit = limit;
		this.start = start;
		this.count = count;
		this.data = data;
	}
	
	public boolean getSuccess() {
		return true;
	}

	public int getStart() {
		return start;
	}

	/**
	 * 取总记录数.
	 */
	public long getCount() {
		return this.count;
	}

	/**
	 * 取总页数.
	 */
	public long getTotalPageCount() {
		if (count % limit == 0)
			return count / limit;
		else
			return count / limit + 1;
	}

	/**
	 * 取每页数据容量.
	 */
	public int getLimit() {
		return limit;
	}

	/**
	 * 取当前页中的记录.
	 */
	public List<T> getResults() {
		return data;
	}

	/**
	 * 取该页当前页码,页码从1开始.
	 */
	public long getCurrentPageNo() {
		return start / limit + 1;
	}

	/**
	 * 该页是否有下一页.
	 */
	public boolean hasNextPage() {
		return this.getCurrentPageNo() < this.getTotalPageCount();
	}

	/**
	 * 该页是否有上一页.
	 */
	public boolean hasPreviousPage() {
		return this.getCurrentPageNo() > 1;
	}

	/**
	 * 获取任一页第一条数据在数据集的位置，每页条数使用默认值.
	 * 
	 * @see #getStartOfPage(int,int)
	 */
	protected static int getStartOfPage(int pageNo) {
		return getStartOfPage(pageNo, DEFAULT_PAGE_SIZE);
	}

	/**
	 * 获取任一页第一条数据在数据集的位置.
	 * 
	 * @param pageNo
	 *            从1开始的页号
	 * @param pageSize
	 *            每页记录条数
	 * @return 该页第一条数据
	 */
	public static int getStartOfPage(int pageNo, int pageSize) {
		return (pageNo - 1) * pageSize;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this,
				ToStringStyle.SHORT_PREFIX_STYLE);
	}
}
