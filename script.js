document.addEventListener('DOMContentLoaded', () => {
    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    const audioElement = document.getElementById('audioElement');
    const recordingStatus = document.getElementById('recordingStatus');
    let mediaRecorder;
    let chunks = [];

    recordButton.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' }); // Adjust as per your chosen format
                const audioUrl = URL.createObjectURL(blob);
                audioElement.src = audioUrl;
                // Now you can send `blob` to ChatGPT API for transcription
                // Implement the next steps here (transcription, summarization, etc.)
            };
            mediaRecorder.start();
            recordingStatus.textContent = 'Recording...';
            recordButton.style.display = 'none';
            stopButton.style.display = 'inline-block';
            console.log('Recording started...');
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    });

    stopButton.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            recordingStatus.textContent = 'Recording stopped.';
            stopButton.style.display = 'none';
            recordButton.style.display = 'inline-block';
            console.log('Recording stopped.');
        }
    });
});
