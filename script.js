let mediaRecorder;
let recordedChunks = [];
let audioPlayer = document.getElementById('audioPlayer');
const apiKey = 'your_assembly_ai_api_key'; // Replace with your actual Assembly AI API key
const apiUrl = 'https://api.assemblyai.com/v2/transcript';

// Function to start recording
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
            document.getElementById('playButton').style.display = 'inline-block';

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

// Function to play recorded audio
function playRecording() {
    if (audioPlayer.src) {
        audioPlayer.play();
        console.log('Playing recording...');
    }
}

// Function to send recorded audio to Assembly AI for transcription
async function sendToAssemblyAI(audioBlob) {
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
        console.error('Error sending to Assembly AI:', error);
    }
}

// Event listeners
document.getElementById('recordButton').addEventListener('click', startRecording);
document.getElementById('stopButton').addEventListener('click', stopRecording);
document.getElementById('playButton').addEventListener('click', playRecording);
