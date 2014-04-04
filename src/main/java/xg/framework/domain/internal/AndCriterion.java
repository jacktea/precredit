package xg.framework.domain.internal;

import xg.framework.domain.QueryCriterion;
import xg.framework.domain.QueryException;

public class AndCriterion implements QueryCriterion {
	private QueryCriterion[] criterions;

	public AndCriterion(QueryCriterion... criterions) {
		if (criterions == null || criterions.length < 2) {
			throw new QueryException("At least two query criterions required!");
		}
		this.criterions = criterions;
	}

	public QueryCriterion[] getCriterons() {
		return criterions;
	}
	
	
}
