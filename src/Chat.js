import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    console.log('Sending message to server:', input);

    try {
      const response = await axios.post('http://localhost:3001/api/chat', {
        prompt: input,
        max_tokens: 150,
      });

      if (response.data && response.data.choices) {
        const botMessage = {
          sender: 'bot',
          text: response.data.choices[0].text,
        };
        setMessages([...messages, userMessage, botMessage]);
        console.log(
          'Received response from server:',
          response.data.choices[0].text
        );
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error communicating with ChatGPT:', error);
    }

    setInput('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Chat with ChatGPT</h1>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px',
          height: '400px',
          overflowY: 'scroll',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              margin: '10px 0',
            }}
          >
            <span
              style={{
                padding: '10px',
                background: msg.sender === 'user' ? '#d1e7dd' : '#f8d7da',
                borderRadius: '5px',
                display: 'inline-block',
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: '80%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleSend}
          style={{
            width: '18%',
            padding: '10px',
            marginLeft: '2%',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
