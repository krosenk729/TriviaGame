var ansShowTime = 3000;
var questTime = 30000;
var allQuestions = loadQs(); // array of all questions to pull from
var gameLength = 3; // number of questions in a game


$(document).ready(function(){

	$('#play-game, #play-new').click(newG);

	$('#game-answers').on('click', 'button', function(event){
		event.preventDefault();
		nextA( $(this).data('answer') );
	});

	$('#pause-play').click(pauseQ);

	$('#unpause').click(timeQ);

});

var pos = 1; // position in game 
var ansCor, ansIncor, ansTimed; // number of correct answers, incorrect and timed out
var gameQuestions; 
var questTimer;

// function to get all questions
function loadQs(){
	var t = $.ajax({
		url: 'assets/javascript/quizquestions.json',
		async: false,
		dataType: 'json',
		contentType: 'application/json'
	});
	return t.responseJSON.AllQuestions;

	/*
	var quests;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			quests = responseText;
		}
	};
	xhttp.open('GET','assets/javascript/quizquestions.json');
	xhttp.send();
	*/
}

// function to reset game and start a new one 
function newG(){
	[pos, ansCor, ansIncor, ansTimed] = [1, 0, 0, 0];

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
		v += '<button id="Q' + index + '" data-answer="' + item + '" class="btn btn-info">';
		v += item + '</button>';
		$('.form-group').append(v);
	});

	$('.progress-bar').css('width', '\'' + ( pos / gameLength ) + '%\'');

	changeCard('.card-question');
	timeQ();
}

// function to time a question
function timeQ(){
	var t = {time: questTime};
	$('.counting').html( t );

	questTimer = setInterval(down, 1000);

	function down(){
		t -= 1000;
		$('.counting').html( t );
	}

}

function pauseQ(){

}

// function to clear UI of past questions
function clearQ(){
	$('.game-question, .form-group').empty();
}


// function to transition between cards
function changeCard(toCard){
	$('.card-welcome, .card-question, .card-score').hide();
	$(toCard).fadeIn();
}


// function to show a question's outcome
function nextA(userInput){
	switch(userInput){
		case undefined:
			ansTimed ++;
			$('#timedout').text(ansTimed);
			$('#score-message').html('How did it get so late so soon? <br>The clock counted down before you answered');
			break;
		case gameQuestions[pos-1].name:
			ansCor ++;
			$('#correct').text(ansCor);
			$('#score-message').html('You have brains in your head');
			break;
		default:
			ansIncor ++;
			$('#incorrect').text(ansIncor);
			$('#score-message').html('That wasn\'t right... you should have said '+ gameQuestions[pos-1].name + '<br>Oh, the thinks you can think up if only you try!');
	}
	
	changeCard('.card-score');

	if( pos === gameLength ){
		$('#game-over').show();
	} else {
		pos ++;
		setTimeout(function(){ nextQ(pos); }, ansShowTime);
	}
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

