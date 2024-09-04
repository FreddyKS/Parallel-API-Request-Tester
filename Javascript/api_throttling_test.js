async function fetchMultipleUrls() {
    //Retrieve variables
    var loop = document.getElementById('loop').value;
    var url_list = document.getElementById('url_list').value.split("\n");
    var method = document.getElementById('method').value;
    var token = document.getElementById('bearer').value;
    var postfield = document.getElementById('post_field').value;
    var content = document.getElementById('content_type').value;
    //Disable the button
    document.getElementById('print').disabled = true;

    //Empties the result
    document.getElementById('output').innerHTML = '';
    
    if(!document.getElementById('url_list').value){
        document.getElementById('fetch-loading').style.visibility='visible';
        document.getElementById('fetch-loading').style.backgroundColor='red';
        document.getElementById('fetch-loading').style.color='white';
        var display_loading = '`API list` cannot be empty';
        document.getElementById('complete').innerHTML=display_loading;
        return;
    }
    else{
        document.getElementById('fetch-loading').style.visibility='visible';
        document.getElementById('fetch-loading').style.backgroundColor='#00e54c';
        document.getElementById('fetch-loading').style.color='black';
    }
    //Loading starts
    let startTime = new Date();
    var display_loading = 'Fetching ' + parseInt(loop)*parseInt(url_list.length) + ' request';
    document.getElementById('complete').innerHTML=display_loading;
    document.getElementById('loading').style.visibility='visible';
    
    const urls = [];
    if(!loop){
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
            urls.push(url_list[i]);

        }
    }
    try {
        //If GET, don't send body
        if(method=='GET'){
            // Run these requests in parallel using Promise.all
                const responses = await Promise.all(
                    urls.map(url => 
                        fetch(url, {
                            method: `${method}`,
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': `${content}`
                            }
                        })
                    )
                );
            
            // Parse all responses to JSON
            const data = await Promise.all(responses.map(response => response.json()));
            
            // Display in file for further analysis
            var data_str="";
            data.forEach(item => {
                document.getElementById('output').innerHTML += `<pre>${JSON.stringify(item, null, 2)}</pre>`;
            });
            
            //Loading Complete
            let endTime = new Date();
            let timeElapsed = (endTime - startTime)/1000;
            document.getElementById('complete').innerHTML='`'+document.getElementById('url_list').value+'` done in <br>'+timeElapsed + ' seconds';
            document.getElementById('loading').style.visibility='hidden';
            
        
            //Re enable the button
            document.getElementById('print').disabled = false;
        }
        else{
            // Run these requests in parallel using Promise.all
            const responses = await Promise.all(
                urls.map(url => 
                    fetch(url, {
                        method: `${method}`,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': `${content}`
                        },
                        body: JSON.stringify(postfield)
                    })
                )
            );

            // Parse all responses to JSON
            const data = await Promise.all(responses.map(response => response.json()));

            // Display in file for further analysis
            var data_str="";
            data.forEach(item => {
            document.getElementById('output').innerHTML += `<pre>${JSON.stringify(item, null, 2)}</pre>`;
            });

            //Loading Complete
            let endTime = new Date();
            let timeElapsed = (endTime - startTime)/100;
            document.getElementById('complete').innerHTML='`'+document.getElementById('url_list').value+'` done in <br>'+timeElapsed + ' seconds';
            document.getElementById('loading').style.visibility='hidden';


            //Re enable the button
            document.getElementById('print').disabled = false;
        }

    } catch (error) {
        document.getElementById('fetch-loading').style.visibility='visible';
        document.getElementById('fetch-loading').style.backgroundColor='red';
        document.getElementById('fetch-loading').style.color='white';
        document.getElementById('loading').style.visibility='hidden';
        document.getElementById('complete').innerHTML='Invalid API '+document.getElementById('url_list').value+'<br>Error Detail -> '+error;
        return;
    }
}

function changeColor(){
    var method = document.getElementById('method').value;
    if(method=='GET'){
        document.getElementById('method').className='getmethod';
    }
    else if(method=='POST'){
        document.getElementById('method').className='postmethod';
    }
    else if(method=='PUT' || method=='PATCH'){
        document.getElementById('method').className='updatemethod';
    }
    else{
        document.getElementById('method').className='deletemethod';
    }
}

function displayDanger(){
    var loop = document.getElementById('loop').value;
    if(loop>20){
        document.getElementById('danger_parallel').style.visibility='visible';
    }
    else{
        document.getElementById('danger_parallel').style.visibility='hidden';
    }
}