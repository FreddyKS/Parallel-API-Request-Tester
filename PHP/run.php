<?php
/**
 * == Steps to use script == 
 * 
 * 1. fill $list_api with the api you want
 * 2. $method is api method GET, POST, PUT, PATCH, etc
 * 3. $is_looped -> How many times each api in $list_api wants to be looped. So here is the breakdown :
 *  - Assume this condition
 *  
 *  $list_api = array(
 *      'https://catfact.ninja/fact',
 *      'https://webhook-site.com/api/staging/webhook/92 '
 *      );
 *  $postfield = array(
 *      array('data'=>'data_catfact'),
 *      array('data'=>'data_webhook')
 * );
 *  $is_looped = 2;
 * 
 *  The api will be accessed like this: 
 *  > https://catfact.ninja/fact (2 times), each of them has postfield -> array('data'=>'data_catfact')
 *  > https://webhook-site.com/api/staging/webhook/92 (2 times), each of these has postfield -> array('data'=>'data_webhook')
 * 
 * 
 *  Total 4 apis are accessed
 * 4. See curl_result.txt for the result, the format is in list with either response, if no response at all, then ""
 *   - The timeout error depends how the coding provided it. It can either be "" or sometimes others
 *  
 */


/**
 * EDIT THESE FIELD
 */
//true means using multi exec, else, using regular curl
$multi_exec = true;

//Choose how many times an api in $list_api should be looped
$is_looped = 61;

$method = 'GET';
$bearer = '';
$list_api = array(
    //Fill your api delimited with 'https://catfact.ninja/fact', example
    'https://catfact.ninja/fact'
);
$postfield = array(

);
/**
 * end of EDIT THESE FIELD
 */
$result = array();
$time_start = microtime(true); 
if($multi_exec==true){
    $ch = array();
    $j=0;
    foreach($list_api as $la){
        for($i=$j*$is_looped;$i<($j+1)*$is_looped;$i++){
            $ch[$i] = curl_init();
            curl_setopt($ch[$i], CURLOPT_URL, $la);
            curl_setopt($ch[$i], CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'Accept: application/json',
                "Authorization: Bearer $bearer"
            ));
            if(strtolower($method)!='get'){
                curl_setopt($ch[$i], CURLOPT_POSTFIELDS, $postfield[$j]);
            }
            curl_setopt($ch[$i], CURLOPT_CUSTOMREQUEST, $method);
            curl_setopt($ch[$i], CURLOPT_RETURNTRANSFER, 1);
        }
        $j++;
    }
    //create the multiple cURL handle
    $mh = curl_multi_init();
    
    $j=0;
    foreach($list_api as $la){
        for($i=$j*$is_looped;$i<($j+1)*$is_looped;$i++){
            curl_multi_add_handle($mh,$ch[$i]);
        }
        $j++;
    }

    //execute the multi handle
    $active = null;
    do {
        curl_multi_exec($mh, $active);
    } while ($active);

    foreach($ch as $c){
        $response = curl_multi_getcontent($c);
        array_push($result,$response);
    }
    //close the handles
    $j=0;
    foreach($list_api as $la){
        for($i=$j*$is_looped;$i<($j+1)*$is_looped;$i++){
            curl_multi_remove_handle($mh, $ch[$i]);
        }
        $j++;
    }
    curl_multi_close($mh);
}
else{
    foreach($list_api as $la){
        for($i=0;$i<$is_looped;$i++){
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $la);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'Accept: application/json',
                "Authorization: Bearer $bearer"
            ));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            if(strtolower($method)!='get'){
                curl_setopt($ch[$i], CURLOPT_POSTFIELDS, $postfield[$j]);
            }
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

            $response = curl_exec($ch);

            curl_close($ch);
            array_push($result,$response);
        }
    }
}
if(file_exists('curl_result.txt')){
    unlink('curl_result.txt');
}

$myfile = fopen("curl_result.txt", "w");
fwrite($myfile, json_encode($result));
fclose($myfile);

$time_end = microtime(true);
$execution_time = $time_end-$time_start;
echo "Duration -> ($execution_time s)";
?>
