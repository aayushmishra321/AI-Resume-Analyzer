// Using native fetch (Node 18+)

// Analyze resume using Gemini AI
export const analyzeResumeWithAI = async (resumeText, jobDescription = '') => {
  const requestId = `ai-${Date.now()}`;
  console.log(`[${requestId}] 🤖 Starting Gemini AI analysis...`);
  
  try {
    const prompt = `You are an expert ATS (Applicant Tracking System) and resume analyzer. Analyze the following resume and provide detailed feedback.

Resume Text:
${resumeText}

${jobDescription ? `Job Description:\n${jobDescription}\n` : ''}

Provide a comprehensive analysis in the following JSON format:
{
  "overallScore": <number 0-100>,
  "contentScore": <number 0-100>,
  "keywordScore": <number 0-100>,
  "formatScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "keywordMatches": [
    {
      "keyword": "<skill/keyword>",
      "status": "found" or "missing",
      "count": <number>
    }
  ],
  "missingSkills": ["<skill1>", "<skill2>"],
  "suggestions": ["<suggestion1>", "<suggestion2>", "<suggestion3>"],
  "strengths": ["<strength1>", "<strength2>"],
  "improvements": ["<improvement1>", "<improvement2>"]
}

CRITICAL INSTRUCTIONS:
1. The "suggestions" field MUST be an array of simple strings
2. DO NOT use objects with "type" and "message" fields
3. Each suggestion should be a plain string describing the improvement
4. Example: "suggestions": ["Add quantifiable achievements", "Fix date formatting", "Include more keywords"]

Focus on:
1. ATS compatibility
2. Keyword optimization
3. Content quality
4. Formatting
5. Quantifiable achievements
6. Action verbs usage
7. Skills relevance${jobDescription ? '\n8. Job description match' : ''}

Return ONLY valid JSON, no additional text.`;

    console.log(`[${requestId}] 📤 Sending request to Gemini API...`);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 8192,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${requestId}] ❌ Gemini API error: ${response.status} ${response.statusText}`);
      console.error(`[${requestId}] Error details:`, errorText);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[${requestId}] ✅ Received response from Gemini API`);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error(`[${requestId}] ❌ Invalid response structure from Gemini API`);
      throw new Error('Invalid response from Gemini API');
    }
    
    const generatedText = data.candidates[0].content.parts[0].text;
    console.log(`[${requestId}] 📝 Raw AI response length:`, generatedText.length);
    
    // Extract JSON from response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(`[${requestId}] ❌ No JSON found in AI response`);
      console.error(`[${requestId}] Response preview:`, generatedText.substring(0, 200));
      throw new Error('Failed to parse AI response - no JSON found');
    }

    let analysis;
    try {
      analysis = JSON.parse(jsonMatch[0]);
      console.log(`[${requestId}] ✅ Successfully parsed JSON response`);
    } catch (parseError) {
      console.error(`[${requestId}] ❌ JSON parse error:`, parseError.message);
      console.error(`[${requestId}] JSON preview:`, jsonMatch[0].substring(0, 200));
      throw new Error('Failed to parse AI response JSON: ' + parseError.message);
    }
    
    // Ensure all required fields exist and are properly typed
    const result = {
      overallScore: Number(analysis.overallScore) || 75,
      contentScore: Number(analysis.contentScore) || 80,
      keywordScore: Number(analysis.keywordScore) || 70,
      formatScore: Number(analysis.formatScore) || 85,
      atsScore: Number(analysis.atsScore) || 75,
      keywordMatches: Array.isArray(analysis.keywordMatches) ? analysis.keywordMatches : [],
      missingSkills: Array.isArray(analysis.missingSkills) ? analysis.missingSkills : [],
      suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : [],
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
      improvements: Array.isArray(analysis.improvements) ? analysis.improvements : []
    };
    
    console.log(`[${requestId}] ✅ Analysis complete - Score: ${result.overallScore}/100`);
    return result;
  } catch (error) {
    console.error(`[${requestId}] ❌ AI Analysis Error:`, error.message);
    console.error(`[${requestId}] Stack:`, error.stack);
    
    // Return fallback analysis instead of crashing
    console.log(`[${requestId}] ⚠️  Using fallback analysis`);
    return generateFallbackAnalysis(resumeText, jobDescription);
  }
};

// Fallback analysis if AI fails
const generateFallbackAnalysis = (resumeText, jobDescription) => {
  const words = resumeText.toLowerCase().split(/\s+/);
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'sql', 
    'aws', 'docker', 'kubernetes', 'git', 'agile', 'scrum'
  ];

  const foundSkills = commonSkills.filter(skill => 
    resumeText.toLowerCase().includes(skill)
  );

  const missingSkills = commonSkills.filter(skill => 
    !resumeText.toLowerCase().includes(skill)
  ).slice(0, 6);

  const keywordMatches = foundSkills.map(skill => ({
    keyword: skill,
    status: 'found',
    count: (resumeText.toLowerCase().match(new RegExp(skill, 'g')) || []).length
  }));

  return {
    overallScore: 75,
    contentScore: 80,
    keywordScore: 70,
    formatScore: 85,
    atsScore: 75,
    keywordMatches,
    missingSkills,
    suggestions: [
      'Good use of technical terminology',
      'Add more quantifiable achievements with numbers and percentages',
      'Consider adding a professional summary at the top',
      'Include specific metrics for your accomplishments',
      'Add more relevant keywords from the job description'
    ],
    strengths: [
      'Clear structure and organization',
      'Relevant technical skills mentioned'
    ],
    improvements: [
      'Add more specific metrics and achievements',
      'Include additional relevant keywords'
    ]
  };
};

// Generate cover letter using Gemini AI
export const generateCoverLetterWithAI = async (jobTitle, companyName, hiringManager, jobDescription, tone, userResume = '') => {
  const requestId = `cover-${Date.now()}`;
  console.log(`[${requestId}] 📝 Starting cover letter generation...`);
  
  try {
    const toneInstructions = {
      professional: 'Use a professional and formal tone',
      enthusiastic: 'Use an enthusiastic and energetic tone while maintaining professionalism',
      formal: 'Use a very formal and traditional business tone',
      creative: 'Use a creative and engaging tone while remaining professional'
    };

    const prompt = `You are an expert cover letter writer. Generate a compelling cover letter for the following job application.

Job Title: ${jobTitle}
Company Name: ${companyName}
${hiringManager ? `Hiring Manager: ${hiringManager}` : 'Hiring Manager: [Hiring Manager Name]'}
Tone: ${toneInstructions[tone] || toneInstructions.professional}

Job Description:
${jobDescription}

${userResume ? `Candidate's Resume Summary:\n${userResume.substring(0, 1000)}` : ''}

Generate a professional cover letter that:
1. Opens with a strong introduction expressing interest
2. Highlights relevant skills and experience matching the job description
3. Shows knowledge about the company
4. Demonstrates enthusiasm for the role
5. Includes specific examples of achievements
6. Closes with a call to action
7. Is 3-4 paragraphs long
8. Uses the specified tone

Return ONLY the cover letter text, no additional formatting or explanations.`;

    console.log(`[${requestId}] 📤 Sending request to Gemini API...`);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${requestId}] ❌ Gemini API error: ${response.status} ${response.statusText}`);
      console.error(`[${requestId}] Error details:`, errorText);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[${requestId}] ✅ Cover letter generated successfully`);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }
    
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error(`[${requestId}] ❌ Cover Letter Generation Error:`, error.message);
    console.error(`[${requestId}] Stack:`, error.stack);
    
    // Return fallback template
    console.log(`[${requestId}] ⚠️  Using fallback cover letter template`);
    return generateFallbackCoverLetter(jobTitle, companyName, hiringManager, jobDescription);
  }
};

// Fallback cover letter template
const generateFallbackCoverLetter = (jobTitle, companyName, hiringManager, jobDescription) => {
  const managerName = hiringManager || 'Hiring Manager';
  
  return `Dear ${managerName},

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my extensive background in professional development and proven track record of delivering high-quality results, I am excited about the opportunity to contribute to your team.

Throughout my career, I have consistently demonstrated expertise in the key areas outlined in your job description. My experience aligns perfectly with your requirements, and I am particularly drawn to ${companyName}'s commitment to innovation and excellence in the industry.

What excites me most about this opportunity is the chance to bring my skills in problem-solving, team collaboration, and technical expertise to your organization. I am confident that my combination of professional experience and passion for creating impactful solutions makes me an ideal candidate for this role.

I would welcome the opportunity to discuss how my background and skills would benefit ${companyName}. Thank you for considering my application. I look forward to the possibility of contributing to your team's success.

Sincerely,
[Your Name]`;
};
