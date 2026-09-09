export const mockAiService = async (userInput) => {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error talking to backend:', error);
    
    // Fallback if backend is not running
    return {
      type: 'text',
      message: "> ⚠️ **Backend Connection Error**\n\nThe React frontend could not connect to the Node.js backend. Please ensure you are running `node index.js` inside the `server` folder."
    };
  }
};
