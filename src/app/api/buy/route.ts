import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { user_id, item_id, quantity } = body;

        if (!user_id || !item_id) {
            return NextResponse.json({ error: 'User ID and Item ID required' }, { status: 400 });
        }

        const qty = parseInt(quantity || '1');

        // Use a transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Check stock
            const item = await tx.item.findUnique({
                where: { id: parseInt(item_id) },
            });

            if (!item) {
                throw new Error('Item not found');
            }

            // 2. Decrement stock
            const updatedItem = await tx.item.update({
                where: { id: parseInt(item_id) },
                data: { stock: item.stock - qty },
            });

            // 3. Log transaction
            await tx.transaction.create({
                data: {
                    userId: parseInt(user_id),
                    itemId: parseInt(item_id),
                    quantity: qty,
                },
            });

            return updatedItem;
        });

        return NextResponse.json({ success: true, new_stock: result.stock });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Error processing purchase' }, { status: 500 });
    }
}
