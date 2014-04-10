package xg.framework.querychannel.support;

import java.util.List;
import java.util.Map;
/**
 * 对列数据进行格式化，可以对查询出的数据进行特殊处理
 * @author XIAOGANG
 *
 * @param <T>返回数据的类型
 */
public interface FieldDataFormat<T> {
	

	/**
	 * 数据格式化
	 * @param data			全部数据
	 * @param row			当前行数据
	 * @param rowIndex		当前行在结果集中的位子
	  * @param value		当前数据值
	 * @return
	 */
	public T format(List<Map<String, Object>> data,Map<String,Object> row,Integer rowIndex,Object value);

}
