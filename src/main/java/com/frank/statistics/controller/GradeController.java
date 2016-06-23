package com.frank.statistics.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.frank.statistics.pojo.Grade;
import com.frank.statistics.service.IGradeService;
import com.frank.statistics.util.Result;

@Controller
@RequestMapping("/grade")
public class GradeController {
	@Autowired
	@Qualifier("gradeService")
	private IGradeService gradeService;
	
	@RequestMapping(value="/query",method=RequestMethod.GET)
	@ResponseBody
	public Result query(HttpServletRequest req){
		List<Grade> list =gradeService.query();
		return new Result().setStatusSuccess().setResult(list);
	}
	
	
	@RequestMapping(value="/addOrUpdate")
	@ResponseBody
	public Result addOrUpdate(HttpServletRequest req,Grade grade) throws IOException{
		if(null!=grade&&grade.getId()==null&&grade.getName()!=null){
			int a=gradeService.addrecord(grade);
			if(a>0){
				return new Result().setStatusSuccess().setResult(grade);
			}
			return new Result().setStatusError().setMsg("添加系统异常");
		}else if(null!=grade&&grade.getId()!=null){
			int a=gradeService.updateByPrimaryKeySelective(grade);
			if(a>0){
				return new Result().setStatusSuccess().setResult(grade);
			}
			return new Result().setStatusError().setMsg("修改系统异常");
		
		}
		return new Result().setStatusError().setMsg("参数异常");
	}
	
	@RequestMapping(value="/update",method=RequestMethod.POST)
	@ResponseBody
	public Result updateRecord(HttpServletRequest req,Grade grade){
		if(null!=grade&&grade.getId()!=null){
			int a=gradeService.updateByPrimaryKeySelective(grade);
			if(a>0){
				return new Result().setStatusSuccess().setResult(grade);
			}
			return new Result().setStatusError().setMsg("修改系统异常");
		}
		return new Result().setStatusError().setMsg("参数异常");
	}
	
	@RequestMapping(method=RequestMethod.GET)
	public String index(HttpServletRequest req){
		return "/view/grade/grade" ;
	}
	
	@RequestMapping("/queryForPage")
	@ResponseBody
	public Page<Grade> queryForPage(HttpServletRequest request,Pageable pageable){
		return gradeService.queryForPage(pageable);
	}
}
