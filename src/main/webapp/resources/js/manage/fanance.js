$(function(){
	
	
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
	
	// jqgrid初期化
	$("#list").jqGrid({
		url: "getAccountInfoByDay",
		datatype: "json",
		cmTemplate : {
			sortable : false
		},
		colModel:[
			{
				label: '日期',
				name:'date', 
				width:'60' 
			},{
				label: '收入（元）',
				name:'sum',  
				width:'60'
			},{
				label: '缴费人数',
				name:'count',  
				width:'60'
			},
			{
				label: '操作',
				name:'',  
				width:'80',
				formatter:function(cellvalue, options, rowObject){
					 return '<a href="javascript:;" onclick="goPage(\''+rowObject.date+'\')">查看明细</a>';
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
			startTime : $.trim($('#payStartTime').val()),
			endTime : $.trim($('#payEndTime').val())
		};
		
		$.extend(postData, formData);
		$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
    });
   
   $('#type').change(function(){
	   var postData = $("#list").jqGrid('getGridParam', 'postData');
		var formData = {
			type : $(this).val(),
			startTime : $.trim($('#payStartTime').val()),
			endTime : $.trim($('#payEndTime').val())
		};
		$.extend(postData, formData);
		$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
   });
   
   $('#payType').change(function(){
	   var postData = $("#list").jqGrid('getGridParam', 'postData');
		var formData = {
			type : $('#type').val(),
			payType : $(this).val(),
			startTime : $.trim($('#payStartTime').val()),
			endTime : $.trim($('#payEndTime').val())
		};
		$.extend(postData, formData);
		$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
   });
   
   $('#excel').click(function(){
	   var postData = $("#list").jqGrid('getGridParam', 'postData');
		var formData = {
			type : $('#type').val(),
			payType : $(this).val(),
			startTime : $.trim($('#payStartTime').val()),
			endTime : $.trim($('#payEndTime').val())
		};
		window.location.href = 'downloadAccountInfoByDay?type='+formData.type+"&payType="+formData.payType+
		"&startTime="+formData.startTime+"&endTime="+formData.endTime;
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
function goPage(date){
	window.location.href = 'fananceCommittee?date='+date;
}