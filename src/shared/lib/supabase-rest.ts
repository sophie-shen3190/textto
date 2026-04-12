/**
 * Lightweight Supabase REST client — no SDK needed.
 * Uses PostgREST API with the service role key for server-side operations.
 */

function getSupabaseHeaders() {
  const url = process.env.NEXT_PUBLIC_TIMI_SUPABASE_URL ?? '';
  const key =
    process.env.TIMI_SUPABASE_SERVICE_KEY ??
    process.env.NEXT_PUBLIC_TIMI_SUPABASE_PUBLISHABLE_KEY ??
    '';

  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }

  return {
    baseUrl: `${url}/rest/v1`,
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  };
}

export interface ParseJobInsert {
  id: string;
  user_id?: string;
  user_email?: string;
  job_id?: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  file_url?: string;
  status: string;
  markdown?: string;
  result_json?: string;
  parse_mode?: string;
  session_id?: string;   // anonymous tracking
  ip?: string;
}

export interface ParseJobUpdate {
  status?: string;
  markdown?: string;
  result_json?: string;
  error_message?: string;
  file_url?: string;
}

/** Insert a new parse job record */
export async function insertParseJob(data: ParseJobInsert): Promise<void> {
  const { baseUrl, headers } = getSupabaseHeaders();

  const resp = await fetch(`${baseUrl}/parse_job`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify(data),
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.error('[supabase] insertParseJob failed:', err);
    // Non-fatal — don't throw, just log
  }
}

/** Update an existing parse job by job_id */
export async function updateParseJobByJobId(
  jobId: string,
  data: ParseJobUpdate
): Promise<void> {
  const { baseUrl, headers } = getSupabaseHeaders();

  const resp = await fetch(
    `${baseUrl}/parse_job?job_id=eq.${encodeURIComponent(jobId)}`,
    {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify(data),
    }
  );

  if (!resp.ok) {
    const err = await resp.text();
    console.error('[supabase] updateParseJob failed:', err);
  }
}

export interface ParseJobRecord {
  id: string;
  job_id?: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  file_url?: string;
  status: string;
  markdown?: string;
  result_json?: string;
  parse_mode?: string;
  created_at: string;
}

/** Get parse jobs for a specific user, newest first */
export async function getUserParseJobs(userId: string, limit = 30): Promise<ParseJobRecord[]> {
  const { baseUrl, headers } = getSupabaseHeaders();

  const resp = await fetch(
    `${baseUrl}/parse_job?user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc&limit=${limit}&select=id,job_id,file_name,file_type,file_size,file_url,status,markdown,result_json,parse_mode,created_at`,
    { headers }
  );

  if (!resp.ok) {
    console.error('[supabase] getUserParseJobs failed:', await resp.text());
    return [];
  }

  return resp.json();
}

/** Get basic usage stats */
export async function getUsageStats(): Promise<{
  totalJobs: number;
  registeredUsers: number;
}> {
  const { baseUrl, headers } = getSupabaseHeaders();

  const [jobsResp, usersResp] = await Promise.all([
    fetch(`${baseUrl}/parse_job?select=count`, {
      headers: { ...headers, Prefer: 'count=exact' },
    }),
    fetch(`${baseUrl}/parse_job?user_id=not.is.null&select=user_id`, {
      headers: { ...headers, Prefer: 'count=exact' },
    }),
  ]);

  const totalJobs = parseInt(jobsResp.headers.get('content-range')?.split('/')[1] ?? '0');
  const registeredUsers = parseInt(usersResp.headers.get('content-range')?.split('/')[1] ?? '0');

  return { totalJobs, registeredUsers };
}
