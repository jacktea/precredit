package xg.precredit.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.SimpleTimeZone;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import xg.precredit.util.JavascriptUtil;

/**
 * 加载JAR内的JS文件
 * @author XIAOGANG
 *
 */
@Controller
@RequestMapping("/loadResourcesController")
public class LoadResourcesController {
	
	SimpleDateFormat dateFormat = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.ENGLISH);
	
	{
		dateFormat.setTimeZone(new SimpleTimeZone(0, "GMT"));
	}
	

	protected static final Logger log = LoggerFactory.getLogger(LoadResourcesController.class);
	
	@RequestMapping(value="/loadAllJavaScript")
	public void loanAllJavascript(HttpServletRequest request,HttpServletResponse response){
		
		//System.out.println(new Date());
		
		int seconds = 3600;//脚本缓存时间(秒)
		
		//int minutes = 60;//脚本有效时间

	    Date d = new Date();

	    String modDate = dateFormat.format(d);

	    String expDate = dateFormat.format(new Date(d.getTime() + seconds * 1000));

	    response.setHeader("Last-Modified", modDate);

	    response.setHeader("Expires", expDate);

	    response.setHeader("Cache-Control", "max-age="+seconds+", must-revalidate"); //   HTTP/1.1

	    response.setHeader("Pragma", "Pragma"); //   HTTP/1.0
	    
		
		String uri = request.getRequestURI();
		String path = uri.substring(0, uri.indexOf("/loadResourcesController/loadAllJavaScript"));
		response.setContentType("text/javascript;charset=UTF-8");
		PrintWriter out = null;
		try {
			out = response.getWriter();
			
			JavascriptUtil.writeJavaScript(out,path);
			
			out.flush();
			out.close();
		} catch (IOException e) {
			log.error("LoadResourcesController.loanAllJavascript(req,resp)",e);
		}finally{
			if(null!=out){
				out.close();
			}
		}
		
	}
	
	/*public static void main(String[] args) {
		Date d = new Date();
		System.out.println(d);
		SimpleDateFormat dateFormat = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.ENGLISH);
		dateFormat.setTimeZone(new SimpleTimeZone(0, "GMT"));
		System.out.println(dateFormat.format(d));
		System.out.println(dateFormat.format(new Date(d.getTime()+600000)));		
	}*/
	
/*	private String getFileContent(String path){
		try {
			return FileCopyUtils.copyToString(new InputStreamReader(
					ClassUtils.getDefaultClassLoader().getResourceAsStream(path), "UTF-8"));
		} catch (Exception e) {
			return "";
		} 
	}
	
	private static String getFileContent1(String path){
		try {
			return FileCopyUtils.copyToString(new InputStreamReader(
					new FileInputStream(ResourceUtils.getFile(path)), "UTF-8"));
		} catch (Exception e) {
			return "";
		} 
	}
	
	private static String getFileContent1(File f){
		try {
			return FileCopyUtils.copyToString(new InputStreamReader(
					new FileInputStream(f), "UTF-8"));
		} catch (Exception e) {
			return "";
		} 
	}
	
	private static String getFileContent1(InputStream is){
		try {
			return FileCopyUtils.copyToString(new InputStreamReader(
					is, "UTF-8"));
		} catch (Exception e) {
			return "";
		} 
	}
	private static String getFileContent1(InputStream is){
		try {
			return FileCopyUtils.copyToString(new InputStreamReader(
					is, "UTF-8"));
		} catch (Exception e) {
			return "";
		} 
	}
	
	public static void main(String[] args) throws Exception{
		InputStream is =  ClassUtils.getDefaultClassLoader().getResourceAsStream("com/sunyard/extjs/atest/controller/TestController.class");
		System.out.println(getFileContent1(is));
		File f = (new ClassPathResource("testfile/grid.xml",LoadResourcesController.class.getClassLoader())).getFile();
		InputStream is =  ClassUtils.getDefaultClassLoader().getResourceAsStream("resources/ext-css.js");
		URL url = ClassUtils.getDefaultClassLoader().getResource("testfile/grid.xml");
		System.out.println(url);
		System.out.println(ResourceUtils.toURI(url).getSchemeSpecificPart());
		JarFile f = new JarFile("F:/testfile.jar");
		is = f.getInputStream(f.getJarEntry("testfile/grid.xml"));
		System.out.println(f.getInputStream(f.getJarEntry("testfile/grid.xml")));
		System.out.println(getFileContent1("testfile/grid.xml"));
		System.out.println(getFileContent1(is));
	}*/
	

}
