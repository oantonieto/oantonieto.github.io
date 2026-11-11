// Gera as peças de redes sociais e os PNGs do símbolo. Uso: node marca/v2/fonte/social.js (precisa do Playwright)
const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const {COR,logo,simbolo,IC,IL,icone,ilustra,OUT}=require('./construir.js');
const RAIZ=path.resolve(OUT,'../..');
const css=`@font-face{font-family:Figtree;font-weight:400;src:url(file://${RAIZ}/fontes/Figtree_400Regular.ttf)}@font-face{font-family:Figtree;font-weight:600;src:url(file://${RAIZ}/fontes/Figtree_600SemiBold.ttf)}
*{box-sizing:border-box;margin:0}body{font-family:Figtree,sans-serif;overflow:hidden;position:relative;-webkit-font-smoothing:antialiased}
.abs{position:absolute}.fio{position:absolute;left:50%;transform:translateX(-50%)}.fio svg{display:block;height:100%;width:auto}
h1{font-weight:600;letter-spacing:-.025em;line-height:1.02}p{font-weight:400;line-height:1.3}.chip{display:inline-flex;align-items:center;gap:12px;border-radius:999px;font-weight:600}`;
const fio=(alt,cor,ac,estilo='')=>`<div class="fio" style="height:${alt}px;${estilo}">${logo('fio',cor,ac,{estica:5000})}</div>`;
const il=(n,larg,traco,estilo)=>`<div class="abs" style="width:${larg}px;${estilo}">${ilustra(IL[n].replace(/<path d="M10 1(64|72)h220/,'<path d="M0 0').replace('M0 0"/>','M0 0h0" opacity="0"/>'),'',traco,COR.barro)}</div>`;
const ic=(n,t,cor)=>`<span style="display:inline-flex;width:${t}px;height:${t}px;color:${cor}">${icone(IC[n])}</span>`;
const foto=n=>`file://${RAIZ}/fotos/${n}.jpg`;
const pecas={
 'social/compartilhar-1200x630':[1200,630,COR.areia,`${fio(150,COR.mata,COR.barro,'top:150px')}
   <h1 class="abs" style="left:0;right:0;top:372px;text-align:center;font-size:58px;color:${COR.mata}">Vamos aonde?</h1>
   <p class="abs" style="left:0;right:0;top:452px;text-align:center;font-size:27px;color:${COR.tinta};opacity:.8">Lugares de São Paulo, do centro à periferia,<br>com o preço em reais.</p>`],
 'social/capa-1500x500':[1500,500,COR.mata,`${fio(130,COR.areia,COR.barro,'top:200px;margin-left:-330px')}
   ${il('parques',170,COR.areia,'left:880px;top:175px')}${il('cafes-padarias',170,COR.areia,'left:1050px;top:175px')}${il('feiras-mercados',170,COR.areia,'left:1220px;top:175px')}
   <p class="abs" style="left:96px;top:392px;font-size:30px;color:${COR.areia};font-weight:600">Vamos aonde?</p>`],
 'social/post-frase-1080x1350':[1080,1350,COR.mata,`<h1 class="abs" style="left:88px;top:120px;right:88px;font-size:148px;color:${COR.areia}">Hoje a gente vai <span style="color:${COR.barro}">aonde?</span></h1>
   <p class="abs" style="left:88px;top:640px;width:760px;font-size:44px;color:${COR.areia};opacity:.86">Do centro à periferia, com o preço em reais antes de sair de casa.</p>
   ${il('bares',300,COR.areia,'left:740px;top:970px')}${fio(120,COR.areia,COR.barro,'top:1090px;margin-left:-160px')}`],
 'social/post-lugar-1080x1350':[1080,1350,COR.areia,`<div class="abs" style="left:48px;top:48px;right:48px;height:800px;border-radius:56px;background:url(${foto('praca-por-do-sol')}) center/cover"></div>
   <div class="abs chip" style="left:88px;top:88px;background:${COR.areia};color:${COR.mata};font-size:32px;padding:16px 28px 16px 20px">${ic('parque',40,COR.mata)}Parque</div>
   <h1 class="abs" style="left:64px;top:900px;right:64px;font-size:92px;color:${COR.mata}">Praça Pôr do Sol</h1>
   <p class="abs" style="left:64px;top:1016px;font-size:40px;color:${COR.tinta};opacity:.8">Alto de Pinheiros · zona oeste</p>
   <div class="abs" style="left:64px;top:1104px;display:flex;gap:16px"><span class="chip" style="background:${COR.mata};color:${COR.areia};font-size:34px;padding:18px 30px 18px 22px">${ic('preco',42,COR.areia)}De graça</span><span class="chip" style="border:3px solid ${COR.mata};color:${COR.mata};font-size:34px;padding:15px 30px 15px 22px">${ic('por-do-sol',42,COR.mata)}Pôr do sol</span></div>
   <div class="abs" style="right:64px;bottom:60px;width:230px">${logo('curto',COR.mata,COR.barro)}</div>`],
 'social/post-lista-1080x1350':[1080,1350,COR.barro,`<p class="abs" style="left:88px;top:112px;font-size:38px;font-weight:600;color:${COR.tinta}">Roteiro do fim de semana</p>
   <h1 class="abs" style="left:88px;top:190px;right:88px;font-size:156px;color:${COR.tinta}">5 rolês de graça em SP</h1>
   ${il('lugar',300,COR.tinta,'left:88px;top:842px').replace(new RegExp(COR.barro,'g'),COR.areia)}${il('baladas-shows',300,COR.tinta,'left:390px;top:842px').replace(new RegExp(COR.barro,'g'),COR.areia)}${il('cultura',300,COR.tinta,'left:692px;top:842px').replace(new RegExp(COR.barro,'g'),COR.areia)}
   <div class="abs" style="left:0;right:0;top:1086px;height:14px;background:${COR.tinta}"></div>
   <div class="abs" style="left:88px;bottom:80px;width:230px">${logo('curto',COR.tinta,COR.areia)}</div><p class="abs" style="right:88px;bottom:104px;font-size:34px;font-weight:600;color:${COR.tinta}">Arrasta →</p>`],
 'social/story-1080x1920':[1080,1920,COR.mata,`<div class="abs" style="left:72px;top:250px;right:72px;height:900px;border-radius:64px;background:url(${foto('feira-da-praca-benedito-calixto')}) center/cover"></div>
   <div class="abs chip" style="left:112px;top:290px;background:${COR.areia};color:${COR.mata};font-size:34px;padding:16px 30px 16px 22px">${ic('feira',42,COR.mata)}Feira</div>
   <h1 class="abs" style="left:72px;top:1210px;right:72px;font-size:104px;color:${COR.areia}">Sábado é dia de Benedito Calixto</h1>
   <p class="abs" style="left:72px;top:1450px;font-size:44px;color:${COR.areia};opacity:.86">Pinheiros · entrada de graça</p>
   ${fio(110,COR.areia,COR.barro,'top:1640px')}`],
};
for(const [n,cor,fundo] of [['lugar',COR.areia,COR.mata],['cafe',COR.areia,COR.mata],['bar',COR.mata,COR.areia],['parque',COR.mata,COR.areia],['feira',COR.tinta,COR.barro],['balada',COR.areia,COR.mata]])
 pecas[`social/destaque-${n}`]=[1080,1080,fundo,`<div class="abs" style="left:340px;top:340px">${ic(n,400,cor)}</div>`];
pecas['social/avatar-1080']=[1080,1080,COR.mata,`<div class="abs" style="left:108px;top:108px;width:864px">${simbolo('',COR.branco,COR.barro)}</div>`];
for(const t of [180,512,1024])pecas[`simbolo/icone-${t}`]=[t,t,'transparent',`<div style="width:${t}px">${simbolo(COR.mata,COR.branco,COR.barro)}</div>`];
pecas['simbolo/icone-mascaravel-512']=[512,512,COR.mata,`<div class="abs" style="left:56px;top:56px;width:400px">${simbolo('',COR.branco,COR.barro)}</div>`];
(async()=>{const b=await chromium.launch();
 for(const [nome,[W,H,fundo,html]] of Object.entries(pecas)){
  const p=await b.newPage({viewport:{width:W,height:H}});
  const tmp=path.join(require('os').tmpdir(),'simbo-peca.html');fs.writeFileSync(tmp,`<meta charset="utf-8"><style>${css}</style><body style="width:${W}px;height:${H}px;background:${fundo}">${html}</body>`);await p.goto('file://'+tmp);
  await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(120);
  await p.screenshot({path:path.join(OUT,nome+'.png'),omitBackground:fundo==='transparent'});await p.close();console.log(nome);}
 await b.close();})();
