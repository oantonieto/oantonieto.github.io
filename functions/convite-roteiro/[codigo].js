// Cloudflare Pages Function de /convite-roteiro/<código>: devolve o app com a prévia (OpenGraph) do convite para editar um roteiro junto,
// para o WhatsApp mostrar "Edite junto: <nome do roteiro>". Só convite válido ganha a prévia própria; vencido, cheio ou inexistente
// fica com a prévia geral do Simbó. Os dois valores abaixo são trocados na publicação (scripts/juntar-web-no-site.mjs).
const SUPABASE_URL = 'https://auth.simbo.app.br'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2bXNnZ2tvZnZpeXV0d3RtcnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4MDUyNTMsImV4cCI6MjEwOTM4MTI1M30.90Pcl5qzCythEzW-VOBPM74RbwR63xRZts_qZYBiYek'
const CONVITE = /^[a-z0-9]{12}$/

const cortar = (t, n) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t)

export async function onRequest({ request, params, env }) {
  const pagina = await env.ASSETS.fetch(new URL('/index.html', request.url))
  const convite = String(params.codigo || '').toLowerCase()
  if (!CONVITE.test(convite)) return pagina

  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/consultar_convite_de_roteiro`, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_convite: convite }),
  })
  const linhas = r.ok ? await r.json() : null
  const dado = Array.isArray(linhas) ? linhas[0] : null
  if (!dado || dado.estado !== 'valido' || !dado.titulo) return pagina

  const titulo = `Edite junto: ${cortar(String(dado.titulo), 60)}`
  const quem = dado.dono ? `${dado.dono} chamou você` : 'Você foi chamado'
  const descricao = `${quem} para montar este roteiro no Simbó. Entre com a conta e mude as paradas com o grupo.`
  const endereco = new URL(`/convite-roteiro/${convite}`, request.url).toString()
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
  // Convite vale 7 dias e pode ser revogado: a prévia não fica guardada por muito tempo.
  resposta.headers.set('Cache-Control', 'public, max-age=60')
  return reescritor.transform(resposta)
}
