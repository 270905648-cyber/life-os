import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 获取任务列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period');
    const moduleCode = searchParams.get('module');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    
    if (period) {
      where.period = period;
    }
    if (moduleCode) {
      where.module = moduleCode;
    }
    if (status) {
      where.status = status;
    }

    const tasks = await db.task.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { success: false, error: '获取任务列表失败' },
      { status: 500 }
    );
  }
}

// 创建任务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, period, module: taskModule, moduleId, priority, points, dueDate } = body;

    if (!title || !period) {
      return NextResponse.json(
        { success: false, error: '标题和时间周期不能为空' },
        { status: 400 }
      );
    }

    const task = await db.task.create({
      data: {
        title,
        description,
        period,
        module: taskModule,
        moduleId,
        priority: priority || 'medium',
        points: points || 0,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: 'user-1' // 临时用户ID
      }
    });

    return NextResponse.json({
      success: true,
      data: task,
      message: '任务创建成功'
    });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { success: false, error: '创建任务失败' },
      { status: 500 }
    );
  }
}

// 更新任务状态
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: '任务ID和状态不能为空' },
        { status: 400 }
      );
    }

    const task = await db.task.update({
      where: { id },
      data: {
        status,
        completedAt: status === 'completed' ? new Date() : null
      }
    });

    // 如果任务完成，增加积分
    if (status === 'completed' && task.points > 0) {
      await db.pointRecord.create({
        data: {
          userId: 'user-1',
          points: task.points,
          type: 'earn',
          source: 'task',
          description: `完成任务：${task.title}`,
          balance: 0 // 需要计算
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: task,
      message: status === 'completed' ? '恭喜完成任务！' : '任务状态已更新'
    });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { success: false, error: '更新任务失败' },
      { status: 500 }
    );
  }
}

// 删除任务
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: '任务ID不能为空' },
        { status: 400 }
      );
    }

    await db.task.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: '任务已删除'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { success: false, error: '删除任务失败' },
      { status: 500 }
    );
  }
}
