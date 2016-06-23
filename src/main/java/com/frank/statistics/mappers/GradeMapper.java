package com.frank.statistics.mappers;

import java.util.List;

import com.frank.statistics.pojo.Grade;

public interface GradeMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Grade record);

    int insertSelective(Grade record);

    Grade selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Grade record);

    int updateByPrimaryKey(Grade record);
    
    List<Grade> query();
    
    int queryCount();
}