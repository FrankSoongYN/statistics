package com.frank.statistics.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.frank.statistics.mappers.StudentMapper;
import com.frank.statistics.pojo.Student;
import com.frank.statistics.service.IStudentService;
@Service("/studentService")
public class StudentServiceImpl implements IStudentService{
	@Autowired
	private StudentMapper studentMapper;

	@Override
	public int addStudent(Student s) {
		if(s!=null){
			return studentMapper.insert(s);
		}
		return 0;
	}

	@Override
	public int updateStudent(Student s) {
		if(s!=null&&s.getId()!=null){
			return studentMapper.updateByPrimaryKey(s);
		}
		return 0;
	}

	@Override
	public int deleteStudent(Integer id) {
		return studentMapper.deleteByPrimaryKey(id);
	}

	@Override
	public List<Student> query(Map<String, String> map) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int queryCount(Map<String, String> map) {
		// TODO Auto-generated method stub
		return 0;
	}
	
	
}
