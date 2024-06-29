const recordButton = document.getElementById('recordButton');
const audioElement = document.getElementById('audioElement');
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
        console.log('Recording started...');
    } catch (error) {
        console.error('Error accessing microphone:', error);
    }
});
