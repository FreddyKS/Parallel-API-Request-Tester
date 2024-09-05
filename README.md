# Parallel API Request Tester
Want to know how far a server can handle request from multiple user at the same time? Then this software is for you<br>
Parallel request testing mockup in HTML+JavaScript and PHP to test the multiple user request on 1 or more API. From here, the errors can be seen from curl_result.txt in PHP and Result in Javascript

Steps : 
> PHP
1. Open the run.php, edit the variables inside EDIT THESE FIELD
2. php run.php 

> HTML + JavaScript
1. Open run.html in web browser
2. Fill the required parameters : 
    2.a. API List -> list tested api
    2.b. How many parallel -> Concurrent requests per API in List API
    
   Fill the optional parameters
    2.c. POST / PUT / PATCH field (POSTFIELD) -> Fill it with the same position as the API List, here is the example
       2.c.a Example
    
      API List  
          'https://catfact.ninja/fact'<br>
          'https://webhook-site.com/api/staging/webhook/92 '
          
      POST / PUT / PATCH field (POSTFIELD)  
          {'data':'data_catfact'}<br>
          {'data':'data_webhook'}
     
      How many parallel 
          2
     
      The api will be accessed like this: 
      > https://catfact.ninja/fact (2 times), each of them has postfield -> {'data':'data_catfact'}<br>
      > https://webhook-site.com/api/staging/webhook/92 (2 times), each of these has postfield -> {'data':'data_webhook'}

    2.d. Bearer -> If your api requires bearer, please insert it here

4. Click 'Test' and wait for the result in Result

NOTE : API rate limit error may varies, some are null, some returns 429 Too Many Requests, google drive returns 403 forbidden kindof.

Author : FreddyKSoe76712@gmail.com
