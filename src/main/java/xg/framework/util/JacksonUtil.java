package xg.framework.util;

import java.io.File;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig.Feature;
import org.codehaus.jackson.map.type.CollectionType;
import org.codehaus.jackson.map.type.MapType;
import org.codehaus.jackson.map.type.TypeFactory;
import org.codehaus.jackson.type.JavaType;
import org.codehaus.jackson.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class JacksonUtil {
	
	protected static final Logger log = LoggerFactory.getLogger(JacksonUtil.class);
	
	private static final ObjectMapper mapper = new ObjectMapper();
	
	static {
		//mapper.enable(Feature.INDENT_OUTPUT);
		//mapper.disable(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES);
	}
	

	/**
	 * 序列化对象to JSON
	 * @param obj			要序列化的对象
	 * @return				序列化后的对象
	 */
	public static String serializeObjectToJson(final Object obj) {
		try {
/*			ObjectMapper mapper = new ObjectMapper();

			if (indent) {
				mapper.getSerializationConfig().enable(Feature.INDENT_OUTPUT);
			}*/

			return mapper.writeValueAsString(obj);
		} catch (Exception e) {
			log.error(
					"serialize object to json", e);
			return null;
		}
	}
	
	public static String serializeObjectToJson(final Object obj,boolean indent) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			mapper.enable(Feature.INDENT_OUTPUT);
			return mapper.writeValueAsString(obj);
		} catch (Exception e) {
			log.error(
					"serialize object to json", e);
			return null;
		}
	}
	
	public static void serializeObjectToFile(Object obj,File file,boolean indent){
		try {
			ObjectMapper mapper = new ObjectMapper();
			if(indent)
			mapper.enable(Feature.INDENT_OUTPUT);
			mapper.writeValue(file, obj);
		} catch (Exception e) {
			log.error(
					"serialize object to json", e);
		}
	}
	
	public static <T> T deserializeFormFile(File file,Class<T> clazz,boolean indent){
		try {
			ObjectMapper mapper = new ObjectMapper();
			if(indent)
			mapper.enable(Feature.INDENT_OUTPUT);
			return mapper.readValue(file, clazz);
		} catch (Exception e) {
			log.error(
					"deserializeFormFile", e);
		}
		return null;
	}

	/**
	 * 反序列化JSON字符串到对象
	 * @param <T>				对象类型
	 * @param json				要反序列化JSON字符串
	 * @param typeReference		类型帮助类(带泛型类T为List,Map等泛型类)
	 * @return					反序列化后的对象
	 */
	@SuppressWarnings("unchecked")
	public static <T> T deserializeJsonToObject(final String json,
			final TypeReference<T> typeReference) {
		try {
/*			ObjectMapper mapper = new ObjectMapper();
			mapper.getDeserializationConfig().disable(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES);*/
			return (T) mapper.readValue(json, typeReference);
		} catch (Exception e) {
			log.error(
					"deserialize json to object", e);
			return null;
		}
	}

	/**
	 * 反序列化JSON字符串到对象
	 * @param <T>		对象类型
	 * @param json		要反序列化JSON字符串
	 * @param clazz		普通对象类型
	 * @return			反序列化后的对象
	 */
	public static <T> T deserializeJsonToObject(final String json,
			final Class<T> clazz) {
		try {
/*			ObjectMapper mapper = new ObjectMapper();
			mapper.getDeserializationConfig().disable(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES);*/
			return mapper.readValue(json, clazz);
		} catch (Exception e) {
			log.error(
					"deserialize json to object", e);
			return null;
		}
	}
	/**
	 * 反序列化JSON字符串到对象
	 * @param json		要反序列化JSON字符串
	 * @param jt		JavaType表示的对象
	 * @return			反序列化后的对象
	 */
	public static Object deserializeJsonToObject(final String json,final JavaType jt){
		try {
/*			ObjectMapper mapper = new ObjectMapper();
			mapper.getDeserializationConfig().disable(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES);*/
			return mapper.readValue(json, jt);
		} catch (Exception e) {
			log.error(
					"deserialize json to object", e);
			return null;
		}
	}
	/**
	 * 获取List类型的JavaType对象
	 * @param <T>			List内部泛型
	 * @param clazz			List内部对象类型
	 * @return				List类型的JavaType对象
	 */
	public static <T> JavaType getListJavaType(final Class<T> clazz){
		TypeFactory instance = TypeFactory.defaultInstance();
		JavaType[] pt = new JavaType[]{instance._constructType(clazz, null)};
		JavaType subtype = instance.constructSimpleType(List.class, pt);
        JavaType[] collectionParams = instance.findTypeParameters(subtype, Collection.class);
        if (collectionParams.length != 1) {
            throw new IllegalArgumentException("Could not find 1 type parameter for Collection class list (found "+collectionParams.length+")");
        }
        JavaType jt = CollectionType.construct(List.class, collectionParams[0]);
        return jt;
	}
	/**
	 * 反序列化JSON到List对象
	 * @param <T>		List内部类型
	 * @param json		JSON字符串
	 * @param clazz		List内部类型
	 * @return			List对象
	 */
	public static <T> List<T> deserializeJsonToList(final String json,final Class<T> clazz){
        JavaType jt = getListJavaType(clazz);
        try {
			return mapper.readValue(json, jt);
		} catch (Exception e) {
			log.error(
					"deserialize json to object", e);
			return null;
		} 
	}
	/**
	 * 获取Map类型的JavaType对象
	 * @param <K>			
	 * @param <V>
	 * @param clazzKey			Map key Type
	 * @param clazzValue		Map value Type
	 * @return					Map类型的JavaType对象
	 */
	public static <K,V> JavaType getMapJavaType(final Class<K> clazzKey,final Class<V> clazzValue){
		TypeFactory instance = TypeFactory.defaultInstance();
		JavaType[] pt = new JavaType[]{instance._constructType(clazzKey, null),instance._constructType(clazzValue, null)};
		JavaType subtype = instance.constructSimpleType(Map.class, pt);
		JavaType[] mapParams = instance.findTypeParameters(subtype, Map.class);
        if (mapParams.length != 2) {
            throw new IllegalArgumentException("Could not find 2 type parameter for Map class map (found "+mapParams.length+")");
        }
        JavaType jt = MapType.construct(Map.class, mapParams[0], mapParams[1]);
        return jt;
	}
	
	/**
	 * JSON to Map
	 * @param <K>
	 * @param <V>
	 * @param json			JSON 字符串
	 * @param clazzKey		key Type
	 * @param clazzValue	value Type
	 * @return				Map<K,V>对象
	 */
	public static <K,V> Map<K,V> deserializeJsonToMap(final String json,final Class<K> clazzKey,final Class<V> clazzValue){
        JavaType jt = getMapJavaType(clazzKey,clazzValue);
        try {
			return mapper.readValue(json, jt);
		} catch (Exception e) {
			log.error(
					"deserialize json to object", e);
			return null;
		}
	}
	/**
	 * JSON to List<Map>
	 * @param <K>
	 * @param <V>
	 * @param json			JSON字符串
	 * @param clazzKey		key Type
	 * @param clazzValue	value Type
	 * @return				List<Map<K,V>>对象
	 */
	public static <K,V> List<Map<K,V>> deserializeJsonToListMap(final String json,final Class<K> clazzKey,final Class<V> clazzValue){
		JavaType tmp = getMapJavaType(clazzKey, clazzValue);		
		TypeFactory instance = TypeFactory.defaultInstance();
		JavaType[] pt = new JavaType[]{tmp};
		JavaType subtype = instance.constructSimpleType(List.class, pt);
        JavaType[] collectionParams = instance.findTypeParameters(subtype, Collection.class);
        if (collectionParams.length != 1) {
            throw new IllegalArgumentException("Could not find 1 type parameter for Collection class list (found "+collectionParams.length+")");
        }
        JavaType jt = CollectionType.construct(List.class, collectionParams[0]);
        try {
			return mapper.readValue(json, jt);
		} catch (Exception e) {
			log.error(
					"deserialize json to object", e);
			return null;
		} 
	}

}
