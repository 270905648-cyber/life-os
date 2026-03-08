import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// 初始化 SDK
const z = new ZAI({
  apiKey: process.env.Z_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, type = 'chat', context = [] } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: '消息不能为空' },
        { status: 400 }
      );
    }

    // 调用AI服务
    const response = await z.llm.chat({
      messages: [
        {
          role: 'system',
          content: `你是一个温暖、专业的个人成长AI助手。你的职责是：
1. 帮助用户进行时间管理和目标规划
2. 提供情绪支持和心理疏导
3. 给出实用的生活建议和成长指导
4. 以积极、鼓励的语调与用户交流

请用简洁、温暖的语言回复用户，避免过长的回复。`
        },
        ...context.map((msg: { role: string; content: string }) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ],
      model: 'glm-4-flash'
    });

    return NextResponse.json({
      success: true,
      data: {
        content: response.choices[0]?.message?.content || '抱歉，我暂时无法回复。',
        type
      }
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { success: false, error: 'AI服务暂时不可用，请稍后再试' },
      { status: 500 }
    );
  }
}
