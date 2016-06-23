$(function(){


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
		url: "getButton?type=1",
		datatype: "json",
		cmTemplate : {
			sortable : false
		},
		colModel:[
		          {
		        	  label: '',
		        	  name:'id', 
		        	  hidden:true
		          },{
		        	  label: '菜单',
		        	  name:'name', 
		        	  width:'90' 
		          },{
		        	  label: '显示顺序',
		        	  name:'sort',
		        	  width:'100'
		          },{
		        	  label: '修改',
		        	  name:'',  
		        	  width:'50',
		        	  formatter:function(cellvalue, options, rowObject){
		        		  return '<a href="javascript:;"  class="updatebutton" rowId="'+options.rowId+'">修改</a>';;
		        	  } 
		          },{
		        	  label: '删除',
		        	  name:'',  
		        	  width:'30',
		        	  formatter:function(cellvalue, options, rowObject){
		        		  return '<a href="javascript:;"  class="delbutton"  buttonId="'+rowObject.id+'"   rowId="'+options.rowId+'">删除</a>';
		        	  } 
		          } ,{
		        	  label: '增加子菜单',
		        	  name:'settlementStatus',  
		        	  width:'20',
		        	  formatter:function(cellvalue, options, rowObject){
		        		  return '<a href="javascript:;" class="addButton"  rowId="'+options.rowId+'" >添加</a>';
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
		        		  url: 'getButton?type=2&dependId='+rowData.id,
		        		  pager : subgrid_pager_id,
		        		  datatype: 'json',
		        		  height: 'auto',
		        		  colModel : [
		        		              {
		        		            	  label: 'id', 
		        		            	  name:'id' ,
		        		            	  hidden:true
		        		              },{	
		        		            	  label: 'dependId', 
		        		            	  name:'dependId' ,
		        		            	  hidden:true
		        		              },{	
		        		            	  label: '菜单名',
		        		            	  name:'name',
		        		            	  width:'100'
		        		              },{
		        		            	  label: '类型', 
		        		            	  name:'type',
		        		            	  width:'100',
		        		            	  formatter:function(cellvalue, options, rowObject){
		        		            		  if(cellvalue==1){
		        		            			  return '点击'
		        		            		  }else if(cellvalue==2){
		        		            			  return '跳转URL'
		        		            		  }else if(cellvalue==3){
		        		            			  return '扫码推事件'
		        		            		  }else if(cellvalue==5){
		        		            			  return '弹出系统拍照发图'
		        		            		  }else if(cellvalue==6){
		        		            			  return '弹出拍照或者相册发图'
		        		            		  }else if(cellvalue==8){
		        		            			  return '地理位置'
		        		            		  }
		        		            		  return ''
		        		            	  }
		        		              },{
		        		            	  label: '链接',
		        		            	  name:'url',
		        		            	  width:'100'
		        		              },{
		        		            	  label: '显示顺序',
		        		            	  name:'sort',
		        		            	  width:'100'
		        		              },{	
		        		            	  label: 'media_id', 
		        		            	  name:'media_id',
		        		            	  width:'100',
		        		            	  hidden:true
		        		              },{
		        		            	  label: '修改',
		        		            	  name:'',  
		        		            	  width:'50',
		        		            	  formatter:function(cellvalue, options, rowObject){
		        		            		  return '<a href="javascript:;"  class="updateSubButton"  subgrid_table_id="'+subgrid_table_id+'"  rowId="'+options.rowId+'">修改</a>';;
		        		            	  } 
		        		              } ,{
		        		            	  label: '删除',
		        		            	  name:'',  
		        		            	  width:'50',
		        		            	  formatter:function(cellvalue, options, rowObject){
		        		            		  return '<a href="javascript:;"  class="delbutton"  subgrid_table_id="'+subgrid_table_id+'"  buttonId="'+rowObject.id+'"  rowId="'+options.rowId+'">删除</a>';;
		        		            	  } 
		        		              } 
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


	$('body').on('click','.delbutton',function(e){
		e.preventDefault();
		var buttonId=$(this).attr('buttonId');
		if(buttonId){
			$.ajax({
				type : "post",
				url : 'delButton',
				data:{
					'id':  buttonId 
				},
				success : function onSucc(data) {
					if(data.status == 1){
						alert("删除操作已完成！")
						$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page : 1 }]);
					}else{
						alert(data.msg);
					} 
				},
				error : function onErr() {
					showMessage("操作执行失败！","error");
				}
			});
		}

	})


	function addButton(button){
		$.ajax({
			type : "post",
			url : 'saveOrUpdateButton',
			data:button,
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

	function subButtonDialog(_this){
		var rowId=_this.attr('rowId');
		var parDate=$('#list').jqGrid('getRowData',rowId);
		if(rowId){
			var subgrid_table_id=_this.attr("subgrid_table_id");
			var rowDate=$('#'+subgrid_table_id).jqGrid('getRowData',rowId);
			$('#name').val(rowDate.name);
			$('#url').val(rowDate.url);
			$('#media_id').val(rowDate.media_id);
			//$('#key').val(rowDate.);
			$('#sort').val(rowDate.sort);
			$('#subButtonId').val(rowDate.id);
		}else{
			var subCount=$("#list_"+rowDate.id+'_t').getGridParam("reccount");
			if(subCount&&subCount>=5){
				alert("二级菜单不能多于5项！");
				return false;
			}
		}
		$("#subButtonform").dialog({
			height:325,
			width:325,
			resizable:true,
			modal:true,  //这里就是控制弹出为模态
			buttons:{
				"确定":function(){ 
					var name= $('#name').val().trim();
					var type = $('#type').val();
					var url = $('#url').val().trim();
					var media_id = $('#media_id').val().trim();
					var key = $('#key').val().trim();
					var sort = $('#sort').val().trim();
					var subButtonId=$('#subButtonId').val();
					if(name==''){
						alert("菜单不能为空！")
						return false;
					}
					if(name.length>7){
						alert("二级菜单名字不能超过7个字！")
						return false;
					}
					if(url==''){
						alert("链接地址不能为空！")
						return false;
					}
					var button={};
					button.name=name;
					button.type=type;
					button.url=url;
					button.media_id=media_id;
					button.key=key;
					
					button.sort=sort;
					if(subButtonId){
						button.id=subButtonId
						button.dependId=rowDate.dependId;
					}else{
						button.dependId=parDate.id;
					}
					addButton(button);
					$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page :  $('#list').getGridParam('page') }]);
					$(this).dialog("close");
					$('#name').val('');
					$('#url').val('');
					$('#media_id').val('');
					$('#key').val('');
					$('#sort').val('')

				},
				"取消":function(){$(this).dialog("close");}
			}
		});

	}
	
	$('body').on('click','.addButton',function(e){
		e.preventDefault();
		var _this=$(this);
		subButtonDialog(_this);
	})
	
	$('body').on('click','.updateSubButton',function(e){
		e.preventDefault();
		var _this=$(this);
		subButtonDialog(_this);
	})
	
	function buttonForm(_this){
		var rowId=_this.attr('rowId');
		if(rowId){
			var rowDate=$('#list').jqGrid('getRowData',rowId);
			$('#buttonName').val(rowDate.name);
			$('#buttonSort').val(rowDate.sort);
			$('#buttonId').val(rowDate.id);
		}else{
			var count=$("#list").getGridParam("reccount");
			if(count&&count>=3){
				alert("一级菜单不能多于3项");
				return false;
			}
		}
		$("#buttonform").dialog({
			height:175,
			width:325,
			resizable:true,
			modal:true,  //这里就是控制弹出为模态
			buttons:{
				"确定":function(){ 
					var name= $('#buttonName').val().trim();
					var buttonSort= $('#buttonSort').val().trim();
					var buttonId= $('#buttonId').val();
					if(name==''){
						alert("菜单不能为空！")
						return false;
					}
					if(name.length>4){
						alert("一级菜单名字不能超过4个！")
						return false;
					}
					var button={};
					button.name=name;
					button.sort=buttonSort;
					if(buttonId){
						button.id=buttonId
					}
					addButton(button);
					$("#list").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid', [{ page :  $('#list').getGridParam('page') }]);
					$(this).dialog("close");
					$('#buttonName').val('');
					$('#buttonSort').val('');
				},
				"取消":function(){$(this).dialog("close");}
			}
		});
	}

	$('body').on('click','#adbutton',function(e){
		e.preventDefault();
		var _this=$(this);
		buttonForm(_this)
	})
	
	$('body').on('click','.updatebutton',function(e){
		e.preventDefault();
		var _this=$(this);
		buttonForm(_this)
	})

	/************创建菜单********/
	$("#createMenu").click(function(e){
		$.ajax({
			type : "post",
			url : 'createMenu',
			success : function onSucc(data) {
				if(data.status == 1){
					alert("菜单创建已完成！")
				}else{
					alert(data.msg)
				}
			},
			error : function onErr() {
				showMessage("操作执行失败！","error");
			}
		});
	})

});
