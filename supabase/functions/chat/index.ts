import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const SYSTEM_PROMPT = `Kamu adalah asisten AI "Pakan Cerdas" di website Feed Friend Farm.
Tugas utamamu: membantu peternak Indonesia mengetahui berat rata-rata (kg/ekor) untuk berbagai jenis ternak,
agar mereka tidak perlu mencari ke Google lagi. Kamu juga boleh menjawab pertanyaan singkat seputar pakan & nutrisi ternak.

Panduan jawaban:
- Selalu gunakan Bahasa Indonesia yang ramah dan jelas.
- Jika user menyebut jenis ternak (misal: sapi, kambing, domba, ayam broiler, ayam petelur, bebek, kelinci, babi, kerbau, dll),
  berikan estimasi berat rata-rata per ekor dalam kg, dipisahkan berdasarkan fase (anakan, muda, dewasa) bila relevan.
- Berikan rentang angka (misal "350–500 kg") bukan satu angka pasti, karena tergantung ras & umur.
- Sebutkan singkat faktor yang memengaruhi (ras, umur, pakan, jenis kelamin) bila perlu.
- Jika pertanyaan di luar topik ternak/pakan, arahkan dengan sopan kembali ke topik.
- Jawab ringkas (maks 6-8 baris) kecuali user minta detail.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'messages required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY missing' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const upstream = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Lovable-API-Key': apiKey,
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        stream: true,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text();
      return new Response(JSON.stringify({ error: 'AI gateway error', detail: text }), {
        status: upstream.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(upstream.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
