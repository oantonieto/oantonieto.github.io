// Cloudflare Pages Function de /r/<código>: devolve o app (index.html) com as meta-tags da prévia (OpenGraph) do roteiro, para o WhatsApp,
// o Instagram e os buscadores mostrarem o nome do roteiro e as paradas. Quem abre no navegador recebe o mesmo app e ele mostra o roteiro.
// Os dois valores abaixo são trocados na publicação (scripts/juntar-web-no-site.mjs) pelo endereço e pela chave PÚBLICA do Supabase,
// que o app já distribui a todo mundo. A função ver_roteiro só entrega título e Lugares no ar, sem nada pessoal.
// A imagem é a mesma para todos os roteiros (modelo "o trajeto"); o que muda de um roteiro para o outro é o texto.
const SUPABASE_URL = 'https://auth.simbo.app.br'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2bXNnZ2tvZnZpeXV0d3RtcnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4MDUyNTMsImV4cCI6MjEwOTM4MTI1M30.90Pcl5qzCythEzW-VOBPM74RbwR63xRZts_qZYBiYek'
const CODIGO = /^[a-z0-9]{10}$/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
const cabecalhos = { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` }

async function chamar(nome, args) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${nome}`, { method: 'POST', headers: { ...cabecalhos, 'Content-Type': 'application/json' }, body: JSON.stringify(args) })
  return r.ok ? r.json() : null
}

const cortar = (t, n) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t)

export async function onRequest({ request, params, env }) {
  const pagina = await env.ASSETS.fetch(new URL('/index.html', request.url))
  const codigo = String(params.codigo || '').toLowerCase()
  if (!CODIGO.test(codigo)) return pagina

  const linhas = await chamar('ver_roteiro', { p_codigo: codigo })
  if (!Array.isArray(linhas) || linhas.length === 0) return pagina
  const ordenadas = [...linhas].sort((a, b) => a.ordem - b.ordem)
  const ids = ordenadas.map((l) => l.lugar_id).filter((id) => UUID.test(id))

  // Os nomes das paradas, na ordem do roteiro (a RLS já entrega só Lugar no ar).
  let nomes = []
  if (ids.length > 0) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/places?id=in.(${ids.join(',')})&select=id,name`, { headers: cabecalhos })
    const lugares = r.ok ? await r.json() : []
    const porId = new Map((Array.isArray(lugares) ? lugares : []).map((l) => [l.id, l.name]))
    nomes = ids.map((id) => porId.get(id)).filter(Boolean)
  }

  const titulo = `${cortar(String(ordenadas[0].titulo), 60)} · roteiro em São Paulo`
  const quantas = ordenadas.length
  const descricao = cortar(`${quantas} ${quantas === 1 ? 'parada' : 'paradas'}${nomes.length ? `: ${nomes.join(', ')}` : ''}. Monte o seu no Simbó.`, 200)
  const endereco = new URL(`/r/${codigo}`, request.url).toString()
  const imagem = new URL('/compartilhar-roteiro.png', request.url).toString()

  const definir = (valor) => ({ element: (el) => el.setAttribute('content', valor) })
  const reescritor = new HTMLRewriter()
    .on('title', { element: (el) => el.setInnerContent(titulo) })
    .on('meta[name="description"]', definir(descricao))
    .on('meta[property="og:title"]', definir(titulo))
    .on('meta[property="og:description"]', definir(descricao))
    .on('meta[property="og:url"]', definir(endereco))
    .on('meta[property="og:image"]', definir(imagem))
    .on('meta[property="og:type"]', definir('article'))

  const resposta = new Response(pagina.body, pagina)
  resposta.headers.set('Cache-Control', 'public, max-age=300')
  return reescritor.transform(resposta)
}
