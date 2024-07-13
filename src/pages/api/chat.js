import { NextApiRequest, NextApiResponse } from 'next';
import { callOpenAI } from '@/utils/openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { messages } = req.body;
      const apiKey = process.env.OPENAI_API_KEY;
      
      const aiResponse = await callOpenAI(messages, apiKey);
      
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