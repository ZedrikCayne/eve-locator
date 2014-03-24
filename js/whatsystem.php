<?php
$IGB = false;
$IGBTrusted = false;
if( array_key_exists( 'HTTP_EVE_TRUSTED', $_SERVER ) )
{
  $IGB = true;
  if( $_SERVER[ 'HTTP_EVE_TRUSTED' ] == 'Yes' )
  {
    $IGBTrusted = true;
  }
}

if( $IGBTrusted )
{
  $igbLocation = $_SERVER[ 'HTTP_EVE_SOLARSYSTEMNAME' ];
}

if( array_key_exists( 'location', $_GET ) )
{
	$location = $_GET[ 'location' ];
}

if( $IGBTrusted )
{
  $location = $igbLocation;
}

header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
header('Pragma: no-cache'); // HTTP 1.0.
header('Expires: 0'); // Proxies.
header('P3P: CP="CAO PSA OUR"');
echo $location;