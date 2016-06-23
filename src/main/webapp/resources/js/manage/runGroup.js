$(function(){
	var subTableId = 0;
	$('#payStartTime').datepicker({
		dateFormat : 'yy-mm-dd 00:00:00',
		changeMonth: true,
		changeYear: true 
	}); 
	
	$('#payEndTime').datepicker({
		dateFormat : 'yy-mm-dd 23:59:59',
		changeMonth: true,
		changeYear: true 
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
		url: "../runGroup/queryAllRunGroup",
		datatype: "json",
		cmTemplate : {
			sortable : false
		},
		colModel:[
			{
				label: '',
				name:'id', 
				width:'60',
				hidden:true
			},{
				label: '名称EN',
				name:'name',  
				width:'60' 
			},{
				label: '描述',
				name:'description',  
				width:'60'
			},{
				label: '备注',
				name:'remark',  
				width:'60' 
			},{
				label: '名称CN',
				name:'chineseName',  
				width:'60'
			},{
				label: 'adminUserId',
				name:'user.adminUserId',  
				width:'60',
				hidden:true
			},{
				label: 'adminUserName',
				name:'user.adminUserName',  
				width:'60',
				hidden:true
			},{
				label: 'adminUserPassword',
				name:'user.adminUserPassword',  
				width:'60',
				hidden:true
			},{
				label: 'adminUserRole',
				name:'user.adminUserRole',  
				width:'60',
				hidden:true
			}
		],
		rowList:[10,20,30],
		rownumbers:true,//显示行号
		viewrecords : true,
		pager: '#pager',
		multiselect: false,
		shrinkToFit:true,
		height:930,
		rowNum:10,
		altRows: true,
		autowidth: true,
		altclass:'altclass',//隔行变色样式
		hidegrid:false,
		subGrid : true,
		subGridRowExpanded:function(subgrid_id, row_id){
			var groupId = row_id;
			var subgrid_table_id;
			subgrid_table_id = subgrid_id + "_t";
			var subgrid_pager_id;  
    		subgrid_pager_id = subgrid_id + "_pgr"; 
    		$('#'+subgrid_id).html("<table id='"+subgrid_table_id+"'></table><div id='"+subgrid_pager_id+"' ></div>");
    		subTableId = subgrid_table_id;
    		$("#" + subgrid_table_id).jqGrid($.extend(jqOpt, { 
    		 	url: 'queryUserByGroupId?groupId='+groupId,
    		 	pager : subgrid_pager_id,
    		 	datatype: 'json',
    		 	height: 'auto',
    			colModel : [
    			            {label: 'userId', name:'userId' ,hidden:true},
    						{label: '用户名', name:'name',width:'500px'},
    						{label: '电话', name:'callPhone',width:'500px'} 
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
	$('#add').click(function(){
		$("#addRunGroup").dialog({
            height:700,
            width:700,
            resizable:true,
            modal:true,  //这里就是控制弹出为模态
            buttons:{
                "确定":function(){ 
                	if(/^[A-Za-z]+$/.test($('#name').val())){
                		$.ajax({
                    		url : 'insertRunGroup',
                    		type : 'post',
                    		data : $('#dataDialog').serialize(),
                    		success : function(retData){
                    			if(retData.status == 1){
                    				alert('添加成功');
                    				$("#list").trigger('reloadGrid', [{ page : 1 }]);
                    			}else{
                    				alert('添加失败!');
                    			}
                    		},
                    		error:function(){
                    			alert('添加失败');
                    		}
                    	});
                		$(this).dialog("close");
                	}else{
                		alert('名称EN：请输入英文字母');
                		$('#name').focus();
                	}
                },
                "取消":function(){$(this).dialog("close");}
            }
        });
	});
	
	$('#deleteRunner').click(function(){
		var rowid = $('#'+subTableId).jqGrid('getGridParam', "selrow");
        if (rowid === null) {
            showMessage('未选择有效的数据行', 'notice',3000);
        } else {
        	var selRow = $('#'+subTableId).jqGrid('getRowData', rowid);
        	if(selRow.userId){ 
        		if(confirm('您确定要删除该人员信息吗?')){
        			$.ajax({
                		url : 'deleteRunner',
                		type : 'get',
                		data : {'userId':selRow.userId},
                		success : function(retData){
                			if(retData.status == 1){
                				alert('删除成功！');
                				$("#"+subTableId).trigger('reloadGrid', [{ page : 1 }]);
                			}else{
                				alert('没有找到用户');
                			}
                		}
                	});
        		}
        	}else{
        		showMessage('选择行不是人员信息行', 'warning',3000);
        	}
        }
	});
	
	$('#addRunner').click(function(){
		var rowid = $('#list').jqGrid('getGridParam', "selrow");
        if (rowid === null) {
            showMessage('未选择有效的数据行', 'notice',3000);
        } else {
        	var selRow = $('#list').jqGrid('getRowData', rowid);
		$("#addRunnerDialog").dialog({
            height:300,
            width:400,
            resizable:true,
            modal:true,  //这里就是控制弹出为模态
            buttons:{
                "确定":function(){ 
                	if(flag){//only if can find the runner,send ajax request
	                	$.ajax({
	                		url : 'addRunner',
	                		type : 'get',
	                		data : {'groupId':selRow.id,'userId':$('input:checked').val()},
	                		success : function(retData){
	                			if(retData.status == 1){
	                				alert('添加成功');
	                				$("#list").trigger('reloadGrid', [{ page : 1 }]);
	                			}else{
	                				alert('添加失败!');
	                			}
	                			flag = false;
	                		},
	                		error:function(){
	                			alert('添加失败');
	                		}
	                	});
                	}
                    $(this).dialog("close");
                },
                "取消":function(){$(this).dialog("close");}
            }
        });
        }
	});
	var flag = false;
	$('#search').click(function(e){
		e.preventDefault();
        	$.ajax({
        		url : 'queryUserByPhone',
        		type : 'get',
        		data : {'callPhone':$('#phone').val()},
        		success : function(retData){
        			if(retData.status == 1){
        				flag = true;
        				$('#userSection').empty();
        				$('#userSection').append('<input name="userId" type="radio" value="'+retData.user.userId+'">'+retData.user.name+'</in>');
        			}else{
        				alert('没有找到用户');
        			}
        		}
        	});
	});
	
	$('#update').click(function(){
		var rowid = $('#list').jqGrid('getGridParam', "selrow");
        if (rowid === null) {
            showMessage('未选择有效的数据行', 'notice',3000);
        } else {
        	var selRow = $('#list').jqGrid('getRowData', rowid);
        	$('#name').val(selRow.name);
        	$('#description').val(selRow.description);
        	$('#remark').val(selRow.remark);
        	$('#chineseName').val(selRow.chineseName);
        	$('#adminUserName').val(selRow['user.adminUserName']);
        	$('#adminUserPassword').val(selRow['user.adminUserPassword']);
        	$('#adminUserRole').val(selRow['user.adminUserRole']);
        	$("#addRunGroup").dialog({
                height:700,
                width:700,
                resizable:true,
                modal:true,  //这里就是控制弹出为模态
                buttons:{
                    "确定":function(){ 
                    		$.ajax({
                        		url : 'updateRunGroup',
                        		type : 'post',
                        		data : $('#dataDialog').serialize()+"&id="+selRow.id+'&adminUserId='+selRow['user.adminUserId'],
                        		success : function(retData){
                        			if(retData.status == 1){
                        				alert('更新成功');
                        				$("#list").trigger('reloadGrid', [{ page : 1 }]);
                        			}else{
                        				alert('更新失败!');
                        			}
                        			flag = true;
                        		},
                        		error:function(){
                        			alert('添加失败');
                        		}
                        	});
                        $(this).dialog("close");
                    },
                    "取消":function(){$(this).dialog("close");}
                }
            });
        }
	});
	 $('#search').click(function(){
		 $.ajax({
			 url : '',
			 type : 'post',
			 success : function(retData){
				 
			 }
		 });
	 });
    // 对账
    $('#delete').click(function() {
    	var rowid = $('#list').jqGrid('getGridParam', "selrow");
        if (rowid === null) {
            showMessage('未选择有效的数据行', 'notice',3000);
        } else {
        	var selRow = $('#list').jqGrid('getRowData', rowid);
        	if(confirm('删除该跑团吗？')){
        		$.ajax({
    				type : "post",
    	            url : 'deleteRunGroup',
    	            data:{
    	            	id:  selRow.id,
    	            },
    	            success : function (data) {
    	            	if(data.status == 1){
    		            	showMessage("删除成功","notice",5000);
    	            	} 
    	            	$("#list").trigger('reloadGrid', [{ page : 1 }]);
    	            },
    	            error : function onErr() {
    	            	showMessage("操作执行失败！","error");
    	            }
    	        });
        	}
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
   $('#isDelete').change(function(){
	   var postData = $("#list").jqGrid('getGridParam', 'postData');
		var formData = {
			isDelete : $(this).val() 
		};
		$.extend(postData, formData);
		$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
   });
   //恢复
   $('#renew').click(function() {
	   var rowid = $('#list').jqGrid('getGridParam', "selrow");
       if (rowid === null) {
           showMessage('未选择有效的数据行', 'notice',3000);
       } else {
    	   var selRow = $('#list').jqGrid('getRowData', rowid);
    	   if(selRow.isDelete == '已删除'){
    		   $.ajax({
   				type : "post",
   	            url : 'updateBannerById',
   	            data:{
   	            	id:  selRow.id,
   	            	isDelete : 0
   	            },
   	            success : function (data) {
   	            	if(data.status == 1){
   		            	showMessage("删除banner成功","notice",5000);
   	            	} 
   	            	$("#list").trigger('reloadGrid', [{ page : 1 }]);
   	            },
   	            error : function onErr() {
   	            	showMessage("操作执行失败！","error");
   	            }
   	        });
    	   }else{
    		   showMessage('选择数据无效', 'notice',3000);
    	   }
       }
   });
   
   
   // 清空按钮
	$('#clear').click(function() {
   	 $('input').val('');
  });
});
function goPage(date){
	window.location.href = 'fananceCommittee?date='+date;
}
function uploadImage(data){
	$.ajax({
		url : 'insertBanner',
		type : 'post',
		data : {'cmptUrl':data.cmptUrl,'picUrl':data.bannerUrl,'remark':data.remark,'bannerBgUrl':data.bannerBgUrl},
		success : function(retData){
			if(retData.status == 1){
				alert('上传成功');
				$("#list").trigger('reloadGrid', [{ page : 1 }]);
			}else{
				alert('上传失败!');
			}
		},
		error:function(){
			alert('上传失败');
		}
	});
}