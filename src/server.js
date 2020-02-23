const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const route = express();

const port = process.env.PORT || 8080;

route.use(bodyParser.urlencoded({extended: true}));
route.use(bodyParser.json())
route.use(express.static(path.join(__dirname, "public")));


/**
 * 1) Receive GET request from CLIENT
 * 2) Read data from JSON file
 * 3) If NOT error, send data to a CLIENT
 * 4) If error, send error response
 */

route.get('/list', function(request, response) {
    fs.readFile('./src/models/tasks.json', 'utf-8', function(err, data){
        if(!err){
            const obj = JSON.parse(data)
            return response.send(obj);
        } else {
            return response.send({error: `Reading file error ${err}`});
        }
    })
})


/**
 * 1) Receive POST request with an object inside body from CLIENT
 * 2) Read data from JSON file
 * 3) If NOT error:
 *      3.1) Create key argument ID, genearate value and assign it to a key
 *      3.2) Update file object with a new object
 *      3.3) Stringify file object and send JSON object to a CLIENT
 *      3.4) Update JSON file with new JSON object
 * 4) If error, send error response
 */

route.post('/item', function(request, response) {
    fs.readFile('./src/models/tasks.json', 'utf-8', function(err, data){
        if (!err) {
            const obj = JSON.parse(data)
            console.log(`Post item: ${request.body.title}`);
            
            obj.push(Object.assign({}, request.body, {id: Date.now() + obj.length}));
            const json = JSON.stringify(obj);
            
            fs.writeFile('./src/models/tasks.json', json, 'utf-8', (err) => {
                if (err) {
                    console.log({error: `Writing file error ${err}`});
                } else {
                    console.log('Writing file success');
                }
            });
            return response.send(json);
        } else {
            return response.send({error: `Reading file error ${err}`});
        }
    })
})

/**
 * 1) Receive DELETE request with an ID inside params from CLIENT
 * 2) Read data from JSON file
 * 3) If NOT error:
 *      3.1) Find item index by id
 *      3.2) Remove item from file object by index
 *      3.3) Stringify file object and send JSON object to a CLIENT
 *      3.4) Update JSON file with new JSON object
 * 4) If error, send error response
 */

route.delete('/item/:id', function(request, response) {
    fs.readFile('./src/models/tasks.json', 'utf-8', function(err, data){
        if (!err) {
            const obj = JSON.parse(data)
            console.log(`Delete item: ${request.params.id}`);
            
            const indexToDelte = obj.findIndex((item) => item.id === parseInt(request.params.id));
            obj.splice(indexToDelte, 1);
            const json = JSON.stringify(obj);

            fs.writeFile('./src/models/tasks.json', json, 'utf-8', (err) => {
                if (err) {
                    console.log({error: `Writing file error ${err}`});
                } else {
                    console.log('Writing file success');
                }
            });
            return response.send(json);
        } else {
            return response.send({error: `Reading file error ${err}`});
        }
    })
})

route.listen(port, function(){
    console.log(`Express server listening on port ${port}`);
});
