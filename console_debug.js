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


// DEBUGGING JSONS..

let center_3d_sel = [0.00138032,0.72872186,0.69860077];
center_3d_sel.push(1);
let T_map_cam_str = '[[0.99928750,0.00000028,-0.03774234,0.91324190],[0.03774234,-0.00000026,0.99928750,-1.00883230],[0.00000027,-1.00000000,-0.00000027,1.50500075],[0.00000000,0.00000000,0.00000000,1.00000000]]';
let T_map_cam_mat = JSON.parse(T_map_cam_str);

let center_3d_new = [0, 0, 0]; // just initializing a list of new coordinates. 

// Applying the rotation from map to camera ! 
center_3d_new[0] = T_map_cam_mat[0][0] * center_3d_sel[0] + T_map_cam_mat[0][1] * center_3d_sel[1] + T_map_cam_mat[0][2] * center_3d_sel[2] + T_map_cam_mat[0][3] * center_3d_sel[3];
center_3d_new[1] = T_map_cam_mat[1][0] * center_3d_sel[0] + T_map_cam_mat[1][1] * center_3d_sel[1] + T_map_cam_mat[1][2] * center_3d_sel[2] + T_map_cam_mat[1][3] * center_3d_sel[3];
center_3d_new[2] = T_map_cam_mat[2][0] * center_3d_sel[0] + T_map_cam_mat[2][1] * center_3d_sel[1] + T_map_cam_mat[2][2] * center_3d_sel[2] + T_map_cam_mat[2][3] * center_3d_sel[3];

console.log(center_3d_new);


center_3d_sel = [0.00304624,0.73114747,0.70368868];
center_3d_sel.push(1);
T_map_cam_str = '[[-0.99845860,-0.00000025,-0.05550164,-1.00898206],[0.05550164,0.00000028,-0.99845860,-0.82325448],[0.00000027,-1.00000000,-0.00000027,1.50499998],[0.00000000,0.00000000,0.00000000,1.00000000]]';
T_map_cam_mat = JSON.parse(T_map_cam_str);

let center_3d_new = [0, 0, 0]; // just initializing a list of new coordinates. 

// Applying the rotation from map to camera ! 
center_3d_new[0] = T_map_cam_mat[0][0] * center_3d_sel[0] + T_map_cam_mat[0][1] * center_3d_sel[1] + T_map_cam_mat[0][2] * center_3d_sel[2] + T_map_cam_mat[0][3] * center_3d_sel[3];
center_3d_new[1] = T_map_cam_mat[1][0] * center_3d_sel[0] + T_map_cam_mat[1][1] * center_3d_sel[1] + T_map_cam_mat[1][2] * center_3d_sel[2] + T_map_cam_mat[1][3] * center_3d_sel[3];
center_3d_new[2] = T_map_cam_mat[2][0] * center_3d_sel[0] + T_map_cam_mat[2][1] * center_3d_sel[1] + T_map_cam_mat[2][2] * center_3d_sel[2] + T_map_cam_mat[2][3] * center_3d_sel[3];

console.log(center_3d_new);



center_3d_sel = [0.00304624,0.73114747,0.70368868]
center_3d_sel.push(1);
T_map_cam_str = '[[-0.99845860,-0.00000025,-0.05550164,-1.01761837],[0.05550164,0.00000028,-0.99845860,-0.97861937],[0.00000027,-1.00000000,-0.00000027,1.50500044],[0.00000000,0.00000000,0.00000000,1.00000000]]';
T_map_cam_mat = JSON.parse(T_map_cam_str);

let center_3d_new = [0, 0, 0]; // just initializing a list of new coordinates. 

// Applying the rotation from map to camera ! 
center_3d_new[0] = T_map_cam_mat[0][0] * center_3d_sel[0] + T_map_cam_mat[0][1] * center_3d_sel[1] + T_map_cam_mat[0][2] * center_3d_sel[2] + T_map_cam_mat[0][3] * center_3d_sel[3];
center_3d_new[1] = T_map_cam_mat[1][0] * center_3d_sel[0] + T_map_cam_mat[1][1] * center_3d_sel[1] + T_map_cam_mat[1][2] * center_3d_sel[2] + T_map_cam_mat[1][3] * center_3d_sel[3];
center_3d_new[2] = T_map_cam_mat[2][0] * center_3d_sel[0] + T_map_cam_mat[2][1] * center_3d_sel[1] + T_map_cam_mat[2][2] * center_3d_sel[2] + T_map_cam_mat[2][3] * center_3d_sel[3];

console.log(center_3d_new);
