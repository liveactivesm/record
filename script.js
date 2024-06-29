// script.js

let mediaRecorder;
let recordedChunks = [];

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

        mediaRecorder.onstop = async function() {
            document.getElementById('recordingStatus').innerText = 'Recording stopped.';
            document.getElementById('recordButton').style.display = 'inline-block';
            document.getElementById('stopButton').style.display = 'none';

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

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        console.log('Recording stopped...');
    }
}

async function sendToAssemblyAI(audioBlob) {
    const apiKey = 'abcdef1234567890'; // Replace with your actual Assembly AI API key
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

// Event listeners
document.getElementById('recordButton').addEventListener('click', startRecording);
document.getElementById('stopButton').addEventListener('click', stopRecording);
