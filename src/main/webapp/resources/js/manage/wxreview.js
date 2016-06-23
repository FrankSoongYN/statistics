$(function(){
	
	

	var postUrl="getWxReview";
	// jqgrid初期化
	$("#list").jqGrid({
		url: postUrl,
		datatype: "json",
		postData:{type:4},
		cmTemplate : {
			sortable : false
		},
		colModel:[
			{
				label: '',
				name:'id', 
				hidden:true
			},{
				label: '关键字',
				name:'keyword', 
				width:'90' 
			},{
				label: '类型',
				name:'type', 
				width:'90' ,
				formatter:function(cellvalue, options, rowObject){
					if(cellvalue==1){
						return '文字'
					}else if(cellvalue==2){
						return '图片'
					}
					return '';
				} 
			},{
				label: '回复内容',
				name:'content', 
				width:'90' 
			},{
				label: '流媒体内容',
				name:'mediaId', 
				width:'90' ,
				formatter:function(cellvalue, options, rowObject){
//					if(cellvalue){
//						return '<a href="javascript:;"  class="view" mediaId="'+cellvalue+'"  rowId="'+options.rowId+'">点击查看</a>';
//					}else{
//						return '';
//					}
					if(cellvalue){
						return '微信回复查看';
					}else{
						return '';
					}
					
					
				} 
			},{
				label: '删除',
				name:'',  
				width:'30',
				formatter:function(cellvalue, options, rowObject){
					return '<a href="javascript:;"  class="delReview"  rowId="'+options.rowId+'">删除</a>';
				} 
			} ,{
				label: '修改',
				name:'',  
				width:'30',
				formatter:function(cellvalue, options, rowObject){
					return '<a href="javascript:;"  class="updateReview"  rowId="'+options.rowId+'">修改</a>';
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
	

	
   $('#search').click(function() {
	   var keyword =$.trim($('#keyword').val())
	   if(keyword){
	    	var postData = $("#list").jqGrid('getGridParam', 'postData');
			var formData = {
				type:'2',
				keyword : $.trim($('#keyword').val())
			};
			$.extend(postData, formData);
	   }
	   $("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
    });
   // 清空按钮
   $('#clear').click(function() {
   	 $('input').val('');
  });
   	
   
	$("#type").change(function(){
		var _this=$(this);
		var val=_this.find("option:selected").val();
		if(val==1){
			$("#midiaDiv").hide();
			$("#contentDiv").show();
		}else if(val==2){
			$("#midiaDiv").show();
			$("#contentDiv").hide();
		}
	});
	
	$("#addReview").click(function(e){
		e.preventDefault();
		$("#midiaDiv").hide();
		$("#reviewform").dialog({
		      height:250,
		      width:350,
		      resizable:true,
		      modal:true,  //这里就是控制弹出为模态
		      buttons:{
		          "确定":function(){ 
		            	submit();
		            	$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page :  $('#list').getGridParam('page') }]);
		                $(this).dialog("close");
		            },
		           "取消":function(){$(this).dialog("close");}
		        }
		    });
			
		})
		
	$('body').on('click','.updateReview',function(e){
		e.preventDefault();
		var rowId=$(this).attr('rowId');
		var rowData = $('#list').jqGrid('getRowData',rowId);
		$("#keyword").val(rowData.keyword);
		$("#type option:selected").attr("selected", false); 
		$("#type option[text="+rowData.type+"]").attr("selected", true); 
		$("#reviewId").val(rowData.id);
		if(rowData.type=="文字"){
			$("#content").val(rowData.content);
			$("#midiaDiv").hide();
			$("#contentDiv").show();
		}else{
			$("#midiaDiv").show();
			$("#contentDiv").hide();
		}
		
		$("#reviewform").dialog({
		      height:250,
		      width:350,
		      resizable:true,
		      modal:true,  //这里就是控制弹出为模态
		      buttons:{
		          "确定":function(){ 
		            	submit();
		            	$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page :  $('#list').getGridParam('page') }]);
		                $(this).dialog("close");
		            },
		           "取消":function(){$(this).dialog("close");}
		        }
		    });
			
		})
	
	   function submit(){
			$('#mediaForm').ajaxSubmit({
				url :'saveOrUpdateWxReview',
				clearForm: false,
				timeout:10*60*1000,
	            method:'post',
				success:function (data){
					console.log(data)
		    		if(data.status==1){
		    			alert("数据提交成功！");
		    		}else{
		    			alert(data.msg);
		    		}
		    	},
		    	error: function(XMLHttpRequest, textStatus, errorThrown) {
	                alert("添加失败,异常信息:"+XMLHttpRequest.status+textStatus);
	            }          
		    });
		}
	
	$('body').on('click','.delReview',function(e){
		e.preventDefault();
		var rowId=$(this).attr('rowId');
		var rowData = $('#list').jqGrid('getRowData',rowId);
		$.ajax({
			   type : "post",
	           url : 'delWxReview',
	           data:{
	        	   id:rowData.id
	           },
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
	})
	
	function getToken(){
		var token;
		$.ajax({
			   type : "post",
	           url : 'getAccessToken',
	           async: false, 
	           success : function onSucc(data) {
	           	if(data.status == 1){
		           token=data.access_token;
	           	} 
	           },
	           error : function onErr() {
	           	showMessage("操作执行失败！","error");
	           }
	       });
		return token;
	}
	
	$('body').on('click','.view',function(e){
		e.preventDefault();
		var mediaId=$(this).attr('mediaId');
		
		var token=getToken();
		if(token){
			var url="https://api.weixin.qq.com/cgi-bin/material/get_material?access_token="+token;
			//window.open(url);
			openPostWindow(url, mediaId, "微信图片")
		}else{
			alert("微信异常！")
		}
		
	})

	function openPostWindow(url, data, name) {  
	          var tempForm = document.createElement("form");  
	          tempForm.id="tempForm1";  
	           tempForm.method="post";  
	           tempForm.action=url;  
	           tempForm.target=name;  
	           
	           var hideInput = document.createElement("input");  
	           hideInput.type="hidden";  
	           hideInput.name= "media_id"
	           hideInput.value= data;
	           tempForm.appendChild(hideInput);   
	           tempForm.addEventListener("onsubmit",function(){ openWindow(name); });
	           document.body.appendChild(tempForm);  
	          
	           tempForm.removeEventListener("onsubmit");
	           tempForm.submit();
	           document.body.removeChild(tempForm);
	     }
	     
	      function openWindow(name)  
	      {  
	          window.open('about:blank',name,'height=400, width=400, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes');   
	      }  
	
});
