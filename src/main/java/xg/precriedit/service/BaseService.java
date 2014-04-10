package xg.precriedit.service;

import org.springframework.transaction.annotation.Transactional;

import xg.framework.domain.AbstractEntity;
import xg.framework.jpa.internal.EntityUtils;

public abstract class BaseService {

	@Transactional
	public void save(AbstractEntity... entitys) {
		for (AbstractEntity entity : entitys){
			entity.save();
		}
	}

	@Transactional
	public void update(AbstractEntity... entitys) {
		for (AbstractEntity entity : entitys) {
			AbstractEntity dbEntity = AbstractEntity.get(entity.getClass(),
					entity.getId());
			EntityUtils.copyProperties(entity, dbEntity);
			dbEntity.save();
		}
	}

	@Transactional
	public void remove(AbstractEntity... entitys) {
		for (AbstractEntity entity : entitys){
			entity.remove();
		}
	}

}