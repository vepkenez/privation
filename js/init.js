var show = true;
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
}


function getPlayerCode(file, filter, id) {
	    flashvars = "flv=http://greendotblade2.cs.nyu.edu/privacy/flv/" + filter + "/" + file + ".flv";
	    html = '<div class="choice_box">	<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="160" height="120" id="player" align="middle"><param name="allowScriptAccess" value="sameDomain" /><param name="allowFullScreen" value="false" /><param name="movie" value="player.swf" /><param name="quality" value="low" /><param name="scale" value="noscale" /><param name="salign" value="lt" /><param name="bgcolor" value="#eeeeee" /><param name="FlashVars" value="' + flashvars + '" />	<embed src="player.swf" FlashVars="' + flashvars + '" quality="low" scale="noscale" salign="lt" bgcolor="#eeeeee" width="160" height="120" name="player" align="middle" allowScriptAccess="sameDomain" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"/></object>';
	    if (id != -1) html += "<center>" + (id + 1) + " <input type=button value='Identify as Subject' onClick=choose(" + id + ")>";
	    else html += "<center>Subject</center>"
	    html += '</div>';
	    return html;
	}

function showHide(hide) {
    show = !show;
    if (show) {
        document.getElementById("showButton").value = "Hide Instructions";
        document.getElementById("instructions").style.display = "Block";
    } else {
        document.getElementById("showButton").value = "Show Instructions";
        document.getElementById("instructions").style.display = "None";
    }
}



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
	'evals' : function(param,obj1,obj2,func){
		return func(param,obj1,obj2)
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



function test_queries(){

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
 			'name': 'same action, different person, person id is odd',
 			'query':[
 						
  						{'chain_id':'same'},
  						{'user_id':'diff'},
  						{'user_id': {'evals':function(param,obj1,obj2){
  							return(obj2[param]%2 != 0)
  						}}}
  					]
 		},
 		{
 			'name': 'same action, different person, person id is even',
 			'query':[
 						
  						{'chain_id':'same'},
  						{'user_id':'diff'},
  						{'user_id': {'evals':function(param,obj1,obj2){
  							return(obj2[param]%2 == 0)
  						}}}
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
 	]

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

}
	
var num_Qs = 10,
	results = [];

function rnd_element(list){
	return list[_.random(0,list.length-1)]
}


function get_question(){
	//get a random person action movie
	var hero = rnd_element(pam_list),
	pams =[];

	pams = get_pams(hero,[{'user_id':'diff'},{'chain_id':'same'}]);
	



	var filter = rnd_element(filters);

	if(results.length){
		while(_(results).pluck('user_id').contains(hero.user_id)){
			hero = rnd_element(pam_list);
		}		
		while(_(results).last().filter == filter){
			filter = rnd_element(filters);
		}
	}




	return (
		{	
			'hero':hero,
			'filter':filter,
			'army':
				_(
					pams)//get a bunch of different people performing any action
					.chain()
					.shuffle()//shuffle the list
					.first(8)//take the 1st 8
					.union(
						// add in a movie featuring the same person performing a different action
						[_(get_pams(hero,[{'user_id':'same'},{'chain_id':'diff'}])).shuffle()[0]]
					)
					.shuffle()//mix it all up
					.value()//and return the list of 9 movies
		})

}


function populate_question(){

	var Q = get_question();


    $(Q.army).each(function(){
        $("#choices").append(getPlayerCode(this.filename, Q.filter, this.parent_id));
    })

    $("#subject").append(getPlayerCode(Q.hero.filename, "original", -1));

    console.log(Q)

}


$(window).load(function () {


	console.log()

 	// test_queries();
 	populate_question()

});