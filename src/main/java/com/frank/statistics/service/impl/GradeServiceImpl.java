package com.frank.statistics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.frank.statistics.mappers.GradeMapper;
import com.frank.statistics.pojo.Grade;
import com.frank.statistics.service.IGradeService;
import com.frank.statistics.util.PageFactory;
@Service("gradeService")
public class GradeServiceImpl implements IGradeService {
	@Autowired
	private GradeMapper gradeMapper;

	@Override
	public int addrecord(Grade grade) {
		return gradeMapper.insert(grade);
	}

	@Override
	public List<Grade> query() {
		return gradeMapper.query();
	}

	@Override
	public int updateByPrimaryKeySelective(Grade record) {
		return gradeMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public Page<Grade> queryForPage(Pageable pageable) {
		int count =gradeMapper.queryCount();
		List<Grade> list=gradeMapper.query();
		return PageFactory.createPage(list, pageable, count);
	}

	
}
