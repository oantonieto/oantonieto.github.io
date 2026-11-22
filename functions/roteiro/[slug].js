// Cloudflare Pages Function de /roteiro/<endereço>: devolve o app (index.html) com as meta-tags da prévia (OpenGraph) do roteiro do Simbó
// (passeio de um dia ou roteiro por tema), para o WhatsApp, o Instagram e os buscadores mostrarem o título, a chamada, os primeiros lugares
// e a foto de capa. Quem abre no navegador recebe o mesmo app e ele mostra o roteiro.
// Os dois valores abaixo são trocados na publicação (scripts/juntar-web-no-site.mjs) pelo endereço e pela chave PÚBLICA do Supabase;
// a chave só lê o que a RLS libera (roteiro no ar e Lugar no ar).
const SUPABASE_URL = 'https://auth.simbo.app.br'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2bXNnZ2tvZnZpeXV0d3RtcnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4MDUyNTMsImV4cCI6MjEwOTM4MTI1M30.90Pcl5qzCythEzW-VOBPM74RbwR63xRZts_qZYBiYek'
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
const cabecalhos = { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` }

async function buscar(caminho) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${caminho}`, { headers: cabecalhos })
  return r.ok ? r.json() : null
}

const cortar = (t, n) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t)

export async function onRequest({ request, params, env }) {
  const pagina = await env.ASSETS.fetch(new URL('/index.html', request.url))
  const slug = String(params.slug || '').toLowerCase()
  if (!SLUG.test(slug) || slug.length > 80) return pagina

  const achados = await buscar(`roteiros?slug=eq.${encodeURIComponent(slug)}&select=titulo,descricao,capa_url,tipo,roteiro_paradas(ordem,lugar_id)&limit=1`)
  const roteiro = achados && achados[0]
  if (!roteiro) return pagina

  const ordenadas = [...(roteiro.roteiro_paradas || [])].sort((a, b) => a.ordem - b.ordem)
  const ids = ordenadas.map((p) => p.lugar_id).filter((id) => id && UUID.test(id))
  let nomes = []
  if (ids.length > 0) {
    const lugares = await buscar(`places?id=in.(${ids.slice(0, 8).join(',')})&select=id,name`)
    const porId = new Map((Array.isArray(lugares) ? lugares : []).map((l) => [l.id, l.name]))
    nomes = ids.slice(0, 8).map((id) => porId.get(id)).filter(Boolean).slice(0, 4)
  }

  const colecao = roteiro.tipo === 'colecao'
  const quantos = ordenadas.length
  const titulo = `${cortar(String(roteiro.titulo), 60)} · ${colecao ? 'roteiro por tema' : 'roteiro'} em São Paulo`
  const resumo = colecao ? `${quantos} lugares para ir aos poucos` : `${quantos} ${quantos === 1 ? 'parada' : 'paradas'}`
  const partes = [roteiro.descricao ? String(roteiro.descricao) : '', `${resumo}${nomes.length ? `, como ${nomes.join(', ')}` : ''}.`, 'Veja no Simbó.'].filter(Boolean)
  const descricao = cortar(partes.join(' '), 200)
  const endereco = new URL(`/roteiro/${slug}`, request.url).toString()
  const capa = roteiro.capa_url && /^https:\/\//.test(roteiro.capa_url) ? roteiro.capa_url : null
  const imagem = capa || new URL('/compartilhar-roteiro.png', request.url).toString()

  const definir = (valor) => ({ element: (el) => el.setAttribute('content', valor) })
  const reescritor = new HTMLRewriter()
    .on('title', { element: (el) => el.setInnerContent(titulo) })
    .on('meta[name="description"]', definir(descricao))
    .on('meta[property="og:title"]', definir(titulo))
    .on('meta[property="og:description"]', definir(descricao))
    .on('meta[property="og:url"]', definir(endereco))
    .on('meta[property="og:image"]', definir(imagem))
    .on('meta[property="og:type"]', definir('article'))
    .on('meta[name="twitter:image"]', definir(imagem))

  const resposta = new Response(pagina.body, pagina)
  resposta.headers.set('Cache-Control', 'public, max-age=300')
  return reescritor.transform(resposta)
}
