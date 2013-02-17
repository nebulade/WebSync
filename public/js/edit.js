
WebSync = {
	start: function(){
		WebSync.connection = new WebSocket("ws://"+window.location.host+window.location.pathname);
		WebSync.connection.onopen = function(e){
			console.log(e);
			WebSync.diffInterval = setInterval(WebSync.checkDiff,1000);
		}
		WebSync.connection.onclose = function(e){
			console.log(e);
			clearInterval(WebSync.diffInterval);
		}
		WebSync.connection.onmessage = function(e){
			console.log(e);
		}
		WebSync.connection.onerror = function(e){
			console.log(e);
		}
		WebSync.old_html = $(".content page").html();
		$(".content .page").keypress(WebSync.keypress);
		$("#name").blur(function(){
			WebSync.connection.sendJSON({type: "name_update", name: $("#name").text()});
		});
		$("#name").focus(function(){
			setTimeout(function(){
				document.execCommand('selectAll');
			},100);
		});
		var text_buttons = ["bold",'italic','strikethrough','underline','justifyleft','justifycenter','justifyright','justifyfull'];
		text_buttons.forEach(function(elem){
			$('button#'+elem).click(function(){
				document.execCommand(elem);
				$(document).trigger('selectionchange');
			});
		});
		$(document).on('selectionchange',function(){
			text_buttons.forEach(function(elem){
				if(document.queryCommandState(elem)){
					$('button#'+elem).addClass("active");
				}
				else {
					$('button#'+elem).removeClass('active');
				}
			});
			$('#font').val(capitaliseFirstLetter(document.queryCommandValue('fontname').split("'").join("")));
			$('#font_size').val(document.queryCommandValue('fontsize'));
		});
		$('#font').change(function(){
			document.execCommand('fontname',false,$('#font').val());
		});
		$('#font_size').change(function(){
			var size = $('#font_size').val()
			console.log(size);
			/*var applier = rangy.createCssClassApplier("fontsize",{ 
				normalize: true,
				elementTagName: 'font',
				elementProperties: {
					style: "font-size: 15pt;"
				}
			});
			applier.applyToSelection();*/
			document.execCommand('fontsize',false,size);
		});
		WebSync.fontsInit();
	},
	keypress: function(e){
		console.log(e);
		$(".page").each(function(page,list,index){
			console.log(page,list);	
		});
	},
	showHTML: function(){
		$('.page').html("<code>"+$('.page').html()+"</code>");
	},
	fontsInit: function(){
		var fonts = [];
    	var d = new Detector();
	    fonts.push("Cursive");
	    fonts.push("Monospace");
	    fonts.push("Serif");
	    fonts.push("Sans-serif");
	    fonts.push("Fantasy");
	    fonts.push("Arial");
	    fonts.push("Arial Black");
	    fonts.push("Arial Narrow");
	    fonts.push("Arial Rounded MT Bold");
	    fonts.push("Bookman Old Style");
	    fonts.push("Bradley Hand ITC");
	    fonts.push("Century");
	    fonts.push("Century Gothic");
	    fonts.push("Comic Sans MS");
		fonts.push("Droid Sans")
	    fonts.push("Courier");
	    fonts.push("Courier New");
	    fonts.push("Georgia");
	    fonts.push("Gentium");
	    fonts.push("Impact");
	    fonts.push("King");
	    fonts.push("Lucida Console");
	    fonts.push("Lalit");
	    fonts.push("Modena");
	    fonts.push("Monotype Corsiva");
	    fonts.push("Papyrus");
	    fonts.push("Tahoma");
	    fonts.push("TeX");
	    fonts.push("Times");
	    fonts.push("Times New Roman");
	    fonts.push("Trebuchet MS");
		fonts.push("Tahoma");
	    fonts.push("Verdana");
	    fonts.push("Verona");
		var font_list = [];
	    fonts = fonts.sort(function(a,b){
			if(a<b) return -1;
			if(a>b) return 1;
			return 0;
		});
		for (i = 0; i < fonts.length; i++) {
		    var result = d.detect(fonts[i]);
			if(result){
				font_list.push("<option>"+fonts[i]+"</option>");
			}
	    }
		$('#font').html(font_list.join("\n"));
   	},
	checkDiff: function(){
		var new_html = $(".content .page").html();
		if(new_html!=WebSync.old_html){
			WebSync.connection.sendJSON({type: "text_update",text: new_html.trim()})
			WebSync.old_html=new_html;
		}
	},
	old_html: ""
}

WebSocket.prototype.sendJSON = function(object){
	this.send(JSON.stringify(object));
}
function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
$(document).ready(WebSync.start);
