$(function(){
	$('#startTime').datepicker({
		dateFormat : 'yy-mm-dd 00:00:00',
		changeMonth: true,
		changeYear: true
	}); 
	
	$('#endTime').datepicker({
		dateFormat : 'yy-mm-dd 23:59:59',
		changeMonth: true,
		changeYear: true
	}); 
	var postUrl="forTheAccountList";
	// jqgrid初期化
	$("#list").jqGrid({
		url: postUrl,
		datatype: "json",
		cmTemplate : {
			sortable : false
		},
		colModel:[
			{
				label: '赛事名称',
				name:'cmptName', 
				width:'100' 
			},{
				label: 'cmptId',
				name:'cmptId',  
				hidden:true
			},{
				label: '截止时间',
				name:'deadLine',  
				width:'50'
			},{
				label: '赛事时间',
				name:'startTime',  
				width:'30'
			} ,{
				label: '缴费总额',
				name:'cmptAmount',  
				width:'20'
			},{
				label: '报名人数',
				name:'enrollNum',  
				width:'20'
			},{
				label: '可报名人数',
				name:'canEnrollNum',  
				width:'20'
			},{
				label: '创建人',
				name:'name',  
				width:'30'
			},{
				label: '联系电话',
				name:'callPhone',  
				width:'40'
			},{
				label: '是否关闭',
				name:'isClose',  
				width:'20',
				formatter:function(cellvalue, options, rowObject){
					if(cellvalue == '0'){
						return '否';
					}else if(cellvalue == '1'){
						return '是';
					}
				} 
			},{
				label: '已签协议',
				name:'isPact',  
				width:'20',
				editable: true,
				formatter:function(cellvalue, options, rowObject){
					if(!cellvalue||cellvalue == '0'){
						return '<a href="javascript:;" class="changePact" value="'+cellvalue+'" rowId="'+options.rowId+'">否</a>';
					}else if(cellvalue == '1'){
						return '<a href="javascript:;" class="changePact" value="'+cellvalue+'" rowId="'+options.rowId+'">是</a>';
					}
				} 
			},{
				label: '提交付款申请',
				name:'isPaymentRequest',  
				width:'20',
				formatter:function(cellvalue, options, rowObject){
					if(!cellvalue||cellvalue == '0'){
						return '<a href="javascript:;" class="changeRequest" value="'+cellvalue+'" rowId="'+options.rowId+'">否</a>';
					}else if(cellvalue == '1'){
						return '<a href="javascript:;" class="changeRequest" value="'+cellvalue+'" rowId="'+options.rowId+'">是</a>';
					}
				} 
			}
		],
		rowList:[10,20,30],
		rownumbers:true,//显示行号
		viewrecords : true,
		pager: '#pager',
		multiselect: false,
		shrinkToFit:true,
		height:670,
		rowNum:20,
		altRows: true,
		autowidth: true,
		altclass:'altclass',//隔行变色样式
		hidegrid:false,
		jsonReader : {
			root : 'content',
			page : 'number',
			rows : 'size',
			total : 'totalPages',
			records : 'totalElements',
			repeatitems : false
		},prmNames : {
			page : 'page.page',
			rows : 'page.size',
			sort : 'page.sort',
			order : 'page.sort.dir'
		}
	});
	
    // 查询
	   $('#search').click(function() {
	    	var postData = $("#list").jqGrid('getGridParam', 'postData');
	    	var formData = {
	    			startTime : $.trim($('#startTime').val()),
					endTime : $.trim($('#endTime').val())
	    		};
	    	$.extend(postData, formData);
			$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
	    });
	   
	   $('#type').change(function(){
		   var postData = $("#list").jqGrid('getGridParam', 'postData');
			var formData = {
				type : $(this).val(),
				startTime : $.trim($('#startTime').val()),
				endTime : $.trim($('#endTime').val())
			};
			$.extend(postData, formData);
			$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
	   });
	   
	   // 清空按钮
	   $('#clear').click(function() {
	   	 $('input').val('');
	  });
	   
		$('body').on('click','.changePact',function(e){
			e.preventDefault();
			var rowId=$(this).attr('rowId');
			var isPact=$(this).attr('value');
			var rowData = $('#list').jqGrid('getRowData',rowId);
			
			$("#pcmptName").text(rowData.cmptName);
			$("#pactform").dialog({
	            height:240,
	            width:350,
	            resizable:true,
	            modal:true,  //这里就是控制弹出为模态
	            buttons:{
	                "确定":function(){ 
	                	$.ajax({
	            			type : "post",
	                        url : '../wechatAudit/updateIsPact',
	                        data:{
	                        	cmptId:  rowData.cmptId,
	                        	isPact: isPact
	                        },
	                        success : function onSucc(data) {
	                        	if(data.status == 1){
	            	            	alert("操作已完成！")
	                        	}else{
	                        		alert(data.msg);
	                        	} 
	                        },
	                        error : function onErr() {
	                        	showMessage("操作执行失败！","error");
	                        }
	                    });
	                	
	                    $(this).dialog("close");
	                },
	                "取消":function(){$(this).dialog("close");}
	            }
	        });
		})
		
		$('body').on('click','.changeRequest',function(e){
			e.preventDefault();
			var rowId=$(this).attr('rowId');
			var isRequest=$(this).attr('value');
			var rowData = $('#list').jqGrid('getRowData',rowId);
			$("#rcmptName").text(rowData.cmptName);
			$("#PaymentRequestform").dialog({
	            height:240,
	            width:350,
	            resizable:true,
	            modal:true,  //这里就是控制弹出为模态
	            buttons:{
	                "确定":function(){
	                	$.ajax({
	            			type : "post",
	                        url : '../wechatAudit/updateisPaymentRequest',
	                        data:{
	                        	cmptId:  rowData.cmptId,
	                        	isPaymentRequest: isRequest
	                        },
	                        success : function onSucc(data) {
	                        	if(data.status == 1){
	            	            	alert("操作已完成！")
	                        	}else{
	                        		alert(data.msg);
	                        	} 
	                        },
	                        error : function onErr() {
	                        	showMessage("操作执行失败！","error");
	                        }
	                    });
	                	
	                    $(this).dialog("close");
	                },
	                "取消":function(){$(this).dialog("close");}
	            }
	        });
		})
})