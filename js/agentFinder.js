var agent_table_id = 0;
var agent_table_level = 1;
var agent_table_corp = 2;
var agent_table_faction = 3;
var agent_table_station = 4;
var agent_table_system = 5;
var agent_table_name = 6;
var agent_table_stationName = 7;

var current_jump_table = undefined;

function SORT_AGENTS_BY_DISTANCE( left, right )
{
    a = current_jump_table[ left[ agent_table_system ] ];
    b = current_jump_table[ right[ agent_table_system ] ];
    
    if (a == b) {
        a = left[ agent_table_stationName ];
        b = right[ agent_table_stationName ];
        if( a == b )
		{
			a = left[ agent_table_name ];
			b = right[ agent_table_name ];
		}
    }
    return (a < b) ? -1 : 1;
}

//Standings is dictionary. <corpOrFaction>:<standing>
function FindMyAgents( solarSystemName, standings )
{
	var solarSystemId = solar_system_lookup[ solarSystemName ];
	if( solarSystemId == undefined )
		return Array();

	var agents = new Array();

	current_jump_table = GetJumpTable( solarSystemId );

	var sizeOfAgents = agent_table.length;

	for( i = 0; i < sizeOfAgents; ++i )
	{
		var anAgent = agent_table[ i ];
		var factionStanding = standings[ anAgent[ agent_table_faction ] ];
		var corpStanding = standings[ anAgent[ agent_table_corp ] ];
		var agentLevel = anAgent[ agent_table_level ];

		if( factionStanding == undefined )
			factionStanding = 0.0;
		if( corpStanding == undefined )
			corpStanding = 0.0;

		var minimumStanding = -10;
		switch( agentLevel )
		{
			case 2:
				minimumStanding = 1;
				break;
			case 3:
				minimumStanding = 3;
				break;
			case 4:
				minimumStanding = 5;
				break;
			case 5:
				minimumStanding = 7;
				break;
		}

		if( factionStanding <= -2.0 || corpStanding <= -2.0 )
			continue;
		if( factionStanding >= minimumStanding || corpStanding >= minimumStanding )
		{
			agents.push(anAgent);
		}
	}

  
	agents.sort( SORT_AGENTS_BY_DISTANCE );
  
	return agents;
}

function GetDerivedStanding( agentArray )
{
  level = agentArray[0];
  //quality = agentArray[1];
  quality = -20;
  
  requiredStanding = (( level - 1 ) * 2) + (quality / 20);
  
  return requiredStanding;
}
