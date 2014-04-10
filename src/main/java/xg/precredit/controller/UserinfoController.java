package xg.precredit.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import xg.framework.querychannel.support.GridData;
import xg.framework.querychannel.support.PagingParam;
import xg.framework.web.controller.BaseController;
import xg.framework.web.support.JsonFormResult;
import xg.precredit.domain.Userinfo;
import xg.precriedit.service.UserinfoService;

@Controller
@RequestMapping("/userinfoController")
public class UserinfoController extends BaseController{

	@Resource(name = "userinfoService")
	private UserinfoService userinfoService;
	
	@RequestMapping("/UserinfoPage")
	public String getUserinfoPage() {
		return "Userinfopage";
	}
	
	@RequestMapping("/save")
	@ResponseBody
	public JsonFormResult<String> save(Userinfo p) {
		JsonFormResult<String> ret = new JsonFormResult<String>();
		if (!p.existed()) {
			userinfoService.save(p);
		} else {
			ret.setSuccess(false);
			ret.setErrorMessage("对象已存在！");
		}
		return ret;
	}
	
	@RequestMapping("/update")
	@ResponseBody
	public JsonFormResult<String> update(Userinfo p) {
		JsonFormResult<String> ret = new JsonFormResult<String>();
		if (p.existed()) {
			userinfoService.update(p);
		} else {
			ret.setSuccess(false);
			ret.setErrorMessage("对象已存在！");
		}
		return ret;
	}
	
	@RequestMapping("/delete")
	@ResponseBody
	public JsonFormResult<String> delete(Userinfo p) {
		JsonFormResult<String> ret = new JsonFormResult<String>();
		if (p.existed()) {
			userinfoService.remove(p);
		} else {
			ret.setSuccess(false);
			ret.setErrorMessage("对象已存在！");
		}
		return ret;
	}
	
	@RequestMapping("/get")
	@ResponseBody
	public JsonFormResult<Userinfo> get(Long id) {
		JsonFormResult<Userinfo> ret = new JsonFormResult<Userinfo>();
		Userinfo p = Userinfo.get(Userinfo.class, id);
		if (null != p) {
			ret.setData(p);
		} else {
			ret.setSuccess(false);
			ret.setErrorMessage("对象不存在！");
		}
		return ret;
	}
	
	@RequestMapping("/allUserinfo")
	@ResponseBody
	public GridData allUserinfo(PagingParam param) {
		param.setEntityClass(Userinfo.class);
		GridData data = getQueryService().queryByParam(param);		
		return data;
	}

}
