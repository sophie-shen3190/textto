import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAuth } from '@/core/auth';
import { normalise } from '@/app/api/playground/normalise';
import { getUserParseJobs } from '@/shared/lib/supabase-rest';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ code: 401, jobs: [] });
    }

    const limit = parseInt(request.nextUrl.searchParams.get('limit') ?? '30');
    const rawJobs = await getUserParseJobs(session.user.id, limit);

    const jobs = rawJobs.map((job) => {
      let result = null;
      if (job.status === 'done') {
        try {
          if (job.result_json) {
            const raw = JSON.parse(job.result_json);
            result = normalise(raw);
          } else if (job.markdown) {
            // Fallback: only markdown saved, no raw JSON
            result = { markdown: job.markdown, detail: [], pages: [] };
          }
        } catch {
          if (job.markdown) {
            result = { markdown: job.markdown, detail: [], pages: [] };
          }
        }
      }
      return { ...job, result };
    });

    return NextResponse.json({ code: 200, jobs });
  } catch (e: any) {
    console.error('[history]', e);
    return NextResponse.json({ code: 500, jobs: [], message: e.message });
  }
}
