@echo off
echo var solar_system_table = ^{> SolarSystemTable.js
FOR /F %%I IN ( 'sqlite3.exe universeDataDx.db "select solarSystemID from mapSolarSystems WHERE regionID < 11000000;"' ) DO (
	FOR /F "tokens=1,2,3,4,5,6 delims=|" %%J IN ( 'sqlite3.exe universeDataDx.db "select solarSystemID,solarSystemName,security,constellationID,regionID,GROUP_CONCAT(toSolarSystemID) from mapSolarSystems JOIN mapSolarSystemJumps ON solarSystemID = fromSolarSystemID WHERE solarSystemID = %%I;"' ) DO ECHO %%J : [ ^"%%K^", %%L, %%M, %%N, [ %%O ] ], >>SolarSystemTable.js
)
echo ^}^; >> SolarSystemTable.js
echo var solar_system_lookup = ^{>>SolarSystemTable.js
FOR /F "tokens=1,2 delims=|" %%I IN ( 'sqlite3.exe universeDataDx.db "select solarSystemName,solarSystemID from mapSolarSystems WHERE regionID < 11000000 ORDER BY solarSystemName;"' ) DO ECHO ^"%%I^" : %%J, >> SolarSystemTable.js
echo ^}^; >> SolarSystemTable.js