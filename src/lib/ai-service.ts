// ==========================================
// 客户端 AI 服务
// 用于 APK 版本直接调用 AI API
// ==========================================

// AI API 配置
const AI_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// 从环境变量获取 API Key（需要在 .env 中配置）
const getApiKey = () => {
  // 优先使用环境变量
  if (typeof window !== 'undefined') {
    // 客户端：从 localStorage 获取用户设置的 API Key
    return localStorage.getItem('ai_api_key') || '';
  }
  return process.env.Z_API_KEY || '';
};

// AI 对话类型
export type AiChatType = 'chat' | 'emotion' | 'advice' | 'companion';

// AI 消息
export interface AiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 系统提示词
const SYSTEM_PROMPTS: Record<AiChatType, string> = {
  chat: `你是一个温暖、专业的个人成长AI助手。你的职责是：
1. 帮助用户进行时间管理和目标规划
2. 提供情绪支持和心理疏导
3. 给出实用的生活建议和成长指导
4. 以积极、鼓励的语调与用户交流
请用简洁、温暖的语言回复用户，避免过长的回复。`,
  
  emotion: `你是一个专业的心理咨询师。你擅长：
1. 倾听用户的情绪表达
2. 理解和共情用户的感受
3. 提供情绪调节的建议
4. 帮助用户走出情绪困境
请用温暖、包容的语言回复，让用户感到被理解和支持。`,
  
  advice: `你是一个人生导师和顾问。你擅长：
1. 提供实用的生活建议
2. 帮助用户制定行动计划
3. 分解复杂问题为可执行的步骤
4. 给出专业、客观的分析
请用清晰、有条理的语言回复，给出具体的行动建议。`,
  
  companion: `你是一个温暖的成长伙伴。你的职责是：
1. 鼓励用户坚持目标
2. 庆祝用户的每一个小成就
3. 在用户低落时给予支持
4. 分享积极向上的能量
请用热情、鼓励的语言回复，传递正能量。`,
};

// 发送 AI 消息
export async function sendAiMessage(
  message: string,
  type: AiChatType = 'chat',
  context: AiMessage[] = []
): Promise<string> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return '⚠️ 请先设置 AI API Key。\n\n设置方法：\n1. 访问 https://open.bigmodel.cn\n2. 注册并获取 API Key\n3. 在设置中填入 API Key';
  }

  try {
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS[type] },
          ...context.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '抱歉，我暂时无法回复。';
  } catch (error) {
    console.error('AI chat error:', error);
    return '抱歉，AI 服务暂时不可用。请检查网络连接或 API Key 设置。';
  }
}

// 设置 API Key
export function setApiKey(key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ai_api_key', key);
  }
}

// 获取 API Key（部分显示）
export function getApiKeyMasked(): string {
  const key = getApiKey();
  if (!key) return '';
  return key.slice(0, 8) + '****' + key.slice(-4);
}

// 检查 API Key 是否已设置
export function hasApiKey(): boolean {
  return !!getApiKey();
}
