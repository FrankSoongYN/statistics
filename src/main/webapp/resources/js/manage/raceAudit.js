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
		url: "queryRaceCmpt",
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
				width:'20%'
			},{
				label: '开始时间',
				name:'cmptBeginTime',  
				width:'15%'
			},{
				label: '开始时间',
				name:'cmptEndTime',  
				width:'15%'
			},{
				label: '地点',
				name:'cmptLocation',  
				width:'10%'
			},{
				label: '创建人电话',
				name:'callPhone',  
				width:'10%'
			},{
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
			},{
				label: '是否审核',
				name:'status',  
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
                view = "<button style='color:#f60' class='view' id='view_"+id+"' >查看页面</button>";  //这里的onclick就是调用了上面的javascript函数 Modify(id)
                modify = "<button style='color:#f60' class='modify' id='modify_"+id+"' >修改审核状态</button>";  //这里的onclick就是调用了上面的javascript函数 Modify(id)  
                jQuery("#list").jqGrid('setRowData', ids[i], { Modify: modify ,view: view});
            }
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
   
   // 清空按钮
	$('#clear').click(function() {
   	 $('input').val('');
  });
	

	$('body').on('click','.modify',function(){
		var id =this.id.split("_")[1];
		var selRow = $('#list').jqGrid('getRowData', id);
		$("#cmptName").text(selRow.cmptName);
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
	
	$('body').on('click','.view',function(){
		var id =this.id.split("_")[1];
		var selRow = $('#list').jqGrid('getRowData', id);
		var cmptId=selRow.cmptId;
		var href_url=race+"sBoard/index.html?cId="+cmptId;
		window.open(href_url);
	});
	
	function updateStatus(selRow){
		var level;
		if(selRow.status=="已审核"){
			level=0;
		}else{
			level=1;
		}
		$.ajax({
			type : "post",
            url : 'updateRaceCmpt',
            data:{
            	cmptId:  selRow.cmptId,
            	status:level
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


