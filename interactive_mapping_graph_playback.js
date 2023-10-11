let a = 1;
let rangeIn_bottom = 0;
let rangeIn_top = 1;
let rangeOut_bottom = 0;
let rangeOut_top = 1;

let a_walls = 1;
let rangeIn_bottom_walls = 0;
let rangeIn_top_walls = 1;
let rangeOut_bottom_walls = 0;
let rangeOut_top_walls = 1;

function exponentialMapping(rangeOut_bottom, rangeOut_top, rangeIn_bottom, rangeIn_top, fac, val) {
    // map value between 0 1
    valueMapped = 0.0 + ((1.0 - 0.0) * (val - rangeIn_bottom) / (rangeIn_top - rangeIn_bottom));

    // map to an exponential curve between 0 and 1 with a factor fac
    mapToExp = (Math.exp(valueMapped * fac) - 1) / (Math.exp(fac) - 1);

    // map back to desired output range
    newValue = rangeOut_bottom + ((rangeOut_top - rangeOut_bottom) * (mapToExp - 0) / (1 - 0));

    return newValue;
}

function setup() {
    let canvas = createCanvas(200*1.5, 400*1.5);
    canvas.parent('canvas-container-1');
}


function draw() {
    background(220);

    a = expMappingFactor_playbackRate; // Update 'a' from the slider
    a_walls = expMappingFactor_harmonicity;

    translate(width / 2, height / 2); // Move the origin to the center

    updateRangeIn_Bottom();
    updateRangeIn_Top();
    updateRangeOut_Bottom();
    updateRangeOut_Top();

    updateRangeIn_walls_Bottom();
    updateRangeIn_walls_Top();
    updateRangeOut_walls_Bottom();
    updateRangeOut_walls_Top();

    drawExponentialGraph(a,a_walls);
    drawAxisTicks();
}

function updateRangeIn_Bottom(){
    rangeIn_bottom = 0.01;
}

function updateRangeIn_Top(){
    rangeIn_top = obstacleLimitDistance;
}

function updateRangeOut_Bottom(){
    rangeOut_bottom = 0.5;
}

function updateRangeOut_Top(){
    rangeOut_top = 3;
}


function updateRangeIn_walls_Bottom(){
    rangeIn_bottom_walls = 0.2;
}

function updateRangeIn_walls_Top(){
    rangeIn_top_walls = wallLimitDistance;
}

function updateRangeOut_walls_Bottom(){
    rangeOut_bottom_walls = 1.0;
}

function updateRangeOut_walls_Top(){
    rangeOut_top_walls = 3.0;
}


function drawAxisTicks() {
    stroke(0);
    textAlign(CENTER, TOP);

    // // Draw x-axis tick marks and labels
    // for (let x = rangeIn_bottom; x <= rangeIn_top; x += (rangeIn_top - rangeIn_bottom)/2) {
    //     let tickX = map(x, rangeIn_bottom, rangeIn_top, -width / 2, width / 2);
    //     line(tickX, 5 + height/4, tickX, -5 + height/4); // Tick mark
    //     text(x.toFixed(2), tickX-20, height/4 - 20); // Label
    // }

    // // Draw y-axis tick marks and labels
    // for (let y = rangeOut_bottom; y <= rangeOut_top; y += (rangeOut_top - rangeOut_bottom)/8) {
    //     let tickY = map(y, rangeOut_bottom, rangeOut_top, -height / 2, height / 2);
    //     line(5 - width/2, -tickY , -5 - width/2, -tickY); // Tick mark
    //     text(y.toFixed(1) + 'x', -width/2 + 15, -tickY); // Label
    // }

    stroke('red');
    strokeWeight(4);

    line(-width/2, 0, width/2, 0); // Tick mark
    line(-width/2, -height/2, width/2, -height/2); // Tick mark
    line(-width/2, height/2, width/2, height/2); // Tick mark
    line(-width/2, -height/2, -width/2, height/2); // Tick mark
    line(width/2, -height/2, width/2, height/2); // Tick mark

    stroke('black');
    strokeWeight(1);


    // Draw x-axis tick marks and labels - graph 2
    let count = 0;
    let divisions = 3;
    for (let x = rangeIn_bottom; x < rangeIn_top+ 1; x += (rangeIn_top - rangeIn_bottom)/divisions) {
        let tickX = map(x, rangeIn_top, rangeIn_bottom, -width / 2, width / 2);
        // line(tickX, 5 + height/2, tickX, -5 + height/2); // Tick mark
        // line(-width/2, -height/2,width/2, height/2 ); // Tick mark
        line(tickX, 5, tickX, -5); // Tick mark
        text(x.toFixed(2), tickX+20, - 20); // Label
        if (count == 0){
            text(x.toFixed(2), tickX-20, - 20); // Label
        }
        count++;
    }

    
    // Draw x-axis tick marks and labels
    count = 0;
    divisions = 3;
    for (let x = rangeIn_bottom_walls; x < rangeIn_top_walls + 1; x += (rangeIn_top_walls - rangeIn_bottom_walls)/divisions) {
        // console.log(x);
        let tickX = map(x, rangeIn_top_walls, rangeIn_bottom_walls, -width / 2, width / 2);
        // line(tickX, 5 + height/2, tickX, -5 + height/2); // Tick mark
        // line(-width/2, -height/2,width/2, height/2 ); // Tick mark
        line(tickX, 5 + height/2, tickX, -5 + height/2); // Tick mark
        text(x.toFixed(2), tickX+20, height/2 - 20); // Label
        if (count == 0){
            text(x.toFixed(2), tickX-20, height/2 - 20); // Label
        }
        count++;
    }



    // Draw y-axis tick marks and labels
    for (let y = rangeOut_bottom + (rangeOut_top - rangeOut_bottom)/8; y <= rangeOut_top; y += (rangeOut_top - rangeOut_bottom)/8) {
        let tickY = map(y, rangeOut_bottom, rangeOut_top, 0, height / 2);
        line(5 - width/2, -tickY , -5 - width/2, -tickY); // Tick mark
        text(y.toFixed(1) + 'x', -width/2 + 15, -tickY); // Label
    }  
    
    // Draw y-axis tick marks and labels
    for (let y = rangeOut_bottom_walls; y <= rangeOut_top_walls; y += (rangeOut_top_walls - rangeOut_bottom_walls)/8) {
        let tickY = map(y, rangeOut_bottom_walls, rangeOut_top_walls, -height / 2, 0);
        line(5 - width/2, -tickY , -5 - width/2, -tickY); // Tick mark
        text(y.toFixed(1) + 'x', -width/2 + 15, -tickY); // Label
    }      
}

function drawExponentialGraph(a,a_walls) {
    noFill();
    stroke(0);
    beginShape(POINTS);
    strokeWeight(4);
    // let rangeIn_bottom = 0;
    // let rangeIn_top = 1;
    // let rangeOut_bottom = 0;
    // let rangeOut_top = 1;

    for (let inVal = rangeIn_bottom; inVal < rangeIn_top; inVal += 0.001) {
        let x = inVal;
        let y = exponentialMapping(rangeOut_bottom, rangeOut_top, rangeIn_bottom, rangeIn_top, a, x)

        x = map(x, rangeIn_bottom, rangeIn_top, -width / 2, width / 2);
        y = map(y, rangeOut_bottom, rangeOut_top, -height / 4, height / 4);

        // console.log(x);
        // console.log(y);
        // vertex(x, -y - height / 4); // Invert the y-axis for screen coordinates
        vertex(x, -y - height / 4); // Invert the y-axis for screen coordinates
    }
    endShape();

    beginShape(POINTS);
    strokeWeight(4);
    for (let inVal = rangeIn_bottom_walls; inVal < rangeIn_top_walls; inVal += 0.001) {
        let x = inVal;
        let y = exponentialMapping(rangeOut_bottom_walls, rangeOut_top_walls, rangeIn_bottom_walls, rangeIn_top_walls, a_walls, x)

        x = map(x, rangeIn_bottom_walls, rangeIn_top_walls, -width / 2, width / 2);
        y = map(y, rangeOut_bottom_walls, rangeOut_top_walls, -height / 4, height / 4);

        // console.log(x);
        // console.log(y);
        // vertex(x, -y - height / 4); // Invert the y-axis for screen coordinates
        vertex(x, -y + height / 4); // Invert the y-axis for screen coordinates
    }    
    endShape();

    fill(0);
    noStroke();
    text(`Exp Map Fac Obst. = ${a.toFixed(4)}`, 10, -height / 2 + 20);
    text(`Distance to obstacle mapped to playback rate`, 10, -height / 2 + 40);

    text(`Exp Map Fac Walls = ${a_walls.toFixed(4)}`, 10, 0 + 20);
    text(`Distance to wall mapped to pitch`, 10, 0 + 40);

}


// function mousePressed() {
//     if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
//       clickPoint.set(mouseX - width/2, mouseY - height/2);
//       console.log('press!')

//     }
//   }
  
//   function mouseDragged() {
//     if (clickPoint.mag() > 0) {

//         if (clickPoint.mag() > 0) {
//             let mouseVector = createVector(mouseX - width/2, mouseY - height/2);
//             let clickVector = createVector(clickPoint.x, clickPoint.y);
            
//             let crossProduct = clickVector.cross(mouseVector); // Calculate the cross product
            
//             if (crossProduct.z > 0) {
//               // Mouse movement is towards the right, increase 'a'
//                 let distance = dist(clickPoint.x, clickPoint.y, mouseX - width/2, mouseY - height/2);

//                 a = map(distance, 0, width/2, 0.1, 5); // Adjust the mapping as needed

//             } else if (crossProduct.z < 0) {
//               // Mouse movement is towards the left, decrease 'a'
//                 console.log('here!')
//                 let distance = dist(clickPoint.x, clickPoint.y, mouseX - width/2, mouseY - height/2);

//                 a = map(distance, 0, width/2, -0.1, -5); // Adjust the mapping as needed
//             }
            
//             // // Keep 'a' within the desired range
//             // a = constrain(a, 0.1, 5);
//           }
//         }        
    
//     }
  
  
//   function mouseReleased() {
//     clickPoint.set(0, 0);
//   }
