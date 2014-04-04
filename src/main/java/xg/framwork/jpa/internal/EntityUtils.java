package xg.framwork.jpa.internal;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.PropertyUtilsBean;

/**
 * 实体工具类。用来获取实体的属性集，属性类型、属性值等，并对属性值在真实类型和字符串形式之间进行双向转换。
 * 
 * @author cnyangyu
 * 
 */
public class EntityUtils {

	private static final String CLAZZ_PROP = "class";
	private static final String VERSION_PROP = "version";
	private static final String ID_PROP = "id";
	private static final String NEW_PROP = "new";
	private Object entity;
	private Class<?> entityClass;
	private Map<String, Class<?>> propTypes;
	private List<String> propNames;
	private PropertyUtilsBean propertyUtilsBean = new PropertyUtilsBean();

	public EntityUtils(Object entity) {
		super();
		this.entity = entity;
		entityClass = entity.getClass();
		propTypes = getPropTypes(entityClass);
		propNames = getPropNames(entityClass);
	}
	
	public static void copyProperties(Object source,Object target){
		copyProperties(source, target, null);
	}
	
	public static void copyProperties(Object source,Object target,String[] ignoreProperties){
		EntityUtils sourceUtil = new EntityUtils(source);
		EntityUtils targetUtil = new EntityUtils(target);
		List<String> srcPropNames = sourceUtil.getPropNames();
		List<String> ignore = null==ignoreProperties ? new ArrayList<String>() : Arrays.asList(ignoreProperties);
		for(String propName : srcPropNames){
			if(ignore.indexOf(propName)!=-1)
				continue;
			Class<?> srcType = sourceUtil.getPropType(propName);
			Class<?> targetType = targetUtil.getPropType(propName);
			if(null!=targetType && srcType.equals(targetType)){
				Object value = sourceUtil.getPropValue(propName);
				if(null==value)
					continue;
				targetUtil.setPropValue(propName, value);
			}
			
		}
	}

	/**********************************************************************************************
	 * 第一部分 类级别的方法。
	 **********************************************************************************************/

	/**
	 * 获取指定实体类性的所有属性的数据类型
	 * 
	 * @param entityClass
	 * @return
	 */
	public static Map<String, Class<?>> getPropTypes(Class<?> entityClass) {
		Map<String, Class<?>> results = new HashMap<String, Class<?>>();
		BeanInfo beanInfo = null;
		try {
			beanInfo = Introspector.getBeanInfo(entityClass);
		} catch (IntrospectionException e) {
			throw new RuntimeException("类型" + entityClass + "不存在。", e);
		}
		PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
		for (PropertyDescriptor each : propertyDescriptors) {
			results.put(each.getName(), each.getPropertyType());
		}
		results.remove(CLAZZ_PROP);
		results.remove(VERSION_PROP);
		results.remove(ID_PROP);
		results.remove(NEW_PROP);
		return results;
	}

	/**
	 * 获取指定实体类型的指定属性的数据类型
	 * 
	 * @param entityClass
	 * @param propName
	 * @return
	 */
	public static Class<?> getPropType(Class<?> entityClass, String propName) {
		return getPropTypes(entityClass).get(propName);
	}

	/**
	 * 获取指定实体类的属性名的集合
	 * 
	 * @param entityClass
	 * @return
	 */
	public static List<String> getPropNames(Class<?> entityClass) {
		List<String> results = new ArrayList<String>();
		BeanInfo beanInfo = null;
		try {
			beanInfo = Introspector.getBeanInfo(entityClass);
		} catch (IntrospectionException e) {
			throw new RuntimeException("解析类型" + entityClass + "失败。", e);
		}
		PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
		for (PropertyDescriptor each : propertyDescriptors) {
			results.add(each.getName());
		}
		results.remove(CLAZZ_PROP);
		results.remove(VERSION_PROP);
		results.remove(ID_PROP);
		results.remove(NEW_PROP);
		return results;
	}

	/**********************************************************************************************
	 * 第二部分 对象级别的方法。
	 **********************************************************************************************/
	/**
	 * 获取所有属性的名字
	 * 
	 * @return
	 */
	public List<String> getPropNames() {
		return propNames;
	}

	/**
	 * 获得属性名到属性类型的映射
	 * 
	 * @return
	 */
	public Map<String, Class<?>> getPropTypes() {
		return propTypes;
	}

	/**
	 * 获得指定属性的类型
	 * 
	 * @param propName
	 * @return
	 * @throws IntrospectionException
	 */
	public Class<?> getPropType(String propName) {
		return propTypes.get(propName);
	}

	/**
	 * 获得属性名到属性值的映射
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> getPropValues() {
		Map<Object, Object> props = null;
		try {
			props = propertyUtilsBean.describe(entity);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		Map<String, Object> results = new HashMap<String, Object>();
		for (Map.Entry<Object, Object> each : props.entrySet()) {
			results.put((String)each.getKey(), each.getValue());
		}
		results.remove(CLAZZ_PROP);
		results.remove(VERSION_PROP);
		//results.remove(ID_PROP);
		results.remove(NEW_PROP);
		return results;
	}
	
	@SuppressWarnings("unchecked")
	public Map<String, Object> getPropValuesForVo() {
		Map<Object, Object> props = null;
		try {
			props = propertyUtilsBean.describe(entity);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		Map<String, Object> results = new HashMap<String, Object>();
		for (Map.Entry<Object, Object> each : props.entrySet()) {
			results.put((String)each.getKey(), each.getValue());
		}
		results.remove(CLAZZ_PROP);
		results.remove(VERSION_PROP);
		//results.remove(ID_PROP);
		results.remove(NEW_PROP);
		return results;
	}

	/**
	 * 获得指定属性的值
	 * 
	 * @param propName
	 * @return
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 * @throws NoSuchMethodException
	 */
	public Object getPropValue(String propName) {
		return getPropValues().get(propName);
	}
	
	public void setPropValue(String propName,Object value) {
		try {
			propertyUtilsBean.setProperty(this.entity, propName, value);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		}
	}
	public static void main(String[] args) {
		List<String> ss = getPropNames(EntityUtils.class);
		for(String s : ss){
			System.out.println(s);
		}
	}
}
