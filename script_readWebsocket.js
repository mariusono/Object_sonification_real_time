// Get some libraries.. 
const fs = require('fs');
const path = require('path')

// PATH WHERE I HAVE MY JSON FILES
const DatasetPath = './1_corridoioAltair_smoothMap2d/jsons/human_workspace_jsons'
// const DatasetPath = './bagchair2_outputs/jsons/human_workspace_jsons'

// import websocket.server library
WebSocketServer = require('ws').Server;

// define port value
var port = 9090;

// open up websocketserver at port
wss = new WebSocketServer({ port: port });

// just state what port u are listening to
console.log('listening on port: ' + port);

// Defining a sleep function 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function readAndSendData(websocket) {

    const jsonsInDir = fs.readdirSync(DatasetPath).filter(file => path.extname(file) === '.json');
    jsonsInDir.sort((a,b)=>Number(a.split('_')[0]) - Number(b.split('_')[0]));
    
    console.log(jsonsInDir)

    var last_ts = 0.0;
    var event_cnt = 0;
    
     for (let file of jsonsInDir) {
        const fileData = fs.readFileSync(path.join(DatasetPath, file));
        const JsonString = JSON.parse(fileData.toString());
        let JsonString_keys = Object.keys(JsonString);


        console.log(JsonString);

        const ts = parseFloat(JsonString[JsonString_keys[0]].ros_timestamp); 

        console.log('Json file: '+file);

        console.log('Time Stamp: '+ts+' of type: '+typeof(ts));

        var ts_msec=parseInt(ts * 1000); //time stamp is given in seconds
        const date = new Date(ts_msec); //ts*0.000001 
        
        const datevalues = [
        date.getFullYear(),
        date.getMonth()+1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
        ];

        const elapsed_msec=(ts_msec-last_ts) //(ts-last_ts)*0.000001;
        
        last_ts = ts_msec;
        // console.log('Decoded: seconds - '+ date.getSeconds() + ', msec - '+date.getMilliseconds()+', msec to wait - '+elapsed_msec);
        
        if(event_cnt>0){ // only start waiting after receiving the second file..
            await sleep(Math.round(elapsed_msec));
            // await sleep(Math.round(3000));
        }

        console.log('Ros Timestamp: %d, converted to time %s, elapsed msec %d ', ts, datevalues, elapsed_msec);
        
        message=JSON.stringify(JsonString);
        websocket.send(message);

        event_cnt+=1;
     }
    }




// Websocket event on "connection" !  
wss.on('connection', function connection(ws) {
   
	ws.on('message', function(message) {
		console.log('message: ' + message);
		ws.send('echo: ' + message);
	});

	console.log('new client connected!');
	ws.send('connected!');

    readAndSendData(ws);
});



