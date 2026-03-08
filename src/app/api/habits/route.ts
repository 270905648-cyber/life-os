import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 获取习惯列表
export async function GET(request: NextRequest) {
  try {
    const habits = await db.habit.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      include: {
        logs: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }
      }
    });

    // 添加今日完成状态
    const habitsWithStatus = habits.map(habit => ({
      ...habit,
      todayCompleted: habit.logs.length > 0 && habit.logs[0].completed
    }));

    return NextResponse.json({
      success: true,
      data: habitsWithStatus
    });
  } catch (error) {
    console.error('Get habits error:', error);
    return NextResponse.json(
      { success: false, error: '获取习惯列表失败' },
      { status: 500 }
    );
  }
}

// 创建习惯
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon, color, description, frequency, targetDays, points, module } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: '习惯名称不能为空' },
        { status: 400 }
      );
    }

    const habit = await db.habit.create({
      data: {
        name,
        icon,
        color,
        description,
        frequency: frequency || 'daily',
        targetDays: targetDays ? JSON.stringify(targetDays) : null,
        points: points || 10,
        module,
        userId: 'user-1'
      }
    });

    return NextResponse.json({
      success: true,
      data: habit,
      message: '习惯创建成功'
    });
  } catch (error) {
    console.error('Create habit error:', error);
    return NextResponse.json(
      { success: false, error: '创建习惯失败' },
      { status: 500 }
    );
  }
}

// 打卡
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { habitId, completed = true, note } = body;

    if (!habitId) {
      return NextResponse.json(
        { success: false, error: '习惯ID不能为空' },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 检查今日是否已打卡
    const existingLog = await db.habitLog.findUnique({
      where: {
        habitId_date: {
          habitId,
          date: today
        }
      }
    });

    let log;
    let habit;

    if (existingLog) {
      // 更新打卡记录
      log = await db.habitLog.update({
        where: { id: existingLog.id },
        data: { completed, note }
      });
    } else {
      // 创建新打卡记录
      log = await db.habitLog.create({
        data: {
          habitId,
          userId: 'user-1',
          date: today,
          completed,
          note
        }
      });
    }

    // 更新习惯统计
    if (completed) {
      habit = await db.habit.update({
        where: { id: habitId },
        data: {
          streak: { increment: 1 },
          totalDays: { increment: 1 }
        }
      });

      // 增加积分
      const habitData = await db.habit.findUnique({ where: { id: habitId } });
      if (habitData && habitData.points > 0) {
        await db.pointRecord.create({
          data: {
            userId: 'user-1',
            points: habitData.points,
            type: 'earn',
            source: 'habit',
            description: `完成习惯：${habitData.name}`,
            balance: 0
          }
        });
      }
    } else {
      habit = await db.habit.update({
        where: { id: habitId },
        data: {
          streak: { decrement: 1 },
          totalDays: { decrement: 1 }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: { log, habit },
      message: completed ? '打卡成功！继续保持！' : '已取消打卡'
    });
  } catch (error) {
    console.error('Toggle habit error:', error);
    return NextResponse.json(
      { success: false, error: '打卡操作失败' },
      { status: 500 }
    );
  }
}
