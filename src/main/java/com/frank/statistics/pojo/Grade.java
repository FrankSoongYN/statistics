package com.frank.statistics.pojo;

import java.util.Date;

public class Grade {
    private Integer id;

    private String name;

    private String enrolltime;

    private String leader;

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

    public String getEnrolltime() {
		return enrolltime;
	}

	public void setEnrolltime(String enrolltime) {
		this.enrolltime = enrolltime;
	}

	public String getLeader() {
        return leader;
    }

    public void setLeader(String leader) {
        this.leader = leader == null ? null : leader.trim();
    }
}