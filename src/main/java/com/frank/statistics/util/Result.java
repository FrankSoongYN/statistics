package com.frank.statistics.util;


public class Result {
	public static String ERROR = "error";
	public static String SUCCESS = "success";
	private String status;
	private Integer code;
	private String msg;
	private Object result;
	public String getStatus() {
		if(null==this.status){
			this.status=SUCCESS;
		}
		return status;
	}
	public Result  setStatus(ResultStatus status) {
		this.status = status.getValue();
		return this;
	}
	public Result setStatusError(){
		this.status = ERROR;
		return this;
	}
	public Result setStatusSuccess(){
		this.status = SUCCESS;
		return this;
	}
	public Integer getCode() {
		if(null==this.code){
			if (SUCCESS.equals(this.getStatus())) {
				this.code = 1;
			} else {
				this.code = -1;
			}
		}
		return code;
	}

	public Result setCode(Integer code) {
		this.code = code;
		return this;
	}

	public String getMsg() {
		if(null==this.msg){
			if (SUCCESS.equals(this.getStatus())) {
				this.msg = "操作成功";
			} else {
				this.msg = "操作失败";
			}
		}
		return msg;
	}

	public Result setMsg(String msg) {
		this.msg = msg;
		return this;
	}

	public Object getResult() {
		return result;
	}

	public Result setResult(Object result) {
		this.result = result;
		return this;
	}

	public enum ResultStatus {
		error("error"), success("success");
		private String value;

		ResultStatus(String value) {
			this.value = value;
		}

		public String getValue() {
			return value;
		}
	}
}