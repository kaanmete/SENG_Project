const OpenAI = require('openai');
const logger = require('../utils/logger');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// CEFR Levels mapping
const CEFR_LEVELS = {
  1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1', 6: 'C2'
};

// Generate next question based on user performance (FR-06 - Adaptive Difficulty)
const generateAdaptiveQuestion = async (skillType, difficultyLevel, userPurpose, previousAnswers = []) => {
  try {
    const cefrLevel = CEFR_LEVELS[difficultyLevel] || 'B1';

    const prompt = `Generate a ${skillType} question at CEFR ${cefrLevel} level for someone learning English for ${userPurpose} purposes.

Previous performance: ${previousAnswers.length > 0 ? `User has answered ${previousAnswers.filter(a => a.correct).length} out of ${previousAnswers.length} correctly.` : 'First question'}

Requirements:
- Difficulty: CEFR ${cefrLevel}
- Type: ${skillType}
- Format: Return a JSON object with these fields:
  {
    "question": "The question text",
    "options": {"A": "option1", "B": "option2", "C": "option3", "D": "option4"},
    "correct_answer": "A" (the letter of correct option),
    "explanation": "Brief explanation of why this is correct"
  }

Make it relevant to ${userPurpose} context.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert English language teacher creating CEFR-aligned assessment questions. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const questionData = JSON.parse(response.choices[0].message.content);

    logger.info('Generated adaptive question', {
      skillType,
      difficultyLevel,
      cefrLevel
    });

    return questionData;
  } catch (error) {
    logger.error('Error generating adaptive question', error);
    throw new Error('Failed to generate question');
  }
};

// Analyze user response and provide feedback (FR-09)
const analyzeResponse = async (question, userAnswer, correctAnswer, skillType) => {
  try {
    const prompt = `Analyze this English language assessment response:

Question: ${question}
Skill Type: ${skillType}
User Answer: ${userAnswer}
Correct Answer: ${correctAnswer}

Provide:
1. Whether the answer is correct (true/false)
2. Detailed feedback explaining why
3. A score from 0-1
4. Suggestions for improvement

Return JSON:
{
  "is_correct": boolean,
  "feedback": "detailed feedback",
  "score": 0.0-1.0,
  "suggestions": "improvement suggestions"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert English language assessor providing constructive feedback. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 400
    });

    const analysis = JSON.parse(response.choices[0].message.content);

    logger.logAIDecision('response_analysis', null, 'analyzed', {
      skillType,
      isCorrect: analysis.is_correct,
      score: analysis.score
    });

    return analysis;
  } catch (error) {
    logger.error('Error analyzing response', error);
    throw new Error('Failed to analyze response');
  }
};

// Generate writing feedback (FR-15)
const generateWritingFeedback = async (text, purpose) => {
  try {
    const prompt = `Analyze this English text and provide comprehensive feedback:

Text: "${text}"
Context: Written for ${purpose} purposes

Provide detailed feedback on:
1. Grammar errors with corrections
2. Vocabulary usage
3. Sentence structure
4. Overall coherence
5. Suggestions for improvement

Return JSON:
{
  "grammar_errors": [{"error": "...", "correction": "...", "explanation": "..."}],
  "vocabulary_score": 0-100,
  "structure_score": 0-100,
  "coherence_score": 0-100,
  "overall_feedback": "comprehensive feedback",
  "suggestions": ["suggestion1", "suggestion2"]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert English language teacher providing detailed writing feedback. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const feedback = JSON.parse(response.choices[0].message.content);

    logger.info('Generated writing feedback', { textLength: text.length });

    return feedback;
  } catch (error) {
    logger.error('Error generating writing feedback', error);
    throw new Error('Failed to generate writing feedback');
  }
};

// Generate speaking feedback (FR-14)
const generateSpeakingFeedback = async (transcription, purpose) => {
  try {
    const prompt = `Analyze this English speech transcription and provide feedback:

Transcription: "${transcription}"
Context: Spoken for ${purpose} purposes

Evaluate:
1. Pronunciation quality
2. Fluency
3. Grammar in spoken form
4. Vocabulary range
5. Overall communication effectiveness

Return JSON with scores (1-5) and feedback:
{
  "pronunciation_score": 1-5,
  "fluency_score": 1-5,
  "grammar_score": 1-5,
  "vocabulary_score": 1-5,
  "overall_score": 1-5,
  "feedback": "detailed feedback",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert English language speaking assessor. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 800
    });

    const feedback = JSON.parse(response.choices[0].message.content);

    logger.info('Generated speaking feedback', { transcriptionLength: transcription.length });

    return feedback;
  } catch (error) {
    logger.error('Error generating speaking feedback', error);
    throw new Error('Failed to generate speaking feedback');
  }
};

// Calculate CEFR level from sub-skill scores (FR-10)
const calculateCEFRLevel = (scores) => {
  // scores = { reading: 0-100, writing: 0-100, listening: 0-100, speaking: 0-100, grammar: 0-100, vocabulary: 0-100 }

  const avgScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length;

  // CEFR mapping based on average percentage
  if (avgScore >= 90) return 'C2';
  if (avgScore >= 75) return 'C1';
  if (avgScore >= 60) return 'B2';
  if (avgScore >= 45) return 'B1';
  if (avgScore >= 30) return 'A2';
  return 'A1';
};

// Generate personalized study plan (FR-20)
const generateStudyPlan = async (cefrLevel, weakAreas, learningPurpose) => {
  try {
    const prompt = `Create a personalized English study plan:

Current Level: CEFR ${cefrLevel}
Weak Areas: ${weakAreas.join(', ')}
Learning Purpose: ${learningPurpose}

Generate a 4-week study plan with:
- Weekly goals
- Daily activities (15-30 min each)
- Specific resources/exercises
- Progress milestones

Return JSON:
{
  "target_level": "next CEFR level",
  "duration_weeks": 4,
  "weekly_plans": [
    {
      "week": 1,
      "goal": "...",
      "daily_tasks": ["task1", "task2", "task3"],
      "focus_areas": ["area1", "area2"]
    }
  ],
  "resources": ["resource1", "resource2"],
  "milestones": ["milestone1", "milestone2"]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert English language learning advisor creating personalized study plans. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const studyPlan = JSON.parse(response.choices[0].message.content);

    logger.info('Generated study plan', { cefrLevel, purpose: learningPurpose });

    return studyPlan;
  } catch (error) {
    logger.error('Error generating study plan', error);
    throw new Error('Failed to generate study plan');
  }
};

// Generate hint without revealing answer (FR-17)
const generateHint = async (question, questionType, difficulty) => {
  try {
    const prompt = `Provide a helpful hint for this question WITHOUT revealing the answer:

Question: ${question}
Type: ${questionType}
Difficulty: ${CEFR_LEVELS[difficulty]}

The hint should:
- Guide thinking process
- Explain relevant grammar/vocabulary concepts
- NOT give away the answer
- Be encouraging and educational

Return only the hint text as a string.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a supportive English language tutor providing helpful hints without revealing answers.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const hint = response.choices[0].message.content.trim();

    logger.info('Generated hint', { questionType, difficulty });

    return hint;
  } catch (error) {
    logger.error('Error generating hint', error);
    throw new Error('Failed to generate hint');
  }
};

module.exports = {
  generateAdaptiveQuestion,
  analyzeResponse,
  generateWritingFeedback,
  generateSpeakingFeedback,
  calculateCEFRLevel,
  generateStudyPlan,
  generateHint
};
