const axios = require('axios');

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

// Function to research medical information
const researchMedicalInfo = async (query) => {
  try {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: 'llama-3-sonar-large-32k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a medical research assistant. Provide accurate, evidence-based information from reputable medical sources like PubMed, medical journals, and official medical guidelines. Focus on finding the most relevant and current information for the query. Always include citations with URLs when possible. Prioritize peer-reviewed sources.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        options: {
          web_search: true
        }
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
        }
      }
    );

    // Extract and process citations from the response
    const content = response.data.choices[0].message.content;
    const citations = extractCitations(content);

    return {
      content,
      citations
    };
  } catch (error) {
    console.error('Error researching medical information:', error);
    throw error;
  }
};

// Helper function to extract citations from text
const extractCitations = (text) => {
  const citations = [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex) || [];
  
  matches.forEach(url => {
    // Basic check to prioritize medical sources
    const isMedicalSource = url.includes('pubmed') || 
                           url.includes('nih.gov') || 
                           url.includes('nejm.org') || 
                           url.includes('jamanetwork.com') ||
                           url.includes('mayoclinic') ||
                           url.includes('medscape') ||
                           url.includes('webmd');
    
    const surroundingText = extractSurroundingText(text, url);
    
    citations.push({
      text: surroundingText,
      source: isMedicalSource ? 'Medical Journal/Database' : 'Web Source',
      url
    });
  });
  
  return citations;
};

// Helper function to extract text surrounding a URL
const extractSurroundingText = (text, url) => {
  const urlIndex = text.indexOf(url);
  const start = Math.max(0, text.lastIndexOf('.', urlIndex) + 1);
  const end = text.indexOf('.', urlIndex + url.length);
  
  return text.substring(start, end > -1 ? end + 1 : text.length).trim();
};

module.exports = {
  researchMedicalInfo
}; 