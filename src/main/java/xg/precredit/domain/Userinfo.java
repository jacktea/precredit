package xg.precredit.domain;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Table;

import xg.framework.domain.AbstractEntity;

@Entity
@Table(name="sys_userinfo")
public class Userinfo extends AbstractEntity implements Serializable {
	
	private static final long serialVersionUID = 1093659559394203379L;

	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public boolean equals(Object other) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return null;
	}
	
}
