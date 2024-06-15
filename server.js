const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  console.log('Received message from client:', prompt);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: prompt,
        max_tokens: 150,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    if (response.data && response.data.choices) {
      console.log('Sending response to client:', response.data.choices[0].text);
      res.json(response.data);
    } else {
      console.error('Unexpected response format:', response.data);
      res.status(500).send('Unexpected response format');
    }
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).send('Error communicating with OpenAI');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
