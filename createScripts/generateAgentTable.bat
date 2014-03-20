@echo off
echo agent_table = { > AgentsTable.js
FOR /F "tokens=1,2,3,4,5,6,7,8 delims=|" %%I IN ( '"sqlcmd -S localhost\SQLEXPRESS  -i AgentTable.sql -s ^| -h -1 -W"' ) DO (
	echo %%I : [ %%J, %%K, %%L, %%M, %%N, ^"%%O^", ^"%%P^" ], >> AgentsTable.js
)
echo }; >> AgentsTable.js