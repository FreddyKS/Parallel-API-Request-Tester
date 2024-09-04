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

    //Loading starts
    var display_loading = 'Fetching ' + parseInt(loop)*parseInt(url_list.length) + ' request';
    document.getElementById('complete').innerHTML=display_loading;
    document.getElementById('loading').style.visibility='visible';
    
    const urls = [];
    if(!loop){
        loop='1';
    }
    if(!url_list){
        return 'API List cannot be empty';
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
            document.getElementById('complete').innerHTML='✔';
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
            document.getElementById('complete').innerHTML='✔';
            document.getElementById('loading').style.visibility='hidden';


            //Re enable the button
            document.getElementById('print').disabled = false;
        }

    } catch (error) {
        console.error('Error with fetching:', error);
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