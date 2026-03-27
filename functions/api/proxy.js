export async function onRequest(context) {
    const url = new URL(context.request.url);
    const target = url.searchParams.get('url');

  if (!target) {
        return new Response(JSON.stringify({ error: 'missing url' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
  }

  const decoded = decodeURIComponent(target);

  const referer = decoded.includes('1234567.com.cn') ? 'https://fund.eastmoney.com/'
        : decoded.includes('eastmoney.com') ? 'https://www.eastmoney.com/'
        : 'https://finance.yahoo.com/';

  try {
        const r = await fetch(decoded, {
                headers: {
                          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                          'Referer': referer,
                          'Accept': 'application/json, text/javascript, */*',
                },
                signal: AbortSignal.timeout(10000),
        });
        const text = await r.text();
        return new Response(text, {
                status: 200,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
  } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
  }
}
