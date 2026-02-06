import { NextResponse } from 'next/server';
import { getCurrentUser, hasAIAccess } from '@/lib/auth';

// POST /api/ai/email/draft - AI-powered email drafting
export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const hasAccess = await hasAIAccess(user.id);
        if (!hasAccess) {
            return NextResponse.json({
                error: 'AI features require Pro or Enterprise subscription'
            }, { status: 403 });
        }

        const body = await request.json();
        const { recipientName, context, tone } = body;

        const prompt = `Draft a professional ${tone || 'business'} email for ${recipientName}. Context: ${context}`;

        const response = await fetch('https://apifreellm.com/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.APIFREE_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert business email writer. Draft clear, professional, and effective emails.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            }),
        });

        const data = await response.json();

        return NextResponse.json({
            email: data.choices[0].message.content,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
