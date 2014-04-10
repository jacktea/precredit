package xg.framework.querychannel.support;

import java.util.ArrayList;
import java.util.List;

import xg.framework.domain.Criterions;
import xg.framework.domain.QueryCriterion;

public class CompositeCdn implements WebQueryCdn {
	
	private String type;
	
	private List<WebQueryCdn> data;	
	
	public CompositeCdn(){}

	private CompositeCdn(String type) {
		super();
		this.type = type;
		this.data = new ArrayList<WebQueryCdn>();
	}
	
	public static CompositeCdn create(String type){
		return new CompositeCdn(type);
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<WebQueryCdn> getData() {
		return data;
	}

	public void setData(List<WebQueryCdn> data) {
		this.data = data;
	}
	
	public CompositeCdn addCdn(WebQueryCdn cdn){
		if(null==this.data){
			this.data = new ArrayList<WebQueryCdn>();
		}
		this.data.add(cdn);
		return this;
	}
	
	public CompositeCdn removeCdn(WebQueryCdn cdn){
		if(null==this.data){
			this.data = new ArrayList<WebQueryCdn>();
		}
		this.data.remove(cdn);
		return this;
	}
	
	public QueryCriterion convert(){
		Criterions criterions = Criterions.singleton();
		List<QueryCriterion> ret = new ArrayList<QueryCriterion>();
		if(null!=this.data){
			for(WebQueryCdn cdn : this.data){
				ret.add(cdn.convert());
			}
		}
		if(ret.isEmpty()){
			return null;
		}
		if(ret.size()==1){
			return ret.get(0);
		}
		if(type.equals("and")){
			return criterions.and(ret.toArray(new QueryCriterion[]{}));
		}else{
			return criterions.or(ret.toArray(new QueryCriterion[]{}));
		}
	}
	

	@Override
	public String toString() {
		return "CompositeCdn [type=" + type + ", data=" + data + "]";
	}
	

}
