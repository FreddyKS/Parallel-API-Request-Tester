//Parallel api request is inspired by https://chatgpt.com/
var list_data = "";
function load_lang_variables(){
    var lang = document.querySelector('input[name="language"]:checked').value;
    if(lang=="EN"){
        list_data = list_en;
    }
    else if(lang=="CN"){
        list_data = list_cn;
    }
    else{
        list_data = list_id;
    }
    document.getElementById('fetch-loading').style.visibility='hidden';
}
function load_language(){

    //Load appropriate file
    load_lang_variables();
    
    //Set text
    document.getElementById("title_label").innerHTML = list_data.header_label;
    document.getElementById("header_label").innerHTML = list_data.header_label;
    document.getElementById("attention_label").innerHTML = list_data.attention_label;
    document.getElementById("input_label").innerHTML = list_data.input_label;
    document.getElementById("method_label").innerHTML = list_data.method_label;
    document.getElementById("custom_method").placeholder = list_data.custom_method;
    document.getElementById("url_list_label").innerHTML = list_data.url_list_label;
    document.getElementById("post_field_label").innerHTML = list_data.post_field_label;
    document.getElementById("loop_label").innerHTML = list_data.loop_label;
    document.getElementById("danger_parallel_span").innerHTML = list_data.danger_parallel_span;
    document.getElementById("bearer_label").innerHTML = list_data.bearer_label;
    document.getElementById("submit").placeholder = list_data.submit;
    document.getElementById("result_label").innerHTML = list_data.result_label;
    document.getElementById("author_label").innerHTML = list_data.author_label;
    changeColor();
}
async function fetchMultipleUrls() {
    
    //Load appropriate file
    load_lang_variables();

    //Retrieve variables
    var loop = document.getElementById('loop').value;
    var url_list = document.getElementById('url_list').value.split("\n");
    //If custom method is defined
    var method = '';
    if(document.getElementById('method').disabled==false){
        method = document.getElementById('method').value;
    }
    else{
        method = document.getElementById('custom_method').value;
    }
    // ## var method = document.getElementById('method').value;
    var token = document.getElementById('bearer').value.split("\n");

    //https://chatgpt.com/share/8a0a8009-6292-4165-bac9-92c8e9ec87d5
    
    //Split json filled inputs by } (any whitespaces between) {, without removing } and {
    //https://medium.com/@shemar.gordon32/how-to-split-and-keep-the-delimiter-s-d433fb697c65
    
    var postfield_get = document.getElementById('post_field').value.split(/(?<=[}])\s*(?=[{])/g);
    
    //var postfield = document.getElementById('post_field').value;
    var content = "application/json";
    
    //Test the app here
    

    //End of testing

    //Disable the button
    document.getElementById('print').disabled = true;

    //Empties the result
    document.getElementById('output').innerHTML = '';
    
    if(!document.getElementById('url_list').value){
        document.getElementById('fetch-loading').style.visibility='visible';
        document.getElementById('fetch-loading').style.backgroundColor='red';
        document.getElementById('fetch-loading').style.color='white';
        document.getElementById('url_list').focus();
        var display_loading = '`'+list_data.url_list_label+'`'+list_data.api_cannot_empty;
        document.getElementById('complete').innerHTML=display_loading;
        //Re enable the button on error
        document.getElementById('print').disabled = false;
        return;
    }
    else if(url_list.length>1 && token.length>1){
        if(url_list.length!=token.length){
            document.getElementById('fetch-loading').style.visibility='visible';
            document.getElementById('fetch-loading').style.backgroundColor='red';
            document.getElementById('fetch-loading').style.color='white';
            document.getElementById('url_list').focus();
            var display_loading = list_data.bearer_same_as_token_not_empty+'`'+list_data.bearer_label+'`'+ list_data.line_same_as+'`'+list_data.url_list_label+'`';
            document.getElementById('complete').innerHTML=display_loading;
            //Re enable the button on error
            document.getElementById('print').disabled = false;
            return;
        }
    }
    else if(url_list.length>1 && postfield_get.length>1){
        if(url_list.length!=postfield_get.length){
            document.getElementById('fetch-loading').style.visibility='visible';
            document.getElementById('fetch-loading').style.backgroundColor='red';
            document.getElementById('fetch-loading').style.color='white';
            document.getElementById('url_list').focus();
            var display_loading = list_data.multiple_postfield_not_empty+'`POST FIELD`'+list_data.line_same_as+'`'+list_data.url_list_label+'`';
            document.getElementById('complete').innerHTML=display_loading;
            //Re enable the button on error
            document.getElementById('print').disabled = false;
            return;
        }
    }
    else{
        document.getElementById('fetch-loading').style.visibility='visible';
        document.getElementById('fetch-loading').style.backgroundColor='#69ff9b9e';
        document.getElementById('fetch-loading').style.color='black';
    }
    // -- Captcha validation, prevent bot --
    var captcha = document.getElementById("image");
    var usr_input = document.getElementById("submit").value;

    // Check whether the input is equal
    // to generated captcha or not
    if (usr_input == captcha.innerHTML) {
        generate();
    }
    else if(!usr_input){
        document.getElementById('fetch-loading').style.visibility='visible';
        document.getElementById('fetch-loading').style.backgroundColor='lightblue';
        document.getElementById('fetch-loading').style.color='white';
        document.getElementById('submit').focus();
        var display_loading = list_data.captcha_please;
        document.getElementById('complete').innerHTML=display_loading;
        //Re enable the button on error
        document.getElementById('print').disabled = false;
        return;
    }
    else {
        document.getElementById('fetch-loading').style.visibility='visible';
        document.getElementById('fetch-loading').style.backgroundColor='red';
        document.getElementById('fetch-loading').style.color='white';
        var display_loading = list_data.wrong_captcha;
        document.getElementById('complete').innerHTML=display_loading;
        //Re enable the button on error
        document.getElementById('print').disabled = false;
        generate();
        return;
    }
    //Loading starts
    let startTime = new Date();
    var display_loading = list_data.fetching + ( (isNaN(parseInt(loop)) || parseInt(loop) < 1) ? 1 : parseInt(loop))*parseInt(url_list.length) + list_data.request;
    document.getElementById('complete').innerHTML=display_loading;
    document.getElementById('loading').style.display='block';
    document.getElementById('loading').style.display='block';
    document.querySelector('input[name="language"]').disabled=true;
    
    const urls = [];

    if(!loop || loop<1){
        loop='1';
    }
    if(!method){
        method='GET';
    }
    if(!content){
        content='application/json';
    }
    
    for(var i=0;i<url_list.length; i++){
        for(let j=0;j<loop;j++){
            var url_inside = [];
            url_inside['url']=url_list[i];
            url_inside['bearer']=token[i];
            if(method!='GET'){
                url_inside['postfield']=postfield_get[i];
            }
            urls.push(url_inside);
            /*
            Multiple bearers and postfields is currently not supported
            if(token.length>1){
                bearers.push(token[i]);
            }
            if(method!='GET'){
                postfield.push(postfield_get[i]);
            }
            */
        }
    }
    console.log(urls);
    let afterLoop = new Date();
    let timeLoop = (afterLoop-startTime)/1000;
    console.log('urls.push duration : '+timeLoop+' s');
    try {
        //If GET, don't send body
        if(method=='GET'){
            // Run these requests in parallel using Promise.all
                const responses = await Promise.all(
                    urls.map(url => 
                        fetch(url.url, {
                            method: `${method}`,
                            headers: {
                                'Authorization': `Bearer ${url.bearer}`,
                                'Content-Type': `${content}`
                            }
                        })
                    )
                );
            
            // Parse all responses to JSON
            const data = await Promise.all(
                responses.map(async response => {
                    if (response && response.ok) {
                        const response_real = response.clone();
                        try{
                            return await response_real.json();  // Handle non-OK status
                        }catch(error){
                            return await response.text();
                        } 
                    } 
                    else if (response) {
                        const response_real = response.clone();
                        try{
                            return await response_real.json();  // Handle non-OK status
                        }catch(error){
                            return await response.text();
                        }
                    }
                    else{
                        return list_data.response_unavailable;
                    }
                })
            );
            
            // Display in file for further analysis
            var data_str="";
            data.forEach(item => {
                document.getElementById('output').textContent += `${JSON.stringify(item, item, 3)}\r\n\r\n`;
            });
            
            //Loading Complete
            let endTime = new Date();
            let timeElapsed = (endTime - startTime)/1000;
            document.getElementById('complete').innerHTML=loop+list_data.parallel+method+list_data._request+'`'+document.getElementById('url_list').value+list_data.done_in+timeElapsed +list_data.seconds;
            document.getElementById('loading').style.display='none';
            document.querySelector('input[name="language"]').disabled=false;
        
            //Re enable the button
            document.getElementById('print').disabled = false;
        }
        else{
            // Run these requests in parallel using Promise.all
            const responses = await Promise.all(
                urls.map(url => 
                    fetch(url.url, {
                        method: `${method}`,
                        headers: {
                            'Authorization': `Bearer ${url.bearer}`,
                            'Content-Type': `${content}`
                        },
                        body: url.postfield
                    })
                )
            );

            // Parse all responses to JSON
            const data = await Promise.all(
                responses.map(async response => {
                    if (response && response.ok) {
                        const response_real = response.clone();
                        try{
                            return await response_real.json();  // Handle non-OK status
                        }catch(error){
                            return await response.text();
                        } 
                    } 
                    else if (response) {
                        const response_real = response.clone();
                        try{
                            return await response_real.json();  // Handle non-OK status
                        }catch(error){
                            return await response.text();
                        }
                    }
                    else{
                        return list_data.response_unavailable;
                    }
                })
            );

            // Display in file for further analysis
            var data_str="";
            data.forEach(item => {
                document.getElementById('output').textContent += `${JSON.stringify(item, item, 3)}\r\n\r\n`;
            });

            //Loading Complete
            let endTime = new Date();
            let timeElapsed = (endTime - startTime)/1000;
            document.getElementById('complete').innerHTML='`'+document.getElementById('url_list').value+list_data.done_in+timeElapsed + list_data.seconds;
            document.getElementById('loading').style.display='none';


            //Re enable the button
            document.getElementById('print').disabled = false;
        }

    } catch (error) {
        document.getElementById('fetch-loading').style.visibility='visible';
        document.getElementById('fetch-loading').style.backgroundColor='red';
        document.getElementById('fetch-loading').style.color='white';
        document.getElementById('loading').style.display='none';
        document.getElementById('complete').innerHTML=list_data.cannot_access+document.getElementById('url_list').value+list_data.with_method+method+list_data.error_detail+error+'`';
        //Re enable the button on error
        document.getElementById('print').disabled = false;
        return;
    }
}

function changeColor(){

    //Load language
    load_lang_variables();
    var method = document.getElementById('method').value;
    var api_list = document.getElementById('url_list').value;
    document.getElementById('print').className='button';
    if(method=='GET'){
        document.getElementById('method').className='getmethod';
        document.getElementById('print').classList.add('getmethod');
        document.querySelector('#print').innerHTML = list_data.test+' GET '+api_list;
    }
    else if(method=='POST'){
        document.getElementById('method').className='postmethod';
        document.getElementById('print').classList.add('postmethod');
        document.querySelector('#print').innerHTML = list_data.test+' POST '+api_list;
    }
    else if(method=='PUT' || method=='PATCH'){
        document.getElementById('method').className='updatemethod';
        document.getElementById('print').classList.add('updatemethod');
        if(method=='PUT'){
            document.querySelector('#print').innerHTML = list_data.test+' PUT '+api_list;
        }
        else{
            document.querySelector('#print').innerHTML = list_data.test+' PATCH '+api_list;
        }
    }    
    else if(method=='DELETE'){
        document.getElementById('method').className='deletemethod';
        document.getElementById('print').classList.add('deletemethod');
        document.querySelector('#print').innerHTML = list_data.test+' DELETE '+api_list;
    }
    else if(method=='HEAD'){
        document.getElementById('method').className='headmethod';
        document.getElementById('print').classList.add('headmethod');
        document.querySelector('#print').innerHTML = list_data.test+' HEAD '+api_list;
    }
    else if(method=='OPTIONS'){
        document.getElementById('method').className='optionsmethod';
        document.getElementById('print').classList.add('optionsmethod');
        document.querySelector('#print').innerHTML = list_data.test+' OPTIONS '+api_list;
    }
    else if(method=='DELETE'){
        document.getElementById('method').className='deletemethod';
        document.getElementById('print').classList.add('deletemethod');
        document.querySelector('#print').innerHTML = list_data.test+' DELETE '+api_list;
    }
    else{
        document.getElementById('method').className='othermethod';
        document.getElementById('print').classList.add('othermethod');
        document.querySelector('#print').innerHTML = list_data.test+' '+method+' '+api_list;
    }
}

//If user input custom method
function handleCustomMethod(){
    
    //Load appropriate file
    load_lang_variables();
    
    var method_value = document.getElementById('method').value;
    var method_innerHTML = document.getElementById('method').innerHTML;
    var api_list = document.getElementById('url_list').value;
    var custom_method = document.getElementById('custom_method').value;
    if(!custom_method){
        document.getElementById('custom_method').className='';    
        document.getElementById('method').disabled=false;
        document.getElementById('print').className='button';
        var method_class_name = document.getElementById('method').className;
        document.getElementById('print').classList.add(method_class_name);
        document.querySelector('#print').innerHTML = list_data.test+' '+method_value+' '+api_list;
    }
    else{
        document.getElementById('method').disabled=true;
        document.getElementById('custom_method').className='othermethod';
        document.getElementById('custom_method').classList.add('othermethod');
        document.getElementById('print').classList.add('othermethod');
        document.querySelector('#print').innerHTML = list_data.test+' '+custom_method+' '+api_list;
    }
}

function displayDanger(){
    var loop = document.getElementById('loop').value;
    if(loop>50){
        document.getElementById('danger_parallel').style.visibility='visible';
    }
    else if(loop<1){
        loop=1;
    }
    else{
        document.getElementById('danger_parallel').style.visibility='hidden';
    }
}

//Generate Captcha
function generate() {

    //Load appropriate file
    //load_lang_variables();
    // Clear old input
    document.getElementById("submit").value = "";

    // Access the element to store
    // the generated captcha
    captcha = document.getElementById("image");
    let uniquechar = "";

    const randomchar =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    //Generate different types of blocker
    if(Math.random() * 60 < 30){
        captcha.style.textDecorationStyle='wavy';
    }
    else if(Math.random() * 60 >= 30 && Math.random() * 60 < 40){
        captcha.style.textDecorationStyle='solid';
    }
    else if(Math.random() * 60 >= 40 && Math.random() * 60 < 50){
        captcha.style.textDecorationStyle='solid';
    }
    else{
        captcha.style.textDecorationStyle='double';
    }

    // Generate captcha for length of
    // 5 with random character
    var min = 4;
    var max = 5;
    var random_length = Math.floor(Math.random() * (max - min + 1) + min);
    for (let i = 1; i <= random_length; i++) {
        uniquechar += randomchar.charAt(
            Math.random() * randomchar.length)
    }

    // Store generated input
    captcha.innerHTML = uniquechar;
}
