//get Date
var currDate = new Date();
var currYear = currDate.getFullYear();
var currMonth = currDate.getMonth();
var currDay = currDate.getDate();
var todayDate = currYear + "-" + (currMonth+1) + "-" + currDay;

var cal = new calendarBase.Calendar({ siblingMonths: true, weekStart: 0 });

var changeGoal = function() {
	var newGoal = window.prompt("Pick a Goal", "Make me.")
	localStorage.setItem("goal", newGoal);
	localStorage.setItem("dateGoalStart", todayDate);
	localStorage.setItem("yourStreak", "0");

	window.location.reload();
}

if(typeof(Storage) !== "undefined") {
	// Code for localStorage/sessionStorage.
		if (null == localStorage.getItem("goal")){
			changeGoal();
		}
	} else {
	// Sorry! No Web Storage support..
		window.alert("Broken");
}

//Backfills dates on calendar for current streak
var fillStreak = function(streak, streakEnd) {
	for (i = 0; i < streak; i++){

		streakEnd.addClass('completed');
		nextDay = streakEnd;
		streakEnd = streakEnd.prev();
	}
}

//prints the table cell for the day in the calendar, identifying if the cell is for the current day
var printCalDay = function(date) {
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

var genCalendar = function(cal) {
	cal.getCalendar(currDate.getUTCFullYear(), currDate.getUTCMonth()).forEach(function (date) {
		printCalDay(date);
	});
}

var doTheThing = function() {
	var streak = localStorage.getItem("yourStreak");
	var streak = parseInt(streak);
	var streakEnd = $('.today').prev();

	$('.today').addClass('completed');
	$('.today').addClass('lastDone');
	localStorage.setItem("dateLastDone", todayDate);
	
	streak++;
	$('.streak').html("Your Streak is: " + streak + ' Days <br> \n <small>Last Completed on: ' + localStorage.getItem("dateLastDone") + '</small>');
	localStorage.setItem("yourStreak", streak.toString());

	$('.doTheThing').html('');
}

var didYesterday = function() {
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

var didNotDoTheThing = function () {
	var streak = localStorage.getItem("yourStreak");
	var streak = parseInt(streak);
	var streakEnd = $('.today').prev();

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
		alert("You have until midnight to do the thing.")
	}
}

var globalReset = function() {
	localStorage.removeItem("goal");
	localStorage.removeItem("dateGoalStart");
	localStorage.removeItem("dateLastDone");
	localStorage.removeItem("yourStreak");

	window.location.reload();
}

var startOver = function() {
	localStorage.setItem("dateGoalStart", todayDate);
	localStorage.removeItem("dateLastDone");
	localStorage.setItem("yourStreak", "0");

	window.location.reload();
}

var main = function() {
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
		$('.doTheThing').html('');
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