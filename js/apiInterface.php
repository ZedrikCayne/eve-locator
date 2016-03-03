<?php

function DoLog( $string )
{
  //file_put_contents( "C:/temp/output.txt", $string, FILE_APPEND );
}

function GetKey( $key, $array, $default )
{
  if( array_key_exists( $key, $array ) )
  {
    return $array[ $key ];
  }
  else
  {
    return $default;
  }
}

$charid = GetKey( 'charid', $_GET, '' );
$vcode = GetKey( 'vcode', $_GET, '' );
$keyid = GetKey( 'keyid', $_GET, '' );
$characters = null;

$sufficientPermissions = false;

$finalOutput = array();

if( $vcode != '' && $keyid != '' )
{
  if( $charid == '' )
  {
    $apikeyinfo = file_get_contents( "https://api.eveonline.com/account/APIKeyInfo.xml.aspx?keyID=$keyid&vCode=$vcode" );
    
    //DoLog( $apikeyinfo );
    //DoLog( "\n\n\n" );

    $charDetails = array();

    if( $apikeyinfo != null )
    {
      $sxml = new SimpleXMLElement( $apikeyinfo );
      
      $key = $sxml->result->key;
      
      //DoLog( "Access Mask: ".(string)$key['accessMask'] );
      //DoLog( "\n\n" );
      
      if( ((int)$key['accessMask'] & 524296) == 524296 )
      {
        $sufficientPermissions = true;
      
        $results = $key->rowset;
        
        $rows = $results->children();
        
        foreach( $rows as $aResult )
        {
          $finalOutput[ (string)$aResult['characterName'] ] = "apiInterface.php?keyid=$keyid&vcode=$vcode&charid=".(string)$aResult['characterID'];
        }
      }
    }
  }
  else
  {
    $sufficientPermissions = true;
    $filteredStandings = array();
    $xmlSkillsFromAPI = file_get_contents( "https://api.eveonline.com/char/CharacterSheet.xml.aspx?keyID=$keyid&vCode=$vcode&characterID=".$charid );

    $sxml = new SimpleXMLElement( $xmlSkillsFromAPI );
    
    $results = $sxml->result->children();
    $connections = '0';
    foreach( $results as $aResult )
    {
      if( $aResult['name']=='skills' )
      {
        $skills = $aResult->children();
        foreach( $skills as $aSkill )
        {
          //3359 is the id for the connections skill.
          if( $aSkill['typeID'] == '3359' )
          {
            $connections = (string)$aSkill['level'];
          }
        }
      }
    }
    
    $xmlFromAPI = file_get_contents( "https://api.eveonline.com/char/Standings.xml.aspx?keyID=$keyid&vCode=$vcode&characterID=".$charid );

    $sxml = new SimpleXMLElement( $xmlFromAPI );
    
    $rowsets = $sxml->result->characterNPCStandings;
    $rows = $rowsets->children();
    foreach( $rows as $whichRowset )
    {
      if( $whichRowset['name'] == 'NPCCorporations' ||
          $whichRowset['name'] == 'factions' )
      {
        $subRows = $whichRowset->children();
        foreach( $subRows as $aRow )
        {
          $entity = (string)$aRow['fromID'];
          $standing = (string)$aRow['standing'];
          if( $standing > 2.0 )
          {
            $standing = $standing + ( (10.0 - $standing) * $connections * 0.04 );
          }
          if( $standing > 2.99999 )
          {
            $filteredStandings[] = array( $entity, $standing );
          }
        }
      }
    }
    
    $outString = '';
    foreach( $filteredStandings as $aStanding )
    {
      $outString .= $aStanding[0].':'.$aStanding[1].',';
    }
    $outString = rtrim( $outString, ',' );
    
    $finalOutput['Click to go to your locators'] = "index.html?standings=$outString";
  }
}

$ref = GetKey( 'ref', $_GET, 'none' );
$refString = "?ref=$ref";

header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
header('Pragma: no-cache'); // HTTP 1.0.
header('Expires: 0'); // Proxies.
header('P3P: CP="CAO PSA OUR"');

?>
<head>
  <title>Dude..where's my locator API KEY INTERFACE!</title>
  <META name="description" content="Eve Online Locator Agent Finder">
  <META name="keywords" content="eve, eve-online, EvE, agent, search, find, Zedrik Cayne, Zedrik">
  <link href="main.css" rel="stylesheet" />
    <script type="text/javascript">

      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-21949366-1']);
      _gaq.push(['_setDomainName', '.justaddhippopotamus.com']);
      _gaq.push(['_trackPageview', '/apiInterface<?php echo $refString;?>']);

      (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
    </script>

  </head>
<body>
  <H2>Enter your Api Key Id and Verification Code:</H2>
  <script type="text/javascript">
    <!--
google_ad_client = "ca-pub-6316860724246582";
/* Locates Header */
google_ad_slot = "3623201956";
google_ad_width = 728;
google_ad_height = 90;
//-->
  </script>
  <script type="text/javascript"
  src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
  </script>
  <p>
    Enter your user id and api-key here..(Not the user name...) All I need is for the CharacterSheet and Standings to be enabled in this
    key.
  </p>
  <p>
    You can get it from <a href="https://support.eveonline.com/api/Key/Index">here</a>.
  </p>
  <?php
    echo "<table>";
    echo "<tr><td>Key ID</td><td><input type='text' value='$keyid' name='keyid' id='keyid'/></td></tr>\n";
    echo "<tr><td>Verification Code</td><td><input type='text' value='$vcode' name='vcode' id='vcode'/></td></tr>\n";
    echo "<tr><td><input type='button' onClick='submitApi()' value='Enter API'/></td></tr>\n";
    echo "</table>";
    echo "<table>";
    if( $sufficientPermissions != true )
    {
      echo "<h2>API KEY DOES NOT HAVE SUFFICIENT PERMISSIONS TO OPERATE</h2>";
    }
    foreach( $finalOutput as $charName => $standingsString )
    {
      echo "<tr>\n";
      echo "<td><a href=\"$standingsString&ref=genKey\">$charName</a></td>\n";
      echo "</tr>\n";
    }
    echo "</table>";
  ?>
  <script type="text/javascript">
    function submitApi()
    {
    var keyid = document.getElementById( 'keyid' ).value;
    var vcode = document.getElementById( 'vcode' ).value;
    window.location.href = 'apiInterface.php?keyid='+keyid+'&vcode='+vcode;

    }

  </script>
  <table>
    <tr>
      <td style="font-size: 10px; text-align: justify;">
        COPYRIGHT NOTICE<br>
        EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual property of CCP hf. All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf. EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide. All other trademarks are the property of their respective owners. CCP is in no way responsible for the content on or functioning of this website, nor can it be liable for any damage arising from the use of this website.<br>
      </td>
    </tr>
  </table>
    </body>