import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { message } = req.body;
      
      // Simulate AI response (replace with actual AI integration)
      const aiResponse = `AI response to: "${message}"`;
      
      res.status(200).json({ response: aiResponse });
    } catch (error) {
      console.error('Error in chat API:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}