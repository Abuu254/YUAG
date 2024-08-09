export default function logToFile(message, error = null) {
    fetch('/api/logs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, error }),
    })
    .then(response => response.json())
    .then(data => console.log('Log sent to server:', data))
    .catch((error) => console.error('Error sending log:', error));
}
