	

$(function(){
	var key = window.location.search.split('=')[0];
	var value = window.location.search.split('=')[1];
	$('#payStartTime').datepicker({
		dateFormat : 'yy-mm-dd 00:00:00',
		changeMonth: true,
		changeYear: true/*,
		onSelect: function(date){
			$('#payEndTime').datepicker( "option", "minDate",date);
		}*/
	}); 
	
	$('#payEndTime').datepicker({
		dateFormat : 'yy-mm-dd 23:59:59',
		changeMonth: true,
		changeYear: true/*,
		onSelect: function(date){
			$('#payStartTime').datepicker( "option", "maxDate",date);
		}*/
	}); 
	var postUrl = '';
	if(key.indexOf('cmptId') > 0){
		postUrl = value != undefined ? 'getAccountDetailInfoByDay?cmptId='+value : 'getAccountDetailInfoByDay';
	}else{
		postUrl = value != undefined ? 'getAccountDetailInfoByDay?date='+value : 'getAccountDetailInfoByDay';
	}
	
	
	// jqgrid初期化
	$("#list").jqGrid({
		url: postUrl,
		datatype: "json",
		postData:{tradeType : $('#tradeType').val()},
		cmTemplate : {
			sortable : false
		},
		colModel:[
			{
				label: '赛事',
				name:'cmptName', 
				width:'60' 
			},{
				label: '渠道',
				name:'payType',  
				width:'20'
			},{
				label: '缴费人',
				name:'userName',  
				width:'20'
			} ,{
				label: '缴费金额',
				name:'amount',  
				width:'15'
			},{
				label: '支付宝手续费',
				name:'alipayFee',  
				width:'15'
			},{
				label: '微信手续费',
				name:'wxFee',  
				width:'15'
			},{
				label: '缴费账户',
				name:'buyerEmail',  
				width:'40'
			},{
				label: '订单号',
				name:'applyId',  
				width:'60'
			},{
				label: '交易时间',
				name:'updateTime',  
				width:'30'
			},{
				label: '退款金额',
				name:'returnAmount',  
				width:'30'
			},{
				label: '退款原因',
				name:'returnReason',  
				width:'40'
			},{
				label: '交易状态',
				name:'tradeStatus',  
				width:'20',
				formatter:function(cellvalue, options, rowObject){
					if(cellvalue=="TRADE_SUCCESS"){
						return '支付成功';
					}else if(cellvalue=="TRADE_RETURE"){
						return '已退款';
					}else if(cellvalue=="TRADE_RETURNING"){
						return '退款中';
					}else if(cellvalue=="TRADE_TRANSFERS"){
						return '转账';
					}
				} 
			},{
				label: '操作',
				name:'tradeStatus',  
				width:'30',
				formatter:function(cellvalue, options, rowObject){
					if(cellvalue=="TRADE_SUCCESS"){
						return '<a href="javascript:;" id="'+rowObject.applyId+'"></a>';
					}else if(cellvalue=="TRADE_RETURE"){
						return '<a href="javascript:;" id="'+rowObject.applyId+'"></a>';
					}else if(cellvalue=="TRADE_RETURNING"){
						return '<a href="javascript:;" class="returnMoneyByAccount"  rowId="'+options.rowId+'" id="'+rowObject.applyId+'">财务退款</a>';
					}else if(cellvalue=="TRADE_TRANSFERS"){
						return '<a href="javascript:;" id="'+rowObject.applyId+'"></a>';
					}
					
				} 
			} /*
			{
				label: '是否处理',
				name:'isDispose',  
				width:'80',
				formatter:function(cellvalue, options, rowObject){
					if(cellvalue == '0'){
						return '否';
					}else if(cellvalue == '1'){
						return '是';
					}
				} 
			}*/
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
	
	function returnMoneyByAccount(data){
		$.ajax({
			type : "post",
            url : 'returnMoneybyAccounting',
            data:{
            	applyId:  data.applyId,
            	operator:  data.operator
            },
            success : function onSucc(data) {
            	if(data.status == 1){
	            	alert("退款操作已完成！")
            	}else{
            		alert(data.msg);
            	} 
            },
            error : function onErr() {
            	showMessage("操作执行失败！","error");
            }
        });
	}
	$('body').on('click','.returnMoneyByAccount',function(e){
		e.preventDefault();
		var rowId=$(this).attr('rowId');
		var rowData = $('#list').jqGrid('getRowData',rowId);
		$("#cuname").text(rowData.userName);
		$("#cName").text(rowData.cmptName);
		$("#cpayType").text(rowData.payType);
		$("#camout").text(rowData.amount);
		$("#returnAmount").text(rowData.returnAmount);
		$("#returnReason").text(rowData.returnReason);
		$("#modifyform").dialog({
            height:360,
            width:350,
            resizable:true,
            modal:true,  //这里就是控制弹出为模态
            buttons:{
                "确定":function(){ 
                	data['operator'] = $('#operator').val().trim();
                	data['applyId'] = rowData.applyId;

                	if(data['operator']==''){
                		alert("操作人不能为空！")
                		return false;
                	}
                	returnMoneyByAccount(data);
                    $(this).dialog("close");
                },
                "取消":function(){$(this).dialog("close");}
            }
        });
	})

    
    // 查询
   $('#search').click(function() {
    	var postData = $("#list").jqGrid('getGridParam', 'postData');
		var formData = {
			userName : $.trim($('#userName').val()),
			payStartTime : $.trim($('#payStartTime').val()),
			payEndTime : $.trim($('#payEndTime').val()),
			tradeType : $('#tradeType').val()
		};
		
		$.extend(postData, formData);
		$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
    });
	
	   $('#tradeType').change(function() {
	    	var postData = $("#list").jqGrid('getGridParam', 'postData');
			var formData = {
				userName : $.trim($('#userName').val()),
				payStartTime : $.trim($('#payStartTime').val()),
				payEndTime : $.trim($('#payEndTime').val()),
				tradeType : $('#tradeType').val()
			};
			
			$.extend(postData, formData);
			$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
	    });
   

   $('#excel').click(function(){
	   var cmptId="";
	   if(key.indexOf('cmptId') > 0){
		   cmptId = value ;
		}
	   var postData = $("#list").jqGrid('getGridParam', 'postData');
		var formData = {
			userName : $('#userName').val(),
			startTime : $.trim($('#payStartTime').val()),
			endTime : $.trim($('#payEndTime').val()),
			tradeType : $('#tradeType').val()
		};
		window.location.href = 'downloadAccountDetailInfoByDay?userName='+formData.userName+
		"&payStartTime="+formData.startTime+"&payEndTime="+formData.endTime+"&cmptId="+cmptId+"&tradeType="+formData.tradeType;
		$.extend(postData, formData);
		$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
   });
   // 清空按钮
	$('#clear').click(function() {
   	 $('input').val('');
	});

});
