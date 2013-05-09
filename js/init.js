var show = true;
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
}

function getQueryStringParam(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
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


function get_question(value){
	//get a random person action movie
	var hero = null,
		pams =[];

	//if we have a specified hero id, get that, otherwise pick a random clip
	if (value){
		hero = get_pams(null,[{'id':{'is':value}}])[0]
	}else{
		hero = rnd_element(pam_list);
	}

	// pick a random filter
	var filter = rnd_element(filters);

	// make sure we don't get the same hero or filter as last time
	if(results.length){
		while(_(results).last().hero.user_id == hero.user_id){
			hero = rnd_element(pam_list);
		}		
		while(_(results).last().filter == filter){
			filter = rnd_element(filters);
		}
	}


	//now based on the hero, get a bunch of movies of people doing the same action
	// as long as none of them are the same person as the hero
	// return our question
	return (
		{	
			'hero':hero,
			'filter':filter,
			'army':
				_(get_pams(hero,[{'user_id':'diff'}]))//a bunch of different people not including the hero, performing any action
					
					.chain()//underscore.js stuff

					.shuffle()//shuffle the list
					.first(8)//take the 1st 8
					.union(
						// add in a movie of the subject doing a different action
						[_(get_pams(hero,[{'user_id':'same'},{'chain_id':'diff'}])).shuffle()[0]]
					)
					.shuffle()//mix it all up
					.value()// underscore.js stuff...returns the result as a list
		})

}


function populate_question(){

	var value = null;

	// read in the query args if any
	if (getQueryStringParam('h')){
    	value = getQueryStringParam('h');    
    }

    // get our question
    //  this will have a 'hero' an 'army', and a 'filter'
	var Q = get_question(value);

	// add our hero label so we know the id of the hero for future reference (testing only)
	$('body').append('<div>Hero:'+Q.hero.id+'</div>')

	//add the army
    $(Q.army).each(function(){
        $("#choices").append(getPlayerCode(this.filename, Q.filter, this.parent_id));
    })

    // add the subject
    $("#subject").append(getPlayerCode(Q.hero.filename, "original", -1));


}


$(window).load(function () {

 	populate_question()

});