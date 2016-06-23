package com.frank.statistics.mappers;

import java.util.List;

import com.frank.statistics.pojo.Schoolclass;

public interface SchoolclassMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Schoolclass record);

    int insertSelective(Schoolclass record);

    Schoolclass selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Schoolclass record);

    int updateByPrimaryKey(Schoolclass record);
    
    List<Schoolclass> selectInfoByOtherKey(Schoolclass record);
    
    List<Schoolclass> selectByOtherKey(Schoolclass record);
    
    Integer selectCountByOtherKey(Schoolclass record);
}