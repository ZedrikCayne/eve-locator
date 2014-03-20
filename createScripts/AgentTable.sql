/****** Script for SelectTopNRows command from SSMS  ******/
SELECT [agentID]
      ,[ebs_DATADUMP].[dbo].[agtAgents].[corporationID] as [corpID]
      ,[locationID] as [stationID]
      ,[level]
      ,[quality]
	  ,[itemName] as [agentName]
	  ,[factionID]
	  ,[stationName]
  FROM [ebs_DATADUMP].[dbo].[agtAgents]
  INNER JOIN [ebs_DATADUMP].[dbo].[invNames]
  ON [agentID] = [itemID]
  INNER JOIN [ebs_DATADUMP].[dbo].[crpNPCCorporations] as b
  ON [ebs_DATADUMP].[dbo].[agtAgents].[corporationID] = [b].[corporationID]
  INNER JOIN [ebs_DATADUMP].[dbo].[staStations]
  ON [locationID] = [stationID]
  WHERE isLocator = 1 AND NOT agentTypeID = 5
