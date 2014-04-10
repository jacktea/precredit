package xg.framework.web.support;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import xg.framework.domain.DictInfoItem;
import xg.framework.domain.Entity;
import xg.framework.domain.QueryCriterion;
import xg.framework.domain.QuerySettings;
import xg.framework.querychannel.support.FieldDataFormat;
import xg.framework.querychannel.support.GridData;
import xg.framework.querychannel.support.WebQueryCdn;

public abstract class WebUtils {
	
	static String dictFilePath(){
		ClassLoader cl = Thread.currentThread().getContextClassLoader();
		if(null==cl){
			cl = WebUtils.class.getClassLoader();
		}
		URL url = cl.getResource("dict/dict.xml");
		return url.getPath();
	}
	
	/**
	 * 根据数据字典类型，获取具体字典数据列表。
	 * @param dictTypeValue 数据字典类型值
	 * @return
	 * @throws FileNotFoundException
	 * @throws DocumentException
	 */
	@SuppressWarnings("unchecked")
	static List<DictInfoItem> getDataByType(String dictTypeValue){
		if (StringUtils.isBlank(dictTypeValue))
			return null;
		
		Document dictDocument;
		try {
			dictDocument = getDocument(dictFilePath());
		} catch (Exception e) {
			return new ArrayList<DictInfoItem>();
		} 
		List<Element> itemList = (List<Element>) dictDocument.selectNodes("/dictinfo/item");
		if (itemList != null && !itemList.isEmpty()) {
			for (Element item : itemList) {
				String name = item.attributeValue("name");
				if (dictTypeValue.equals(name)) {
					List<Element> optionList = item.selectNodes("./option");
					if (optionList != null && !optionList.isEmpty()){
						List<DictInfoItem> dataList = new ArrayList<DictInfoItem>();
						for (Element option : optionList){
							DictInfoItem dictItem = new DictInfoItem(name, option.getText(), option.attributeValue("text"));
							dataList.add(dictItem);
						}
						return dataList;
					}
				}
			}
		}
		return null;
	}
	/**
	 * 根据文件路径读取一个XML文件，返回Document对象
	 * @param filePath 文件路径
	 * @return
	 * @throws FileNotFoundException
	 * @throws DocumentException
	 */
	static Document getDocument(String filePath) throws FileNotFoundException, DocumentException {
		if (StringUtils.isBlank(filePath))
			return null;
		File file = new File(filePath);
		if (!file.exists())
			throw new FileNotFoundException("[" + filePath + "]文件并不存在。");
		Document dictDocument = null;
		SAXReader reader = new SAXReader();
		try {
			dictDocument = reader.read(file);
		} catch (DocumentException e) {
			e.printStackTrace();
			throw e;
		}
		return dictDocument;
	}
	
	/**
	 * 获取当前时间
	 * @return
	 */
	public static String now(){
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		return format.format(new Date());
	}
	
	/**
	 * 为列表字段绑定字典表中的中文值
	 * @param data		数据集
	 * @param colName	列名
	 * @param dictType	字典类型
	 */
	public static void addDictCol(GridData data,final String colName,final String dictType){
		final List<DictInfoItem> dicts = getDataByType(dictType);
		data.addCol(colName+"Cn", colName+"Cn", "", new FieldDataFormat<Object>() {
			@Override
			public Object format(List<Map<String, Object>> data,
					Map<String, Object> row, Integer rowIndex, Object value) {
				Object oriValue = row.get(colName);
				for (DictInfoItem item : dicts) {
					if (item.getDictValue().equals(oriValue)) {
						return item.getDictText();
					}
				}
				return oriValue;
			}
		});
	}
	

	
	public static <T extends Entity> QuerySettings<T> createQuerySettings(Class<T> entityClass,WebQueryCdn cdn){
		QuerySettings<T> settings =  QuerySettings.create(entityClass);
		QueryCriterion qc = cdn.convert();
		if(null!=qc)
			settings.addCriterion(qc);
		return settings;
	}
	


}
