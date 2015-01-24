;(function() {
	GitAnimation.set_local_file('#localFile');
	GitAnimation.add_single_file('textbook.txt');
	GitAnimation.set_local_repository('#local');

	$('#conmandLine').terminal(function(cmd, trm){
		var words = cmd.split(' ');
		if(words[0] == 'move'){
			GitAnimation.add_point_dymanic(words[1],words[2]);
			trm.echo('successful!');
		}else if(words[0] == 'merge') {
			GitAnimation.merge_branch(words[1],words[2]);
			trm.echo('successful!');
		}else{
			trm.echo('hello world');
		}
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