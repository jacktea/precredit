package xg.framework.domain.internal;

import xg.framework.domain.QueryCriterion;
import xg.framework.domain.QueryException;

public class NotCriterion implements QueryCriterion {
	private QueryCriterion criterion;

	public NotCriterion(QueryCriterion criterion) {
		if (criterion == null) {
			throw new QueryException("Query criterion is null!");
		}
		this.criterion = criterion;
	}

	public QueryCriterion getCriteron() {
		return criterion;
	}
}
