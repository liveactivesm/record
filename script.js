// script.js

// Global variables
let mediaRecorder;
let recordedChunks = [];

// Function to start recording
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function(event) {
            recordedChunks.push(event.data);
        };

        mediaRecorder.onstop = async function() {
            const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
            recordedChunks = [];

            // Send recorded audio to Assembly AI for transcription
            await sendToAssemblyAI(audioBlob);
        };

        mediaRecorder.start();
        console.log('Recording started...');
    } catch (error) {
        console.error('Error starting recording:', error);
    }
}

// Function to stop recording
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        console.log('Recording stopped...');
    }
}

// Function to send audio to Assembly AI for transcription
async function sendToAssemblyAI(audioBlob) {
    const apiKey = '7ee7fb879f664375ab8ce7fa2a17ca67';
    const apiUrl = 'https://api.assemblyai.com/v2/transcript';

    const formData = new FormData();
    formData.append('audio', audioBlob);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': apiKey,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error from Assembly AI');
        }

        const data = await response.json();
        console.log('Transcription:', data.text);
        console.log('Summary:', data.summary);

        // Display transcription and summary results on the webpage
        document.getElementById('transcriptionResult').innerText = `Transcription: ${data.text}`;
        document.getElementById('summaryResult').innerText = `Summary: ${data.summary}`;

    } catch (error) {
        console.error('Error:', error);
    }
}

// Event listener for record button click
document.getElementById('recordButton').addEventListener('click', () => {
    startRecording();
});

// Event listener for stop button click (optional)
// You can add a stop button if needed
// document.getElementById('stopButton').addEventListener('click', () => {
//     stopRecording();
// });
