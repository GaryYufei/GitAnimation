var GitAnimation = ( function() {
	var LocalFile,remote,local;
	var box;

	var LocalfileList = []
	var filenum = 0;

	function init_local_file(){
		box = LocalFile.append('div').attr('id','filecontainer');
	}

	function add_file(name,filename){
		var div = box.append('div')
					.attr('class','single_file pull-right')
					.attr('id','file'+name);
		div.append('span')
		   .text(filename);
		div.append('button')
		   .attr("class","close")
		   .html('&times;')
		   .on('click',function(el){
		   		d3.select('#file'+name).remove();
		   });
		
	}

	function file_validation(filename){
		var nameParts = filename.split('.');
		if(nameParts.length != 2){
			return {'result':false};
		}
		var name = nameParts[0]+nameParts[1];
		for(var i = 0 ; i < filenum ; i++){
			if(name == LocalfileList[i]){
				return {'result':false};
			}
		}
		LocalfileList[filenum++] = filename;
		return {'result':true,'name':name,'filename':filename};
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
		},

		add_single_file:function(filename,failcallback){
			result = file_validation(filename);
			if(result.result){
				add_file(result.name,result.filename);
			}else{
				failcallback();
			}
		},

		delete_single_file:function(filename){
			var nameParts = filename.split('.');
			d3.select('#file'+nameParts[0] + nameParts[1]).remove();
		}
	};
} () );