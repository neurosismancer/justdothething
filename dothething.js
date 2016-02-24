//get today's date for all kinds of function
var currDate = new Date();
var currYear = currDate.getFullYear();
var currMonth = (currDate.getMonth() + 1);
var dateLastDone = new Date();
currDate.setHours(0,0,0,0);

if (currMonth < 10){
	currMonth = "0" + currMonth;
}

var currDay = currDate.getDate();

if (currDay < 10){
	currDay = "0" + currDay;
}

var todayDate = currYear + "-" + currMonth + "-" + currDay;

var twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
twoDaysAgo.setHours(0,0,0,0);

//Set streak (days completed) by converting locally stored value to Int
var streak = parseInt(localStorage.getItem("yourStreak"));
if(isNaN(streak)){
	streak = 0;
}

//Sets a date value for the last day completed in, or marks it as Never.
if (!localStorage.getItem("dateLastDone")){
	lastDone = "Never";
} else {
	dateLastDone = parseDate(localStorage.getItem("dateLastDone"));
}

//console.log(dateLastDone.getTime() == twoDaysAgo.getTime());

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

	streak = 0;

	localStorage.removeItem("dateLastDone");

	$('.doTheThing').html("<a onclick=\"doTheThing()\" href=\"javascript:void(0);\">Yes</a>")

	$('#doOrDoNot').toggle();
	$('#setup').toggle()
	$('.startOver').hide();
	$('.doTheThing').show();

	updateGoalInfo();
}

function updateGoalInfo() {
	$('.goalAndStreak').text("Your Goal is: " + localStorage.getItem("goal"));
	$('.goalStart').text('Goal started on: ' + localStorage.getItem("dateGoalStart"));
	if(localStorage.getItem("dateLastDone")){
		$('.streak').html("Your Streak is: " + streak + ' Days <br> \n <small>Last Completed on: ' + localStorage.getItem("dateLastDone") + '</small>');
	} else {
		$('.streak').html("Your Streak is: " + streak + ' Days <br> \n <small>Last Completed: Never </small>');
	}
	$('#actions').show();
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

function setCalendarHeight() {
	//setCalendar Height to fill remainder after goal data
	calendarHeight = ($(window).height() - $('.goalData').height());
	$('.calendar').height(calendarHeight + "px");

	//Set calendar day cell height
	if($('.calendar').children().length == 42) {
		var dayHeight = ($('.calendar').height() / 6) - 30;
		$('.calendar li').height(dayHeight + 'px');
	} else if ($('.calendar').children().length == 35){
		var dayHeight = ($('.calendar').height() / 5) - 30;
		$('.calendar li').height(dayHeight + 'px');
	} else if ($('.calendar').children().length == 28) {
		var dayHeight = ($('.calendar').height() / 4) - 30;
		$('.calendar li').height(dayHeight + 'px');
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
	$('.didYouDoIt').show();
	$('.doTheThing').html("<a onclick=\"doTheThing()\" href=\"javascript:void(0);\">Yes</a>")
}

function didNotDoTheThing() {
	var streakEnd = $('.today').prev();

	$('.didNotDoTheThing').html("<a onclick=\"didNotDoTheThing()\" href=\"javascript:void(0);\">Start Over</a>");

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
		}

		$('#doOrDoNot').prepend('<p class=\"stillTime\">Are you sure? You have until midnight. It\'s not too late!</p>');
	}
}

//resets everything, and forces you to pick a new goal
function globalReset() {
	if(confirm("This will reset all your progress. Are you sure you want to continue?")) {
		clearStreak();
		localStorage.removeItem("goal");
		localStorage.removeItem("dateGoalStart");
		localStorage.removeItem("dateLastDone");
		localStorage.removeItem("yourStreak");

		streak = 0;

		$('.goalAndStreak').html("Please set a goal");
		$('.goalStart').html("Your start date will be today");
		$('.streak').html("");

		setupToggle();
	}
}

//Resets streak progress, but keeps the goal
function startOver() {
	localStorage.removeItem("dateLastDone");
	localStorage.setItem("yourStreak", "0");

	clearStreak();

	streak = 0;

	$('.streak').html("Your Streak is: 0 Days");
	$('.didYouDoIt').html("Did you accomplish your goal today?");
	$('.doTheThing').html("<a onclick=\"doTheThing()\" href=\"javascript:void(0);\">Yes</a>")
	$('.didNotDoTheThing').html("<a onclick=\"didNotDoTheThing()\" href=\"javascript:void(0);\">No</a>");
	$('.startOver').hide();
	setupToggle();
}

//Backfills dates on calendar for current streak
function fillStreak(streak, streakEnd) {
	for (i = 0; i < streak; i++){
		streakEnd.addClass('completed');
		nextDay = streakEnd;
		streakEnd = streakEnd.prev();
	};
}

//Backfills missed days on calendar
function fillMissed(lastMissed) {
	lastMissed.addClass('missed');

	var prevMissed = lastMissed.prev();
	while (!prevMissed.hasClass('completed')){
		prevMissed.addClass('missed');
		prevMissed = prevMissed.prev();
	}
}

//Clears the streak on the calendar
function clearStreak(){
	var streakEnd = $('.today');

	for (i = 0; i <= 31; i++){
		streakEnd.removeClass('completed');
		streakEnd.removeClass('missed');
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
	} else {
	// Sorry! No Web Storage support..
		$('body').html("Sorry, you need a browser that supports Local Storage.");
	}

	//Setting up the page
	genCalendar(cal);

	setCalendarHeight();

	if(localStorage.getItem("goal")){
		var streakEnd = $('.lastDone');

		fillStreak(streak, streakEnd);

		updateGoalInfo();

		//Checking for recent completion, or the lack thereof.
		if (dateLastDone.getTime() == currDate.getTime()){
			$('.today').addClass('completed');
			$('.doTheThing').hide();
		} else if (dateLastDone.getTime() == twoDaysAgo.getTime()) {
			$('.today').prev().addClass('missed');

			$('.didYouDoIt').hide();
			$('#doOrDoNot').prepend("<h4 class=\"missedADay\">Hey! You didn't check in yesterday! Did you accomplish your goal?</h4>");

			$('.doTheThing').html("<a onclick=\"didYesterday()\" href=\"javascript:void(0);\">Yes</a>")
		} else if (dateLastDone.getTime() < twoDaysAgo.getTime()) {
			//FIXME: swap out Actions with "Start Over with Same Goal" and "Start Over with New Goal"
			fillMissed($('.today').prev());
			$('.didYouDoIt').html("You missed more than one day. You need to start over.");
			$('#actions').hide();
			$('.startOver').show();
		} else if (lastDone === "Never"){
			console.log("No Dates Logged");
		};
	} else {
		setupToggle();
	};

	$(window).resize(function() {
		setCalendarHeight();
	});
}

$(document).ready(main);
