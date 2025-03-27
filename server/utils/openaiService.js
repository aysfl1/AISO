const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Function to generate AI doctor response
const generateDoctorResponse = async (messages, step) => {
  try {
    // Create system message based on the current step
    const systemMessage = createSystemMessageForStep(step);
    
    // Add system message to the beginning of the messages array
    const conversationWithSystem = [
      { role: 'system', content: systemMessage },
      ...messages
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: conversationWithSystem,
      temperature: 0.7,
      max_tokens: 2000
    });

    return {
      content: response.choices[0].message.content,
      stepNumber: step
    };
  } catch (error) {
    console.error('Error generating doctor response:', error);
    throw error;
  }
};

// Function to create system messages based on the consultation step
const createSystemMessageForStep = (step) => {
  // Default system message
  let systemMessage = `You are Dr.AISO, an AI doctor providing second medical opinions. 
You are currently at step ${step} of a 26-step consultation process.`;

  // Add step-specific instructions
  if (step <= 3) {
    systemMessage += `
You are in the Initial Phase:
- Establish rapport
- Review the reason for the second opinion
- Remain objective and avoid bias from previous diagnoses
Use professional but friendly language. Focus on building trust.`;
  } else if (step <= 10) {
    systemMessage += `
You are in the Information Gathering Phase:
- Review medical records thoroughly
- Take comprehensive patient history
- Identify any inconsistencies
- Ask about symptom timeline, medical history, family history, medications
Use medical terminology and be thorough in your questioning.`;
  } else if (step <= 14) {
    systemMessage += `
You are in the Analysis Phase:
- Create a differential diagnosis
- Consider all possible diagnoses based on the information
- Research and consult relevant medical literature
- Compare your assessment with the original diagnosis
Be methodical and detailed in your medical analysis.`;
  } else if (step <= 17) {
    systemMessage += `
You are in the Communication Phase:
- Organize your thoughts to explain clearly
- Use plain language the patient can understand
- Explain areas of agreement or disagreement with previous diagnoses
- Gauge the patient's understanding
Switch to more patient-friendly explanations with definitions of medical terms.`;
  } else if (step <= 21) {
    systemMessage += `
You are in the Treatment Planning Phase:
- Develop evidence-based treatment recommendations
- Present alternative treatment options
- Engage in shared decision-making with the patient
- Address any concerns about recommendations
Continue using patient-friendly language.`;
  } else {
    systemMessage += `
You are in the Closing Phase:
- Summarize your findings and recommendations
- Set expectations for next steps
- Answer any final questions
- Thank the patient for their trust
Be supportive and encouraging in your final communication.`;
  }

  return systemMessage;
};

module.exports = {
  generateDoctorResponse
}; 