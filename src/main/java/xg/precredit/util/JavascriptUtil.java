package xg.precredit.util;

import java.io.InputStreamReader;
import java.io.PrintWriter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.ClassUtils;
import org.springframework.util.FileCopyUtils;

public class JavascriptUtil {
	
	protected static final Logger log = LoggerFactory.getLogger(JavascriptUtil.class);
	
	public static String getFileToString(String path){
		try {
			return FileCopyUtils.copyToString(new InputStreamReader(
					ClassUtils.getDefaultClassLoader().getResourceAsStream(path), "UTF-8"));
		} catch (Exception e) {
			log.error("读取jar文件失败",e);
			return "";
		} 
	}
	
	/**
	 * 往客户端写jar中的js文件
	 * @param out
	 * @param contextPath	应用上下我路径，客户可以通过Ext.getPath()获取
	 */
	public static void writeJavaScript(PrintWriter out,String contextPath){
		
		log.debug("load Extjs Base...");
		out.println(getFileToString("js/ext-base.js"));
		out.println(getFileToString("js/ext-all.js"));
		out.println(getFileToString("js/ext-lang-zh_CN.js"));
		out.println(getFileToString("js/sunyard/ext-bug.js"));
		
		log.debug("load ux plugin...");
/*		out.println(getFileToString("js/ux/GroupSummary.js"));
		out.println(getFileToString("js/ux/GridFilters-min.js"));
		out.println(getFileToString("js/ux/RowExpander.js"));
		out.println(getFileToString("js/ux/TabCloseMenu.js"));*/
		out.println(getFileToString("js/ux/ux-all.js"));
		out.println(getFileToString("js/ux/GroupSummary.js"));
		out.println(getFileToString("js/ux/GridFilters-ex.js"));
		out.println(getFileToString("js/ux/treegrid.js"));
		out.println(getFileToString("js/ux/Printer-all.js"));
		

		out.println("Ext.getPath = function(){return '"
					+ contextPath + "' };");
		
		log.debug("load sunyard plugin...");
		out.println(getFileToString("js/sunyard/vtypes.js"));
		out.println(getFileToString("js/sunyard/ext-sunyard-common.js"));
		out.println(getFileToString("js/sunyard/ext-sunyard-tree.js"));
		out.println(getFileToString("js/sunyard/ext-sunyard-treegrid.js"));
		out.println(getFileToString("js/sunyard/ext-common-grid.js"));
		out.println(getFileToString("js/sunyard/sunyard-plugins.js"));
		out.println(getFileToString("js/sunyard/popgridfilters.js"));
		out.println(getFileToString("js/sunyard/poptreefilters.js"));
		out.println(getFileToString("js/sunyard/PinyinFilter.js"));
		out.println(getFileToString("js/sunyard/PagingMemoryProxy.js"));
//		out.println(getFileToString("js/sunyard/ext-common.js"));
		out.println(getFileToString("js/sunyard/JsonReaderEx.js"));
		log.debug("load css...");
		out.println(getFileToString("js/ext-css.js"));
		out.println(getFileToString("js/sunyard/init.js"));
		out.println(getFileToString("js/sunyard/patch/patch_1.01.js"));
		
	}
/*	
	public static void writeJavaScript(PrintWriter out,Object...other){
		log.debug("load Extjs Base...");
		out.println(getFileToString("js/ext-base.js"));
		out.println(getFileToString("js/ext-all.js"));
		out.println(getFileToString("js/ext-lang-zh_CN.js"));
		out.println(getFileToString("js/sunyard/ext-bug.js"));
		
		for(Object o : other){
			out.println(o.toString());
		}
		log.debug("load sunyard plugin...");
		out.println(getFileToString("js/sunyard/ext-common.js"));
		out.println(getFileToString("js/sunyard/JsonReaderEx.js"));
		log.debug("load ux plugin...");
		out.println(getFileToString("js/ux/GroupSummary.js"));
		out.println(getFileToString("js/ux/Printer-all.js"));
		out.println(getFileToString("js/ux/GridFilters-min.js"));
		out.println(getFileToString("js/ux/RowExpander.js"));
		out.println(getFileToString("js/ux/TabCloseMenu.js"));
		out.println(getFileToString("js/ux/treegrid.js"));
		log.debug("load css...");
		out.println(getFileToString("js/ext-css.js"));
	}*/

}
