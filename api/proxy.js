// 서버사이드 프록시 — API 키 숨김 + CORS 완전 우회
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = '8cb40cbd3b0469c993a678897958a9449a8cd71a27d3b9c6692337aa48739dea';
  const BASE    = 'https://apis.data.go.kr/B551182/nonPaymentDamtInfoService/getNonPaymentItemHospDtlList';

  const params = new URLSearchParams(req.query);
  params.set('serviceKey', API_KEY);
  params.set('type', 'json');

  try {
    const r = await fetch(`${BASE}?${params}`, {
      headers: { Accept: 'application/json, text/xml' },
      signal: AbortSignal.timeout(30000),
    });
    const text = await r.text();
    const ct = r.headers.get('content-type') || 'application/json';
    res.setHeader('Content-Type', ct);
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
