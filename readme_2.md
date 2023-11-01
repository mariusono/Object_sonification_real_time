
**INTRODUCTION:**

  

This is a repository for a web application built for sonifying indoor spaces with the aim of helping blind people navigate and get a sense of the space they are in. It is built to work in tandem with the visual analysis software found at: https://github.com/AndreaRoberti/vivavis_vision . The video app maps the walls and obstacles present in the room to point cloud data and sends, via a websocket connection, this data to the current web app.

  

Each identified wall is then assigned a drone sound source (a constant harmonic tone) whose pitch increases when the user gets closer to the wall. The sound is panned in space, using 3D panning, with the sound source being positioned at the nearest point of the wall relative to the camera view ( which in testing situations would be mounted on the user's head ).

  

Simlarly, idendified obstacles are assigned a short transient sound, i.e. a quick attack - release sawtooth wave. The sound source is positioned in space at the center of the point cloud that is associated with the obstacle.

  

When the user moves in the room, or moves their head, resulting in the camera view changing, the panning of the sound sources will change accordingly, with the walls and obstacles being fixed in space.

  

**STEP BY STEP GUIDE:**

  

Below there is the functionality of the web app in a browser setting, with details of each of the possible controls. Following this, a method to run the app in a headless browser mode will be given.

  

The default mode of running the app is with a presaved dataset of .json files, which contain information about the simulation space, resulting from the visual analysis software, see points 2a and 2b below. If running the app together with the real-time visual analysis software the toggle "Real-time" at the top of the html page needs to be checked.

  

1. Download the github repository at: https://github.com/mariusono/Object_sonification_real_time

  

2a. If running via the json files, then open a terminal, cd into the downloaded repository and run the command : "node script_serverWebsocket.js"

- this opens the websocket connection.

- on connection the stream of json files (human workspace jsons) is sent to the sonification app, with delays consistent to the time difference in the ROS_timestamp of each json file.

- similarly a stream of png files, which are the camera view at various timestamps is also sent.

  

2b. If running via the live connection, you just need to click the toggle "Real-time" at the top of the page.

- this should hopefully work just as the json stream.

3. Click the "Start Audio!" button to enable the Tone.js library on which the sonification is built on.

- in the case of the real-time mode, this needs to be done AFTER clicking the "real-time" toggle.

  

4. Click the "Run Websocket" hyperlink.

- this enables the websocket connection to the server port (same in the offline mode, and the real-time mode)

- once connection is established, the sonification starts, which reacts to every new incoming human workspace json message and new .png file of the camera view.

  
  

FUNCTIONALITY:

1. Toggle Button: "Real-time"

- Toggle disabled (default): sonification is expected to run offline via pre-saved human workspace .json files. See info above.

- Toggle enabled: sonification is expected to run in real-time with a new ROS simulation, or live camera feed.

2. Buttons: "Start Audio!" and "Stop Audio!"

- the button "Start Audio!" needs to be pressed in order for sonification to work.

- sounds can be stopped by pressing the button "Stop Audio!"

- it can be restarted after this, however it is a bit buggy so I suggest just reloading the page instead

3. Toggle button: "Play all sound sources at once"

- There are 2 modes:
- Toggle enabled  (default): all sonifications are played at the same time.
- Toggle disabled: each sonified element (obstacles or walls) is played in a loop, moving from one to another

4. Slider: "Gain"
- controls the overall volume. large values can cause distortion.

5. Slider: "Interval Sounds"

- only relevant when sonifying elements in a loop, i.e. toggle "Play all sound sources at once" is disabled !
- this controls how long each element is being sonified (played), before moving on to the next
- values are in seconds
- default is 0.1 second - if clicking the "Play all sound sources at once" toggle, make sure to increase this value.

6. Slider: "Silence Interval (percentace)"
- again,  only relevant in the case that "Play all sound sources at once" toggle is enabled 
- controls how long there will be silence at the end of the sound interval (to give the user some space to reflect on the sound)
- in percentage relative to the sonification sound interval (value in Slider "Interval Sounds")
- example: default is 10%, coupled with 1 second of sonification per element. Means that each element will be sonified for 0.9 seconds (active sound) followed by 0.1 seconds of silence.

7. Slider: "Obstacle Limit Distance"
- this sets the minimum distance to obstacles so that they are sonified
- obstacles present in the scene but at a distance bigger than this value will not be sonified
- default value is max value of 4 meters
- distance is computed as to the "center_3d" of the 3d point cluster representing the obstacle

8. Slider: "Wall Limit Distance"
- this sets the minimum distance to walls so that they are sonified
- walls present in the scene but at a distance bigger than this value will not be sonified
- default value is max value of 3.0 meters
- distance is computed as to the "nearest_3d" of the 3d point cluster representing the wall plane

9. Slider: "Exp Mapping Fac Obstacles"
- this controls how the mapping between the distance to the obstacle and the playback rate of its sonification (frequency of beeping) is carried out.
- shorter distance -> higher beeping frequency
- a minimum value of 0.01, results in a practically linear mapping
- larger values result in an exponential mapping, where the beeping frequency does not change much initially as the distance to the obstacle becomes shorter, but increases drastically when the distance is small.
- this mapping is visualised interactively in the top graph to the right of the web page.
- play around with this slider and the "Obstacle Limit Distance" slider to see how this mapping changes.
- can be used for calibration, in different test settings

10. Slider: "Exp Mapping Fac Walls"
- controls how the mapping between the distance to the nearest point of the wall and the pitch of the drone sound of its sonification is carried out.
- shorter distance - > higher pitch
- this mapping is visualized interactively in the bottom graph to the right of the web page.
- play around with this slider and the "Wall Limit Distance" slider to see how this mapping changes.