$(function(){
	
	
	$('#payStartTime').datetimepicker({
		dateFormat : 'yy-mm-dd',
		changeMonth: true,
		changeYear: true,
		onSelect: function(date){
			$('#payEndTime').datepicker( "option", "minDate",date);
		}
	}); 
	
	$('#payEndTime').datetimepicker({
		dateFormat : 'yy-mm-dd',
		changeMonth: true,
		changeYear: true,
		onSelect: function(date){
			$('#payStartTime').datepicker( "option", "maxDate",date);
		}
	}); 
	
	// jqgrid初期化
	$("#list").jqGrid({
		url: "queryAllBadAccount",
		datatype: "json",
		cmTemplate : {
			sortable : false
		},
		colModel:[
			{
				label: '用户编号',
				name:'registerId', 
				width:'60',
				hidden:true
			},{
				label: '电话号',
				name:'callPhone',  
				width:'60'
			},{
				label: '充值金额',
				name:'amount',  
				width:'60'
			},
			{
				label: '充值前',
				name:'payBeforeBalance',  
				width:'60'
			},
			{
				label: '充值后',
				name:'payAfterBalance',  
				width:'60'
			},
			{
				label: '订单号',
				name:'applyId',  
				width:'250',
				hidden:true
			},
			{
				label: '交易状态',
				name:'tradeStatus',  
				width:'100',
				formatter:function(cellvalue, options, rowObject){
					if(cellvalue == 'TRADE_FAILED'){
						return '失败';
					}else if(cellvalue == 'TRADE_SUCCESS'){
						return '成功';
					}
				}
			},
			{
				label: '是否对账',
				name:'isCheck',  
				width:'80',
				formatter:function(cellvalue, options, rowObject){
					if(cellvalue == '0'){
						return '未对账';
					}else if(cellvalue == '1'){
						return '已对账';
					}
				} 
			},
			{
				label: '是否坏账',
				name:'isBadDebt',  
				width:'80',
				formatter:function(cellvalue, options, rowObject){
					if(cellvalue == '0'){
						return '否';
					}else if(cellvalue == '1'){
						return '是';
					}
				} 
			},
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
			}
		],
		rowList:[10,20,30],
		rownumbers:true,//显示行号
		viewrecords : true,
		pager: '#pager',
		multiselect: false,
		shrinkToFit:true,
		height:330,
		rowNum:10,
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
	
    // 对账
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
    });
    
    // 查询
   $('#search').click(function() {
    	var postData = $("#list").jqGrid('getGridParam', 'postData');
		var formData = {
			callPhone : $.trim($('#callPhone').val()),
			payStartTime : $.trim($('#payStartTime').val()),
			payEndTime : $.trim($('#payEndTime').val())
		};
		
		$.extend(postData, formData);
		$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
    });
   
   $('#adjustedAccount').click(function() {
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
  });
   // 清空按钮
   $('#clear').click(function() {
   	 $('input').val('');
  });
});
