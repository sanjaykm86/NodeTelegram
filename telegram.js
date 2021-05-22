const express = require('express');
const request = require('request')
const fs = require('fs')
const updateJsonFile = require('update-json-file')
const { stringify } = require('querystring')
const cron = require('node-cron')
let currentUpdateId = ""
let latestUpdateId = ""

var app = express()

const token = "1841810592:AAEQPj7L8LJCVFWjpmUUxj2ng_hsxTucxqk"
let chat_id = ""
// let configobj = {
    
//         "updateId" : 0
//     }

const task = cron.schedule('*/10 * * * * *',()=>{
    //reading xml
    fs.readFile('./config.json','utf8',(err,data)=>{
        currentUpdateId = JSON.parse(data).updateId
        console.log("Current Update Id : "+currentUpdateId)
    })
    
    
    //Getting updates event
    request(`https://api.telegram.org/bot${token}/getUpdates?offset=0`,{json:true},(err,res,body)=>{
        if(err)
        {
            return console.log(err)
        }
        else
        {
            //console.log(body)
            let update = body["result"]
            let message = update[update.length-1].message
            let chat_id = message.from.id 
            latestUpdateId = String(update[update.length-1].update_id)
            let firstName = message.from.first_name
            let text = message.text
           // console.log("Latest update id : "+latestUpdateId)
            if(latestUpdateId != currentUpdateId)
            {
            
            request(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=Hello ${firstName} you sent this :  ${text}`,(err,res,body)=>{
                if(err)
                {
                    return console.log(err)
                }
                else
                {
                    //console.log(res)
                }
                
                })
            
            // configobj["updateId"] = latestUpdateId;
            // console.log("Config Object : "+JSON.stringify(configobj.updateId))
            //fs.writeFile()
            updateJsonFile("./config.json",(data) => {
                //let mutatedId = String(latestUpdateId) 
                //console.log("mutated is : "+mutatedId)
                //console.log("LatestUpdateId : "+latestUpdateId)
                data.updateId = latestUpdateId
                //console.log("Updated JSON Update id  : "+data.updateId)
                return data
            })
        }
    }
    })
    
})



const port = process.env.PORT || 5002

var server = app.listen(port,'0.0.0.0', function () {
    console.log(`Server is running at ${port}`);
    task.start();
})


