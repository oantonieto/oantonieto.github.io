// Cloudflare Pages Function de /lista/<endereço>: devolve o app (index.html) com as meta-tags da prévia (OpenGraph) da lista, para o WhatsApp,
// o Instagram e os buscadores mostrarem o nome e a descrição dela. Quem abre no navegador recebe o mesmo app e ele mostra a lista.
// Os dois valores abaixo são trocados na publicação (scripts/juntar-web-no-site.mjs) pelo endereço e pela chave PÚBLICA do Supabase,
// que o app já distribui a todo mundo; a chave só lê o que a RLS libera (lista pública e no ar).
const SUPABASE_URL = 'https://dvmsggkofviyutwtmrqa.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2bXNnZ2tvZnZpeXV0d3RtcnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4MDUyNTMsImV4cCI6MjEwOTM4MTI1M30.90Pcl5qzCythEzW-VOBPM74RbwR63xRZts_qZYBiYek'
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/

async function buscar(caminho) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${caminho}`, { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } })
  return r.ok ? r.json() : null
}

const cortar = (t, n) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t)

export async function onRequest({ request, params, env }) {
  const pagina = await env.ASSETS.fetch(new URL('/index.html', request.url))
  const slug = String(params.slug || '').toLowerCase()
  if (!SLUG.test(slug) || slug.length > 80) return pagina

  // A RLS só entrega lista pública e no ar para quem não tem conta: privada ou inexistente volta [] e fica a prévia geral do Simbó.
  const achadas = await buscar(`playlists?slug=eq.${encodeURIComponent(slug)}&select=title,description,user_id,playlist_places(place_id,event_id)&limit=1`)
  const lista = achadas && achadas[0]
  if (!lista) return pagina

  // O nome do autor só vem se o perfil dela é público (a função do banco decide); senão, “alguém do Simbó”.
  let autor = null
  if (lista.user_id) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/autor_da_lista`, {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_slug: slug }),
    })
    autor = r.ok ? await r.json() : null
  }

  const total = (lista.playlist_places || []).length
  const quem = lista.user_id == null ? 'Lista do Simbó' : autor ? `Por ${autor}` : 'Por alguém do Simbó'
  const titulo = `${lista.title} · Simbó`
  const contagem = total === 0 ? 'Lista de rolês' : `${total} ${total === 1 ? 'rolê' : 'rolês'}`
  const descricao = cortar([quem, contagem, lista.description].filter(Boolean).join(' · '), 200)
  const endereco = new URL(`/lista/${slug}`, request.url).toString()
  const imagem = new URL('/compartilhar.png', request.url).toString()

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
