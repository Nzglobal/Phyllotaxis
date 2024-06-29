# PhylloSonic

PhylloSonic is an interactive 3D visualization project that generates phyllotaxis patterns influenced by microphone input. The project uses Three.js to create dynamic and colorful visualizations that react to audio frequencies, with features like instanced rendering for performance optimization, wiggle effects, and dynamic control of pattern properties.

## Features

- Real-time audio visualization using microphone input
- Dynamic phyllotaxis patterns that respond to audio frequencies
- Instanced rendering for improved performance
- Adjustable number of spheres and pattern spacing (`c` variable)
- Toggleable wiggle effect to add vibrational movement on the z-axis
- Add multiple phyllotaxis groups by pressing keys `1-9`
- Smooth camera controls with OrbitControls

## Getting Started

### Prerequisites

- A web server to serve the project files (e.g., Python's `http.server`, Node.js's `http-server`, or any other web server)
- A modern web browser that supports ES6 modules

### Installing

1. Clone the repository or download the project files.
2. Ensure you have the necessary files in the `libs` directory:

   - `three.module.js` from [Three.js](https://unpkg.com/three@0.128.0/build/three.module.js)
   - `OrbitControls.js` from [Three.js](https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js)

   Your project structure should look like this:
   
```
Phyllotaxis/
├── favicon.ico
├── index.html
├── manifest.json
├── libs/
│ ├── three.module.js
│ ├── OrbitControls.js
└── app.js
```
### Running the Project

1. Start a local web server in the project directory. For example, using Python:
```sh
python -m http.server
```

2. Open your web browser and navigate to http://localhost:8000 (or the appropriate URL for your web server).

### Usage
Press keys 1-9 to add additional phyllotaxis groups.
Press ArrowUp to increase the number of spheres.
Press ArrowDown to decrease the number of spheres.
Press ArrowLeft to decrease the c variable (pattern spacing).
Press ArrowRight to increase the c variable (pattern spacing).
Press w to toggle the wiggle effect on and off.

### Project Structure
index.html: The main HTML file that includes the necessary scripts and sets up the page layout.
manifest.json: The web app manifest for saving the project as a web app.
libs/: Directory containing external libraries (three.module.js and OrbitControls.js).
app.js: The main JavaScript file that contains the Three.js logic and audio processing.
Contributing
Feel free to submit issues or pull requests if you have suggestions for improvements or new features.

Acknowledgments
Three.js - A JavaScript 3D library
Inspiration from various audio visualization projects
