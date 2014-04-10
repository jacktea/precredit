package xg.framework.web.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import xg.framework.querychannel.QueryChannelService;
import xg.framework.util.JacksonUtil;
import xg.framework.web.JsonFormResult;
import xg.framework.web.exception.JsonRespException;

public class BaseController {

	@Resource(name = "querychannel_service_jpa")
	QueryChannelService queryService;

	public QueryChannelService getQueryService() {
		return queryService;
	}

	@ExceptionHandler(value = { JsonRespException.class })
	@ResponseBody
	public JsonFormResult<String> extRespException(Exception ex) {
		JsonFormResult<String> ret = new JsonFormResult<String>();
		ret.setSuccess(false);
		ret.setErrorMessage(ex.getMessage());
		return ret;
	}

	public void responseUpload(HttpServletResponse resp, JsonFormResult<?> ret) {
		resp.setContentType("text/html;charset=utf-8");
		try {
			PrintWriter out = resp.getWriter();
			out.write("<html><body><textarea>");
			out.write(JacksonUtil.serializeObjectToJson(ret));
			out.write("</textarea></body></html>");
			out.flush();
			out.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
