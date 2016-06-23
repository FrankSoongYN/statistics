<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%-- <%@ include file="../auth.jsp" %> --%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>年级管理</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <link href="<c:url value='/resources/css/bootstrap/bootstrap.min.css'></c:url>" rel="stylesheet">
    <link href="<c:url value='/resources/js/jquery-toastmessage/0.2.0/jquery.toastmessage.css'></c:url>" rel="stylesheet">
    <link href="<c:url value='/resources/js/jqgrid/4.6.0/css/ui.jqgrid.css'></c:url>" rel="stylesheet">
    <link href="<c:url value='/resources/css/jquery-ui/jquery-ui.css'></c:url>" rel="stylesheet">
    <link href="<c:url value='/resources/css/jquery-ui/jquery-ui.structure.css'></c:url>" rel="stylesheet">
    <link href="<c:url value='/resources/css/ace/ace.min.css'></c:url>" rel="stylesheet">
    <link href="<c:url value='/resources/css/ace/font-awesome.min.css'></c:url>" rel="stylesheet">
    <script type="text/javascript" src="<c:url value='/resources/js/jquery/1.11.1/jquery.js'></c:url>"></script>
    <script type="text/javascript" src="<c:url value='/resources/js/jquery-ui/jquery-ui.js'></c:url>"></script>
    <script type="text/javascript" src="<c:url value='/resources/js/bootstrap/bootstrap.min.js'></c:url>"></script>
    <script type="text/javascript" src="<c:url value='/resources/js/jqgrid/4.6.0/js/jquery.jqGrid.js'></c:url>"></script>
    <script type="text/javascript" src="<c:url value='/resources/js/jqgrid/4.6.0/js/grid.locale-cn.js'></c:url>"></script>
    <script type="text/javascript" src="<c:url value='/resources/js/jquery-toastmessage/0.2.0/jquery.toastmessage.js'></c:url>"></script>
    <script type="text/javascript" src="<c:url value='/resources/js/jquery-timepicker/jquery-ui-timepicker-addon.js'></c:url>"></script>
    <script type="text/javascript" src="<c:url value='/resources/js/manage/common.js'></c:url>"></script>
    <script type="text/javascript" src="<c:url value='/view/grade/grade.js'></c:url>"></script>
    <style type="text/css">
    .row{ margin-left: 0px;margin-right: 0px;}
    .ui-timepicker-div .ui-widget-header { margin-bottom: 8px; } 
	.ui-timepicker-div dl { text-align: left; } 
	.ui-timepicker-div dl dt { height: 25px; margin-bottom: -25px; } 
	.ui-timepicker-div dl dd { margin: 0 10px 10px 65px; } 
	.ui-timepicker-div td { font-size: 90%; } 
	.ui-tpicker-grid-label { background: none; border: none; margin: 0; padding: 0; } 
	.ui_tpicker_hour_label,.ui_tpicker_minute_label,.ui_tpicker_second_label, 
	.ui_tpicker_millisec_label,.ui_tpicker_time_label{padding-left:20px}
	.altclass {background: bisque;}
	.ui-jqgrid .ui-pg-input {height: 20px;font-size: .8em;margin: 0;}
	.SelectBG{background:red;}
    </style>
</head>

<body>
    <!-- topbar starts -->
    <div class="navbar navbar-default navbar-fixed-top" role="navigation">
        <div class="navbar-inner">
            <a class="navbar-brand" href="#">
                <span>管理系统</span></a>
                <div class="btn-group pull-right">
                <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                    <i class="glyphicon glyphicon-user"></i><span class="hidden-sm hidden-xs"></span>
                </button>
            </div>
        </div>
        
    </div>
    <!-- topbar ends -->
<div class="ch-container" style='margin-top: 73px;'>
    <div class="row">
        <!-- left menu starts -->
        <%@ include file="../menu.jsp"  %>
        <!--/span-->
        <!-- left menu ends -->
        <noscript>
            <div class="alert alert-block col-md-12">
                <h4 class="alert-heading">Warning!</h4>
                <p>You need to have <a href="http://en.wikipedia.org/wiki/JavaScript" target="_blank">JavaScript</a>
                    enabled to use this site.</p>
            </div>
        </noscript>
        <div id="content" class="col-lg-10 col-sm-10">
				<!-- content starts -->
				<div style="overflow: auto;">
				<hr>
				<div class='row'>
					<div class="box col-md-12 btn-group">
					<div class="box col-md-6">
						<button id='add_Grade' class='btn btn-success'>
						<span class='glyphicon glyphicon-download-alt'></span>添加</button>
					</div>
					</div>
				</div>
				<hr>
				<div class="row">
					<div class="box col-md-12">
						<div class="box-inner">
							<div class="box-header well" data-original-title="">
								<div id="search-result">
									<div>
										<table id="list">
											<tr>
												<td />
											</tr>
										</table>
										<div id="pager"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!--/span-->
				</div>
				</div>
				<!--/row-->
				<!-- content ends -->
			</div><!--/#content.col-md-0-->
</div><!--/fluid-row-->
    <hr>
    <footer class="row">
        <p class="col-md-9 col-sm-9 col-xs-12 copyright">&copy; <a href="" target="_blank"> 
              </a> </p>

        <p class="col-md-3 col-sm-3 col-xs-12 powered-by">Design by: <a
                href="">Frank</a></p>
    </footer>
    
</div> 

	<div id="grade_form" title="添加年级" style="display: none">
			<input type="hidden" name="id" id="gradeId">
		    <p>
				<label>年级：</label><input id='name' name="name" style="widht: 600px">
			</p>
			<p>
				<label>年级主任：</label><input id='leader' name="leader" style="widht: 600px">
			</p>
			<p>
				<label>入学时间：</label><input id='enrolltime' type="text" name='enrolltime' placeholder="入学时间">
			</p>
			
		</div>

</body>
</html>
