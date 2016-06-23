package com.frank.statistics.mappers;

import com.frank.statistics.pojo.SubjectTeacher;

public interface SubjectTeacherMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(SubjectTeacher record);

    int insertSelective(SubjectTeacher record);

    SubjectTeacher selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(SubjectTeacher record);

    int updateByPrimaryKey(SubjectTeacher record);
}