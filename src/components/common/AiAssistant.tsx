'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Heart, 
  Lightbulb,
  MessageCircle,
  Smile,
  Frown,
  Meh,
  Zap,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAiStore, useEmotionStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';
import type { AiMessage, EmotionType } from '@/types';

const emotionOptions: { type: EmotionType; icon: React.ReactNode; label: string; color: string }[] = [
  { type: 'happy', icon: <Smile className="w-4 h-4" />, label: '开心', color: 'text-green-500' },
  { type: 'calm', icon: <Meh className="w-4 h-4" />, label: '平静', color: 'text-blue-500' },
  { type: 'anxious', icon: <Frown className="w-4 h-4" />, label: '焦虑', color: 'text-amber-500' },
  { type: 'sad', icon: <Frown className="w-4 h-4" />, label: '低落', color: 'text-purple-500' },
];

const quickActions = [
  { icon: <Heart className="w-4 h-4" />, label: '情绪倾诉', type: 'emotion' },
  { icon: <Lightbulb className="w-4 h-4" />, label: '获取建议', type: 'advice' },
  { icon: <Sparkles className="w-4 h-4" />, label: '成长激励', type: 'companion' },
];

export function AiAssistant() {
  const { messages, isOpen, addMessage, setOpen } = useAiStore();
  const { currentEmotion, setEmotion } = useEmotionStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AiMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      type: 'chat',
      createdAt: new Date()
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    // 模拟AI响应
    setTimeout(() => {
      const aiMessage: AiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAiResponse(input),
        type: 'chat',
        createdAt: new Date()
      };
      addMessage(aiMessage);
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickAction = (type: string) => {
    const prompts: Record<string, string> = {
      emotion: '我想聊聊今天的心情...',
      advice: '请给我一些关于时间管理的建议',
      companion: '我今天有点累，需要一些鼓励'
    };
    setInput(prompts[type] || '');
  };

  const handleEmotionSelect = (emotion: EmotionType) => {
    setEmotion(emotion, 5);
    const prompts: Record<EmotionType, string> = {
      happy: '今天心情很不错！',
      calm: '今天状态比较平静',
      anxious: '最近有点焦虑，想找人聊聊',
      sad: '今天心情不太好...',
      excited: '今天非常兴奋！',
      neutral: '状态一般',
      angry: '今天有点生气',
      tired: '感觉很疲惫'
    };
    setInput(prompts[emotion]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-4 right-4 w-[380px] max-w-[calc(100vw-2rem)] z-50"
        >
          <div className="bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* 头部 */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI 助手</h3>
                    <p className="text-xs text-muted-foreground">随时陪伴，智能赋能</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 情绪选择 */}
            <div className="p-3 border-b border-border bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">今天感觉如何？</p>
              <div className="flex gap-2">
                {emotionOptions.map((emotion) => (
                  <Button
                    key={emotion.type}
                    variant={currentEmotion === emotion.type ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      "flex-1 gap-1",
                      currentEmotion === emotion.type && "bg-primary"
                    )}
                    onClick={() => handleEmotionSelect(emotion.type)}
                  >
                    <span className={cn(currentEmotion !== emotion.type && emotion.color)}>
                      {emotion.icon}
                    </span>
                    <span className="text-xs">{emotion.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* 消息列表 */}
            <ScrollArea className="h-[300px] p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Bot className="w-12 h-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">你好！我是你的AI助手</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    可以和我聊天、倾诉或寻求建议
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex",
                        message.role === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] px-4 py-2 rounded-2xl",
                          message.role === 'user'
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted rounded-bl-md"
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-md">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* 快捷操作 */}
            <div className="p-3 border-t border-border bg-muted/30">
              <div className="flex gap-2 mb-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.type}
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1 text-xs"
                    onClick={() => handleQuickAction(action.type)}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 输入框 */}
            <div className="p-3 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入消息..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 简单的AI响应生成（实际项目中应调用后端API）
function generateAiResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('心情') || lowerInput.includes('情绪')) {
    return '我能理解你的感受。每个人都有起伏，这很正常。要不要和我聊聊发生了什么？或者我可以给你一些调节情绪的小建议。';
  }
  
  if (lowerInput.includes('焦虑') || lowerInput.includes('压力')) {
    return '焦虑是对未知的正常反应。试试深呼吸练习：吸气4秒，屏息4秒，呼气4秒。另外，把大任务拆成小步骤，一步一步来，会感觉好很多。';
  }
  
  if (lowerInput.includes('建议') || lowerInput.includes('如何')) {
    return '这是一个很好的问题！根据你的情况，我建议：1. 设定明确的目标；2. 优先处理重要任务；3. 适当休息保持精力。需要更具体的建议吗？';
  }
  
  if (lowerInput.includes('累') || lowerInput.includes('疲惫')) {
    return '辛苦了！记得适时休息。你已经做得很棒了，不要对自己太苛刻。试试听首喜欢的歌，或者泡杯茶放松一下？';
  }
  
  if (lowerInput.includes('开心') || lowerInput.includes('高兴')) {
    return '太棒了！🎉 看到你心情好，我也很开心！保持这份好心情，它会给你带来更多正能量。';
  }
  
  return '我理解你的意思。有什么我可以帮助你的吗？无论是学习建议、情绪支持还是日常规划，我都很乐意协助你。';
}
