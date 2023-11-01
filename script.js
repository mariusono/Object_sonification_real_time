//FLAGS:
let doNodeJS = true;
let doROS = !doNodeJS;
let useVideos = false;

let flagUseSynthLoop = true;
let flagUseSampleLoop = false;

let flagSonifyObstacles  = true;
let flagSonifyWalls  = true;

// Limit distances
let wallLimitDistance = 1.0;
// setWall_Limit_Dist(2000); // this is equiv to 1.0..
setWall_Limit_Dist(10000); // this is equiv to max distance
let obstacleLimitDistance = 1.5;
// setObstacle_Limit_Dist(2858); // this is equiv to 1.5..
setObstacle_Limit_Dist(10000); // this is equiv to max distance

// Exp mapping factors
let expMappingFactor_playbackRate = 8;
// setExpMapFactor_PlaybackRate(5330); // this is equiv to 8..
setExpMapFactor_PlaybackRate(0); // this is equiv to min value
let expMappingFactor_harmonicity = 8;
// setExpMapFactor_Harmonicity(5330); // this is equiv to 8..
setExpMapFactor_Harmonicity(0); // this is equiv to min value

const button_3 = document.getElementById("button_3");
button_3.addEventListener("click", async () => {
    WebSocketCallback();
});

function clickButtonAfterDelay() {
    // setTimeout(function () {
    //     button_1.click();
    // }, 1000); // 1000 milliseconds = 1 second
    // setTimeout(function () {
    //     button_3.click();
    // }, 2000); // 1000 milliseconds = 1 second
}

// // Attach the function to the window's load event
window.onload = clickButtonAfterDelay;

// let wallLimitDistance = 400;
// let obstacleLimitDistance = 400;

// document objects
const boxVideos = document.getElementById('videos');
const video_rgb = document.createElement('video');
const video_map2d = document.createElement('video');

const span_human = document.createElement('span');
const span_walls = document.createElement('span');

const img_rgb = document.createElement('img');
const img_map2d = document.createElement('img');
const img_walls = document.createElement('img');

const checkbox_real_time = document.getElementById("checkbox_real_time");


checkbox_real_time.addEventListener("change", () => {
    doNodeJS = !doNodeJS;
    doROS = !doNodeJS;
    console.log(doNodeJS);
});


function setObstacle_Limit_Dist(v) {
    obstacleLimitDistance = linearMapping(0.5, 4, 0, 10000, v); // db linear Scale
    document.getElementById('ObstLimitDist').innerText = parseFloat(obstacleLimitDistance).toFixed(4);
}

function setWall_Limit_Dist(v) {
    wallLimitDistance = linearMapping(0.5, 3, 0, 10000, v); // db linear Scale
    document.getElementById('WallLimitDist').innerText = parseFloat(wallLimitDistance).toFixed(4);
}

function setExpMapFactor_PlaybackRate(v) {
    expMappingFactor_playbackRate = linearMapping(0.01, 15.0, 0, 10000, v); // db linear Scale
    document.getElementById('ExpMapFact_Obstacle').innerText = parseFloat(expMappingFactor_playbackRate).toFixed(4);
}


function setExpMapFactor_Harmonicity(v) {
    expMappingFactor_harmonicity = linearMapping(0.01, 15.0, 0, 10000, v); // db linear Scale
    document.getElementById('ExpMapFact_Wall').innerText = parseFloat(expMappingFactor_harmonicity).toFixed(4);
}


if (doNodeJS) {
    if (useVideos){
        video_rgb.src = './data_5_ott/rviz-2023-10-05_16.05.29.mp4#t=5,200';
        // video_rgb.src = './data_5_ott/rviz-2023-10-05_16.05.29.mp4';
        video_rgb.id = 'videoPlayer_rgb';
        video_rgb.controls = true;
        video_rgb.muted = false;
        video_rgb.height = 400; // in px
        // video_rgb.width = 640; // in px

        // video_map2d.src = './1_corridoioAltair_smoothMap2d/videos/map2d.mp4#t=7';
        // // video_map2d.src = './bagchair2_outputs/map2d.mp4'
        // video_map2d.id = 'videoPlayer_map2d';
        // video_map2d.controls = true;
        // video_map2d.muted = false;
        // video_map2d.height = 400; // in px
        // // video_map2d.width = 640; // in px

        boxVideos.appendChild(video_rgb);
        // boxVideos.appendChild(video_map2d);
    }else{
        img_rgb.id = 'img_rgb';
        img_rgb.style = 'height:400px; object-fit:contain';
        img_rgb.src = "";
    
        img_map2d.id = 'img_map2d';
        img_map2d.style = 'height:400px; object-fit:contain';
        img_map2d.src = "";
    
        img_walls.id = 'img_walls';
        img_walls.style = 'height:400px; object-fit:contain';
        img_walls.src = "";
    
        boxVideos.appendChild(img_rgb);
        boxVideos.appendChild(img_rgb);
        boxVideos.appendChild(img_walls);
    }
}
else {

    img_rgb.id = 'img_rgb';
    img_rgb.style = 'height:400px; object-fit:contain';
    img_rgb.src = "";

    img_map2d.id = 'img_map2d';
    img_map2d.style = 'height:400px; object-fit:contain';
    img_map2d.src = "";

    img_walls.id = 'img_walls';
    img_walls.style = 'height:400px; object-fit:contain';
    img_walls.src = "";

    boxVideos.appendChild(img_rgb);
    boxVideos.appendChild(img_rgb);
    boxVideos.appendChild(img_walls);
}



// Prep doSonification 
var last_ts = 0;
let currentTimeStamp = 0;
var timest_msec_offset = -1;
let unique_ids_playing = [];


// let maxDistance_comp = 0;
// let minDistance_comp = 100;

// possible notes for the sonifications (in Hz). will be selected randomly upon instantiation
const baseNotePossibilities = [392,440]
const baseNotePossibilities_drone = [55, 75, 110,155.56,196]

// // possible samples:
// let audioSamples_array = ["glass_1.wav",
//                           "glass_2.wav",
//                           "glass_3.wav",
//                           "knock.wav",
//                           "drone.wav",
//                           "violin_1.wav"];
// possible samples:
let audioSamples_array = ["glass_1.wav",
                          "glass_3.wav",
                          "knock.wav"];                          

// samples url:
let urlName = "https://mariusono.github.io/Vis-a-Vis/audio_files/";


// const baseNotePossibilities = [43.65,49,55,61.74,77.78,98,110,155.56,185,196,220,311.13,392,440]
// const baseNotePossibilities = [110,155.56,185,196,220,311.13,392,440]
// const baseNotePossibilities_drone = [55,110,155.56,196,220]

function doSonification(received_msg) {

    // console.log(received_msg);

    var JsonString = JSON.parse(received_msg);

    // console.log(JsonString);

    let JsonString_keys = Object.keys(JsonString);

    let unique_ids_current = new Array(JsonString_keys.length).fill('init');
    for (var iKeys = 0; iKeys < JsonString_keys.length; iKeys++) {
        unique_ids_current[iKeys] = JsonString[JsonString_keys[iKeys]]['unique_id'];
    }

    let diff = unique_ids_playing.filter(x => !unique_ids_current.includes(x));


    // console.log('unique_ids_current = ' + unique_ids_current);
    // console.log('unique_ids_playing = ' + unique_ids_playing);
    // // console.log(sonifiedObjects);

    // console.log('diff is ' + diff);

    // Stop sonified objects that are playing but are not in current frame
    for (var iDiff = 0; iDiff < diff.length; iDiff++) {
        let index = unique_ids_playing.indexOf(diff[iDiff]);

        // Just set the playing flag to false
        sonifiedObjects[unique_ids_playing[index]].playingFlag = false;
        console.log('HERE!');

        // remove "playing" unique ids that are not in current frame
        unique_ids_playing.splice(index, 1);
    }

    // loop over objects detected in current json frame
    for (var iKeys = 0; iKeys < JsonString_keys.length; iKeys++) {
        let unique_id = JsonString[JsonString_keys[iKeys]]['unique_id'];
        let type_obj = JsonString[JsonString_keys[iKeys]]['type'];
        let timestamp = JsonString[JsonString_keys[iKeys]]['ros_timestamp'];

        // console.log(timestamp);

        if (!unique_ids_playing.includes(unique_id)) { // if current unique Id is not in already playing unique ids 

            unique_ids_playing.push(unique_id); // adding it..

            if (type_obj.includes('wall')) {
                let randomNoteIdx_drone = Math.floor(0 + Math.random() * (baseNotePossibilities_drone.length - 0));
                let baseNoteFreq = baseNotePossibilities_drone[randomNoteIdx_drone];

                if (!sonifiedObjects.hasOwnProperty(unique_id)) { // only create a new sonification if it hasn't already been created
                    sonifiedObjects[unique_id] = new droneSonification(7, baseNoteFreq, "triangle", 1); 
                }

                // connect the panner of the sonified Object to the freereverb (last in chain before audio out)
                sonifiedObjects[unique_id].freeverb.connect(gainNode);
            }
            else if (type_obj.includes('obstacle')) {
                if (flagUseSynthLoop){
                    let randomNoteIdx = Math.floor(0 + Math.random() * (baseNotePossibilities.length - 0));
                    let baseNote = baseNotePossibilities[randomNoteIdx];
                    let notePattern = [baseNote]; 

                    // console.log('NOTE IS + ', notePattern);

                    if (!sonifiedObjects.hasOwnProperty(unique_id)) { // only create a new sonification if it hasn't already been created
                        sonifiedObjects[unique_id] = new synthLoopSonification("sawtooth", notePattern, 0); 
                    }
                    sonifiedObjects[unique_id].freeverb.connect(gainNode);
                }
                else if (flagUseSampleLoop){

                    // Add random sample selection !!!  
                    // let fileName = "glass_3.wav";

                    let randomNoteIdx_sample = Math.floor(0 + Math.random() * (audioSamples_array.length - 0));
                    let fileName = audioSamples_array[randomNoteIdx_sample];
                    // let fileName = "glass_1.wav";
                    // let urlName = "https://mariusono.github.io/Vis-a-Vis/audio_files/";
                    let noteVal = 440;
                    // console.log(Tone.Transport.bpm.value);
                    let interval_sound = Tone.Time('16n').toSeconds();

                    if (!sonifiedObjects.hasOwnProperty(unique_id)) { // only create a new sonification if it hasn't already been created
                        sonifiedObjects[unique_id] = new samplerLoopSonification(fileName,urlName, noteVal, interval_sound);
                    }
                    sonifiedObjects[unique_id].freeverb.connect(gainNode);
                }
            }

            // setting the playing flag to true for this unique id..  why here ? 
            sonifiedObjects[unique_id].playingFlag = true;
            console.log('HERE! SETTING FLAG TO TRUE');
        }

        // // setting the playing flag to true for this unique id.. why here ? 
        // sonifiedObjects[unique_id].playingFlag = true;

        // UPDATE PANNERS 
        let T_map_cam_mat = JSON.parse(JsonString[JsonString_keys[iKeys]]['T_map_cam']);
        let center_3d_sel = [0, 0, 0];
        if (sonifiedObjects[unique_id] instanceof synthLoopSonification) {
            // center_3d_sel = JSON.parse(JsonString[JsonString_keys[iKeys]]['center_3d']);
            center_3d_sel = JSON.parse(JsonString[JsonString_keys[iKeys]]['center_3d']); // taking the center 3d point from the cluster insteat of the center point
        }
        else if (sonifiedObjects[unique_id] instanceof droneSonification) {
            center_3d_sel = JSON.parse(JsonString[JsonString_keys[iKeys]]['nearest_3d']);
        }
        else if (sonifiedObjects[unique_id] instanceof samplerLoopSonification) {
            // center_3d_sel = JSON.parse(JsonString[JsonString_keys[iKeys]]['nearest_3d']); // should I take the center_3d instead ?? 
            center_3d_sel = JSON.parse(JsonString[JsonString_keys[iKeys]]['center_3d']); // should I take the center_3d instead ?? 
        }

        center_3d_sel.push(1); // in the Python script, I forgot to add the 1 at the end .. 

        // let center_reshuffle = [0,0,0,1];
        // center_reshuffle[0] = center_3d_sel[0];
        // center_reshuffle[1] = center_3d_sel[2];
        // center_reshuffle[2] = -center_3d_sel[1];
        // center_3d_sel = center_reshuffle;

        let center_3d_new = [0, 0, 0]; // just initializing a list of new coordinates. 

        // IMPORTANT ! NEEDS TO BE INVERTED.. 
        T_map_cam_mat = math.inv(T_map_cam_mat);

        // Applying the rotation from map to camera ! 
        center_3d_new[0] = T_map_cam_mat[0][0] * center_3d_sel[0] + T_map_cam_mat[0][1] * center_3d_sel[1] + T_map_cam_mat[0][2] * center_3d_sel[2] + T_map_cam_mat[0][3] * center_3d_sel[3];
        center_3d_new[1] = T_map_cam_mat[1][0] * center_3d_sel[0] + T_map_cam_mat[1][1] * center_3d_sel[1] + T_map_cam_mat[1][2] * center_3d_sel[2] + T_map_cam_mat[1][3] * center_3d_sel[3];
        center_3d_new[2] = T_map_cam_mat[2][0] * center_3d_sel[0] + T_map_cam_mat[2][1] * center_3d_sel[1] + T_map_cam_mat[2][2] * center_3d_sel[2] + T_map_cam_mat[2][3] * center_3d_sel[3];

        // IMPORTANT ! RIGHT HANDED COORD SYSTEM !! SEE https://developer.mozilla.org/en-US/docs/Web/API/PannerNode
        center_3d_new[2] = -center_3d_new[2]; 


        // Computing the distance to the new point
        let distance_comp = Math.sqrt(center_3d_new[0] * center_3d_new[0] + center_3d_new[1] * center_3d_new[1] + center_3d_new[2] * center_3d_new[2]);
        sonifiedObjects[unique_id].distance = distance_comp; // not really needed.. 
        


        // do tha actual update of the panner
        // sonifiedObjects[unique_id].panner.setPosition(center_3d_new[0], center_3d_new[1], center_3d_new[2]);
        sonifiedObjects[unique_id].panner.setPosition(center_3d_new[0], center_3d_new[1], center_3d_new[2]);

        // update the panning 3d point of the sonified object - for debugging purposes
        // sonifiedObjects[unique_id].panning_3d_point = [center_3d_new[0], center_3d_new[1], center_3d_new[2]];
        sonifiedObjects[unique_id].panning_3d_point = [center_3d_new[0], center_3d_new[1], center_3d_new[2]];

        // // if (sonifiedObjects[unique_id] instanceof samplerLoopSonification) {
        // if (sonifiedObjects[unique_id] instanceof droneSonification && type_obj.includes('wall-back')) {
        //     console.log(sonifiedObjects[unique_id].distance);
        //     console.log(sonifiedObjects[unique_id].panning_3d_point);
        // }

        // console.log(type_obj + ' ' + distance_comp);


        if (sonifiedObjects[unique_id] instanceof synthLoopSonification) {
            // update playback rate!         
            sonifiedObjects[unique_id].expMappingFactor_playbackRate = expMappingFactor_playbackRate;   
            sonifiedObjects[unique_id].setPlaybackRate(distance_comp, [0.01, obstacleLimitDistance]); // mapInterval is [lowerBound, upperBound]
            sonifiedObjects[unique_id].setRoomSize(distance_comp, [0.5, 1.5]); // input distance.. 

            // sonifiedObjects[unique_id].playingFlag = false;
            // console.log("synth object distance is: " + distance_comp);

            if (flagSonifyObstacles){
                if (distance_comp > obstacleLimitDistance){ // just some very large value here but this can be a failsafe thing about the radius of the human workspace.. 
                    sonifiedObjects[unique_id].playingFlag = false;
                    console.log('HERE!');
                }
                else if (distance_comp <= obstacleLimitDistance && unique_ids_current.includes(unique_id)){
                    sonifiedObjects[unique_id].playingFlag = true;
                }                
            }else{
                sonifiedObjects[unique_id].playingFlag = false;
            }
            // IDEA ! ADD DISTANCE TO OBJECT ALSO AS A VARIABLE INSIDE THE CLASSES !!

        }
        else if (sonifiedObjects[unique_id] instanceof droneSonification) {

            // sonifiedObjects[unique_id].playingFlag = false;

            // update harmonicity.. 
            sonifiedObjects[unique_id].expMappingFactor_harmonicity = expMappingFactor_harmonicity;   
            sonifiedObjects[unique_id].setHarmonicity(distance_comp, [0.2, wallLimitDistance]);
            sonifiedObjects[unique_id].setRoomSize(distance_comp, [0.3, 1.0]);

            if (flagSonifyWalls){
                if (distance_comp > wallLimitDistance) { // Only play the object if the distance to it is smaller than 2.0 !! this number can be changed.. 
                    sonifiedObjects[unique_id].playingFlag = false;
                    // console.log('HERE!');
                }
                else if (distance_comp <= wallLimitDistance && unique_ids_current.includes(unique_id)){
                    sonifiedObjects[unique_id].playingFlag = true;
                }
            }else{
                sonifiedObjects[unique_id].playingFlag = false;
                // console.log('HERE!');
            }

            // // HARDCODED STOP OF SONIFICATION OF CERTAIN WALLS.. FOR DEBUG!
            // if (type_obj.includes('wall-right') || type_obj.includes('wall-front') || type_obj.includes('wall-left')){
            //     sonifiedObjects[unique_id].playingFlag = false;
            // }
        }
        else if (sonifiedObjects[unique_id] instanceof samplerLoopSonification) {

            // console.log(center_3d_sel);

            // update playback rate.. 
            sonifiedObjects[unique_id].expMappingFactor_playbackRate = expMappingFactor_playbackRate;   
            sonifiedObjects[unique_id].setPlaybackRate(distance_comp, [0.01, obstacleLimitDistance]); // mapInterval is [lowerBound, upperBound]
            sonifiedObjects[unique_id].setRoomSize(distance_comp, [1.0, 2.0]);

            // console.log("sampler object distance is: " + distance_comp);

            // Check the biggerst and smallest distance to obstacles.. for calibration
            // if (distance_comp > maxDistance_comp) maxDistance_comp = distance_comp;
            // if (distance_comp < minDistance_comp) minDistance_comp = distance_comp;
            // console.log("sampler object max distance is: " + maxDistance_comp);
            // console.log("sampler object min distance is: " + minDistance_comp);

            if (flagSonifyObstacles){
                // if (distance_comp > 2.0) { // Only play the object if the distance to it is smaller than 2.0 !! this number can be changed.. 
                if (distance_comp > obstacleLimitDistance){ // just some very large value here but this can be a failsafe thing about the radius of the human workspace.. 
                    sonifiedObjects[unique_id].playingFlag = false;
                }
                else if (distance_comp <= obstacleLimitDistance && unique_ids_current.includes(unique_id)){
                    sonifiedObjects[unique_id].playingFlag = true;
                }  
            }else{
                sonifiedObjects[unique_id].playingFlag = false;
            }
        }
    }
}

// The callback carried out when the websocket is connected ! 
function WebSocketCallback() {

    if (doNodeJS) {
        video_rgb.play();
        // video_map2d.play();

        var port = 9090;

        var ws = new WebSocket("ws://localhost:" + port + "/echo");

        ws.onmessage = function (evt) {
            if (typeof evt.data === 'string'){
                let received_msg = evt.data;
                // console.log(received_msg);

                // SONIFICATION BASED ON EACH HUMAN_WORKSPACE.JSON FILE! 
                doSonification(received_msg);

                var JsonString = JSON.parse(received_msg);
                let JsonString_keys = Object.keys(JsonString);

                span_human_html = "<h2><i>Human workspace info:</i></h2>"; // init html string
                for (var iKeys = 0; iKeys < JsonString_keys.length; iKeys++) {
                    span_human_html+="<b>unique_id: </b>"+JsonString[JsonString_keys[iKeys]]['unique_id']
                                    +"</br> <b>timestamp: </b>"+JsonString[JsonString_keys[iKeys]]['ros_timestamp']
                                    +"</br> <b>center_3d: </b>"+JsonString[JsonString_keys[iKeys]]['center_3d']
                                    +"</br> <b>nearest_3d: </b>"+JsonString[JsonString_keys[iKeys]]['nearest_3d']
                                    +"</br> <b>T_map_cam: </b>"+JsonString[JsonString_keys[iKeys]]['T_map_cam']
                                    +"</br> <b>type: </b>"+JsonString[JsonString_keys[iKeys]]['type']+"</br></br>";
                }       
                document.getElementById("span_human").innerHTML = span_human_html; // print on html

            }else if ((evt.data instanceof Blob) && (!useVideos)) {

                // Handle the received binary data (e.g., .png image)
                var imageURL = URL.createObjectURL(evt.data);
                document.getElementById('img_rgb').src = imageURL;

                // document.body.appendChild(img);
            }

        }

        ws.onclose = function () {

            // websocket is closed.
            alert("Connection is closed...");
        };
    }
    else if (doROS) {
        var ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' });

        ros.on('connection', function () {
            console.log('Connected to websocket server.');
        });

        ros.on('error', function (error) {
            console.log('Error connecting to websocket server: ', error);
        });

        ros.on('close', function () {
            console.log('Connection to websocket server closed.');
        });

        // Subscribing to json ROS Topics
        var json_human_workspace_sub = new ROSLIB.Topic({ ros: ros, name: '/out/json_human_workspace', messageType: 'std_msgs/String' });

        json_human_workspace_sub.subscribe(
            function (message) {
                console.log('Received humanws message:' + message.data);
                json_human_workspace_sub.subscribe(function (message) { 
                    doSonification(message.data); // message.data is same as received_msg in the offline mode (nodeJS flag true)

                    let JsonString = JSON.parse(message.data);
                    let JsonString_keys = Object.keys(JsonString);
                    span_human_html = "<h2><i>Human workspace info:</i></h2>"; // init html string
                    for (var iKeys = 0; iKeys < JsonString_keys.length; iKeys++) {
                        span_human_html+="<b>unique_id: </b>"+JsonString[JsonString_keys[iKeys]]['unique_id']
                            +"</br> <b>timestamp: </b>"+JsonString[JsonString_keys[iKeys]]['ros_timestamp']
                            +"</br> <b>center_3d: </b>"+JsonString[JsonString_keys[iKeys]]['center_3d']
                            +"</br> <b>nearest_3d: </b>"+JsonString[JsonString_keys[iKeys]]['nearest_3d']
                            +"</br> <b>T_map_cam: </b>"+JsonString[JsonString_keys[iKeys]]['T_map_cam']
                            +"</br> <b>type: </b>"+JsonString[JsonString_keys[iKeys]]['type']+"</br></br>";
                    }       
                    document.getElementById("span_human").innerHTML = span_human_html; // print on html
                })
            }
        );

        var json_walls_equations_sub = new ROSLIB.Topic({ ros: ros, name: '/out/json_walls_equations', messageType: 'std_msgs/String' });
        json_walls_equations_sub.subscribe(function (message) {
            // console.log(message.data)
            var JsonString = JSON.parse(message.data);
            let JsonString_keys = Object.keys(JsonString);

            span_walls_html = "<h2><i>Wall detection info:</i></h2>"; // init html string
            for (var iKeys = 0; iKeys < JsonString_keys.length; iKeys++) {
                span_walls_html += "<b>wall_type: </b>" + JsonString[JsonString_keys[iKeys]]['wall_type']
                    + "</br> <b>equation: </b>" + JsonString[JsonString_keys[iKeys]]['a'] + "x + " + JsonString[JsonString_keys[iKeys]]['b'] + "y + " + JsonString[JsonString_keys[iKeys]]['c'] + "z + " + JsonString[JsonString_keys[iKeys]]['d'] + " = 0"
                    + "</br> <b>shortest_distance: </b>" + JsonString[JsonString_keys[iKeys]]['shortest_distance']
                    + "</br> <b>num_points: </b>" + JsonString[JsonString_keys[iKeys]]['num_points']
                    + "</br> <b>plane_center_x: </b>" + JsonString[JsonString_keys[iKeys]]['plane_center_x']
                    + "</br> <b>plane_center_y: </b>" + JsonString[JsonString_keys[iKeys]]['plane_center_y']
                    + "</br> <b>plane_center_z: </b>" + JsonString[JsonString_keys[iKeys]]['plane_center_z'] + "</br></br>";
            }
            document.getElementById("span_walls").innerHTML = span_walls_html; // print on html
        });

        // Reference: https://roboticsknowledgebase.com/wiki/tools/roslibjs/
        // rosrun image_transport republish raw in:=camera/rgb/image_rect_color out:=camera/rgb
        var img_rgb_sub = new ROSLIB.Topic({ ros: ros, name: '/camera/rgb/compressed', messageType: 'sensor_msgs/CompressedImage' });
        img_rgb_sub.subscribe(function (message) {
            document.getElementById('img_rgb').src = "data:image/jpg;base64," + message.data;
        });

        // // rosrun image_transport republish raw in:=out/map2d_img1 out:=out/map2d
        // var img_map2d_sub = new ROSLIB.Topic({ ros: ros, name: '/out/map2d/compressed', messageType: 'sensor_msgs/CompressedImage' });
        // img_map2d_sub.subscribe(function (message) {
        //     document.getElementById('img_map2d').src = "data:image/jpg;base64," + message.data;
        // });

        // // rosrun image_transport republish raw in:=out/walls_img out:=out/walls
        // var img_map2d_sub = new ROSLIB.Topic({ ros: ros, name: '/out/walls/compressed', messageType: 'sensor_msgs/CompressedImage' });
        // img_map2d_sub.subscribe(function (message) {
        //     document.getElementById('img_walls').src = "data:image/jpg;base64," + message.data;
        // });
    }
}







