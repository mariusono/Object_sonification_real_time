let sonifiedObjects_keys = Object.keys(sonifiedObjects);


let playingFlag_array = new Array(sonifiedObjects_keys.length).fill('init');
let distance_array = new Array(sonifiedObjects_keys.length).fill('init');
let type_array = new Array(sonifiedObjects_keys.length).fill('init');
let panning_3d_point_array = new Array(sonifiedObjects_keys.length).fill('init');

for (var iKeys = 0; iKeys < sonifiedObjects_keys.length; iKeys++) {
    playingFlag_array[iKeys] = sonifiedObjects[sonifiedObjects_keys[iKeys]]['playingFlag'];
    distance_array[iKeys] = sonifiedObjects[sonifiedObjects_keys[iKeys]]['distance'];
    panning_3d_point_array[iKeys] = sonifiedObjects[sonifiedObjects_keys[iKeys]]['panning_3d_point'];
    if (sonifiedObjects[sonifiedObjects_keys[iKeys]] instanceof droneSonification)
    {
        type_array[iKeys] = 'wall';
    }
    else{
        type_array[iKeys] = 'obstacle';
    }
}

// set all playing flag to false..
for (var iKeys = 0; iKeys < sonifiedObjects_keys.length; iKeys++) {
    sonifiedObjects[sonifiedObjects_keys[iKeys]]['playingFlag'] = false;
}

// You can now set sonified objects on off by setting the playingFlag to true or false

sonifiedObjects[sonifiedObjects_keys[0]]['playingFlag'] = true;

