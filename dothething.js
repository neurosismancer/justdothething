//get Date
var currDate = new Date();
var currYear = currDate.getFullYear();
var currMonth = currDate.getMonth();
var currDay = currDate.getDate();
var streakDate = currYear + "-" + (currMonth+1) + "-" + currDay;

var cal = new calendarBase.Calendar({ siblingMonths: true, weekStart: 0 });

if(typeof(Storage) !== "undefined") {
	// Code for localStorage/sessionStorage.
		if (null == localStorage.getItem("goal")){
			localStorage.setItem("goal", window.prompt("Pick a Goal", "Make me."));
			localStorage.setItem("dateGoalStart", streakDate);
			localStorage.setItem("yourStreak", 0);

			window.location.reload();
		}
	} else {
	// Sorry! No Web Storage support..
		window.alert("Broken");
}

//Backfills dates on calendar for current streak
var fillStreak = function(streak, streakEnd) {
	for (i = 0; i < streak; i++){
		if(streakEnd.length ){
			streakEnd.addClass('completed');
			nextDay = streakEnd;
			streakEnd = streakEnd.prev();
		} else {
			streakEnd = nextDay.parent().prev().children().last()
			streakEnd.addClass('completed');
			
			nextDay = streakEnd;
			streakEnd = streakEnd.prev();
		}	
	}
}

//prints the table cell for the day in the calendar, identifying if the cell is for the current day
var printCalDay = function(day) {
	document.write("<td");
	
	if (day === currDay) {
		document.write(" class=\"today\"");
	}

	document.write(">" + day + "</td>")
}

var genCalendar = function(cal) {
	var i = 0;

	cal.getCalendar(currDate.getUTCFullYear(), currDate.getUTCMonth()).forEach(function (date) {
		if (i === 0 || i % 7 === 0){
			document.write("<tr>");
			printCalDay(date.day);
		} else if (i+1 % 7 === 0) {
			printCalDay(date.day);
			document.write("</tr>");
		} else {
			printCalDay(date.day);
		}
		i++;
	});
}

var doTheThing = function() {
	var streak = localStorage.getItem("yourStreak");
	var streak = parseInt(streak);
	var streakEnd = $('.today').prev();

	$('.today').addClass('completed');
	localStorage.setItem("dateLastDone", streakDate);
	
	streak++;
	$('.streak').html("Your Streak is: " + streak + ' Days <br> \n <small>Last Completed on: ' + localStorage.getItem("dateLastDone") + '</small>');
	localStorage.setItem("yourStreak", streak.toString());
}

var globalReset = function() {
	localStorage.removeItem("goal");
	localStorage.removeItem("dateGoalStart");
	localStorage.removeItem("dateLastDone");
	localStorage.removeItem("yourStreak");

	window.location.reload();
}

var main = function() {
	var streak = localStorage.getItem("yourStreak");
	var streak = parseInt(streak);
	var streakEnd = $('.today').prev();

	if (localStorage.getItem("dateLastDone") === streakDate){
		$('.today').addClass('completed');
		fillStreak(streak - 1, streakEnd);
	} else {
		fillStreak(streak, streakEnd);
	}

	$('.streak').html("Your Streak is: " + streak + ' Days <br> \n <small>Last Completed on: ' + localStorage.getItem("dateLastDone") + '</small>');
}

$(document).ready(main);