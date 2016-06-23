package com.frank.statistics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.frank.statistics.mappers.SchoolclassMapper;
import com.frank.statistics.pojo.Schoolclass;
import com.frank.statistics.service.IClassService;
import com.frank.statistics.util.PageFactory;
@Service("classService")
public class ClassServiceImpl implements IClassService {
	@Autowired
	private SchoolclassMapper schoolclassMapper;

	public int addClass(Schoolclass sc) {
		if(sc!=null){
			return schoolclassMapper.insert(sc);
		}
		return 0;
	}

	@Override
	public List<Schoolclass> selectByOtherKey(Schoolclass record) {
		return schoolclassMapper.selectByOtherKey(record);
	}

	@Override
	public int updateByPrimaryKeySelective(Schoolclass record) {
		return schoolclassMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public Page<Schoolclass> queryByClass(Schoolclass record, Pageable pageable) {
		int toatal=schoolclassMapper.selectCountByOtherKey(record);
		List<Schoolclass> list=schoolclassMapper.selectInfoByOtherKey(record);
		return PageFactory.createPage(list, pageable, toatal);
	}

}
