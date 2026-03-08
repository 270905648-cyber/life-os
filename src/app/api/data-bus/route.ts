import { NextRequest, NextResponse } from 'next/server';
import { dataBus } from '@/lib/data-bus';
import type { ModuleCode } from '@/types';

// 获取模块数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleCode = searchParams.get('module') as ModuleCode | null;
    const type = searchParams.get('type');

    if (!moduleCode || !type) {
      // 返回所有模块摘要
      const summary = await dataBus.getAllModulesSummary();
      return NextResponse.json({
        success: true,
        data: summary
      });
    }

    const data = await dataBus.read(moduleCode, type);

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Data bus read error:', error);
    return NextResponse.json(
      { success: false, error: '获取数据失败' },
      { status: 500 }
    );
  }
}

// 发布数据到总线（仅模块内部使用）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { module: moduleCode, type, data } = body;

    if (!moduleCode || !type) {
      return NextResponse.json(
        { success: false, error: '模块和类型不能为空' },
        { status: 400 }
      );
    }

    await dataBus.publish(moduleCode as ModuleCode, type, data);

    return NextResponse.json({
      success: true,
      message: '数据已发布到总线'
    });
  } catch (error) {
    console.error('Data bus publish error:', error);
    return NextResponse.json(
      { success: false, error: '发布数据失败' },
      { status: 500 }
    );
  }
}

// 清除缓存
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleCode = searchParams.get('module') as ModuleCode | null;

    dataBus.clearCache(moduleCode || undefined);

    return NextResponse.json({
      success: true,
      message: moduleCode ? `模块 ${moduleCode} 缓存已清除` : '所有缓存已清除'
    });
  } catch (error) {
    console.error('Data bus clear error:', error);
    return NextResponse.json(
      { success: false, error: '清除缓存失败' },
      { status: 500 }
    );
  }
}
