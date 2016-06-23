package com.frank.statistics.pojo;

import java.util.Date;

public class Exam {
    private Integer id;

    private String name;

    private Date examtime;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public Date getExamtime() {
        return examtime;
    }

    public void setExamtime(Date examtime) {
        this.examtime = examtime;
    }
}