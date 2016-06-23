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
	
	// jqgrid初期化
	$("#list").jqGrid({
		url: "queryEnrollCmpt",
		datatype: "json",
		cmTemplate : {
			sortable : false
		},
		colModel:[
			{
				label: '赛事Id',
				name:'cmptId', 
				width:'5%'
			},{
				label: '赛事名称',
				name:'cmptName',  
				width:'15%'
			},{
				label: '创建人',
				name:'userName',  
				width:'5%'
			},{
				label: '创建人电话',
				name:'callPhone',  
				width:'10%'
			},{
				label: '成绩地址',
				name:'scoreUrl',  
				width:'10%'
			},{
				label: '证书地址',
				name:'certUrl',  
				width:'10%'
			},{
				label: '创建时间',
				name:'createTime',  
				width:'10%',
				formatoptions:{srcformat: 'Y-m-d H:i:s', newformat: 'Y-m-d H:i:s'}
			},
			{
				label: '是否热门',
				name:'hotIndex',  
				width:'3%',
				formatter:function(cellvalue, options, rowObject){
					if(cellvalue == '1'){
						return '热门赛事';
					}else if(cellvalue == '0'){
						return '去报名';
					}else if(cellvalue == '-1'){
						return '去看看';
					}
				}
			},
			{
				label: '关闭报名',
				name:'isClose',  
				width:'5%',
				formatter:function(cellvalue, options, rowObject){
					if(cellvalue == '1'){
						return '已关闭';
					}else {
						return '未关闭';
					}
				}
			},
			{
				label: '是否删除',
				name:'isDelete',  
				width:'5%',
				formatter:function(cellvalue, options, rowObject){
					if(cellvalue == '1'){
						return '已删除';
					}else {
						return '未删除';
					}
				}
			},
			{
				label: '是否审核',
				name:'cmptAuditLevel',  
				width:'5%',
				formatter:function(cellvalue, options, rowObject){
					if(cellvalue == '1'){
						return '已审核';
					}else{
						return '未审核';
					}
				}
			},{
				label: '查看',
				name:'view', 
				width:'7%'
			},{
				label: '操作',
				name:'Modify', 
				width:'7%'
			}
		],
		rowList:[10,20,30],
		rownumbers:true,//显示行号
		viewrecords : true,
		pager: '#pager',
		multiselect: false,
		shrinkToFit:true,
		height:730,
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
		}, gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
            var ids=jQuery("#list").jqGrid('getDataIDs');
            for(var i=0; i<ids.length; i++){
                var id=ids[i];   
                view = "<a style='color:#f60' class='view' id='view_"+id+"' >查看页面</a>";  //这里的onclick就是调用了上面的javascript函数 Modify(id)
                modify = "<a style='color:#f60' class='modify' id='modify_"+id+"' >修改审核状态</a>";  //这里的onclick就是调用了上面的javascript函数 Modify(id)  
                jQuery("#list").jqGrid('setRowData', ids[i], { Modify: modify ,view: view});
            }
        }
	});
	
   $('#link').click(function(){
	   var rowid = $('#list').jqGrid('getGridParam', "selrow");
       if (rowid === null) {
           showMessage('未选择有效的数据行', 'notice',3000);
       } else {
    	   $("#linkDialog").dialog({
               height:230,
               width:700,
               resizable:true,
               modal:true,  //这里就是控制弹出为模态
               buttons:{
                   "确定":function(){ 
                	   var selRow = $('#list').jqGrid('getRowData', rowid);
                	   $.ajax({
               			type : "post",
                           url : 'updateLink',
                           data:{
                           	cmptId:  selRow.cmptId,
                           	certUrl: $('#certUrl').val(),
                           	scoreUrl : $('#scoreUrl').val()
                           },
                           success : function (data) {
                           	if(data.status == 1){
               	            	showMessage('更新成功',"notice",5000);
                           	} else{
                           		showMessage('更新失败',"notice",5000);
                           	}
                           	$("#list").trigger('reloadGrid', [{ page : 1 }]);
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
       }
	  
   });
    
   function changeParam(){
	   var postData = $("#list").jqGrid('getGridParam', 'postData');
		var formData = {
			cmptName : $.trim($('#cmptName').val()),
			cmptType:$('#cmptType').val(),
			isDelete:$('#isDelete').val(),
			isAudit:$('#isAudit').val(),
			startTime:$('#startTime').val(),
			endTime:$('#endTime').val(),
			creator:$.trim($('#creator').val())
		};
		
		$.extend(postData, formData);
		$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
   }
    // 查询
   $('#search').click(function() {
	   changeParam();
    });
   
   // 清空按钮
	$('#clear').click(function() {
   	 $('input').val('');
  });
	
	
	$('#cmptType').change(function(){
		changeParam();
	   });
	
	$('#isDelete').change(function(){
		changeParam();
	   });
	
	$('#isAudit').change(function(){
		changeParam();
	   });
	
	
	$('body').on('click','.modify',function(){
		var id =this.id.split("_")[1];
		var selRow = $('#list').jqGrid('getRowData', id);
		$("#pcmptName").text(selRow.cmptName);
		$("#modifyform").dialog({
            height:230,
            width:400,
            resizable:false,
            modal:true,  //这里就是控制弹出为模态
            buttons:{
                "确定":function(){                    
                	updateStatus(selRow);
                    $(this).dialog("close");
                },
                "取消":function(){$(this).dialog("close");}
            }
        });
	});
	
	$('#hot').click(function(){
		var rowid = $('#list').jqGrid('getGridParam', "selrow");
        if (rowid === null) {
            showMessage('未选择有效的数据行', 'notice',3000);
        } else {
        	$("#hotDialog").dialog({
                height:230,
                width:400,
                resizable:false,
                modal:true,  //这里就是控制弹出为模态
                buttons:{
                    "确定":function(){                    
                    	var selRow = $('#list').jqGrid('getRowData', rowid);
                		$.ajax({
                			type : "post",
                            url : 'updateHotIndex',
                            data:{
                            	cmptId:  selRow.cmptId,
                            	hotIndex: $('#hotIndex').val()
                            },
                            success : function onSucc(data) {
                            	if(data.status == 1){
                	            	showMessage('更新成功',"notice",5000);
                            	} else{
                            		showMessage('更新失败',"notice",5000);
                            	}
                            	$("#list").trigger('reloadGrid', [{ page : 1 }]);
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
        } 
	});
	
	$('body').on('click','.view',function(){
		var id =this.id.split("_")[1];
		var selRow = $('#list').jqGrid('getRowData', id);
		var cmptId=selRow.cmptId;
		var href_url=concatUrl("http://www.geexek.com/enroll-beta/pc/enroll/cmptInfo.html?", "cId="+cmptId);
		window.open(href_url);
		
	});
	function updateStatus(selRow){
		var level;
		if(selRow.cmptAuditLevel=="已审核"){
			level=-1;
		}else{
			level=1;
		}
		$.ajax({
			type : "post",
            url : 'updateEnrollCmpt',
            data:{
            	cmptId:  selRow.cmptId,
            	cmptAuditLevel:level
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
