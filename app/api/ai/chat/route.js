import { NextResponse } from 'next/server';
import { hasAIAccess } from '@/lib/auth';

export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user has AI access (premium tier)
        const hasAccess = await hasAIAccess(user.id);
        if (!hasAccess) {
            return NextResponse.json({
                error: 'AI features are only available for Pro and Enterprise tiers',
                upgrade_required: true
            }, { status: 403 });
        }

        const body = await request.json();
        const { prompt, context } = body;

        // Call Apifree API
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
                        content: 'You are an AI assistant for VisionQuantech Business Suite. Help users with business tasks.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error('AI service unavailable');
        }

        const data = await response.json();

        return NextResponse.json({
            response: data.choices[0].message.content,
            usage: data.usage,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
