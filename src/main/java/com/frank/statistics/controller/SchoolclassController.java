package com.frank.statistics.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.frank.statistics.pojo.Grade;
import com.frank.statistics.pojo.Schoolclass;
import com.frank.statistics.service.IClassService;
import com.frank.statistics.util.Result;

@RequestMapping("/class")
@Controller
public class SchoolclassController {
	@Autowired
	private IClassService classService;
	
	@RequestMapping(method=RequestMethod.GET)
	public String index(HttpServletRequest req){
		return "/view/grade/class" ;
	}
	
	@RequestMapping(value="/query",method=RequestMethod.GET)
	@ResponseBody
	public Page<Schoolclass> query(HttpServletRequest req,Schoolclass record,Pageable pageable){
		return classService.queryByClass(record, pageable);
	}
	
	@RequestMapping(value="/addOrUpdate")
	@ResponseBody
	public Result addOrUpdate(HttpServletRequest req,Schoolclass sc) throws IOException{
		if(null!=sc&&sc.getId()==null&&sc.getName()!=null){
			int a=classService.addClass(sc);
			if(a>0){
				return new Result().setStatusSuccess().setResult(sc);
			}
			return new Result().setStatusError().setMsg("添加系统异常");
		}else if(null!=sc&&sc.getId()!=null){
			int a=classService.updateByPrimaryKeySelective(sc);
			if(a>0){
				return new Result().setStatusSuccess().setResult(sc);
			}
			return new Result().setStatusError().setMsg("修改系统异常");
		
		}
		return new Result().setStatusError().setMsg("参数异常");
	}
}
