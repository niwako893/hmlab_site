import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const items = await prisma.item.findMany({
        orderBy: { name: 'asc' },
    });
    return NextResponse.json(items);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, stock, unit } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const newItem = await prisma.item.create({
            data: {
                name,
                stock: parseInt(stock || '0'),
                unit: unit || 'pcs',
            },
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error creating item' }, { status: 400 });
    }
}
