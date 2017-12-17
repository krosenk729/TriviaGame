var ansShowTime = 3; 
var questTime = 20; //time per question in seconds
var allQuestions = loadQs(); // array of all questions to pull from
var gameLength = 3; // number of questions in a game


$(document).ready(function(){

	$('#play-game, #play-new').click(newG);

	$('#game-answers').on('click', 'button', function(event){
		event.preventDefault();
		nextA( $(this).data('answer') );
	});

	$('#pause-play').click(function(){
		questTimer.pauseQ();
		changeCard('.card-pause');
	});

	$('#unpause').click(function(){
		questTimer.timeQ(false);
		changeCard('.card-question');
	});

	/***********************************************/
	// game variables
	var pos = 1; // position in game 
	var ansCor, ansIncor, ansTimed, usersTime; // number of correct answers, incorrect answers, time outs, timing function
	var gameQuestions; 
	var questTimer = {
	  isRunning: false,
	  time: questTime,
	  
	  timeQ: function(isNew) {
	  	if( isNew ){
	  		questTimer.time = questTime;
	  		$('.counting').html( questTimer.time );
	  	}
	    if( !questTimer.isRunning ) {
	        usersTime = setInterval(questTimer.count, 1000);
	        questTimer.isRunning = true;
	    }
	  },

	  pauseQ: function() {
	    clearInterval(usersTime);
	    questTimer.isRunning = false;

	  },

	  count: function() {
	  	questTimer.time = Math.max(0, questTimer.time - 1);
	  	$('.counting').html( questTimer.time );

	  	if(questTimer.time === 0 ){
	  		questTimer.pauseQ();
	  		nextA();
	  	}
	  }
	};

	/***********************************************/
	// game functions

	// function to reset game and start a new one 
	function newG(){
		[pos, ansCor, ansIncor, ansTimed, usersTime] = [1, 0, 0, 0, {}];
		$('#timedout, #correct, #incorrect').text('0');

		$('#game-over').hide();

		gameQuestions = randArr(allQuestions).slice(0, gameLength);

		nextQ(pos);
	}

	// function to advance game to question at passed position
	function nextQ(pos){
		clearQ(); 

		var q = gameQuestions[ pos-1 ];
		$('.game-question').html( q.definition );

		var a = [q.name, q.notA, q.notB, q.notC];
		randArr(a);

		a.forEach(function(item, index){
			var v = '';
			v += '<button id="Q' + index + '" data-answer="' + item + '" class="btn seuss-btn">';
			v += item + '</button>';
			$('.form-group').append(v);
		});

		$('.progress-bar').css('width', ( pos / gameLength * 100 ) + '%').html('<h5>' + pos + ' out of ' + gameLength + '</h5>' );

		changeCard('.card-question');
		questTimer.timeQ( true );

	}

	// function to clear UI of past questions
	function clearQ(){
		$('.game-question, .form-group').empty();
		questTimer.pauseQ();
	}

	// function to transition between cards
	function changeCard(toCard){
		$('.card-welcome, .card-pause, .card-question, .card-score').hide();
		$(toCard).fadeIn();
	}


	// function to show a question's outcome
	function nextA(userInput){
		questTimer.pauseQ();
		switch(userInput){
			case undefined:
				ansTimed ++;
				$('#timedout').text(ansTimed);
				$('#score-quote').html('How did it get so late so soon?');
				$('#score-message').html('The clock counted down before you answered\n'+ gameQuestions[pos-1].name + ' was the word we were looking for' );
				break;
			case gameQuestions[pos-1].name:
				ansCor ++;
				$('#correct').text(ansCor);
				$('score-quote').html('You have brains in your head');
				$('#score-message').html('Great thinking!\n'+ gameQuestions[pos-1].name + ' was right');
				break;
			default:
				ansIncor ++;
				$('#incorrect').text(ansIncor);
				$('score-quote').html('Oh, the thinks you can think up if only you try!');
				$('#score-message').html('That wasn\'t right... you should have said '+ gameQuestions[pos-1].name );
		}

		changeCard('.card-score');

		if( pos < gameLength ){
			pos ++;
			setTimeout(function(){ nextQ(pos); }, ansShowTime*1000 );
		} else {
			$('#game-over').show();
		}
	}

});

/***********************************************/
// generic functions 
// function to get all questions
function loadQs(){
	// var t = $.ajax({
	// 	url: 'assets/javascript/quizquestions.json',
	// 	async: false,
	// 	dataType: 'json',
	// 	contentType: 'application/json'
	// });
	// return t.responseJSON.AllQuestions;

	var t = $.ajax({
		url: 'assets/javascript/seussqs.json',
		async: false,
		dataType: 'json',
		contentType: 'application/json'
	});
	return t.responseJSON;

}

// function to randomly sort an array
function randArr( arr ){
	return arr.sort(function(a, b){return 0.5 - Math.random()});
}

// function to construct a question
function Question(name, definition, notA, notB, notC){
	this.name = name;
	this.definition = definition;
	this.notA = notA;
	this.notB = notB;
	this.notC = notC;
}

// quotes
// If things start happening, don’t worry, don’t stew. Just go right along and you’ll start happening, too.
// Sometimes the answers are simple and the questions are hard
// I like nonsense, it wakes up the brain cells.
// You're in pretty good shape for the shape you are in.
// It is fun to have fun but you have to know how.
// There is fun to be done! There are points to be scored. There are games to be won.
// Think left and think right and think low and think high. Oh, the things you can think up if only you try!