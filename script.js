// script.js

let mediaRecorder;
let recordedChunks = [];
let audioPlayer = document.getElementById('audioPlayer');

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function(event) {
            recordedChunks.push(event.data);
        };

        mediaRecorder.onstart = function() {
            document.getElementById('recordingStatus').innerText = 'Recording...';
            document.getElementById('recordButton').style.display = 'none';
            document.getElementById('stopButton').style.display = 'inline-block';
        };

        mediaRecorder.onstop = function() {
            document.getElementById('recordingStatus').innerText = 'Recording stopped.';
            document.getElementById('recordButton').style.display = 'inline-block';
            document.getElementById('stopButton').style.display = 'none';
            document.getElementById('playButton').style.display = 'inline-block';

            const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
            recordedChunks = [];

            // Set audio player source to recorded audio
            audioPlayer.src = URL.createObjectURL(audioBlob);
            audioPlayer.controls = true;
        };

        mediaRecorder.start();
        console.log('Recording started...');
    } catch (error) {
        console.error('Error starting recording:', error);
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        console.log('Recording stopped...');
    }
}

function playRecording() {
    if (audioPlayer.src) {
        audioPlayer.play();
        console.log('Playing recording...');
    }
}

// Event listeners
document.getElementById('recordButton').addEventListener('click', startRecording);
document.getElementById('stopButton').addEventListener('click', stopRecording);
document.getElementById('playButton').addEventListener('click', playRecording);
