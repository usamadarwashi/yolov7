


// Check if the browser supports media devices and getUserMedia
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Request access to the camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
          // Get the video element
            const video = document.querySelector('video');
            
            // Attach the camera stream to the video element
            video.srcObject = stream;
            video.play();

            // Start sending video frames to the server
            sendVideoFrames(stream);
        })
        .catch(function(error) {
            console.error('Error accessing the camera:', error);
        });
} else {
    console.error('getUserMedia is not supported by this browser.');
}

// Function to send video frames to the server
function sendVideoFrames(stream) {
    const videoTrack = stream.getVideoTracks()[0];
    const videoSettings = videoTrack.getSettings();
    const videoWidth = videoSettings.width;
    const videoHeight = videoSettings.height;

    // Create a canvas element to draw the video frames
    const canvas = document.createElement('canvas');
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const context = canvas.getContext('2d');

    // Function to capture and send video frames
    function captureFrame() {
        context.drawImage(video, 0, 0, videoWidth, videoHeight);
        const imageData = canvas.toDataURL('image/jpeg');

        // Send the video frame to the server using AJAX
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/process_frame', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Process the response from the server if needed
            }
        };
        xhr.send(JSON.stringify({ frame: imageData }));

        // Schedule the next frame capture
        requestAnimationFrame(captureFrame);
    }

    // Start capturing video frames
    requestAnimationFrame(captureFrame);
}