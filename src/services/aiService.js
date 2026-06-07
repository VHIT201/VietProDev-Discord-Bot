/**
 * Service AI Chat với OpenRouter
 * Sử dụng axios gọi API trực tiếp
 */

const axios = require('axios');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Gửi câu hỏi đến AI
 * @param {string} question - Câu hỏi của người dùng
 * @param {number} timeout - Timeout trong ms (mặc định 30000)
 * @returns {Promise<string>} - Trả lời từ AI
 */
async function askAI(question, timeout = 30000) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY chưa được cấu hình trong .env');
  }

  // Validate input
  if (!question || question.trim().length === 0) {
    throw new Error('Câu hỏi không được để trống');
  }

  if (question.length > 2000) {
    throw new Error('Câu hỏi quá dài (tối đa 2000 ký tự)');
  }

  try {
    console.log('[AI] Sending request to OpenRouter...');
    
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        messages: [
          {
            role: "user",
            content: question
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://discord-bot.local',
          'X-Title': 'Discord Bot'
        },
        timeout: timeout
      }
    );

    console.log('[AI] Response received:', JSON.stringify(response.data, null, 2));

    return response.data.choices[0]?.message?.content || "Không có phản hồi từ AI";
  } catch (error) {
    console.error('[AI] Error:', error.response?.data || error.message);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('AI không phản hồi trong thời gian cho phép. Vui lòng thử lại.');
    }
    
    if (error.response?.data?.error?.message) {
      throw new Error(`Lỗi AI: ${error.response.data.error.message}`);
    }
    
    throw new Error(`Lỗi AI: ${error.message}`);
  }
}

module.exports = {
  askAI
};
