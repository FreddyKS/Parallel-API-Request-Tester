# API_Throttling_Test
Parallel request testing mockup in HTML+JavaScript and PHP to test the multiple user request on 1 or more API. From here, the errors can be seen from curl_result.txt in PHP and Result in Javascript

Steps : 
> PHP
1. Open the run.php, edit the variables inside EDIT THESE FIELD
2. php run.php 

> Javascript
1. Open run.html in web browser
2. Fill the required parameters : 
    2.a. API List -> list tested api
    2.b. How many parallel -> Concurrent requests per API in List API
   
   Fill the optional parameters
    2.c. Bearer -> If your api requires bearer, please insert it here
3. Click 'Test' and wait for the result in Result

NOTE : API rate limit error may varies, some are null, some returns 429 Too Many Requests, google drive returns 403 forbidden kindof.
