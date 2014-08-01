;(function() {
	GitAnimation.set_local_file('#localFile');
	$('#conmandLine').terminal(function(cmd, trm){
		trm.echo('hello world');
	},{
		greetings:'Git code'
	}); 
})();