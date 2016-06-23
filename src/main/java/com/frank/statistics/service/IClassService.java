package com.frank.statistics.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.frank.statistics.pojo.Schoolclass;

public interface IClassService {

	int addClass(Schoolclass sc);
	
	List<Schoolclass> selectByOtherKey(Schoolclass record);
	
	int updateByPrimaryKeySelective(Schoolclass record);
	
	Page<Schoolclass> queryByClass(Schoolclass record, Pageable pageable);
}
