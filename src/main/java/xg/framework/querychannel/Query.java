package xg.framework.querychannel;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import xg.framework.domain.Criterions;
import xg.framework.domain.OrderSetting;
import xg.framework.domain.QueryCriterion;

public abstract class Query {

	private Set<QueryCriterion> queryCriterions = new HashSet<QueryCriterion>();

	private List<OrderSetting> orderSettings = new ArrayList<OrderSetting>();

	private Criterions criterions = Criterions.singleton();

	public Query eq(String propName, Object value) {
		addCriterion(criterions.eq(propName, value));
		return this;
	}

	public Query notEq(String propName, Object value) {
		addCriterion(criterions.notEq(propName, value));
		return this;
	}

	public Query gt(String propName, Comparable<?> value) {
		addCriterion(criterions.gt(propName, value));
		return this;
	}

	public Query ge(String propName, Comparable<?> value) {
		addCriterion(criterions.ge(propName, value));
		return this;
	}

	public Query lt(String propName, Comparable<?> value) {
		addCriterion(criterions.lt(propName, value));
		return this;
	}

	public Query le(String propName, Comparable<?> value) {
		addCriterion(criterions.le(propName, value));
		return this;
	}

	public Query eqProp(String propName, String otherProp) {
		addCriterion(criterions.eqProp(propName, otherProp));
		return this;
	}

	public Query notEqProp(String propName, String otherProp) {
		addCriterion(criterions.notEqProp(propName, otherProp));
		return this;
	}

	public Query gtProp(String propName, String otherProp) {
		addCriterion(criterions.gtProp(propName, otherProp));
		return this;
	}

	public Query geProp(String propName, String otherProp) {
		addCriterion(criterions.geProp(propName, otherProp));
		return this;
	}

	public Query ltProp(String propName, String otherProp) {
		addCriterion(criterions.ltProp(propName, otherProp));
		return this;
	}

	public Query leProp(String propName, String otherProp) {
		addCriterion(criterions.leProp(propName, otherProp));
		return this;
	}

	public Query sizeEq(String propName, int size) {
		addCriterion(criterions.sizeEq(propName, size));
		return this;
	}

	public Query sizeNotEq(String propName, int size) {
		addCriterion(criterions.sizeNotEq(propName, size));
		return this;
	}

	public Query sizeGt(String propName, int size) {
		addCriterion(criterions.sizeGt(propName, size));
		return this;
	}

	public Query sizeGe(String propName, int size) {
		addCriterion(criterions.sizeGe(propName, size));
		return this;
	}

	public Query sizeLt(String propName, int size) {
		addCriterion(criterions.sizeLt(propName, size));
		return this;
	}

	public Query sizeLe(String propName, int size) {
		addCriterion(criterions.sizeLe(propName, size));
		return this;
	}

	public Query containsText(String propName, String value) {
		addCriterion(criterions.containsText(propName, value));
		return this;
	}

	public Query startsWithText(String propName, String value) {
		addCriterion(criterions.startsWithText(propName, value));
		return this;
	}

	public Query in(String propName, Collection<? extends Object> value) {
		addCriterion(criterions.in(propName, value));
		return this;
	}

	public Query in(String propName, Object[] value) {
		addCriterion(criterions.in(propName, value));
		return this;
	}

	public Query notIn(String propName, Collection<? extends Object> value) {
		addCriterion(criterions.notIn(propName, value));
		return this;
	}

	public Query notIn(String propName, Object[] value) {
		addCriterion(criterions.notIn(propName, value));
		return this;
	}

	public <E> Query between(String propName, Comparable<E> from,
			Comparable<E> to) {
		addCriterion(criterions.between(propName, from, to));
		return this;
	}

	public Query isNull(String propName) {
		addCriterion(criterions.isNull(propName));
		return this;
	}

	public Query notNull(String propName) {
		addCriterion(criterions.notNull(propName));
		return this;
	}

	public Query isEmpty(String propName) {
		addCriterion(criterions.isEmpty(propName));
		return this;
	}

	public Query notEmpty(String propName) {
		addCriterion(criterions.notEmpty(propName));
		return this;
	}

	public Query isTrue(String propName) {
		addCriterion(criterions.isTrue(propName));
		return this;
	}

	public Query isFalse(String propName) {
		addCriterion(criterions.isFalse(propName));
		return this;
	}

	public Query isBlank(String propName) {
		addCriterion(criterions.isBlank(propName));
		return this;
	}

	public Query notBlank(String propName) {
		addCriterion(criterions.notBlank(propName));
		return this;
	}

	public Query not(QueryCriterion criterion) {
		addCriterion(criterions.not(criterion));
		return this;
	}

	public Query and(QueryCriterion... queryCriterions) {
		addCriterion(criterions.and(queryCriterions));
		return this;
	}

	public Query or(QueryCriterion... queryCriterions) {
		addCriterion(criterions.or(queryCriterions));
		return this;
	}

	private void addCriterion(QueryCriterion criterion) {
		queryCriterions.add(criterion);
	}

	public Query asc(String propName) {
		orderSettings.add(OrderSetting.asc(propName));
		return this;
	}

	public Query desc(String propName) {
		orderSettings.add(OrderSetting.desc(propName));
		return this;
	}

	public Set<QueryCriterion> getQueryCriterions() {
		return queryCriterions;
	}

	public void setQueryCriterions(Set<QueryCriterion> queryCriterions) {
		this.queryCriterions = queryCriterions;
	}

	public List<OrderSetting> getOrderSettings() {
		return orderSettings;
	}

	public void setOrderSettings(List<OrderSetting> orderSettings) {
		this.orderSettings = orderSettings;
	}

	public Criterions getCriterions() {
		return criterions;
	}

	public void setCriterions(Criterions criterions) {
		this.criterions = criterions;
	}

}
