
var q_funcs = {

	'same': function(param,obj1,obj2){
		return (obj1[param] == obj2[param])
	},

	'diff': function(param,obj1,obj2){
		return (obj1[param] != obj2[param])
	}

}



function get_pams(pam,query_object){
	/*
		takes a query list like this:
		[
			{'chain_id':'same'},
			{'user_id': 'diff'}
		]
	*/

	var PL = _(pam_list).chain();

	for (q in query_object){
		var o = query_object[q],
			k = Object.keys(o)[0],
			v = o[k],

		PL = _(PL).filter(function(thispam){
			return q_funcs[v](k,pam,thispam);
		})

	}

	return PL.sortBy(function(a){
		return a[query_object[0][0]]
	}).value();

}






$(window).load(function () {
 	//take a random entry from the list
  	var hero = pam_list[_.random(0, pam_list.length)];

 	// now get a list of the other pams that match certain conditions

 	var permutations = [

 		{
 			'name': 'same person, different action',
 			'query':[
 						{'user_id':'same'},
  						{'chain_id':'diff'}
  					]
 		},
 		{
 			'name': 'same action, different person',
 			'query':[
 						
  						{'chain_id':'same'},
  						{'user_id':'diff'}
  					]
 		},
 		{
 			'name': 'different action, same person',
 			'query':[
 						{'chain_id':'diff'},
 						{'user_id':'same'}
  					]
 		},
 		// {
 		// 	'name': 'different action, different person',
 		// 	'query':[
 		// 				{'chain_id':'diff'},
 		// 				{'user_id':'diff'}
  	// 				]
 		// },
 		// {
 		// 	'name': 'different person, different action',
 		// 	'query':[
 						
 		// 				{'user_id':'diff'},
 		// 				{'chain_id':'diff'}
 						
  	// 				]
 		// },
 		// {
 		// 	'name': 'different people, any action',
 		// 	'query':[
 						
 		// 				{'user_id':'diff'},
 						
  	// 				]
 		// },
 		{
 			'name': 'same person, any action',
 			'query':[
 						
 						{'user_id':'same'},
 						
  					]
 		},
 		{
 			'name': 'same action, any person',
 			'query':[
 						
 						{'chain_id':'same'},
 						
  					]
 		},
 		{
 			'name': 'any people, any action',
 			'query':[
 						
 						
 						
  					]
 		}
 	];



  	$(permutations).each(function(){
  		var cont = $('<ul><li>'+'<span>chain:'+hero.chain_id+'</span>'+
  				'<span>user:'+ hero.user_id+'</span>'+'</li><li>'+this.name+'</li></ul>');
  		$(get_pams(hero,this.query)).each(function(){
  			var subcont = $('<li><ul>'+
  				'<span>chain:'+this.chain_id+'</span>'+
  				'<span>user:'+ this.user_id+'</span>'+
  				+'</ul></li>')
  				
  			cont.append(subcont)
  		})
  		$('body').append(cont)
  	})



});