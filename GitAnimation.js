var GitAnimation = ( function() {
	var LocalFile,remote,local;
	var local_file_box,local_repository_box;

	var LocalfileList = []
	var filenum = 0;

	function init_local_file(){
		local_file_box = LocalFile
						.append('div')
						.attr('id','filecontainer');
	}

	function add_file(name,filename){
		var div = local_file_box.append('div')
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

	function create_commit_node(id,cx,cy,root,color){
		 
		 function add_line_between_line(){
		 	if(root != null){
				var _root = d3.select(root);
				local_repository_box.append('line')
									.attr('x1',_root.attr('cx'))
									.attr('y1',_root.attr('cy'))
									.attr('x2',cx)
									.attr('y2',cy)
									.attr('stroke-width','2')
									.attr('stroke','black')
									.attr('id','line'+id);
			}
		 }

		 local_repository_box.append('circle')
		 					.attr('cx',cx)
		 					.attr('cy',cy)
		 					.attr('fill',color)
		 					.attr('r','1')
		 					.attr('id',id)
		 					.transition()
		 					.duration(1000)
		 					.attr('r','6')
		 					.each('end',add_line_between_line);
		
	}

	function init_local_repository(){
		var svg = local.append('svg')
						.attr('width','100%')
						.attr('height','100%');
		local_repository_box = svg.append('g')
								.attr('transform','translate(0,50)');
	}

	

	function move_same_level_points(ids,new_cxs,parent){
		var i = 0;
		function move_point(){
	
			if( i < ids.length - 1){
				var id = ids[i];
				var new_cx = new_cxs[i];
				i++;
				var point = d3.select('#' + id);
				point.transition()
					 .duration(1000)
					 .attr('cx',new_cx);

				d3.select('#line'+id).transition()
					 				.duration(1000)
				 	 				.attr('x2',new_cx)
				 	 				.each('end',move_point);
			}else{
				var y = parseInt(d3.select(parent).attr('cy'));
				create_commit_node(ids[i],new_cxs[i],y+50,parent,'red');
			}
		}

		move_point();


	}

	return {
		set_local_file:function(localfile){
			LocalFile = d3.select(localfile);
			init_local_file();
		},

		set_local_repository:function(local_repository){
			local = d3.select(local_repository);
			init_local_repository();
			create_commit_node("ab238",183,5,null,'blue');
			create_commit_node("df211",122,55,"#ab238",'red');
			create_commit_node("gh980",244,55,"#ab238",'blue');
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
		},

		add_point_dymanic:function(id,parent){
			var current_level_node_num = 4;
			var delta = 366 / current_level_node_num;
			var ids = ['df211','gh980',id];
			var new_cxs = [delta,delta*2,delta*3];
			move_same_level_points(ids,new_cxs,parent);

		}

};
} () );