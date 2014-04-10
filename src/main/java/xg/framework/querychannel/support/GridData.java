package xg.framework.querychannel.support;

import java.beans.PropertyDescriptor;
import java.io.Serializable;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.BeanUtils;

import xg.framework.domain.Entity;
import xg.framework.jpa.internal.EntityUtils;

public class GridData implements Serializable{

	private static final long serialVersionUID = 9148559896364106320L;

	/**
	 * 是否成功
	 */
	private boolean success = true;
	/**
	 * success=false 时提示信息
	 */
	private String errorMessage;
	/**
	 * 总记录数
	 */
	private long count;
	/**
	 * 开始行数
	 */
	private int start;
	/**
	 * 每页大小
	 */
	private int limit;
	
	/**
	 * 数据响应头
	 */
	private MetaData metaData = new MetaData();
	
	/**
	 * 当前页的数据(size <=limit)
	 */
	private List<Map<String,Object>> results;
	
	public static Entity createVo(Entity in){
		if(null==in) 
			return null;
		Class<?> clazz = in.getClass();			
		try {
			Entity entity = (Entity)clazz.newInstance();
			PropertyDescriptor[] pds = BeanUtils.getPropertyDescriptors(clazz);
			for(PropertyDescriptor pd : pds){
				Method readMethod = pd.getReadMethod();
				if(null==readMethod) continue;
				if (!Modifier.isPublic(readMethod.getDeclaringClass()
						.getModifiers())) {
					readMethod.setAccessible(true);
				}
				Method writeMethod = pd.getWriteMethod();
				if(null==writeMethod) continue;
				if (!Modifier.isPublic(writeMethod.getDeclaringClass()
						.getModifiers())) {
					writeMethod.setAccessible(true);
				}
				Object propValue = readMethod.invoke(in);
				if(null==propValue) continue;
				Class<?> propType = pd.getPropertyType();
				if(Collection.class.isAssignableFrom(propType)) continue;
				if(Entity.class.isAssignableFrom(propType)){
					propValue = createVo((Entity)propValue);
				}
				writeMethod.invoke(entity, propValue);
			}
			return entity;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	public static <T extends Entity> GridData create(Page<T> page){
		GridData gd = new GridData();
		gd.start = page.getStart();
		gd.limit = page.getLimit();
		gd.count = page.getCount();
		List<Map<String,Object>> results = new ArrayList<Map<String,Object>>();
		for(T t : page.getResults()){
			EntityUtils e = new EntityUtils(createVo(t));
			Map<String,Object> map = e.getPropValues();
			Iterator<Entry<String, Object>> iter = map.entrySet().iterator();
			while(iter.hasNext()){
				Entry<String, Object> entry = iter.next();
				Object value = entry.getValue();
				if(null==value)continue;
			}
			results.add(map);
		}
		gd.results = results;
		return gd;
	}
	
	/**
	 * 添加列
	 * @param name			列英文名
	 * @param text			列中文名
	 * @param defaultValue	默认值
	 * @param formator		格式化函数
	 */
	public void addCol(String name,String text,Object defaultValue,FieldDataFormat<?> formator){
		metaData.addField(new GridField(name,name,text));
		for(Map<String, Object> m : results){
			m.put(name, formator.format(results,m,results.indexOf(m), defaultValue));
		}
	}
	/**
	 * 移除列
	 * @param name		列名
	 */
	public void removeCol(String name){
		metaData.removeField(name);
		for(Map<String, Object> m : results){
			m.remove(name);
		}
	}
	/**
	 * 格式化列的数据
	 * @param name		列名
	 * @param formator	格式化函数
	 */
	public void formatCol(String name,FieldDataFormat<?> formator){
		for(Map<String, Object> m : results){
			m.put(name, formator.format(results,m,results.indexOf(m), m.get(name)));
		}
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


	public boolean getSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public long getCount() {
		return count;
	}

	public void setCount(long count) {
		this.count = count;
	}

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

	public List<Map<String, Object>> getResults() {
		return results;
	}

	public void setResults(List<Map<String, Object>> results) {
		this.results = results;
	}
	
	/**
	 * 判断类型是否为基本类型的包装类型
	 * @param clazz
	 * @return	true | false
	 */
	public static boolean isWrapClass(Class<?> clazz){
		try {
			return ((Class<?>)clazz.getField("TYPE").get(null)).isPrimitive();
		} catch (Exception e) {
			return false;
		}
	}
	/**
	 * 是否为基本类型
	 * <ul>
	 * <li>boolean | Boolean</li>
	 * <li>byte | Byte</li>
	 * <li>char | Character</li>
	 * <li>short | Short</li>
	 * <li>int | Integer</li>
	 * <li>long | Long</li>
	 * <li>float | Float</li>
	 * <li>double | Double</li>
	 * <li>void | Void</li>
	 * <li>String</li>
	 * </ul>
	 * @param clazz
	 * @return	true | false
	 */
	public static boolean isPrimitive(Class<?> clazz){
		if(clazz.equals(String.class)){
			return true;
		}
		if(clazz.isPrimitive()){
			return true;
		}
		if(isWrapClass(clazz)){
			return true;
		}
		return false;
	}
	

}
