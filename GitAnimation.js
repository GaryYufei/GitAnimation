var GitAnimation = ( function() {
	var LocalFile,remote,local;
	var local_file_box,local_repository_box;

	var LocalfileList = []
	var filenum = 0;

	var NodeNumInEachLevel = [];
	var LevelNum = 0;

	var tip;

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

	function get_position(id,root,rid){

		var ids = [];
		var new_cxs = [];
		var num = 0;

		if(root != null){
			var elements = d3.selectAll('.' + rid);
			var start = parseInt(root.attr('start'));
			var end = parseInt(root.attr('end'));
			var LenthForEachNode = (end - start) / (elements.size() + 1);
			elements.each(function(d,i){
				var node = d3.select(this);
				var index = parseInt(i);
				node.attr('start',start + LenthForEachNode * index);
				node.attr('end',start + LenthForEachNode * (index + 1));

				ids[num] = node.attr('id');
				new_cxs[num] = start + LenthForEachNode * index
				num ++;
			});

			return {
					'cx':start + LenthForEachNode * elements.size(),
					'cy':parseInt(root.attr('cy')) + 50,
					'start':start + LenthForEachNode * elements.size() ,
					'end':start + LenthForEachNode * (elements.size() + 1),
					'ids':ids,
					'new_cxs':new_cxs
			};
		}

		return {
			'cx':15,
			'cy':5,
			'start':15,
			'end':366,
			'ids':[],
			'new_cxs':[]
		};
		
	}

	function create_commit_node(id,root,color){
		 
		 var _root,curLevel,result;
		 function add_line_between_line(){
		 		if(_root != null){
					local_repository_box.append('line')
										.attr('x1',_root.attr('cx'))
										.attr('y1',_root.attr('cy'))
										.attr('x2',result['cx'])
										.attr('y2',result['cy'])
										.attr('stroke-width','2')
										.attr('stroke','black')
										.attr('id','line'+id);
				}
		 }

		function create_new_point(){
			var point = local_repository_box
									.append('circle')
									.attr('cx',result['cx'])
									.attr('cy',result['cy'])
									.attr('fill',color).attr('r','1')
									.attr('id',id)
									.attr('class',root)
									.attr('start',result['start']).attr('end',result['end'])
									.on('mouseover',function(el){
										tip.show(id);
									})
									.on('mouseout',function(el){
										tip.hide();
									});
			point.transition()
				.duration(1000)
				.attr('r','6')
				.each('end',add_line_between_line);
		}

		function move_children(parent_id,p_new_cs){
			var parent = d3.select('#'+parent_id);
			var children = d3.selectAll('.'+parent_id);
			var start = parseInt(parent.attr('start'));
			var end = parseInt(parent.attr('end'));
			var LenthForEachNode = (end - start) / children.size();

			children.each(function(d,i){
				var child = d3.select(this);
				var index = parseInt(i);
				var ch_new_cs = start + LenthForEachNode * index; 
				var line = d3.select('#line' + child.attr('id'));
				child.attr('start',ch_new_cs);
				child.attr('end',ch_new_cs + LenthForEachNode);
				child.transition()
					 .duration(1000)
					 .attr('cx',ch_new_cs);
				line.transition()
					.duration(1000)
					.attr('x1',p_new_cs)
					.attr('x2',ch_new_cs);

				move_children(child.attr('id'),ch_new_cs);
			});

		}

		function move_same_level_points(ids,new_cxs){
			var i = 0;

			function move_point(){
		
				if( i < ids.length){
					var id = ids[i];
					var new_cx = new_cxs[i];
					var point = d3.select('#' + id);
					point.transition()
						 .duration(1000)
						 .attr('cx',new_cx);
					var line = d3.select('#line'+id);
					if(i < ids.length - 1){
						line.transition()
			 				.duration(1000)
		 	 				.attr('x2',new_cx)
		 	 				.each('end',move_point);
					}else{
						line.transition()
			 				.duration(1000)
		 	 				.attr('x2',new_cx)
		 	 				.each('end',create_new_point);
					}
					i++;
					move_children(id,new_cx);
				}
			}

			if(ids.length == 0){
				create_new_point();
			}else{
				move_point();
			}

			
		}

		if(root != null){
			_root = d3.select('#' + root);
			curLevel = parseInt(_root.attr('level')) + 1;
			if(curLevel > LevelNum){
				LevelNum = curLevel;
				NodeNumInEachLevel[LevelNum] = 1;
			}else{
				NodeNumInEachLevel[curLevel] ++;
			}
		}else{
			NodeNumInEachLevel[0] = 1;
			_root = null;
			curLevel = 0;
		}

		result = get_position(id,_root,root);

		move_same_level_points(result['ids'],result['new_cxs']);
		
	}

	function merge(aid,bid) {

		function add_line_between_points(){
			local_repository_box.append('line')
					.attr('x1',bnode.attr('cx'))
					.attr('y1',bnode.attr('cy'))
					.attr('x2',mergeNode.attr('cx'))
					.attr('y2',mergeNode.attr('cy'))
					.attr('stroke-width','2')
					.attr('stroke','black')
					.attr('id','line'+bid);

			local_repository_box.append('line')
					.attr('x1',anode.attr('cx'))
					.attr('y1',anode.attr('cy'))
					.attr('x2',mergeNode.attr('cx'))
					.attr('y2',mergeNode.attr('cy'))
					.attr('stroke-width','2')
					.attr('stroke','black')
					.attr('id','line'+bid);
		}

		var anode = d3.select("#" + aid);
		var bnode = d3.select("#" + bid);
		var ay = parseInt(anode.attr('cy'));
		var by = parseInt(bnode.attr('cy'));
		var distance = ay + 50;
		if(ay < by) {
			distance = by + 50;
		}
		var mergeNodeID = aid + "merge" + bid;
		var mergeNode = local_repository_box
							.append('circle')
							.attr('cx',parseInt(anode.attr('cx')))
							.attr('cy',distance)
							.attr('fill',anode.attr('fill')).attr('r','1')
							.attr('id',mergeNodeID)
							.attr('class',aid + " " + bid)
							.attr('start',parseInt(anode.attr('start')))
							.attr('end',parseInt(anode.attr('end')))
							.on('mouseover',function(el){
								tip.show(mergeNodeID);
							})
							.on('mouseout',function(el){
								tip.hide();
							});
		mergeNode.transition()
			.duration(1000)
			.attr('r','6')
			.each('end',add_line_between_points);
	}

	function delete_single_node(id) {
		var node = d3.select("#" + id);
		node.attr('fill','grey');
	}

	function init_local_repository(){
		var svg = local.append('svg')
						.attr('width','100%')
						.attr('height','100%');
		local_repository_box = svg.append('g')
								.attr('transform','translate(0,50)');
		tip = d3.tip()
                .attr('class', 'd3-tip')
                .html(function(d){ 
                    return '<span>' + d + '</span>' 
                })
                .direction('n')
                .offset([-10, 0]);

        local_repository_box.call(tip);

	}

	return {
		set_local_file:function(localfile){
			LocalFile = d3.select(localfile);
			init_local_file();
		},

		set_local_repository:function(local_repository){
			local = d3.select(local_repository);
			init_local_repository();
			create_commit_node("ab238",null,'blue');
			//create_commit_node("f1","ab238",'blue');
			//create_commit_node("f2","ab238",'blue');
			//create_commit_node("f3","f2",'blue');
			//create_commit_node("f4","f3",'blue');
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
			create_commit_node(id,parent,'red');

		},

		merge_branch: function(aid,bid) {
			merge(aid,bid);
		},

		delete_node: function(id) {
			delete_single_node(id);
		}

	};
} () );