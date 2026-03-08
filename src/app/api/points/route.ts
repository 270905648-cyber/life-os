import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 获取积分记录
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');

    const where: Record<string, unknown> = {
      userId: 'user-1'
    };

    if (type) {
      where.type = type;
    }

    const records = await db.pointRecord.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    // 计算总积分
    const earned = await db.pointRecord.aggregate({
      where: { type: 'earn', userId: 'user-1' },
      _sum: { points: true }
    });

    const spent = await db.pointRecord.aggregate({
      where: { type: 'spend', userId: 'user-1' },
      _sum: { points: true }
    });

    const totalPoints = (earned._sum.points || 0) - (spent._sum.points || 0);

    return NextResponse.json({
      success: true,
      data: {
        records,
        summary: {
          totalPoints,
          earned: earned._sum.points || 0,
          spent: spent._sum.points || 0
        }
      }
    });
  } catch (error) {
    console.error('Get points error:', error);
    return NextResponse.json(
      { success: false, error: '获取积分记录失败' },
      { status: 500 }
    );
  }
}

// 增加积分
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { points, source, description } = body;

    if (!points || points <= 0) {
      return NextResponse.json(
        { success: false, error: '积分数量无效' },
        { status: 400 }
      );
    }

    // 计算当前余额
    const earned = await db.pointRecord.aggregate({
      where: { type: 'earn', userId: 'user-1' },
      _sum: { points: true }
    });

    const spent = await db.pointRecord.aggregate({
      where: { type: 'spend', userId: 'user-1' },
      _sum: { points: true }
    });

    const currentBalance = (earned._sum.points || 0) - (spent._sum.points || 0);
    const newBalance = currentBalance + points;

    const record = await db.pointRecord.create({
      data: {
        userId: 'user-1',
        points,
        type: 'earn',
        source: source || 'manual',
        description,
        balance: newBalance
      }
    });

    // 更新用户积分
    await db.user.update({
      where: { id: 'user-1' },
      data: {
        totalPoints: newBalance
      }
    });

    return NextResponse.json({
      success: true,
      data: record,
      message: `获得 ${points} 积分！`
    });
  } catch (error) {
    console.error('Add points error:', error);
    return NextResponse.json(
      { success: false, error: '增加积分失败' },
      { status: 500 }
    );
  }
}

// 消耗积分
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { points, source, description } = body;

    if (!points || points <= 0) {
      return NextResponse.json(
        { success: false, error: '积分数量无效' },
        { status: 400 }
      );
    }

    // 检查余额
    const earned = await db.pointRecord.aggregate({
      where: { type: 'earn', userId: 'user-1' },
      _sum: { points: true }
    });

    const spent = await db.pointRecord.aggregate({
      where: { type: 'spend', userId: 'user-1' },
      _sum: { points: true }
    });

    const currentBalance = (earned._sum.points || 0) - (spent._sum.points || 0);

    if (currentBalance < points) {
      return NextResponse.json(
        { success: false, error: '积分不足' },
        { status: 400 }
      );
    }

    const newBalance = currentBalance - points;

    const record = await db.pointRecord.create({
      data: {
        userId: 'user-1',
        points,
        type: 'spend',
        source: source || 'redeem',
        description,
        balance: newBalance
      }
    });

    // 更新用户积分
    await db.user.update({
      where: { id: 'user-1' },
      data: {
        totalPoints: newBalance
      }
    });

    return NextResponse.json({
      success: true,
      data: record,
      message: `消耗 ${points} 积分`
    });
  } catch (error) {
    console.error('Spend points error:', error);
    return NextResponse.json(
      { success: false, error: '消耗积分失败' },
      { status: 500 }
    );
  }
}
