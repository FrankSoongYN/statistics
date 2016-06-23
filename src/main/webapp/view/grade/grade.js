$(function(){
	
	$('#enrolltime').datetimepicker({
		dateFormat : 'yy-mm-dd',
		changeMonth: true,
		changeYear: true
	}); 
	// jqgrid初期化
	$("#list").jqGrid({
		url: "grade/queryForPage",
		datatype: "json",
		cmTemplate : {
			sortable : false
		},
		colModel:[
			{
				label: 'id',
				name:'id', 
				width:'60',
				hidden:true
			},{
				label: '年级',
				name:'name', 
				width:'60',
			},{
				label: '年级主任',
				name:'leader',  
				width:'60'
			},{
				label: '入学时间',
				name:'enrolltime',  
				width:'60',
				formatter:function(cellvalue, options, rowObject){
					var value=new Date(cellvalue);
					return value.toLocaleDateString();
				}
			},{
				label: '操作',
				name:'',  
				width:'60',
				formatter:function(cellvalue, options, rowObject){
					return '<a href="javascript:;" class="update_grade" rowId="'+rowObject.id+'">修改</a>';
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
	
	$('body').on('click','.update_grade',function(e){
		e.preventDefault();
		var rowId=$(this).attr("rowId");
		var rowData = $('#list').jqGrid('getRowData',rowId);
		$("#gradeId").val(rowId)
		$("#name").val(rowData.name);
        $("#leader").val(rowData.leader);
        $("#enrolltime").val(rowData.enrolltime);
		 dialog();
	
	})

   $('#add_Grade').click(function() {
	  dialog();
  });
   
   function dialog(){
	   $("#grade_form").dialog({
           height:230,
           width:400,
           resizable:false,
           modal:true,  //这里就是控制弹出为模态
           buttons:{
               "确定":function(){ 
            	   var parm={};
            	   var name=$("#name").val().trim();
            	   var leader=$("#leader").val().trim();
            	   var enrolltime=$("#enrolltime").val();
            	   var gradeId=$("#gradeId").val().trim();
            	   if(gradeId&&gradeId!=""){
            		   parm.id=gradeId;
            	   }
            	   parm.name=name;
            	   parm.leader=leader;
            	   parm.enrolltime=enrolltime;
            	   saveOrUpdate(parm);
                   $(this).dialog("close");
               },
               "取消":function(){$(this).dialog("close");}
           }
       }); 
   }
   
   function saveOrUpdate(parm){
		$.ajax({
			type : "post",
			url : 'grade/addOrUpdate',
			data:parm,
			success : function onSucc(data) {
				if(data.status == 0){
	            	showMessage(data.msg,"notice",5000);
				} 
				$("#list").trigger('reloadGrid', [{ page : 1 }]);
				$("input").clear();
           },
           error : function onErr() {
           	showMessage("操作执行失败！","error");
           }
       });
	}
});
