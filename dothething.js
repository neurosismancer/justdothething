//get Date
var currDate = new Date();
var currYear = currDate.getFullYear();
var currMonth = currDate.getMonth();
var currDay = currDate.getDate();
var todayDate = currYear + "-" + (currMonth + 1) + "-" + currDay;

var streak = localStorage.getItem("yourStreak");
var streak = parseInt(streak);

var cal = new calendarBase.Calendar({ siblingMonths: true, weekStart: 0 });

function changeGoal() {
	clearStreak();

	var newGoal = window.prompt("Pick a Goal", "Make me.")
	localStorage.setItem("goal", newGoal);
	localStorage.setItem("dateGoalStart", todayDate);
	localStorage.setItem("yourStreak", "0");

	var streak = localStorage.getItem("yourStreak");
	var streak = parseInt(streak);
	
	localStorage.removeItem("dateLastDone");

	$('.goalAndStreak').text("Your Goal is: " + localStorage.getItem("goal"));
	$('.goalStart').text('Goal started on: ' + localStorage.getItem("dateGoalStart"));
	$('.streak').html("Your Streak is: 0 Days");
	$('.doTheThing').html("<a onclick=\"doTheThing()\" href=\"javascript:void(0);\">I did the thing today</a>")
}

//Generates a calendar, from the calendarBas calendar
function genCalendar(cal) {
	cal.getCalendar(currDate.getUTCFullYear(), currDate.getUTCMonth()).forEach(function (date) {
		printCalDay(date);
	});
}

//prints the table cell for the day in the calendar, identifying if the cell is for the current day
function printCalDay(date) {
	var dateLastDone = localStorage.getItem("dateLastDone");
	var fullDate = date.year + "-" + (date.month + 1) + "-" + date.day;

	if (date.siblingMonth) {
		$('.calendar').append('<li class=\"siblingMonth\" name=\"' + fullDate + '\">' + date.day + '</li>')
	} else if (fullDate == dateLastDone && fullDate == todayDate) {
		$('.calendar').append('<li class=\"today lastDone\" name=\"' + fullDate + '\">' + date.day + '</li>')
	} else if (fullDate == todayDate) {
		$('.calendar').append('<li class=\"today\" name=\"' + fullDate + '\">' + date.day + '</li>')
	} else if (fullDate == dateLastDone) {
		$('.calendar').append('<li class=\"lastDone\" name=\"' + fullDate + '\">' + date.day + '</li>')
	}else {
		$('.calendar').append('<li name=\"' + fullDate + '\">' + date.day + '</li>')
	}
}

function doTheThing() {
	var streakEnd = $('.today').prev();

	$('.today').addClass('completed');
	$('.today').addClass('lastDone');
	localStorage.setItem("dateLastDone", todayDate);
	
	streak++;
	$('.streak').html("Your Streak is: " + streak + ' Days <br> \n <small>Last Completed on: ' + localStorage.getItem("dateLastDone") + '</small>');
	localStorage.setItem("yourStreak", streak.toString());

	$('.doTheThing').hide();
}

function didYesterday() {
	$('.lastDone').removeClass('lastDone');
	$('.lastDone').removeClass('missed');
	$('.today').prev().addClass('lastDone');
	$('.today').prev().addClass('completed');

	var streakEnd = $('.lastDone').attr('name');
	localStorage.setItem("dateLastDone", streakEnd);

	streak++;
	$('.streak').html("Your Streak is: " + streak + ' Days <br> \n <small>Last Completed on: ' + localStorage.getItem("dateLastDone") + '</small>');
	localStorage.setItem("yourStreak", streak.toString());
}

function didNotDoTheThing() {
	var streakEnd = $('.today').prev();

	if ($('#doOrDoNot').children('.stillTime').length){
		startOver();
		$('.stillTime').remove();
	} else {
		if ($('.today').hasClass('lastDone')){
			$('.today').removeClass('lastDone');
			$('.today').removeClass('completed');
			$('.today').prev().addClass('lastDone');

			lastDone = $('.today').prev().attr("name");

			localStorage.setItem("dateLastDone", lastDone);

			streak--;
			$('.streak').html("Your Streak is: " + streak + ' Days <br> \n <small>Last Completed on: ' + localStorage.getItem("dateLastDone") + '</small>');
			localStorage.setItem("yourStreak", streak.toString());

			$('.doTheThing').html("<a onclick=\"doTheThing()\" href=\"javascript:void(0);\">I did the thing today</a>")

		} else {
			$('#doOrDoNot').prepend('<p class=\"stillTime\">Are you sure? You have until midnight. It\'s not too late!</p>');
		}
	}
}

//resets everything, and forces you to pick a new goal
function globalReset() {
	localStorage.removeItem("goal");
	localStorage.removeItem("dateGoalStart");
	localStorage.removeItem("dateLastDone");
	localStorage.removeItem("yourStreak");

	changeGoal();
}

//Resets streak progress, but keeps the goal
function startOver() {
	localStorage.removeItem("dateLastDone");
	localStorage.setItem("yourStreak", "0");

	clearStreak();

	streak = 0;

	$('.streak').html("Your Streak is: 0 Days");
	$('.doTheThing').html("<a onclick=\"doTheThing()\" href=\"javascript:void(0);\">I did the thing today</a>")
}

//Backfills dates on calendar for current streak
function fillStreak(streak, streakEnd) {
	for (i = 0; i < streak; i++){
		streakEnd.addClass('completed');
		nextDay = streakEnd;
		streakEnd = streakEnd.prev();
	};
}

//Clears the streak on the calendar
function clearStreak(){
	var streakEnd = $('.lastDone');

	for (i = 0; i <= streak; i++){
		streakEnd.removeClass('completed');
		nextDay = streakEnd;
		streakEnd = streakEnd.prev();
	};
}

function popUp(which) {
	$('.fadeOver').fadeToggle(200);
	$('.popOver').fadeToggle(200);
}

var main = function() {
	if(typeof(Storage) !== "undefined") {
	// Code for localStorage/sessionStorage.
		if (null == localStorage.getItem("goal")){
			changeGoal();
		}
	} else {
	// Sorry! No Web Storage support..
		window.alert("Broken");
	}

	genCalendar(cal);

	var streak = localStorage.getItem("yourStreak");
	var streak = parseInt(streak);
	if (streak === null){
		streak = 0;
	}

	var streakEnd = $('.lastDone');
	var lastDone = localStorage.getItem("dateLastDone");
	if (lastDone === null){
		lastDone = "Never";
	}

	$('.goalAndStreak').text("Your Goal is: " + localStorage.getItem("goal"));
	$('.goalStart').text('Goal started on: ' + localStorage.getItem("dateGoalStart"));
	$('.streak').html("Your Streak is: " + streak + ' Days <br>\n<small>Last Completed: ' + lastDone + '</small>');

	fillStreak(streak, streakEnd);

	if (localStorage.getItem("dateLastDone") == $('.today').attr('name')){
		$('.today').addClass('completed');
		$('.doTheThing').hide();
	} else if ($('.lastDone').attr('name') == $('.today').prev().prev().attr('name')) {
		$('.today').prev().addClass('missed');

		var didYesterday = window.confirm("Hey! You missed a day! Hit okay if you did the thing yesterday!");

		if (didYesterday === true) {
			doYesterday();
		} else {
			window.alert("You missed more than one day. You need to start over.");
			startOver();
		}
	} else if ($('.lastDone').attr('name') < $('.today').prev().prev().attr('name')) {
		window.alert("You missed more than one day. You need to start over.");
		startOver();
	} else {
		//don't do nuthin'
	};	
}

$(document).ready(main);