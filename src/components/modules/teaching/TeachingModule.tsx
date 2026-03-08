'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronRight,
  Sparkles,
  Brain,
  Target,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Star,
  Filter,
  Download,
  MoreVertical,
  Send,
  Loader2,
  X,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// ============== 数据类型定义 ==============

interface Student {
  id: string;
  name: string;
  grade: string;
  level: 'A' | 'B' | 'C' | 'D';
  weakPoints: string[];
  lastSession: Date;
  totalSessions: number;
  avatar?: string;
}

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: string;
  objectives: string[];
  content: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  status: 'draft' | 'completed' | 'archived';
}

interface Question {
  id: string;
  type: 'choice' | 'fill' | 'calculation';
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  content: string;
  answer: string;
  points: number;
  createdAt: Date;
}

interface ExamRecord {
  id: string;
  studentId: string;
  studentName: string;
  examTitle: string;
  score: number;
  totalScore: number;
  date: Date;
  analysis: string;
  weakPoints: string[];
  improvement: string[];
}

// ============== 模拟数据 ==============

const mockStudents: Student[] = [
  {
    id: '1',
    name: '张小明',
    grade: '高一',
    level: 'B',
    weakPoints: ['函数', '不等式'],
    lastSession: new Date(Date.now() - 86400000),
    totalSessions: 12,
  },
  {
    id: '2',
    name: '李小红',
    grade: '高二',
    level: 'A',
    weakPoints: ['导数应用'],
    lastSession: new Date(Date.now() - 172800000),
    totalSessions: 20,
  },
  {
    id: '3',
    name: '王小华',
    grade: '高三',
    level: 'C',
    weakPoints: ['立体几何', '解析几何', '概率'],
    lastSession: new Date(Date.now() - 259200000),
    totalSessions: 8,
  },
  {
    id: '4',
    name: '刘小强',
    grade: '高一',
    level: 'B',
    weakPoints: ['三角函数'],
    lastSession: new Date(Date.now() - 86400000),
    totalSessions: 15,
  },
  {
    id: '5',
    name: '陈小美',
    grade: '高二',
    level: 'A',
    weakPoints: [],
    lastSession: new Date(Date.now() - 345600000),
    totalSessions: 25,
  },
];

const mockLessonPlans: LessonPlan[] = [
  {
    id: '1',
    title: '函数的概念与性质',
    subject: '数学',
    grade: '高一',
    objectives: ['理解函数的定义', '掌握函数的三要素', '学会求函数的定义域和值域'],
    content: '通过实例引入函数概念，讲解函数的定义域、值域、对应法则...',
    duration: 90,
    difficulty: 'medium',
    createdAt: new Date(Date.now() - 604800000),
    status: 'completed',
  },
  {
    id: '2',
    title: '导数的几何意义',
    subject: '数学',
    grade: '高二',
    objectives: ['理解导数的几何意义', '掌握切线方程的求法'],
    content: '从曲线的切线入手，讲解导数作为切线斜率的意义...',
    duration: 45,
    difficulty: 'hard',
    createdAt: new Date(Date.now() - 259200000),
    status: 'completed',
  },
  {
    id: '3',
    title: '等差数列',
    subject: '数学',
    grade: '高一',
    objectives: ['理解等差数列的定义', '掌握通项公式'],
    content: '通过生活中的例子引入等差数列...',
    duration: 45,
    difficulty: 'easy',
    createdAt: new Date(),
    status: 'draft',
  },
];

const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'choice',
    difficulty: 'easy',
    tags: ['函数', '定义域'],
    content: '函数 f(x) = √(x-1) 的定义域是？',
    answer: '[1, +∞)',
    points: 5,
    createdAt: new Date(Date.now() - 604800000),
  },
  {
    id: '2',
    type: 'calculation',
    difficulty: 'medium',
    tags: ['导数', '切线'],
    content: '求曲线 y = x³ 在点 (1,1) 处的切线方程。',
    answer: 'y = 3x - 2',
    points: 10,
    createdAt: new Date(Date.now() - 259200000),
  },
  {
    id: '3',
    type: 'fill',
    difficulty: 'hard',
    tags: ['三角函数', '最值'],
    content: '函数 y = sinx + cosx 的最大值是____，最小值是____。',
    answer: '√2, -√2',
    points: 8,
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: '4',
    type: 'choice',
    difficulty: 'medium',
    tags: ['不等式', '解法'],
    content: '不等式 x² - 2x - 3 < 0 的解集是？',
    answer: '(-1, 3)',
    points: 5,
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: '5',
    type: 'calculation',
    difficulty: 'hard',
    tags: ['立体几何', '体积'],
    content: '已知正四棱锥的底面边长为2，高为3，求其体积。',
    answer: '4',
    points: 12,
    createdAt: new Date(),
  },
];

const mockExamRecords: ExamRecord[] = [
  {
    id: '1',
    studentId: '1',
    studentName: '张小明',
    examTitle: '函数单元测试',
    score: 78,
    totalScore: 100,
    date: new Date(Date.now() - 604800000),
    analysis: '对函数概念理解较好，但在定义域求解上存在漏洞。需要加强复合函数的训练。',
    weakPoints: ['复合函数定义域', '抽象函数'],
    improvement: ['多做复合函数练习', '建立错题本'],
  },
  {
    id: '2',
    studentId: '2',
    studentName: '李小红',
    examTitle: '导数综合测试',
    score: 92,
    totalScore: 100,
    date: new Date(Date.now() - 259200000),
    analysis: '导数基础扎实，应用题解题思路清晰。建议增加高难度综合题训练。',
    weakPoints: ['参数讨论'],
    improvement: ['练习含参问题', '总结分类讨论方法'],
  },
  {
    id: '3',
    studentId: '3',
    studentName: '王小华',
    examTitle: '期中模拟考试',
    score: 65,
    totalScore: 100,
    date: new Date(Date.now() - 172800000),
    analysis: '基础薄弱，需要从概念入手重新梳理。立体几何和解析几何得分率低，建议增加练习。',
    weakPoints: ['立体几何', '解析几何', '概率统计', '计算能力'],
    improvement: ['加强基础概念复习', '每日计算练习', '专项突破几何题'],
  },
];

// ============== 辅助函数和配置 ==============

const levelColors: Record<string, string> = {
  A: 'bg-green-500 text-white',
  B: 'bg-blue-500 text-white',
  C: 'bg-amber-500 text-white',
  D: 'bg-red-500 text-white',
};

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  hard: 'bg-red-100 text-red-700 border-red-200',
};

const difficultyLabels: Record<string, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

const typeLabels: Record<string, string> = {
  choice: '选择题',
  fill: '填空题',
  calculation: '计算题',
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// ============== 主组件 ==============

export function TeachingModule() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(mockLessonPlans);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [examRecords, setExamRecords] = useState<ExamRecord[]>(mockExamRecords);
  const [activeTab, setActiveTab] = useState('students');

  // Dialog states
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [isGenerateLessonOpen, setIsGenerateLessonOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: '高一',
    level: 'B' as 'A' | 'B' | 'C' | 'D',
    weakPoints: '',
  });
  const [newQuestion, setNewQuestion] = useState({
    type: 'choice' as 'choice' | 'fill' | 'calculation',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    tags: '',
    content: '',
    answer: '',
    points: 5,
  });
  const [newExam, setNewExam] = useState({
    studentId: '',
    examTitle: '',
    score: 0,
    totalScore: 100,
    analysis: '',
  });
  const [lessonPrompt, setLessonPrompt] = useState({
    topic: '',
    grade: '高一',
    duration: 45,
    objectives: '',
  });
  const [generatedLesson, setGeneratedLesson] = useState<LessonPlan | null>(null);

  // Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionFilter, setQuestionFilter] = useState({
    type: 'all',
    difficulty: 'all',
  });

  // 统计数据
  const totalStudents = students.length;
  const activeStudents = students.filter(s => 
    Date.now() - s.lastSession.getTime() < 7 * 86400000
  ).length;
  const totalQuestions = questions.length;
  const avgScore = examRecords.length > 0 
    ? Math.round(examRecords.reduce((sum, r) => sum + (r.score / r.totalScore) * 100, 0) / examRecords.length)
    : 0;

  // 学生管理操作
  const addStudent = () => {
    if (!newStudent.name.trim()) return;
    const student: Student = {
      id: Date.now().toString(),
      name: newStudent.name,
      grade: newStudent.grade,
      level: newStudent.level,
      weakPoints: newStudent.weakPoints.split(/[,，]/).map(s => s.trim()).filter(Boolean),
      lastSession: new Date(),
      totalSessions: 0,
    };
    setStudents([...students, student]);
    setNewStudent({ name: '', grade: '高一', level: 'B', weakPoints: '' });
    setIsAddStudentOpen(false);
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  // 题库管理操作
  const addQuestion = () => {
    if (!newQuestion.content.trim() || !newQuestion.answer.trim()) return;
    const question: Question = {
      id: Date.now().toString(),
      ...newQuestion,
      tags: newQuestion.tags.split(/[,，]/).map(s => s.trim()).filter(Boolean),
      createdAt: new Date(),
    };
    setQuestions([...questions, question]);
    setNewQuestion({
      type: 'choice',
      difficulty: 'medium',
      tags: '',
      content: '',
      answer: '',
      points: 5,
    });
    setIsAddQuestionOpen(false);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  // 教案生成（模拟AI生成）
  const generateLesson = async () => {
    if (!lessonPrompt.topic.trim()) return;
    setIsGenerating(true);
    
    // 模拟AI生成过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const lesson: LessonPlan = {
      id: Date.now().toString(),
      title: lessonPrompt.topic,
      subject: '数学',
      grade: lessonPrompt.grade,
      objectives: lessonPrompt.objectives 
        ? lessonPrompt.objectives.split(/[,，]/).map(s => s.trim()).filter(Boolean)
        : [`掌握${lessonPrompt.topic}的基本概念`, `能够运用${lessonPrompt.topic}解决问题`],
      content: `## 教学目标\n${lessonPrompt.objectives || '掌握知识点并能够灵活运用'}\n\n## 教学重点\n1. ${lessonPrompt.topic}的定义与性质\n2. 典型例题讲解\n\n## 教学过程\n### 导入（5分钟）\n通过实际问题引入${lessonPrompt.topic}概念...\n\n### 新课讲授（${Math.floor(lessonPrompt.duration * 0.6)}分钟）\n1. 概念讲解\n2. 例题分析\n3. 方法总结\n\n### 练习巩固（${Math.floor(lessonPrompt.duration * 0.25)}分钟）\n布置课堂练习，学生独立完成...\n\n### 课堂小结（5分钟）\n回顾本节课重点内容...\n\n## 课后作业\n完成教材Pxx 练习题`,
      duration: lessonPrompt.duration,
      difficulty: 'medium',
      createdAt: new Date(),
      status: 'draft',
    };
    
    setGeneratedLesson(lesson);
    setIsGenerating(false);
  };

  const saveGeneratedLesson = () => {
    if (generatedLesson) {
      setLessonPlans([...lessonPlans, generatedLesson]);
      setGeneratedLesson(null);
      setLessonPrompt({ topic: '', grade: '高一', duration: 45, objectives: '' });
      setIsGenerateLessonOpen(false);
    }
  };

  // 考试记录操作
  const addExamRecord = () => {
    if (!newExam.studentId || !newExam.examTitle.trim()) return;
    const student = students.find(s => s.id === newExam.studentId);
    if (!student) return;
    
    const record: ExamRecord = {
      id: Date.now().toString(),
      studentId: newExam.studentId,
      studentName: student.name,
      examTitle: newExam.examTitle,
      score: newExam.score,
      totalScore: newExam.totalScore,
      date: new Date(),
      analysis: newExam.analysis || '待分析',
      weakPoints: student.weakPoints,
      improvement: [],
    };
    setExamRecords([record, ...examRecords]);
    setNewExam({ studentId: '', examTitle: '', score: 0, totalScore: 100, analysis: '' });
    setIsAddExamOpen(false);
  };

  // 过滤后的数据
  const filteredStudents = students.filter(s =>
    s.name.includes(studentSearch) || s.grade.includes(studentSearch)
  );

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.content.includes(questionSearch) || 
      q.tags.some(t => t.includes(questionSearch));
    const matchesType = questionFilter.type === 'all' || q.type === questionFilter.type;
    const matchesDifficulty = questionFilter.difficulty === 'all' || q.difficulty === questionFilter.difficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 模块头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-emerald-500" />
            数学教学
          </h1>
          <p className="text-muted-foreground">学生管理、教案生成、题库管理、考试记录</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-3">
            <Award className="w-4 h-4 mr-1 text-yellow-500" />
            平均分 {avgScore}%
          </Badge>
        </div>
      </div>

      {/* 核心数据卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              <span className="text-2xl font-bold">{totalStudents}</span>
            </div>
            <p className="text-sm text-muted-foreground">学生总数</p>
            <p className="text-xs text-emerald-600 mt-1">{activeStudents} 人本周活跃</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold">{lessonPlans.filter(p => p.status === 'completed').length}</span>
            </div>
            <p className="text-sm text-muted-foreground">已完成教案</p>
            <p className="text-xs text-blue-600 mt-1">{lessonPlans.filter(p => p.status === 'draft').length} 份草稿</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold">{totalQuestions}</span>
            </div>
            <p className="text-sm text-muted-foreground">题库总量</p>
            <p className="text-xs text-purple-600 mt-1">
              {questions.filter(q => q.difficulty === 'hard').length} 道难题
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold">{examRecords.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">考试记录</p>
            <p className="text-xs text-amber-600 mt-1">AI分析已开启</p>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students" className="gap-1">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">学生管理</span>
          </TabsTrigger>
          <TabsTrigger value="lessons" className="gap-1">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">教案生成</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="gap-1">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">题库管理</span>
          </TabsTrigger>
          <TabsTrigger value="exams" className="gap-1">
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">考试记录</span>
          </TabsTrigger>
        </TabsList>

        {/* 学生管理 */}
        <TabsContent value="students" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">学生列表</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索学生..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[200px]"
                />
              </div>
              <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 shrink-0">
                    <Plus className="w-4 h-4" />
                    添加学生
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>添加新学生</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>姓名</Label>
                      <Input
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        placeholder="输入学生姓名"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>年级</Label>
                        <Select
                          value={newStudent.grade}
                          onValueChange={(value) => setNewStudent({ ...newStudent, grade: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="高一">高一</SelectItem>
                            <SelectItem value="高二">高二</SelectItem>
                            <SelectItem value="高三">高三</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>水平等级</Label>
                        <Select
                          value={newStudent.level}
                          onValueChange={(value: 'A' | 'B' | 'C' | 'D') => setNewStudent({ ...newStudent, level: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A - 优秀</SelectItem>
                            <SelectItem value="B">B - 良好</SelectItem>
                            <SelectItem value="C">C - 一般</SelectItem>
                            <SelectItem value="D">D - 待提高</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>薄弱知识点（逗号分隔）</Label>
                      <Input
                        value={newStudent.weakPoints}
                        onChange={(e) => setNewStudent({ ...newStudent, weakPoints: e.target.value })}
                        placeholder="如：函数, 不等式, 导数"
                      />
                    </div>
                    <Button onClick={addStudent} className="w-full">添加学生</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium">{student.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{student.grade}</span>
                              <Badge className={cn('text-xs px-1.5', levelColors[student.level])}>
                                {student.level}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit2 className="w-4 h-4 mr-2" />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => deleteStudent(student.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {student.weakPoints.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {student.weakPoints.map((point, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {point}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <Separator className="my-3" />
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          上课 {student.totalSessions} 次
                        </span>
                        <span>
                          最近: {student.lastSession.toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* 教案生成 */}
        <TabsContent value="lessons" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">教案管理</h3>
            <Dialog open={isGenerateLessonOpen} onOpenChange={setIsGenerateLessonOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Sparkles className="w-4 h-4" />
                  AI生成教案
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    AI教案生成器
                  </DialogTitle>
                </DialogHeader>
                
                {!generatedLesson ? (
                  <div className="space-y-4">
                    <div>
                      <Label>教学主题</Label>
                      <Input
                        value={lessonPrompt.topic}
                        onChange={(e) => setLessonPrompt({ ...lessonPrompt, topic: e.target.value })}
                        placeholder="例如：二次函数的图像与性质"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>适用年级</Label>
                        <Select
                          value={lessonPrompt.grade}
                          onValueChange={(value) => setLessonPrompt({ ...lessonPrompt, grade: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="高一">高一</SelectItem>
                            <SelectItem value="高二">高二</SelectItem>
                            <SelectItem value="高三">高三</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>课时长度（分钟）</Label>
                        <Input
                          type="number"
                          value={lessonPrompt.duration}
                          onChange={(e) => setLessonPrompt({ ...lessonPrompt, duration: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>教学目标（逗号分隔，可选）</Label>
                      <Textarea
                        value={lessonPrompt.objectives}
                        onChange={(e) => setLessonPrompt({ ...lessonPrompt, objectives: e.target.value })}
                        placeholder="例如：理解概念, 掌握公式, 学会应用"
                        rows={2}
                      />
                    </div>
                    <Button 
                      onClick={generateLesson} 
                      className="w-full"
                      disabled={isGenerating || !lessonPrompt.topic.trim()}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          正在生成...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          开始生成
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{generatedLesson.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{generatedLesson.grade}</Badge>
                          <Badge variant="outline">{generatedLesson.duration}分钟</Badge>
                        </div>
                      </div>
                      <div className="mb-3">
                        <span className="text-sm font-medium">教学目标：</span>
                        <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
                          {generatedLesson.objectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-sm whitespace-pre-wrap bg-background rounded p-3 max-h-60 overflow-y-auto">
                        {generatedLesson.content}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setGeneratedLesson(null)} className="flex-1">
                        重新生成
                      </Button>
                      <Button onClick={saveGeneratedLesson} className="flex-1">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        保存教案
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {lessonPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {plan.title}
                          <Badge variant="outline">{plan.grade}</Badge>
                          <Badge className={cn('text-xs', difficultyColors[plan.difficulty])}>
                            {difficultyLabels[plan.difficulty]}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {plan.duration}分钟 · {plan.createdAt.toLocaleDateString('zh-CN')}
                        </CardDescription>
                      </div>
                      <Badge variant={plan.status === 'completed' ? 'default' : 'secondary'}>
                        {plan.status === 'completed' && '已完成'}
                        {plan.status === 'draft' && '草稿'}
                        {plan.status === 'archived' && '已归档'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <span className="text-sm font-medium">教学目标：</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {plan.objectives.map((obj, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {obj}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {plan.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <Button variant="ghost" size="sm">
                        查看详情
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* 题库管理 */}
        <TabsContent value="questions" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">题库列表</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索题目..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[200px]"
                />
              </div>
              <Select
                value={questionFilter.type}
                onValueChange={(value) => setQuestionFilter({ ...questionFilter, type: value })}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="题型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部题型</SelectItem>
                  <SelectItem value="choice">选择题</SelectItem>
                  <SelectItem value="fill">填空题</SelectItem>
                  <SelectItem value="calculation">计算题</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={questionFilter.difficulty}
                onValueChange={(value) => setQuestionFilter({ ...questionFilter, difficulty: value })}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="难度" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部难度</SelectItem>
                  <SelectItem value="easy">简单</SelectItem>
                  <SelectItem value="medium">中等</SelectItem>
                  <SelectItem value="hard">困难</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 shrink-0">
                    <Plus className="w-4 h-4" />
                    添加题目
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>添加新题目</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>题型</Label>
                        <Select
                          value={newQuestion.type}
                          onValueChange={(value: 'choice' | 'fill' | 'calculation') => 
                            setNewQuestion({ ...newQuestion, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="choice">选择题</SelectItem>
                            <SelectItem value="fill">填空题</SelectItem>
                            <SelectItem value="calculation">计算题</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>难度</Label>
                        <Select
                          value={newQuestion.difficulty}
                          onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                            setNewQuestion({ ...newQuestion, difficulty: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">简单</SelectItem>
                            <SelectItem value="medium">中等</SelectItem>
                            <SelectItem value="hard">困难</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>题目内容</Label>
                      <Textarea
                        value={newQuestion.content}
                        onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                        placeholder="输入题目内容..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>答案</Label>
                      <Textarea
                        value={newQuestion.answer}
                        onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                        placeholder="输入答案..."
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>知识点标签（逗号分隔）</Label>
                        <Input
                          value={newQuestion.tags}
                          onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                          placeholder="如：函数, 导数"
                        />
                      </div>
                      <div>
                        <Label>分值</Label>
                        <Input
                          type="number"
                          value={newQuestion.points}
                          onChange={(e) => setNewQuestion({ ...newQuestion, points: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <Button onClick={addQuestion} className="w-full">添加题目</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <ScrollArea className="max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">题型</TableHead>
                    <TableHead>题目内容</TableHead>
                    <TableHead className="w-[80px]">难度</TableHead>
                    <TableHead className="w-[150px]">知识点</TableHead>
                    <TableHead className="w-[60px]">分值</TableHead>
                    <TableHead className="w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>
                        <Badge variant="outline">{typeLabels[question.type]}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="line-clamp-1">{question.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            答案: {question.answer}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={difficultyColors[question.difficulty]}>
                          {difficultyLabels[question.difficulty]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {question.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {question.points}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => deleteQuestion(question.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* 考试记录 */}
        <TabsContent value="exams" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">考试记录</h3>
            <Dialog open={isAddExamOpen} onOpenChange={setIsAddExamOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="w-4 h-4" />
                  添加记录
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加考试记录</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>学生</Label>
                    <Select
                      value={newExam.studentId}
                      onValueChange={(value) => setNewExam({ ...newExam, studentId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择学生" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} ({student.grade})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>考试名称</Label>
                    <Input
                      value={newExam.examTitle}
                      onChange={(e) => setNewExam({ ...newExam, examTitle: e.target.value })}
                      placeholder="如：期中考试、单元测试"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>得分</Label>
                      <Input
                        type="number"
                        value={newExam.score}
                        onChange={(e) => setNewExam({ ...newExam, score: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>满分</Label>
                      <Input
                        type="number"
                        value={newExam.totalScore}
                        onChange={(e) => setNewExam({ ...newExam, totalScore: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>分析备注（可选）</Label>
                    <Textarea
                      value={newExam.analysis}
                      onChange={(e) => setNewExam({ ...newExam, analysis: e.target.value })}
                      placeholder="输入考试分析..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={addExamRecord} className="w-full">保存记录</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {examRecords.map((record, index) => {
              const scorePercent = (record.score / record.totalScore) * 100;
              const isGood = scorePercent >= 80;
              const isMedium = scorePercent >= 60 && scorePercent < 80;
              
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {record.studentName}
                            <span className="text-muted-foreground font-normal">- {record.examTitle}</span>
                          </CardTitle>
                          <CardDescription>
                            {record.date.toLocaleDateString('zh-CN')}
                          </CardDescription>
                        </div>
                        <div className={cn(
                          'text-2xl font-bold',
                          isGood && 'text-green-600',
                          isMedium && 'text-amber-600',
                          !isGood && !isMedium && 'text-red-600'
                        )}>
                          {record.score}/{record.totalScore}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-3">
                        <Progress 
                          value={scorePercent} 
                          className={cn(
                            'h-2',
                            isGood && '[&>div]:bg-green-500',
                            isMedium && '[&>div]:bg-amber-500',
                            !isGood && !isMedium && '[&>div]:bg-red-500'
                          )}
                        />
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium">AI 分析</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {record.analysis}
                        </p>
                      </div>
                      
                      {record.weakPoints.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-destructive flex items-center gap-1 mb-1">
                            <AlertCircle className="w-3 h-3" />
                            薄弱知识点
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {record.weakPoints.map((point, i) => (
                              <Badge key={i} variant="destructive" className="text-xs">
                                {point}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {record.improvement.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-emerald-600 flex items-center gap-1 mb-1">
                            <Target className="w-3 h-3" />
                            改进建议
                          </span>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {record.improvement.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
