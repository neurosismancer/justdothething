//get today's date for all kinds of function
var currDate = new Date();
var currYear = currDate.getFullYear();
var currMonth = (currDate.getMonth() + 1);
currDate.setHours(0,0,0,0);
console.log("Today: " + currDate);

if (currMonth < 10){
	currMonth = "0" + currMonth;
}

var currDay = currDate.getDate();

if (currDay < 10){
	currDay = "0" + currDay;
}

var todayDate = currYear + "-" + currMonth + "-" + currDay;

var twoDaysAgo = new Date()
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
twoDaysAgo.setHours(0,0,0,0);
console.log("Two Days Ago: " + twoDaysAgo);

//Set streak (days completed) by converting locally stored value to Int
var streak = localStorage.getItem("yourStreak");
var streak = parseInt(streak);
if (streak === null){
	streak = 0;
}

//Sets a date value for the last day completed in, or marks it as Never.
var lastDone = localStorage.getItem("dateLastDone");
if (lastDone === null){
	lastDone = "Never";
} else {
	dateLastDone = parseDate(lastDone);
	console.log("Last Done: " + dateLastDone);
}

console.log(dateLastDone.getTime() == twoDaysAgo.getTime());

// parse a date in yyyy-mm-dd format
function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
}

//Creates a calendar object
var cal = new calendarBase.Calendar({ siblingMonths: true, weekStart: 0 });

//Provides an option for changing the goal
function changeGoal() {
	clearStreak();

	var newGoal = $('.newGoal').val()
	localStorage.setItem("goal", newGoal);
	localStorage.setItem("dateGoalStart", todayDate);
	localStorage.setItem("yourStreak", "0");

	var streak = 0;
	
	localStorage.removeItem("dateLastDone");

	$('.goalAndStreak').text("Your Goal is: " + localStorage.getItem("goal"));
	$('.goalStart').text('Goal started on: ' + localStorage.getItem("dateGoalStart"));
	$('.streak').html("Your Streak is: 0 Days");
	$('.doTheThing').html("<a onclick=\"doTheThing()\" href=\"javascript:void(0);\">I did the thing today</a>")

	$('#doOrDoNot').toggle();
	$('#setup').toggle();
	$('.doTheThing').show();
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

	//Adjust Formatting for Date Conversions
	var printMonth = date.month + 1;

	if (printMonth < 10){
		printMonth = "0" + printMonth;
	}

	var printDay = date.day;

	if (printDay < 10){
		printDay = "0" + printDay;
	}

	var fullDate = date.year + "-" + printMonth + "-" + printDay;

	if (date.siblingMonth && fullDate == dateLastDone) {
		$('.calendar').append('<li class=\"siblingMonth lastDone\" name=\"' + fullDate + '\">' + date.day + '</li>')
	} else if (date.siblingMonth) {
		$('.calendar').append('<li class=\"siblingMonth\" name=\"' + fullDate + '\">' + date.day + '</li>')
	} else if (fullDate == dateLastDone && fullDate == todayDate) {
		$('.calendar').append('<li class=\"today lastDone\" name=\"' + fullDate + '\">' + date.day + '</li>')
	} else if (fullDate == todayDate) {
		$('.calendar').append('<li class=\"today\" name=\"' + fullDate + '\">' + date.day + '</li>')
	} else if (fullDate == dateLastDone) {
		$('.calendar').append('<li class=\"lastDone\" name=\"' + fullDate + '\">' + date.day + '</li>')
	} else {
		$('.calendar').append('<li name=\"' + fullDate + '\">' + date.day + '</li>')
	}
}

function doTheThing() {
	var streakEnd = $('.today');
	$('.today').removeClass('missed');
	$('.today').addClass('completed');
	$('.today').addClass('lastDone');
	$('.stillTime').remove();
	localStorage.setItem("dateLastDone", todayDate);
	
	streak++;
	$('.streak').html("Your Streak is: " + streak + ' Days <br> \n <small>Last Completed on: ' + localStorage.getItem("dateLastDone") + '</small>');
	localStorage.setItem("yourStreak", streak.toString());

	$('.doTheThing').hide();
}

function didYesterday() {
	$('.lastDone').removeClass('lastDone');
	$('.today').prev().removeClass('missed');
	$('.today').prev().addClass('lastDone');
	$('.today').prev().addClass('completed');

	var streakEnd = $('.lastDone').attr('name');
	localStorage.setItem("dateLastDone", streakEnd);

	streak++;
	$('.streak').html("Your Streak is: " + streak + ' Days <br> \n <small>Last Completed on: ' + localStorage.getItem("dateLastDone") + '</small>');
	localStorage.setItem("yourStreak", streak.toString());

	$('.missedADay').remove();
	$('.doTheThing').html("<a onclick=\"doTheThing()\" href=\"javascript:void(0);\">Yes</a>")
}

function didNotDoTheThing() {
	var streakEnd = $('.today').prev();

	if ($('#doOrDoNot').children('.stillTime').length){
		startOver();
		$('.stillTime').remove();
	} else {
		$('.today').addClass('missed');
		if ($('.today').hasClass('lastDone')){
			$('.today').removeClass('lastDone');
			$('.today').removeClass('completed');
			$('.today').prev().addClass('lastDone');

			lastDone = $('.today').prev().attr("name");

			localStorage.setItem("dateLastDone", lastDone);

			streak--;
			$('.streak').html("Your Streak is: " + streak + ' Days <br> \n <small>Last Completed on: ' + localStorage.getItem("dateLastDone") + '</small>');
			localStorage.setItem("yourStreak", streak.toString());

			$('.doTheThing').show();
			$('#doOrDoNot').prepend('<p class=\"stillTime\">Are you sure? You have until midnight. It\'s not too late!</p>');
		} else {
			$('#doOrDoNot').prepend('<p class=\"stillTime\">Are you sure? You have until midnight. It\'s not too late!</p>');
		}
	}
}

//resets everything, and forces you to pick a new goal
//FIXME: Add some kind of warning, or something.
function globalReset() {
	clearStreak();
	localStorage.removeItem("goal");
	localStorage.removeItem("dateGoalStart");
	localStorage.removeItem("dateLastDone");
	localStorage.removeItem("yourStreak");

	streak = 0;

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

function setupToggle() {
	$('#doOrDoNot').toggle();
	$('#setup').toggle();
}

//FIXME: Drop this, or use it for a First Run deal
function popUp(which) {
	$('.fadeOver').fadeToggle(200);
	$('.popOver').fadeToggle(200);
}

var main = function() {
	if(typeof(Storage) !== "undefined") {
	// Code for localStorage/sessionStorage.
		if (null == localStorage.getItem("goal")){
			setupToggle();
			changeGoal();
		}
	} else {
	// Sorry! No Web Storage support..
		$('body').html("Sorry, you need a browser that supports Local Storage.");
	}

	//Setting up the page
	genCalendar(cal);

	var streakEnd = $('.lastDone');

	$('.goalAndStreak').text("Your Goal is: " + localStorage.getItem("goal"));
	$('.goalStart').text('Goal started on: ' + localStorage.getItem("dateGoalStart"));
	$('.streak').html("Your Streak is: " + streak + ' Days <br>\n<small>Last Completed: ' + lastDone + '</small>');

	fillStreak(streak, streakEnd);

	//Checking for recent completion, or the lack thereof.
	if (dateLastDone.getTime() == currDate.getTime()){
		$('.today').addClass('completed');
		$('.doTheThing').hide();
	} else if (dateLastDone.getTime() == twoDaysAgo.getTime()) {
		$('.today').prev().addClass('missed');

		$('#doOrDoNot').prepend("<p class=\"missedADay\">Hey! You didn't check in yesterday! Did you accomplish your goal?");

		$('.doTheThing').html("<a onclick=\"didYesterday()\" href=\"javascript:void(0);\">Yes</a>")
	} else if (dateLastDone.getTime() < twoDaysAgo.getTime()) {
		//Backfill missed days, swap out Actions with "Start Over with Same Goal"
		//and "Start Over with New Goal"
		window.alert("You missed more than one day. You need to start over.");
		startOver();
	} else {
		//don't do nuthin'
	};
}

$(document).ready(main);