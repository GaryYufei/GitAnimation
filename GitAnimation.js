var GitAnimation = ( function() {
	var LocalFile,remote,local;

	function init_local_file(){
		var box = LocalFile
					.append('div')
					.attr('id','filecontainer');

		names = ['dsafsd.xxx','sdfd.aaa','sdfsdf.sss','dsfasdf.yyy','dsfsd.sss']
		for(var i = 0 ; i < 5 ; i++){

			var namePart = names[i].split('.');
			var name = namePart[0] + namePart[1];
			var div = box.append('div')
						.attr('class','single_file pull-right')
						.attr('id','file'+name);
			div.append('span')
			   .text(names[i]);
			div.append('button')
			   .attr("class","close")
			   .attr('remove','#file' + name)
			   .html('&times;')
			   .on('click',function(el){
			   		var id = d3.select(this).attr('remove');
			   		d3.select(id).remove();
			   });
		}
	}

	return {
		set_local_file:function(localfile){
			LocalFile = d3.select(localfile);
			init_local_file();
		},

		set_local_repository:function(local_repository){
			local = d3.select(local_repository);
		},

		set_remote_repository:function(remote_repository){
			remote = d3.select(remote_repository);
		}
	};
} () );