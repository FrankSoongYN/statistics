package com.frank.statistics.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.frank.statistics.pojo.Grade;

public interface IGradeService {
	
   int addrecord(Grade grade);
   
   List<Grade> query();
   
   int updateByPrimaryKeySelective(Grade record);
   
   /**
	 * 查询赛事的转账记录 分页
	 * @param cmptId
	 * @return
	 */
	Page<Grade> queryForPage( Pageable pageable);
}
