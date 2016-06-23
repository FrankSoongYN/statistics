	

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
						return '<a href="javascript:;" class="returnMoney" rowId="'+options.rowId+'" id="'+rowObject.applyId+'">退款</a>';
					}else if(cellvalue=="TRADE_RETURE"){
						return '<a href="javascript:;" id="'+rowObject.applyId+'"></a>';
					}else if(cellvalue=="TRADE_RETURNING"){
						return '<a href="javascript:;" id="'+rowObject.applyId+'"></a>';
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
	
	function returnMoney(data){
		$.ajax({
			type : "post",
            url : 'returnMoney',
            data:{
            	applyId:  data.applyId,
            	returnAmount:  data.returnAmount,
            	returnReason:  data.returnReason,
            	operator:  data.operator
            },
            success : function onSucc(data) {
            	if(data.status == 1){
	            	alert("退款操作已保存！")
            	}else{
            		alert(data.msg);
            	} 
            },
            error : function onErr() {
            	showMessage("操作执行失败！","error");
            }
        });
	}
	$('body').on('click','.returnMoney',function(e){
		e.preventDefault();
		var rowId=$(this).attr('rowId');
		var rowData = $('#list').jqGrid('getRowData',rowId);
		$("#cuname").text(rowData.userName);
		$("#cName").text(rowData.cmptName);
		$("#cpayType").text(rowData.payType);
		$("#camout").text(rowData.amount);
		var fee='';
		if(rowData.payType=='微信支付'){
			fee=rowData.wxFee;
		}else{
			fee=rowData.alipayFee;
		}
		$("#cfee").text(fee);
		$("#modifyform").dialog({
            height:300,
            width:350,
            resizable:true,
            modal:true,  //这里就是控制弹出为模态
            buttons:{
                "确定":function(){ 
                	data['returnAmount'] = $('#returnAmount').val().trim();
                	data['returnReason'] = $('#returnReason').val().trim();
                	data['operator'] = $('#operator').val().trim();
                	data['applyId'] = rowData.applyId;
                	if(data['returnAmount']==''){
                		alert("金额不能为空！")
                		return false;
                	}
                	if(data['returnReason']==''){
                		alert("原因不能为空！")
                		return false;
                	}
                	if(data['operator']==''){
                		alert("操作人不能为空！")
                		return false;
                	}
                	var warning="退款金额为："+data['returnAmount'];
                	if(data['returnAmount']>rowData.amount){
                		warning+=",已大于缴费金额："+rowData.amount
                	}else if(data['returnAmount']>rowData.amount-fee){
                		warning+=",已大于缴费金额："+rowData.amount+"与手续费："+fee+"的差额";
                	}
                	warning+=";是否确认退款操作！"
                	if(confirm(warning)){
                		returnMoney(data);
                	}
                    $(this).dialog("close");
                },
                "取消":function(){$(this).dialog("close");}
            }
        });
	})
/*    // 对账
    $('#adjust').click(function() {
    	
    	var rowid = $('#list').jqGrid('getGridParam', "selrow");
        if (rowid === null) {
            showMessage('未选择有效的数据行', 'notice',3000);
        } else {
        	var selRow = $('#list').jqGrid('getRowData', rowid);
        	if(selRow.isCheck == '未对账'){
       		 showMessage('该行记录未对账，请先对账后，冲正！', 'notice',5000);
       		 return false;
        	}
        	if(selRow.isBadDebt != '是' ){
        		 showMessage('该行记录不是坏账，请勿重新操作！', 'notice',5000);
        		 return false;
        	}
        	if(!confirm('确定冲正选中行记录?')){
        		return false;
        	}
			$.ajax({
				type : "post",
	            url : 'updateTradeStatus',
	            data:{
	            	applyId:  selRow.applyId
	            },
	            success : function onSucc(data) {
	            	if(data.status == 0){
		            	showMessage(data.msg,"notice",5000);
	            	} 
	            	$("#list").trigger('reloadGrid', [{ page : 1 }]);
	            },
	            error : function onErr() {
	            	showMessage("操作执行失败！","error");
	            }
	        });
        }
    });
    //对账
$('#check').click(function() {
    	
    	var rowid = $('#list').jqGrid('getGridParam', "selrow");
        if (rowid === null) {
            showMessage('未选择有效的数据行', 'notice',3000);
        } else {
        	var selRow = $('#list').jqGrid('getRowData', rowid);
        	if(selRow.isCheck== '已对账'){
        		showMessage("该行记录已经对账，请勿请求重新操作","notice");
        		return false;
        	}
        	if(!confirm('确定对选中行记录进行对账吗?')){
        		return false;
        	}
			$.ajax({
				type : "post",
	            url : 'adjustAccountStatus',
	            data:{
	            	applyId:  selRow.applyId
	            },
	            success : function onSucc(data) {
	            	if(data.status == 0){
		            	showMessage(data.msg,"notice",5000);
	            	} 
	            	$("#list").trigger('reloadGrid', [{ page : 1 }]);
	            },
	            error : function onErr() {
	            	showMessage("操作执行失败！","error");
	            }
	        });
        }
    });*/
    
    // 查询
   $('#search').click(function() {
    	var postData = $("#list").jqGrid('getGridParam', 'postData');
		var formData = {
			userName : $.trim($('#userName').val()),
			payStartTime : $.trim($('#payStartTime').val()),
			payEndTime : $.trim($('#payEndTime').val())
		};
		
		$.extend(postData, formData);
		$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
    });
   
  /* $('#adjustedAccount').click(function() {
   		var postData = $("#list").jqGrid('getGridParam', 'postData');
		var formData = {
				isDispose : '1',
				tradeStatus :'TRADE_SUCCESS'
		};
		$.extend(postData, formData);
		$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
   });
   $('#unAdjustedAccount').click(function() {
  		var postData = $("#list").jqGrid('getGridParam', 'postData');
		var formData = {
				isDispose : '0',
				tradeStatus :'TRADE_FAILED'
		};
		$.extend(postData, formData);
		$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
  });*/
   $('#excel').click(function(){
	   var cmptId="";
	   if(key.indexOf('cmptId') > 0){
		   cmptId = value ;
		}
	   var postData = $("#list").jqGrid('getGridParam', 'postData');
		var formData = {
			userName : $('#userName').val(),
			startTime : $.trim($('#payStartTime').val()),
			endTime : $.trim($('#payEndTime').val())
		};
		window.location.href = 'downloadAccountDetailInfoByDay?userName='+formData.userName+
		"&payStartTime="+formData.startTime+"&payEndTime="+formData.endTime+"&cmptId="+cmptId;
		$.extend(postData, formData);
		$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
   });
   // 清空按钮
	$('#clear').click(function() {
   	 $('input').val('');
	});
	
	
	
	
	
	
	var upuUrl
	if(key.indexOf('cmptId') > 0){
		upuUrl = value != undefined ? 'queryUnPayUser?cmptId='+value : 'queryUnPayUser';
	}else{
		upuUrl = value != undefined ? 'queryUnPayUser?date='+value : 'queryUnPayUser';
	}
	// jqgrid初期化
	$("#unpayList").jqGrid({
		url: upuUrl,
		datatype: "json",
		cmTemplate : {
			sortable : false
		},
		colModel:[
			{
				label: '用户名',
				name:'userName', 
				width:'15' 
			},{
				label: '手机',
				name:'callPhone',  
				width:'20'
			},{
				label: '赛事名称',
				name:'cmptName',  
				width:'40'
			} ,{
				label: '项目名称',
				name:'roadName',  
				width:'25'
			},{
				label: 'userMapId',
				name:'userMapId',  
				width:'0'
			},{
				label: 'cmptId',
				name:'cmptId',  
				width:'0'
			},{
				label: 'roadId',
				name:'roadId',  
				width:'0'
			}/*
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
		pager: '#unpayPager',
		multiselect: false,
		shrinkToFit:true,
		height:340,
		width:740,
		rowNum:10,
		altRows: true,
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
	
	$("#unpayList tr").toggle(
			function(){
			$(this).addClass("SelectBG");//点第一次选中
			},
			function(){
			$(this).removeClass("SelectBG");//再点一次就反选
			}
			);
	
	$('#upSearchbtn').click(function() {
    	var uppostData = $("#unpayList").jqGrid('getGridParam', 'postData');
		var formData = {
			search : $.trim($('#upSearch').val()),
		};
		
		$.extend(uppostData, formData);
		$("#unpayList").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
    });
	
	$("#transfers").click(function() {
		$("#transfersForm").dialog({
            height:600,
            width:750,
            resizable:true,
            modal:true,  //这里就是控制弹出为模态
            buttons:{
                "确定":function(){ 
                var rid=	$('#unpayList').jqGrid('getGridParam', "selrow");
                var rowData = $('#unpayList').jqGrid('getRowData',rid);
                var warning="请确认是否为比赛："+rowData.cmptName+",项目："+rowData.roadName+",的用户："+rowData.userName+"转账。";
                if(confirm(warning)){
                	$(this).dialog("close");
                	transfers(rowData);
            	}
                
                },
                "取消":function(){$(this).dialog("close");}
            }
        });
	})
	
	function transfers(rowData){
		//console.log(rowData);
		$("#upcmptName").text(rowData.cmptName);
		$("#uproadName").text(rowData.roadName);
		$("#upuserName").text(rowData.userName);
		$("#upcCellphone").text(rowData.callPhone);
		$("#transfersDataform").dialog({
            height:400,
            width:620,
            resizable:true,
            modal:true,  //这里就是控制弹出为模态
            buttons:{
                "确定":function(){ 
                var trAmount=$('#trAmount').val().trim();
                if(trAmount==""){
                	alert("转账金额不能为空！")
                	return false;
                }
                var TrReturnReason=$('#TrReturnReason').val().trim();
                if(TrReturnReason==""){
                	alert("转账原因不能为空！")
                	return false;
                }
                var trPayType=$('#trPayType').val();
                var TrOperator=$('#TrOperator').val().trim();
                if(TrReturnReason==""){
                	alert("操作人不能为空！")
                	return false;
                }
                var payInfo={};
                payInfo.userMapId=rowData.userMapId;
                payInfo.amount=trAmount;
                payInfo.returnReason=TrReturnReason;
                payInfo.payType=trPayType;
                payInfo.returnoperator=TrOperator;
                payInfo.subject=rowData.cmptName+"-"+rowData.roadName+"-"+rowData.userMapId+"-";
                postInfo(payInfo);
                $(this).dialog("close");
                },
                "取消":function(){$(this).dialog("close");}
            }
        });
		
	}
	
	function postInfo(data){
		$.ajax({
			type : "post",
            url : 'transfers',
            data:data,
            success : function onSucc(data) {
            	if(data.status == 1){
	            	alert("转账操作已保存！")
	            	
            	}else{
            		alert(data.msg);
            	} 
            },
            error : function onErr() {
            	showMessage("操作执行失败！","error");
            }
        });
	}
});
