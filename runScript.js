;(function() {
	GitAnimation.set_local_file('#localFile');
	GitAnimation.add_single_file('textbook.txt');

	$('#conmandLine').terminal(function(cmd, trm){
		trm.echo('hello world');
	},{
		greetings:'Git code'
	}); 

	$("#alertBox").hide();

	$("#Addfile").on('click',function(el){
		if($("#filename").val() == ""){
			$("#alertBox").show();
			$("#error-message").text("Can not be empty");
		}else{
			GitAnimation.add_single_file($("#filename").val(),
				function(){
					$("#alertBox").show();
					$("#error-message").text("file name invaild");
					$("#filename").val("");
			});
		}
	});

	$("#filename").on('focus',function(el){
		$("#alertBox").hide();
	});

	$("#closeAlert").on('click',function(el){
		$("#alertBox").hide();
	});
	

})();