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
  Smile,
  Frown,
  Meh,
  Loader2,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { aiChatStore, initDefaultData } from '@/lib/local-db';
import { sendAiMessage, setApiKey, getApiKeyMasked, hasApiKey, type AiChatType } from '@/lib/ai-service';
import { cn } from '@/lib/utils';

const emotionOptions = [
  { type: 'happy', icon: <Smile className="w-4 h-4" />, label: '开心', color: 'text-green-500' },
  { type: 'calm', icon: <Meh className="w-4 h-4" />, label: '平静', color: 'text-blue-500' },
  { type: 'anxious', icon: <Frown className="w-4 h-4" />, label: '焦虑', color: 'text-amber-500' },
  { type: 'sad', icon: <Frown className="w-4 h-4" />, label: '低落', color: 'text-purple-500' },
];

const quickActions = [
  { icon: <Heart className="w-4 h-4" />, label: '情绪倾诉', type: 'emotion' as AiChatType },
  { icon: <Lightbulb className="w-4 h-4" />, label: '获取建议', type: 'advice' as AiChatType },
  { icon: <Sparkles className="w-4 h-4" />, label: '成长激励', type: 'companion' as AiChatType },
];

interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: AiChatType;
  createdAt: Date;
}

export function AiAssistant() {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 加载历史消息 - 必须在 useEffect 之前定义
  const loadMessages = async () => {
    const stored = await aiChatStore.getAll();
    setMessages(stored.map(m => ({
      ...m,
      createdAt: new Date(m.createdAt)
    })).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()));
  };

  // 初始化
  useEffect(() => {
    initDefaultData().then(() => {
      loadMessages();
      setHasKey(hasApiKey());
    });
  }, []);

  // 滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 保存消息
  const saveMessage = async (msg: AiMessage) => {
    await aiChatStore.save({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      type: msg.type,
      createdAt: msg.createdAt.toISOString()
    });
  };

  // 发送消息
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AiMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      type: 'chat',
      createdAt: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    await saveMessage(userMessage);
    setInput('');
    setIsLoading(true);

    // 获取 AI 回复
    const context = messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }));

    const reply = await sendAiMessage(input, 'chat', context);

    const aiMessage: AiMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: reply,
      type: 'chat',
      createdAt: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    await saveMessage(aiMessage);
    setIsLoading(false);
  };

  // 快捷操作
  const handleQuickAction = (type: AiChatType) => {
    const prompts: Record<AiChatType, string> = {
      chat: '你好！',
      emotion: '我想聊聊今天的心情...',
      advice: '请给我一些关于时间管理的建议',
      companion: '我今天有点累，需要一些鼓励'
    };
    setInput(prompts[type]);
  };

  // 情绪选择
  const handleEmotionSelect = (emotion: string) => {
    setCurrentEmotion(emotion);
    const prompts: Record<string, string> = {
      happy: '今天心情很不错！',
      calm: '今天状态比较平静',
      anxious: '最近有点焦虑，想找人聊聊',
      sad: '今天心情不太好...',
    };
    setInput(prompts[emotion] || '');
  };

  // 保存 API Key
  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setHasKey(true);
      setIsSettingsOpen(false);
      setApiKeyInput('');
    }
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
                <div className="flex items-center gap-2">
                  <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>AI 设置</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>API Key</Label>
                          <p className="text-xs text-muted-foreground mb-2">
                            从 open.bigmodel.cn 获取
                          </p>
                          <Input
                            type="password"
                            value={apiKeyInput}
                            onChange={(e) => setApiKeyInput(e.target.value)}
                            placeholder="输入你的 API Key"
                          />
                          {hasKey && (
                            <p className="text-xs text-green-600 mt-1">
                              当前: {getApiKeyMasked()}
                            </p>
                          )}
                        </div>
                        <Button onClick={handleSaveApiKey} className="w-full">
                          保存
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
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
                  {!hasKey && (
                    <p className="text-xs text-amber-600 mt-2">
                      请先在设置中配置 API Key
                    </p>
                  )}
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
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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

      {/* 浮动按钮 */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg flex items-center justify-center z-50"
        >
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
