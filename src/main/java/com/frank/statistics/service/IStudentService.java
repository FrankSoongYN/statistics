package com.frank.statistics.service;

import java.util.List;
import java.util.Map;

import com.frank.statistics.pojo.Student;

public interface IStudentService {

   int addStudent(Student s);
   int updateStudent(Student s);
   int deleteStudent(Integer id);
   List<Student> query(Map<String,String> map);
   int queryCount(Map<String,String> map);
   
	
}
