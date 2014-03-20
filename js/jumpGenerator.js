//Indices in the solar_system_table
var ss_table_ssname = 0;
var ss_table_security = 1;
var ss_table_constellation = 2;
var ss_table_regsion = 3;
var ss_table_jumps = 4;

function GetJumpTable( startingSystem )
{
	finalOutput = new Array();
	finalOutput[ startingSystem ] = 0;
	//Fill in all the 1 jump systems.
	currentOuterRim = new Array();
	var i;
	var max;
	var jTable = solar_system_table[ startingSystem ][ ss_table_jumps ];
	max = jTable.length;
	for( i = 0; i < max; ++i )
	{
    		var destination = jTable[ i ];
		finalOutput[ destination ] = 1;
		currentOuterRim.push( destination );
	}
	
	var currentDistance = 2;
	while( currentOuterRim.length > 0 )
	{
		var newOuterRim = new Array();
		max = currentOuterRim.length;
    
		for( i = 0; i < max; ++i )
		{
      			aRim = currentOuterRim[ i ];
      			var j;
      			var jTable = solar_system_table[ aRim ][ ss_table_jumps ];
      			var jMax = jTable.length;
			for( j = 0; j < jMax; ++j )
			{
        			var destination = jTable[ j ];
        			if( finalOutput[destination] == undefined )
        			{
					finalOutput[ destination ] = currentDistance;
					newOuterRim.push(destination);
        			}
			}
		}
		currentDistance++;
		currentOuterRim = newOuterRim;
	}
	
	return finalOutput;
}