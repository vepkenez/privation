
var q_funcs = {

	'same': function(param,obj1,obj2){
		return (obj1[param] == obj2[param])
	},

	'diff': function(param,obj1,obj2){
		return (obj1[param] != obj2[param])
	},
	'is': function(param,obj1,obj2,val){
		return (obj2[param] == val)
	},
	'is_not': function(param,obj1,obj2,val){
		return (obj2[param] != val)
	},

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
			p = null;

		if (typeof(v)== 'object'){
			var l = Object.keys(v)[0];
			p = v[l];
			v = l;
		}


		PL = _(PL).filter(function(thispam){
			return q_funcs[v](k,pam,thispam,p);
		})

	}

	return PL.sortBy(function(a){
		if (query_object.length){
			return a[query_object[0][0]]
		}
	}).value();

}






$(window).load(function () {
 	//take a random entry from the list
  	var hero = pam_list[_.random(0, pam_list.length)];

  	// Here are some examples of how we can write queries....
  	// this could be useful for lots of things.
 	var permutations = [

 		{
 			'name': 'same person, different action',
 			'query':[
 						{'user_id':'same'},
  						{'chain_id':'diff'}
  					]
 		},
 		{
 			'name': 'same action, different person, user_id is not "5"',
 			'query':[
 						
  						{'chain_id':'same'},
  						{'user_id':'diff'},
  						{'user_id': {'is_not':5}}
  					]
 		},
 		{
 			'name': 'different action, same person',
 			'query':[
 						{'chain_id':'diff'},
 						{'user_id':'same'}
  					]
 		},
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

 	/*

	This stuff down here just prints things to the page...
 	*/

 	$('body').append('randomly selecting a user/chain/movie');
 	$('body').append('<div>'+'user:'+hero.user_id+'</div>')
 	$('body').append('<div>'+'chain:'+hero.chain_id+'</div>')
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