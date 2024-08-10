const baseUrl = import.meta.env.VITE_BASE_URL;
export default function logToFile(message, error = null) {
    fetch(`${baseUrl}/logs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, error }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); // Get the response as text
    })
    .then(text => {
        if (text) {
            return JSON.parse(text); // Try parsing as JSON if there's content
        }
        return {}; // Return an empty object if the response is empty
    })
    .then(data => console.log('Log sent to server:', data))
    .catch((error) => console.error('Error sending log:', error));
}
