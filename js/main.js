function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

var currlocation = gup( 'location' );
if( currlocation == '' )
  currlocation = 'Jita';

var currentlyRunning = new Array();

var pageData = [];

//alert( "PONG" );
function startTiming(whichThing,level)
{
  var currentDate = new Date();
  var currentMS = currentDate.getTime();
  var targetMS = currentMS;

  var l1Minutes = 5+1;
  var l2Minutes = 8+5;
  var l3Minutes = 15+8;
  var l4Minutes = 26+4;
  //var l3Minutes = 0.5;
  //var l4Minutes = 1;
  
  if( level == 3 ) targetMS += l3Minutes * 60 * 1000;
  else if( level == 4 ) targetMS += l4Minutes * 60 * 1000;
  else if( level == 2 ) targetMS += l2Minutes * 60 * 1000;
  else if( level == 1 ) targetMS += l1Minutes * 60 * 1000;
  else if( level == 5 ) targetMS += l5Minutes * 60 * 1000;
  else return;
  
  
  startThis(whichThing, targetMS);
}

function startThis(myThing, myMS)
{
  var locateButton = document.getElementById('locate-button-'+myThing);
  var locateText = document.getElementById('locate-time-'+myThing);
  if( locateButton != undefined && locateText != undefined )
  {
	  locateButton.style.display = 'none';
	  locateText.style.display = 'inline';
	  locateText.innerHTML = '';
  }
  pageData.push( [myThing, myMS] );
}

function updatePage()
{
  var dateNow = new Date();
  var msNow = dateNow.getTime();
  var removeStuff = new Array();
  for( aKey in pageData )
  {
    var myStuff = pageData[ aKey ];
    if( msNow > myStuff[1] )
    {
      //Turn it off
      var locateButton = document.getElementById('locate-button-'+myStuff[0]);
      var locateText = document.getElementById('locate-time-'+myStuff[0]);
      locateButton.style.display = 'inline';
      locateText.style.display = 'none';
      removeStuff.unshift( aKey );
    }
    else
    {
      var locateText = document.getElementById('locate-time-'+myStuff[0]);

	  if( locateText != undefined )
	  {
		  var smallDate = ( myStuff[1] - msNow ) / 1000;
		  minutes = Math.floor(smallDate / 60);
		  secs = Math.floor(smallDate % 60);
		  //var secs = smallDate.getSeconds();
		  var secString = "";
		  var minString = ""
		  if( minutes < 10 ) minString += 0;
		  minString += minutes;
		  if( secs < 10 ) secString += "0";
		  secString += secs;
      
		  locateText.innerHTML = "LEFT: "+minString+":"+secString;
	  }
    }

  }
  for( aKey in removeStuff )
  {
    var toRemove = removeStuff[ aKey ];
    pageData.splice( toRemove, 1 );
  }

  var first = true;
  var bossString = "";
  for( aKey in pageData )
  {
	var fix = pageData[ aKey ];

	if( !first )
	{
		bossString = bossString + "|";
	}
	first = false;
	bossString = bossString + fix[0] + ":" + fix[1];
  }

  setCookie( 'running', bossString );
  
  setTimeout( "updatePage()", 1000 );
}

var pageStandings = {};

function buildPage(solarSystem,highsecOnly,minLevel)
{
  var standingsString = gup( 'standings' );
  var splitStandings = standingsString.split( "," );
  pageStandings = {};
  var i;
  var len = splitStandings.length;
  for( i = 0; i < len; ++i )
  {
    var stringThing = splitStandings[ i ].split( ":" );
    pageStandings[parseInt( stringThing[0] )] = parseFloat( stringThing[1] );
  }

  document.getElementById( 'system' ).value = solarSystem;
  
  var newInnerHTML = "\
<table border='1'>\
    <tr>\
      <th>Agent Name</th>\
      <th>Level</th>\
      <th>Station</th>\
      <th>Jumps</th>\
      <th>GOTO</th>\
      <th>Locate</th>\
    </tr>";

    var arrayOfResults = FindMyAgents( solarSystem, pageStandings );
    len = arrayOfResults.length;
    for( i = 0; i < len; ++i )
  {
    var anAgent = arrayOfResults[i];
    
    var agentId = anAgent[agent_table_id];
    var agentName = anAgent[ agent_table_name ];	
    var agentLevel = anAgent[ agent_table_level ];
    var stationName = anAgent[ agent_table_stationName ];
    var solarSystem = anAgent[ agent_table_system ];
	var stationId = anAgent[ agent_table_station ];
    var jumps = current_jump_table[ solarSystem ];
    
    if( agentLevel < minLevel )
      continue;
      
    if( highsecOnly && solar_system_table[ solarSystem ][ ss_table_security ] < 0.5 )
      continue;
    
    newInnerHTML += "<tr>\
      <td>"+agentName+"</td>\
      <td>"+agentLevel+"</td>\
      <td>"+stationName+"</td>\
      <td>"+jumps+"</td>\
      <td>\
        <input type='button' value='SET' onClick='CCPEVE.setDestination("+stationId+")' />\
      </td>\
      <td>\
        <div id='locate-button-"+agentId+"'>\
          <input type='button' value='LOCATE' onClick='startTiming("+agentId+","+agentLevel+")' />\
        </div>\
        <div id='locate-time-"+agentId+"'></div>\
      </td>\
    </tr>";

    }
    newInnerHTML += "</table>";

    var tableNub = document.getElementById('TableContainer');
    
    tableNub.innerHTML = newInnerHTML;
    
    var currentlyRunningString = getCookie( 'running' );
    
    if( currentlyRunningString != '' && currentlyRunningString != undefined )
    {
      var runningArray = currentlyRunningString.split( '|' );
      
      len = runningArray.length;
      for( i = 0; i < len; ++i )
      {
        var doubleThing = runningArray[i].split( ':' );
        var target = parseInt( doubleThing[0] );
        var time = parseInt( doubleThing[1] );
        startThis( target, time );
      }

    }
    
    updatePage();
  }