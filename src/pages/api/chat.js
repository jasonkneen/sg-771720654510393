import { NextApiRequest, NextApiResponse } from 'next';
import { callOpenAI } from '@/utils/openai';
import { OPENAI_CONFIG } from '@/config/openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { messages } = req.body;
      
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Invalid messages format' });
      }

      const aiResponse = await callOpenAI(messages, OPENAI_CONFIG.apiKey);
      
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