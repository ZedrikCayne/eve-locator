set nocount on;
SELECT [agentID]
      ,[level]
      ,[ebs_DATADUMP].[dbo].[agtAgents].[corporationID] as [corpID]
	  ,[factionID]
      ,[locationID] as [stationID]
	  ,[ebs_DATADUMP].[dbo].[staStations].[solarSystemID]
	  ,[itemName] as [agentName]
	  ,[stationName]
  FROM [ebs_DATADUMP].[dbo].[agtAgents]
  INNER JOIN [ebs_DATADUMP].[dbo].[invNames]
  ON [agentID] = [itemID]
  INNER JOIN [ebs_DATADUMP].[dbo].[crpNPCCorporations] as b
  ON [ebs_DATADUMP].[dbo].[agtAgents].[corporationID] = [b].[corporationID]
  INNER JOIN [ebs_DATADUMP].[dbo].[staStations]
  ON [locationID] = [stationID]
  WHERE isLocator = 1 AND NOT agentTypeID = 5
  ORDER BY [agentID];