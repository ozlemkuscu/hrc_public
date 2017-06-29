function isEmailAddress( field ) {
 //Validates input as name@isp.com
   var valid = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
   var temp = field.value;
   field.value = temp.toLowerCase();
   return valid.test( field.value );
}

function validate(evt,str) {
  var theEvent = evt || window.event;
  if(str.length >= 12){
  		    theEvent.returnValue = false;
	}
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode( key );
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}

function numberOfDaysInFuture( date_string ) {
  var days = 0;
  var difference = 0;
  future = new Date( date_string );
  today = new Date();
  difference = future - today;
  days = Math.round(difference/( 1000*60*60*24 ) );
  return days;
}

function allTrim( str ) {
   return str.replace(/^\s+|\s+$/g, '');
}


function validateWithinRange(date_string){
	var year  = date_string.substring(6, 10);
	var month = date_string.substring(0,2);
	var day  = date_string.substring(3, 5);
	//alert("year " + year);
	//alert("day " +day);
	//alert("month " + month);
	var myDate  = new Date(year, month-1, day);	
	var nMonth = myDate.getMonth();
  //	var currentTime = new Date()
   	//var year = currentTime.getFullYear();	
   //  var startDate = new Date(year, 9, 1);
   //  var endDate  = new Date(year, 3, 30); 
   
  //  var  startDate  = new Date(year, 3, 30);  
   // var endDate = new Date(year, 9, 1);  
    
   if (nMonth == 0 || nMonth == 1 || nMonth == 2 || nMonth == 3 || nMonth == 9  || nMonth == 10 || nMonth == 11)  {
   		return true;
   	} else {
   	  return false;
   	}
}




function validtosubmit( ) {
var valid = 0;
var msg = "Please complete or correct the following fields (highlighted in yellow):\n";
var fivecount = 0;

if (document.forms[0].EventName ) {
	document.forms[0].EventName.style.backgroundColor = "#ffffff";
	if ( allTrim( document.forms[0].EventName.value ) === "") {
	   msg += "     Event name\n";  
	   valid += 1; 
	   document.forms[0].EventName.style.backgroundColor = "#ffff99";
	   }
}

if (document.forms[0].EventHost ) {
	document.forms[0].EventHost.style.backgroundColor = "#ffffff";
	if ( allTrim( document.forms[0].EventHost.value ) === "") {
	   msg += "     Event host\n";  
	   valid += 1; 
	   document.forms[0].EventHost.style.backgroundColor = "#ffff99";
	   }
}

if (document.forms[0].EventLocn ) {
	document.forms[0].EventLocn.style.backgroundColor = "#ffffff";
	if ( allTrim( document.forms[0].EventLocn.value ) === "") {
	   msg += "     Event location\n";  
	   valid += 1; 
	   document.forms[0].EventLocn.style.backgroundColor = "#ffff99";
	   }
}

if (document.forms[0].EventDate ) {
	document.forms[0].EventDate.style.backgroundColor = "#ffffff";
	if ( allTrim( document.forms[0].EventDate.value ) === "") {
	   msg += "     Event date\n";  
	   valid += 1; 
	   document.forms[0].EventDate.style.backgroundColor = "#ffff99";
	   }
	 else {
	   var days = numberOfDaysInFuture( document.forms[0].EventDate.value );
	   if( days < 56) {
	     alert ("Event date only " + days + " days from today. Trailers must be booked eight weeks in advance. Special circumstances will be accommodated where possible, email htotogo@toronto.ca");  
	    // valid += 1; 
	     document.forms[0].EventDate.style.backgroundColor = "#ffff99";
	     return false;
	   }
	 }
}

if (document.forms[0].EventDate ) {
	document.forms[0].EventDate.style.backgroundColor = "#ffffff";
	var InDateRange=false;
	InDateRange = validateWithinRange(document.forms[0].EventDate.value);
	if (InDateRange){
		alert("Your event date is not within the May 1 to September 30 operating season. \n If your event is indoors, contact us at htotogo@toronto.ca to determine if the water trailer might be able to attend.");  
	     //valid += 1; 
	     document.forms[0].EventDate.style.backgroundColor = "#ffff99";
	     return false;
	}
	
}


if ( document.forms[0].EStartHr ) {
	   document.forms[0].EStartHr.style.backgroundColor = "#ffffff";
	if ( document.forms[0].EStartHr.selectedIndex == 0 ) {
	   msg += "     Starting time hour\n";
	   valid += 1;
	   document.forms[0].EStartHr.style.backgroundColor = "#ffff99";
	   }
}

if ( document.forms[0].EStartAMPM ) {
  document.getElementById('EStartAMPM_Label').style.backgroundColor = "#ffffff";
	for ( i = document.forms[0].EStartAMPM.length - 1; i > -1; i--) {
		if (! document.forms[0].EStartAMPM[i].checked) {
		  var addmsg = 1;
		 } else {
		    addmsg = 0;
		    break;
			}
	   }
    if ( addmsg == 1 ) {
	   document.getElementById('EStartAMPM_Label').style.backgroundColor = "#ffff99";
	   msg += "     Starting time AM/PM\n";
      valid += 1;
	   }
 }

if ( document.forms[0].EEndHr ) {
	   document.forms[0].EEndHr.style.backgroundColor = "#ffffff";
	if ( document.forms[0].EEndHr.selectedIndex == 0 ) {
	   msg += "     Ending time hour\n";
	   valid += 1;
	   document.forms[0].EEndHr.style.backgroundColor = "#ffff99";
	   }
}
		
if ( document.forms[0].EEndAMPM ) {
  document.getElementById('EEndAMPM_Label').style.backgroundColor = "#ffffff";
	for ( i = document.forms[0].EEndAMPM.length - 1; i > -1; i--) {
		if (! document.forms[0].EEndAMPM[i].checked) {
		  var addmsg = 1;
		 } else {
		    addmsg = 0;
		    break;
			}
	   }
    if ( addmsg == 1 ) {
	   document.getElementById('EEndAMPM_Label').style.backgroundColor = "#ffff99";
	   msg += "     Ending time AM/PM\n";
      valid += 1;
	   }
 }

if (document.forms[0].EventDesc ) {
	document.forms[0].EventDesc.style.backgroundColor = "#ffffff";
	if ( allTrim( document.forms[0].EventDesc.value ) === "") {
	   msg += "     Event description\n";  
	   valid += 1; 
	   document.forms[0].EventDesc.style.backgroundColor = "#ffff99";
	   }
}

if (document.forms[0].EventAttendCount ) {
	document.forms[0].EventAttendCount.style.backgroundColor = "#ffffff";
	if ( allTrim( document.forms[0].EventAttendCount.value ) === "") {
	   msg += "     Number of attendees\n";  
	   valid += 1; 
	   document.forms[0].EventAttendCount.style.backgroundColor = "#ffff99";
	   }
}

if (document.forms[0].EventContName ) {
	document.forms[0].EventContName.style.backgroundColor = "#ffffff";
	if ( allTrim( document.forms[0].EventContName.value ) === "") {
	   msg += "     Event contact name\n";  
	   valid += 1; 
	   document.forms[0].EventContName.style.backgroundColor = "#ffff99";
	   }
}

if (document.forms[0].EventContPhone ) {
	document.forms[0].EventContPhone.style.backgroundColor = "#ffffff";
	if ( allTrim( document.forms[0].EventContPhone.value ) === "") {
	   msg += "     Event contact phone\n";  
	   valid += 1; 
	   document.forms[0].EventContPhone.style.backgroundColor = "#ffff99";
	   }
}

if ( document.forms[0].EventContEmail ) {
   document.forms[0].EventContEmail.style.backgroundColor = "#ffffff";   
   if ( isEmailAddress( document.forms[0].EventContEmail ) == false ) {
       msg += "     Event contact e-mail\n";
       valid += 1;
    document.forms[0].EventContEmail.style.backgroundColor = "#ffff99";
   }
}

if (document.forms[0].EventSContName ) {
	document.forms[0].EventSContName.style.backgroundColor = "#ffffff";
	if ( allTrim( document.forms[0].EventSContName.value ) === "") {
	   msg += "     Site contact name\n";  
	   valid += 1; 
	   document.forms[0].EventSContName.style.backgroundColor = "#ffff99";
	   }
}

if (document.forms[0].EventSContPhone ) {
	document.forms[0].EventSContPhone.style.backgroundColor = "#ffffff";
	if ( allTrim( document.forms[0].EventSContPhone.value ) === "") {
	   msg += "     Site contact phone\n";  
	   valid += 1; 
	   document.forms[0].EventSContPhone.style.backgroundColor = "#ffff99";
	   }
}

if ( document.forms[0].EventSContEmail ) {
   document.forms[0].EventSContEmail.style.backgroundColor = "#ffffff";   
   if ( isEmailAddress( document.forms[0].EventSContEmail ) == false ) {
       msg += "     Site contact e-mail\n";
       valid += 1;
    document.forms[0].EventSContEmail.style.backgroundColor = "#ffff99";
   }
}

if ( document.forms[0].EventNonRestrict ) {
  document.getElementById('EventNonRestrict_Label').style.backgroundColor = "#ffffff";
	for ( i = document.forms[0].EventNonRestrict.length - 1; i > -1; i--) {
		if (! document.forms[0].EventNonRestrict[i].checked) {
		  var addmsg = 1;
		 } else {
		    addmsg = 0;
		    break;
			}
	   }
    if ( addmsg == 1 ) {
	   document.getElementById('EventNonRestrict_Label').style.backgroundColor = "#ffff99";
	   msg += "     Event open & non-restrictive\n";
      valid += 1;
	   }
 }

if ( document.forms[0].EventReadCriteria ) {
  document.getElementById('EventReadCriteria_Label').style.backgroundColor = "#ffffff";
	for ( i = document.forms[0].EventReadCriteria.length - 1; i > -1; i--) {
		if (! document.forms[0].EventReadCriteria[i].checked) {
		  var addmsg = 1;
		 } else {
		    addmsg = 0;
		    break;
			}
	   }
    if ( addmsg == 1 ) {
	   document.getElementById('EventReadCriteria_Label').style.backgroundColor = "#ffff99";
	   msg += "     Have read criteria\n";
      valid += 1;
	   }
 }

if ( valid > 0 ) { 
  alert( msg );
  return false;
  }
}