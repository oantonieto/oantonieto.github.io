// Guarda no aparelho o programa e as imagens do site, para a próxima visita abrir sem baixar tudo de novo.
// A página em si vem sempre da internet primeiro, e é ela que aponta para a versão nova: ninguém fica preso.
// Para desligar em uma emergência: troque este arquivo por um que só chame self.registration.unregister().
const VERSAO = 'v1'
const PROGRAMA = `simbo-programa-${VERSAO}`
const IMAGENS = `simbo-imagens-${VERSAO}`
const PAGINA = `simbo-pagina-${VERSAO}`
const LIMITES = { [PROGRAMA]: 12, [IMAGENS]: 400 }
const ESPERA_DA_PAGINA = 2500
// Estas páginas têm vida própria e nunca passam por aqui.
const FORA = ['/beta', '/l/', '/painel', '/privacidade', '/.well-known', '/fotos/', '/fontes/']

async function aparar(nome) {
  const caixa = await caches.open(nome)
  const chaves = await caixa.keys()
  await Promise.all(chaves.slice(0, Math.max(0, chaves.length - LIMITES[nome])).map(k => caixa.delete(k)))
}

// Arquivos com o conteúdo no nome nunca mudam: o que está guardado vale para sempre.
async function primeiroGuardado(pedido, nome) {
  const caixa = await caches.open(nome)
  const guardado = await caixa.match(pedido)
  if (guardado) return guardado
  const resposta = await fetch(pedido)
  if (resposta.ok && resposta.type === 'basic') {
    await caixa.put(pedido, resposta.clone())
    aparar(nome).catch(() => {})
  }
  return resposta
}

// Em internet lenta, abre o que já tem e deixa a versão nova pronta para a próxima visita.
async function paginaDoApp(evento) {
  const caixa = await caches.open(PAGINA)
  const daInternet = fetch(evento.request).then(resposta => {
    if (resposta.ok) caixa.put('/', resposta.clone()).catch(() => {})
    return resposta
  })
  evento.waitUntil(daInternet.catch(() => {}))
  const guardada = await caixa.match('/')
  if (!guardada) return daInternet
  const espera = new Promise(ok => setTimeout(() => ok(null), ESPERA_DA_PAGINA))
  const primeira = await Promise.race([daInternet.catch(() => null), espera])
  return primeira ?? guardada
}

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys()
      .then(nomes => Promise.all(nomes.filter(n => n.startsWith('simbo-') && !n.endsWith(`-${VERSAO}`)).map(n => caches.delete(n))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', evento => {
  const { request } = evento
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (FORA.some(p => url.pathname.startsWith(p))) return
  if (request.mode === 'navigate') return evento.respondWith(paginaDoApp(evento))
  if (url.pathname.startsWith('/_expo/static/')) return evento.respondWith(primeiroGuardado(request, PROGRAMA))
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/marca/')) return evento.respondWith(primeiroGuardado(request, IMAGENS))
})
