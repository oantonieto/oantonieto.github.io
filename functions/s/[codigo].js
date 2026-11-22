// Cloudflare Pages Function de /s/<código>: devolve o app (index.html) com a prévia (OpenGraph) do convite de rolê, para o WhatsApp mostrar
// "Ana chamou você: Pizzaria X · sáb 5 dez" com a foto do Lugar. Quem abre no navegador recebe o mesmo app e ele mostra o convite.
// Os dois valores abaixo são trocados na publicação (scripts/juntar-web-no-site.mjs) pelo endereço e pela chave PÚBLICA do Supabase.
// A função ver_convite_de_role só entrega o rolê e os totais, nunca os nomes de quem respondeu.
const SUPABASE_URL = 'https://auth.simbo.app.br'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2bXNnZ2tvZnZpeXV0d3RtcnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4MDUyNTMsImV4cCI6MjEwOTM4MTI1M30.90Pcl5qzCythEzW-VOBPM74RbwR63xRZts_qZYBiYek'
const CODIGO = /^[a-z0-9]{8}$/
const cabecalhos = { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` }
const SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

const cortar = (t, n) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t)

export async function onRequest({ request, params, env }) {
  const pagina = await env.ASSETS.fetch(new URL('/index.html', request.url))
  const codigo = String(params.codigo || '').toLowerCase()
  if (!CODIGO.test(codigo)) return pagina

  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/ver_convite_de_role`, { method: 'POST', headers: { ...cabecalhos, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_codigo: codigo }) })
  const linhas = r.ok ? await r.json() : null
  const convite = Array.isArray(linhas) ? linhas[0] : null
  if (!convite) return pagina

  const lugares = await fetch(`${SUPABASE_URL}/rest/v1/places?id=eq.${encodeURIComponent(convite.lugar_id)}&select=name,neighborhoods(name),place_photos(path)&limit=1`, { headers: cabecalhos })
  const lugar = lugares.ok ? (await lugares.json())[0] : null
  const nome = lugar ? String(lugar.name) : 'um lugar do Simbó'
  const [a, m, d] = String(convite.data).split('-').map(Number)
  const dia = new Date(a, m - 1, d)
  const quando = `${SEMANA[dia.getDay()]} ${d} ${MESES[m - 1]}`
  const quem = convite.criador_nome ? `${cortar(String(convite.criador_nome), 30)} chamou você` : 'Chamaram você para um rolê'
  const titulo = `${quem}: ${cortar(nome, 50)} · ${quando}`
  const bairro = lugar && lugar.neighborhoods && lugar.neighborhoods.name ? ` em ${lugar.neighborhoods.name}` : ''
  const descricao = cortar(`${nome}${bairro}, ${quando}. Responda se topa, sem precisar de conta. Veja no Simbó.`, 200)
  const endereco = new URL(`/s/${codigo}`, request.url).toString()
  const foto = lugar && lugar.place_photos && (Array.isArray(lugar.place_photos) ? lugar.place_photos[0] : lugar.place_photos)
  const imagem = foto && foto.path ? `${SUPABASE_URL}/storage/v1/object/public/place-photos/${foto.path}` : new URL('/compartilhar.png', request.url).toString()

  const definir = (valor) => ({ element: (el) => el.setAttribute('content', valor) })
  const reescritor = new HTMLRewriter()
    .on('title', { element: (el) => el.setInnerContent(titulo) })
    .on('meta[name="description"]', definir(descricao))
    .on('meta[property="og:title"]', definir(titulo))
    .on('meta[property="og:description"]', definir(descricao))
    .on('meta[property="og:url"]', definir(endereco))
    .on('meta[property="og:image"]', definir(imagem))
    .on('meta[property="og:type"]', definir('website'))
    .on('meta[name="twitter:image"]', definir(imagem))

  const resposta = new Response(pagina.body, pagina)
  // Os totais mudam a cada resposta: a prévia não fica guardada por muito tempo.
  resposta.headers.set('Cache-Control', 'public, max-age=60')
  return reescritor.transform(resposta)
}
