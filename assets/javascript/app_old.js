$(document).ready(function(){

	/**************************************/
	/* Initialization  */
	/**************************************/
	var gameLen = 8; // number of questions in a game
	var questionTime = 30; // time in seconds
	var currentQ, gameQs, answersR, answersW, answersT, currentT;
	var timer;
	var correctM = [ 'Correctomundo' ];
	var incorrectM = ['Wrong'];
	var timeoutM = [ 'Out of time? So soon? Feels so late when it\'s early afternoon' ];

	/**************************************/
	/* Events */
	/**************************************/

	// On Load, start new game
	[currentQ, gameQs, answersR, answersW, answersT] = newG();

	// On Question Answer
	$('.card-question .form-group').on('click', 'button', function(){
		endQ( currentQ, this.data('answer'); );
	});

	// On "Play Again"
	$('#play-again').on('click',function(){
		alert('no one wrote this code yet!');
		[currentQ, gameQs, answersR, answersW, answersT] = newG();
	});

	// On Next Question 
	$('#play-next, #play-game').on('click',function(){
		currentQ = gameQs.shift();
		showQ( currentQ );
	});

	// On Pause
	$('#pause-play').click(function(){
		$('.card-scores, .card-welcome, .card-question, #pause-play').hide();
		$('.card-pause').show();

		stopTimer();
	});

	// On Un-pause
	$('#unpause').click(function(){
		$('.card-scores, .card-welcome, .card-pause').hide();
		$('#pause-play, .card-question').show();

		runTimer();
	});

	/**************************************/
	/* Utilities */
	/**************************************/


	// Function to start a new game
	// Returns cleared values for 
	function newG(){
		$('.card-scores, .card-pause, .card-question').hide();
		$('.card-welcome').show();

		var loadGame = function(){
			var g = [];
			g = [q1, q2, q3, q4, q5, q6, q7, q8];
			//for(i = 1; i <= 8 ; i++){g.push('q'+i);}
			 //update this to a better way of getting questions for the game
			randArr( g );
			return g.splice(0, gameLen);
		}

		return ['', loadGame(), 0, 0, 0];

	}

	// Function to update UI to show question
	// Params: question object
	function showQ( question ){
		clearQ();
		$('.card-question .game-question').html( question.definition );
		$('.card-question .form-group').append( '<label class="sr-only">Pick your best guess for what ' + question.definition + ' is</label>');

		var a = [question.name, question.notA, question.notB, question.notC];
		randArr( a );

		a.forEach(function(item, index){
			var v = '';
			v += '<button id="Q' + index + '" data-answer="' + item + '" class="btn btn-info">';
			v += item + '</button>';
			$('.card-question .form-group').append(v);
		});

		runTimer(true);

		$('.card-scores').hide();
		$('.card-question').fadeIn();
	}

	// Function to update UI to clear old question
	function clearQ(){
		$('.card-question .game-question, .card-question .form-group, .counting').empty();
	}


	// Function to end a question based 
	// Params: question object, user's answer (undefined if timeout)
	function endQ( question, userA ){
		var isCorrect = false;
		switch(userA){
			case question.name:
				isCorrect = true;
				answersR ++;
				$('#correct').html( answersR );
				$('#score-message').html( correctM[0] );
				break;
			case undefined:
				answersT ++;
				$('#score-message').html( timeoutM[0] );
				break;
			default:
				answersW ++;
				$('#incorrect').html( answersW );
				$('#score-message').html( correctW[0] );
		}

		var w = Math.floor((answersW + answersR + answersT) / gameLen * 100);
		$('.progress-bar').css('width', w + '%');
	}


	// Function to run timer
	// Params: if passed 'true', will start a timer from the beginning
	function runTimer(isNew){
		if(isNew){
			currentT = questionTime;
			$('.counting').html(currentT);
		}
		timer = setInterval(countDown, 1000);

		function countDown(){
			currentT--;
			$('.counting').html(currentT);
			if(currentT === 0){ 
				stopTimer(); 
			}
		}
	}

	// Function to stop timer
	function stopTimer(){
		clearInterval(timer);
	}

});

///////////////////////////////////////////////////////////////

var q1 = {'name': 'a-la-hoop', 'definition': "Sleepwalking engaged in by the Hoop-Soup-Snoop-Group — in Dr. Seuss's Sleep Book.", 'notA': 'jertain', 'notB': 'midwinter jicker', 'notC': 'wocket'};
var q2 = {'name': 'aldermen', 'definition': "City officials present on a reviewing stand", 'notA': 'jibboo', 'notB': 'murky-mooshy', 'notC': 'wumbus'};
var q3 = {'name': 'antrums', 'definition': "One of Dr. Ginn's medical specialties", 'notA': 'jill-ikka-jast', 'notB': 'na-nupp', 'notC': 'yekko'};
var q4 = {'name': 'a-snooze', 'definition': "A state of sleep", 'notA': 'jogg-oons', 'notB': 'nerd', 'notC': 'yuzz'};
var q5 = {'name': 'asso-see-eye-ation', 'definition': "Organization responsible for training of Birthday Birds", 'notA': 'kweet', 'notB': 'nizzards', 'notC': 'yuzz-a-ma-tuzz'};
var q6 = {'name': 'bagpipes', 'definition': "Musical instrument made out of straws and socks by Mrs. Fox", 'notA': 'jertain', 'notB': 'nooth grush', 'notC': 'zamp'};
var q7 = {'name': 'balber', 'definition': "Magic incantation (a spell. It's a magic spell)", 'notA': 'jibboo', 'notB': 'obsk', 'notC': 'zatz-it'};
var q8 = {'name': 'bandwagon', 'definition': "Vehicle pulled by an elephant and two giraffes", 'notA': 'jill-ikka-jast', 'notB': 'once-ler', 'notC': 'zax'};


function randArr( arr ){
	return arr.sort(function(a, b){return 0.5 - Math.random()});
}



//////////////////////////////////////////////////////////

function countVowels( s ){
	var vowels = {a : 0, e : 0, i : 0, o : 0, u : 0};
	s = s.split(''); // convert string to an array
	s.forEach(function(item){
		switch( item.toLowerCase() ){
			case 'a': vowels.a ++;
			break;
			case 'e': vowels.e ++;
			break;
			case 'i': vowels.i++;
			break;
			case 'o': vowels.o++;
			break;
			case 'u': vowels.u++;
			break;
		}
	})
	return "A's " + vowels.a + " & E's " + vowels.e + " & I's " + vowels.i + " & O's " + vowels.o + " & U's " + vowels.u;
}