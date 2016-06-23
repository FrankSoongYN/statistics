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

	var jqOpt = {
			datatype : 'json',
			cmTemplate: {
				sortable: false
			},
			height : 245,
			rowNum : 10,
			rowList : [ 10, 20, 30 ],
			hidegrid : false,
			hoverrows : false,
			loadui : 'block',
			rownumbers : true,
			viewrecords : true,
			shrinkToFit : false,
	        multiselect : false,
	        altRows : true,
	        autowidth : true,
	        altclass : 'altclass',
			prmNames : {
				page : 'page.page',
				rows : 'page.size',
				sort : 'page.sort',
				order : 'page.sort.dir'
			},
			jsonReader : {
				root : 'content',
				page : 'number',
				rows : 'size',
				total : 'totalPages',
				records : 'totalElements',
				repeatitems : false
			}
		};
	// jqgrid初期化
	$("#list").jqGrid({
		url: "getAccountDetailInfoByCmpt",
		datatype: "json",
		cmTemplate : {
			sortable : false
		},
		colModel:[
			{
				label: '',
				name:'cmptId', 
				width:'60',
				hidden:true
			},{
				label: '赛事',
				name:'cmptName', 
				width:'90' 
			} ,{
				label: '收入总额（元）',
				name:'amount',  
				width:'25'
			},{
				label: '支付宝收入',
				name:'alipayAmount',  
				width:'25'
			},{
				label: '微信收入',
				name:'wxAmount',  
				width:'25'
			} ,{
				label: '支付宝手续费',
				name:'alipayFee',  
				width:'25'
			},{
				label: '微信手续费',
				name:'wxFee',  
				width:'25'
			},{
				label: '退款金额',
				name:'returnAmount',  
				width:'25'
			},{
				label: '应付金额',
				name:'pay',  
				width:'30'
			},{
				label: '最后一笔交易时间',
				name:'updateTime',  
				width:'60'
			},{
				label: '操作',
				name:'',  
				width:'30',
				formatter:function(cellvalue, options, rowObject){
					return '<a href="javascript:;" onclick="javascript:goPage(\''+rowObject.cmptId+'\');">查看明细</a>';
				} 
			},{
				label: '结算状态',
				name:'settlementStatus',  
				width:'20',
				formatter:function(cellvalue, options, rowObject){
					if(cellvalue=='0'){
						return '未结算';
					}else if(cellvalue=='1'){
						return '结算中';
					}else if(cellvalue=='2'){
						return '已结算';
					}
				} 
			} ,{
				label: '结算',
				name:'settlementStatus',  
				width:'20',
				formatter:function(cellvalue, options, rowObject){
					if(cellvalue=='2'){
						return '';
					}else{
						return '<a href="javascript:;" class="settlement"  rowId="'+options.rowId+'" >结算</a>';
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
		subGrid : true,
		subGridRowExpanded:function(subgrid_id, row_id){
			var rowId = row_id;
			var rowData = $('#list').jqGrid('getRowData',rowId);
			var subgrid_table_id;
			subgrid_table_id = subgrid_id + "_t";
			var subgrid_pager_id;  
    		subgrid_pager_id = subgrid_id + "_pgr"; 
    		$('#'+subgrid_id).html("<table id='"+subgrid_table_id+"'></table><div id='"+subgrid_pager_id+"' ></div>");
    		subTableId = subgrid_table_id;
    		$("#" + subgrid_table_id).jqGrid($.extend(jqOpt, { 
    		 	url: '../bill/queryByCmptId?cmptId='+rowData.cmptId,
    		 	pager : subgrid_pager_id,
    		 	datatype: 'json',
    		 	height: 'auto',
    			colModel : [
    			            {label: 'id', name:'id' ,hidden:true},
    			            {label: 'cmptId', name:'cmptId' ,hidden:true},
    						/*{label: '对方结算人', name:'accountHolder',width:'150'},
    						{label: '对方账户', name:'accounts',width:'150'},*/
    						{label: '结算金额', name:'amount',width:'100'},
    						{label: '操作人', name:'operator',width:'100'},
    						{label: '结算时间', name:'time',width:'100'},
    						{label: '备注', name:'remark',width:'300'}
    		    		]
    		}));
    	},
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
			cmptName : $.trim($('#cmptName').val()),
		};
		
		$.extend(postData, formData);
		$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
    });
   $('#payType').change(function(){
	   var postData = $("#list").jqGrid('getGridParam', 'postData');
		var formData = {
			payType : $(this).val(),
			cmptName : $.trim($('#cmptName').val()),
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
   $('#excel').click(function(){
	   var postData = $("#list").jqGrid('getGridParam', 'postData');
		var formData = {
			cmptName : $('#cmptName').val(),
			payType : $(this).val(),
		};
		window.location.href = 'downloadAccountDetailInfoByCmpt?cmptName='+formData.cmptName+"&payType="+formData.payType;
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
   
   function settlement(bill){
	   $.ajax({
		   type : "post",
           url : '../bill/saveBillRecord',
           data:bill,
           success : function onSucc(data) {
           	if(data.status == 1){
	            alert("结算操作已完成！")
           	}else{
           		alert(data.msg);
           	} 
           },
           error : function onErr() {
           	showMessage("操作执行失败！","error");
           }
       });
   }
	$('body').on('click','.settlement',function(e){
		e.preventDefault();
		var rowId=$(this).attr('rowId');
		var rowData = $('#list').jqGrid('getRowData',rowId);
		console.log(rowData);
		$("#cmptName").text(rowData.cmptName);
		$("#cmptAmount").text(rowData.amount);
		$("#payAmount").text(rowData.pay);
		$("#settlementform").dialog({
            height:325,
            width:350,
            resizable:true,
            modal:true,  //这里就是控制弹出为模态
            buttons:{
                "确定":function(){ 
                	var bill={};
                	var amount= $('#amount').val().trim();
                	/*var accounts = $('#accounts').val().trim();
                	var accountHolder = $('#accountHolder').val().trim();*/
                	var operator = $('#operator').val().trim();
                	var remark = $('#remark').val().trim();
                	if(amount==''){
                		alert("金额不能为空！")
                		return false;
                	}
                	/*if(accounts==''){
                		alert("对方账户不能为空！")
                		return false;
                	}
                	if(accountHolder==''){
                		alert("账户持有人不能为空！")
                		return false;
                	}*/
                	if(operator==''){
                		alert("操作人不能为空！")
                		return false;
                	}
                	if(parseFloat(amount)>parseFloat(rowData.pay)){
                		alert("结算金额不能大于应付金额");
                		return false;
                	}
                	bill.amount=amount;
                	/*bill.accounts=accounts;
                	bill.accountHolder=accountHolder;*/
                	bill.operator=operator;
                	bill.remark=remark;
                	bill.cmptId=rowData.cmptId;
                	settlement(bill);
                	$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page :  $('#list').getGridParam('page') }]);
                    $(this).dialog("close");
                    $('#amount').val('');
                    $('#amount').val('');
                	$('#accounts').val('');
                	$('#accountHolder').val('');
                	$('#operator').val('');
                	$('#remark').val('');
                },
                "取消":function(){$(this).dialog("close");}
            }
        });
	})
});
function goPage(cmptId){
	window.location.href = 'fananceCommittee?cmptId='+cmptId;
}