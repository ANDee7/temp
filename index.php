<?php
// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<jdoc:include type="head" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title></title>
	<link rel="stylesheet" type="text/css"  href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template;?>/css/style.css" >
	<link rel="stylesheet" type="text/css"  href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template;?>/css/resp.css" >
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
</head>

<body>
	<div class="all">
		<div class="all-top">
			<div class="all-top-name--leftcol">
				<div class="leftcol--topname">
					<jdoc:include type="modules" name="logo-top-name"/>
				</div>
				<div class="leftcol--bottomname">
					<jdoc:include type="modules" name="logo-bottom-name"/>
				</div>
			</div>
			<div class="all-top-welcome--rightcol">
				<div class="welcom-top">
					<div class="welcom-top--mapwebsite">
						<jdoc:include type="modules" name="map-link"/>						
					</div>
					<div class="other-templ">
						<jdoc:include type="modules" name="other-templ"/>
						<img src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template;?>/img/vi.jpg"><a href="<?php echo JRoute::_('&template=forvisually'); ?>">Версия для слабовидящих</a>
					</div>
					<div class="welcom-top--rightside">
						<jdoc:include type="modules" name="number"/>
						<div><jdoc:include type="modules" name="kontakt-link"/></div>
					</div>
                    
					<div class="clr"></div>
				</div>
                <div class="all-menu">
                    <jdoc:include type="modules" name="menu"/>
                </div>
			</div>            
			<div class="clr"></div>            
		</div>
		<div class="clr"></div>
		<div class="all-center">
            <div class="center-rightcol">
                <div class="rightcol-backcolor">
                    <div class="rightcol-advet">						
                        <div class="rightcol-advet-top--name"><h3>Объявления</h3></div>
                        <jdoc:include type="modules" name="news-1"/>
                       
                        <div class="rightcol-advet-top--link">
                            <jdoc:include type="modules" name="news-2-link"/>
                        </div>
                    </div>
                </div>
                <div class="rightcol-advet-top--helplink">
					<jdoc:include type="modules" name="help-link"/>
                    <div class="rightcol-advet-top--kontakt">
					   <jdoc:include type="modules" name="kontakt"/>                    
                    </div>
                </div>
                
            </div>
			<div class="center-leftcol">
                <div class="center--content">
					<jdoc:include type="modules" name="content"/>
					<jdoc:include type="message" />
					<jdoc:include type="component" />
					<jdoc:include type="modules" name="center"/>
                </div>
                <div class="center--date">
					<jdoc:include type="modules" name="date"/>
                    <div class="new-1-date"></div>
                </div>
            </div>	
            <div class="center-rightcol-foter">      
                <div class="rightcol-backcolor">
                    <div class="rightcol-advet">						
                        <div class="rightcol-advet-top--name"><h3>Объявления</h3></div>
                        <jdoc:include type="modules" name="news-1"/>
                       
                        <div class="rightcol-advet-top--link">
                            <jdoc:include type="modules" name="news-2-link"/>
                        </div>
                    </div>
                </div>
                <div class="rightcol-advet-top--helplink">
					<jdoc:include type="modules" name="help-link"/>
                    <div class="rightcol-advet-top--kontakt">
					   <jdoc:include type="modules" name="kontakt"/>                    
                    </div>
                </div>            
            </div>
		</div>
        
		<div class="all-footer">
            <div class="footer-left"><jdoc:include type="modules" name="footer-left"/></div>
            <div class="footer-right">
				<jdoc:include type="modules" name="footer-right"/>
                <a href="#">Карта сайта</a> | <a href="#">Контактная информация</a>
            </div>
        </div>
	</div>
	<script type="text/javascript">
//---Большое делаем маленьким, а маленькое - большим {в этом блоке мы переопределяем метод contains для поиска без учета регистра. Помни: contains NOT Contains}
	jQuery(function ($) { 
		jQuery.expr[":"].Contains = jQuery.expr.createPseudo(function(arg) {
    		return function( elem ) {
       		return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
   		 	};
		});
//Закончили делать маленькое и большое
		$("#finderlink").focus();  					//При загрузке страницы ставим фокус на строку поиска
		$("#finderlink").keyup(function(e) {		//Отслеживаем каждое Нажатие
		var findertext = $("#finderlink").val();	//Закидываем значение текстового поля в переменную, причем делаем это при каждом нажатии клавиши		
			if (findertext != "") {					//Если поле НЕ ПУСТОЕ, то скрываем ВСЕ ссылки и отображаем только те, которые содержат необходимый текст.
				$("div.center--content a").css({"display" : "none"});
				$("div.center--content a:Contains(" + findertext + ")").css({"display" : "inline"});
			}
			else {									//Если поле пустое, то отображаем ВСЕ ссылки
				$("div.center--content a").css({"display" : "inline"});
			};
		});
	});
	</script>
	<script type="text/javascript">
		jQuery(function ($) {	
			$("#back-top").hide();	
			$(function () {	
				$(window).scroll(function () {	
					if ($(this).scrollTop() > 800) {	
						$("#back-top").fadeIn()	
					} else {
						$("#back-top").fadeOut()	
					}	
				});	
				$("#back-top a").click(function () {	
					$("body,html").animate({	
						scrollTop: 0	
					}, 200);	
					return false	
				})	
			})
});
</script>
    
</body>

</html>

