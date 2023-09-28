//-------------------------------------------------------------------
// UTILS FUNCTIONS:

function findLastSmallerValueIndex(B, a) {
    let lastIndex = 0;

    for (let i = 0; i < B.length; i++) {
        if (B[i] <= a) {
            lastIndex = i;
        }
    }

    return lastIndex;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//-------------------------------------------------------------------

// FLAGS
let sendFrame_Data = true;

// Get some libraries.. 
const fs = require('fs');
const path = require('path')

// PATH WHERE I HAVE MY DATA FILES
// const DatasetPath = './1_corridoioAltair_smoothMap2d/jsons/human_workspace_jsons'

const DatasetPath = './data_27_sett/jsons/human_workspace_jsons'
const DatasetPath_frames = './data_27_sett/images/rgb'

// import websocket.server library
WebSocketServer = require('ws').Server;

// define port value
var port = 9090;

// open up websocketserver at port
wss = new WebSocketServer({ port: port });

// just state what port u are listening to
console.log('listening on port: ' + port);

async function readAndSendData(websocket) {

    const jsonsInDir = fs.readdirSync(DatasetPath).filter(file => path.extname(file) === '.json');
    jsonsInDir.sort((a, b) => Number(a.split('_')[0]) - Number(b.split('_')[0]));

    const pngsInDir = fs.readdirSync(DatasetPath_frames).filter(file => path.extname(file) === '.png');
    pngsInDir.sort((a, b) => Number(a.split('_')[0]) - Number(b.split('_')[0]));
    console.log(pngsInDir);


    console.log(jsonsInDir)

    var last_ts = 0.0;
    var event_cnt = 0;

    let frames_ts_msec_array = [];
    for (let frame of pngsInDir) {
        let timestamp = Number(frame.split('_')[1].split('.png')[0]);
        let ts_msec = parseInt(timestamp * 1000); //time stamp is given in seconds
        frames_ts_msec_array.push(ts_msec);
    }

    for (let file of jsonsInDir) {
        const fileData = fs.readFileSync(path.join(DatasetPath, file));
        const JsonString = JSON.parse(fileData.toString());
        let JsonString_keys = Object.keys(JsonString);

        console.log(JsonString);

        const ts = parseFloat(JsonString[JsonString_keys[0]].ros_timestamp);

        console.log('Json file: ' + file);

        console.log('Time Stamp: ' + ts + ' of type: ' + typeof (ts));

        var ts_msec = parseInt(ts * 1000); //time stamp is given in seconds
        let indexFrame_for_plot = findLastSmallerValueIndex(frames_ts_msec_array,ts_msec);
        // indexFrame_for_plot = event_cnt;
        // indexFrame_for_plot = Math.floor(Math.random() * (frames_ts_msec_array.length-1 - 0 + 1)) + 0;
        let binaryFilePath = path.join(DatasetPath_frames, pngsInDir[indexFrame_for_plot]);
        console.log(binaryFilePath);
        const date = new Date(ts_msec); //ts*0.000001 

        const datevalues = [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        ];

        const elapsed_msec = (ts_msec - last_ts) //(ts-last_ts)*0.000001;

        last_ts = ts_msec;
        // console.log('Decoded: seconds - '+ date.getSeconds() + ', msec - '+date.getMilliseconds()+', msec to wait - '+elapsed_msec);

        if (event_cnt > 0) { // only start waiting after receiving the second file..
            await sleep(Math.round(elapsed_msec));
            // await sleep(Math.round(3000));
        }

        console.log('Ros Timestamp: %d, converted to time %s, elapsed msec %d ', ts, datevalues, elapsed_msec);

        message = JSON.stringify(JsonString);
        websocket.send(message);

        if (sendFrame_Data){
            // Read the binary file as a Buffer and send it to the websocket
            fs.readFile(binaryFilePath, (err, data) => {
                if (err) {
                    console.error('Error reading binary file:', err);
                    return;
                }

                // Send the binary data as a binary WebSocket message
                websocket.send(data, { binary: true });
            });
        }

        event_cnt += 1;
    }
}




// Websocket event on "connection" !  
wss.on('connection', function connection(ws) {

    ws.on('message', function (message) {
        console.log('message: ' + message);
        ws.send('echo: ' + message);
    });

    console.log('new client connected!');
    ws.send('connected!');

    readAndSendData(ws);
});



