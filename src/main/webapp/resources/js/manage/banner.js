$(function(){
	
	var nignxImageURl = 'http://www.geexek.com:9099/files/';
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
	
	// jqgrid初期化
	$("#list").jqGrid({
		url: "queryAllBanner",
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
				label: '图片',
				name:'picUrl',  
				width:'60',
				formatter:function(cellvalue, options, rowObject){
					return '<img src="'+nignxImageURl+rowObject.picUrl+'" style="width:80px;height:80px">';
				}
			},{
				label: '赛事',
				name:'cmptUrl',  
				width:'60'
			},{
				label: '背景图',
				name:'bannerBgUrl',  
				width:'60',
				formatter:function(cellvalue, options, rowObject){
					return '<img src="'+nignxImageURl+rowObject.bannerBgUrl+'" style="width:80px;height:80px">';
				}
			},{
				label: '描述',
				name:'remark',  
				width:'60'
			},{
				label: '显示顺序',
				name:'sort',  
				width:'60'
			},{
				label: '状态',
				name:'isDelete',  
				width:'60',
				formatter:function(cellvalue, options, rowObject){
					if(cellvalue == '1'){
						return '已删除';
					}else{
						return '未删除';
					}
				}
			},{
				label: '操作',
				name:'',  
				width:'60',
				formatter:function(cellvalue, options, rowObject){
					return '<a href="javascript:;" class="up"  rowId="'+options.rowId+'">上移</a><a href="javascript:;" style="margin: 0 5px 0 10px;" class="down"  rowId="'+options.rowId+'">下移</a>'
				}
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
	$('#upload').click(function(){
		$("#modifyform").dialog({
            height:800,
            width:900,
            resizable:true,
            modal:true,  //这里就是控制弹出为模态
            buttons:{
                "确定":function(){ 
                	data['cmptUrl'] = $('#cmptUrl').val();
                	data['remark'] = $('#remark').val();
                	data['bannerBgUrl'] = $('#bannerBgImgInput').val();
                	data['bannerUrl'] = $('#bannerImgInput').val();
                	data['sort'] = $('#sort').val();
                	uploadImage(data);
                    $(this).dialog("close");
                },
                "取消":function(){$(this).dialog("close");}
            }
        });
	});
	$('#uploadicon').change(function(){
		$('#coverForm').ajaxSubmit({
			url : '../upload/image',
			clearForm : false,
			timeout : 10 * 60 * 1000,
			method : 'post',
			success : function(data) {
				/*data = JSON.parse(data);*/
				if(data){
					if(data.status == 1){
						var dbImageUrl = data.fileRelativePath;
						var imageUrl = nignxImageURl + dbImageUrl;
						$("#bannerImg").attr("src",imageUrl);
						$("#bannerImgInput").val(dbImageUrl);
					}else{
						alert("上传图片失败");
					}
				}
			},
		  error : function(XMLHttpRequest,textStatus,errorThrown) {
				alert("请检查你的网络设置");
				}
	    });
	});
	
	$('#uploadicon2').change(function(){
		$('#coverForm2').ajaxSubmit({
			url : '../upload/image',
			clearForm : false,
			timeout : 10 * 60 * 1000,
			method : 'post',
			success : function(data) {
				/*data = JSON.parse(data);*/
				if(data){
					if(data.status == 1){
						var dbImageUrl = data.fileRelativePath;
						var imageUrl = nignxImageURl + dbImageUrl;
						$("#bannerBgImg").attr("src",imageUrl);
						$("#bannerBgImgInput").val(dbImageUrl);
					}else{
						alert("上传图片失败");
					}
				}
			},
		  error : function(XMLHttpRequest,textStatus,errorThrown) {
				alert("请检查你的网络设置");
				}
	    });
	});
	
	$('#bannerImgBtn').click(function(e){
		e.preventDefault();
		$('#uploadicon').trigger('click');
	});
	
	$('#bannerBgBtn').click(function(e){
		e.preventDefault();
		$('#uploadicon2').trigger('click');
	});
    
    $('#delete').click(function() {
    	var rowid = $('#list').jqGrid('getGridParam', "selrow");
        if (rowid === null) {
            showMessage('未选择有效的数据行', 'notice',3000);
        } else {
        	if(confirm('确认要删除该记录')){
        		var selRow = $('#list').jqGrid('getRowData', rowid);
    			$.ajax({
    				type : "post",
    	            url : 'updateBannerById',
    	            data:{
    	            	id:  selRow.id,
    	            	isDelete : 1
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
	
	
	$('body').on('click','.up',function(e){
		e.preventDefault();
		var rowId=$(this).attr('rowId');
		if(rowId==1){
			alert("第一行无法上移")
			return false;
		}
		changeSort(rowId,1)
	})
		
	$('body').on('click','.down',function(e){
		e.preventDefault();
		var rowId=$(this).attr('rowId');
		changeSort(rowId)
	})
	
	//isUp 1上移
	function changeSort(rowId,isUp){
		var oldRowData = $('#list').jqGrid('getRowData',rowId);
		var newSort;
		if(isUp&&isUp==1){
			if(oldRowData.sort==1){
				alert("显示顺序已经是第一了，无法上移。。。")
				return false;
			}
			newSort=parseInt(oldRowData.sort)-1;
		}else{
			if(oldRowData.sort==3){
				alert("只能显示三项，请注意操作。。。")
				return false;
			}
			newSort=parseInt(oldRowData.sort)+1;
		}
		
		 $.ajax({
			   type : "post",
	           url : 'updateBannerSort',
	           data:{
	        	   'oldId':oldRowData.id,
	        	   'oldSort':oldRowData.sort,
	        	   'newSort':newSort
	           },
	           success : function onSucc(data) {
	           	if(data.status == 1){
	           		$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
		            alert("操作已完成！")
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

function uploadImage(data){
	$.ajax({
		url : 'insertBanner',
		type : 'post',
		data : {
			'cmptUrl':data.cmptUrl,
			'picUrl':data.bannerUrl,
			'remark':data.remark,
			'bannerBgUrl':data.bannerBgUrl,
			'sort':data.sort
			},
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