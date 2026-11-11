// Gera os arquivos da marca Simbó (v2). Uso: node marca/v2/fonte/construir.js
const fs=require('fs'),path=require('path');
const {curvas,mk,d,caixa}=require('./tracado.js');
const OUT=path.resolve(__dirname,'..');
const COR={mata:'#1E4D3B',barro:'#E9743A',areia:'#F3ECE1',tinta:'#17231E',branco:'#FFFFFF'};
const K=0.14,W=28; // inclinação e peso do traço (altura-x = 100)
const w=(f,s)=>{fs.mkdirSync(path.dirname(path.join(OUT,f)),{recursive:true});fs.writeFileSync(path.join(OUT,f),s);};

// ---------- LOGOTIPO ----------
const arco=(cx,cy,rx,ry,a0,a1,n)=>Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*Math.PI/180;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});
const sBase=[[41,40],[75,71],[98,112],[106,142],[97,165],[78,172],[61,162],[57,138],[69,105],[94,72],[110,43],[104,16],[80,0],[51,1],[31,14],[23,30],[22,48,'g']];
const des=p=>[p[0]-K*p[1],p[1],p[2]];
const sFioCom=e=>[[-120-e,30,'g'],[-66-e,30],[-42,30],[-18,30],...sBase].map(des);
const sCurto=[[-60,26,'g'],[-14,30],...sBase].map(des);
const miolo=[[50,-6,'g'],[84,-1],[128,10],[160,52],[176,100,'c'],
 [176,38],[188,6],[210,8],[236,54],[252,100,'c'],
 [252,36],[252,0,'c'],[252,40],[259,74],[277,96],[297,99],[313,84],[319,52],[319,0,'c'],
 [319,40],[326,74],[344,96],[364,99],[380,84],[386,52],[388,26],[400,6],[420,8],
 [448,58],[476,146],[482,192],[468,216],[448,198],[444,130],[444,42],
 ...arco(486,48,42,50,200,-150,9).slice(1),[462,84,'c'],
 [496,80],[540,85],[576,96],
 ...arco(602,49,39,51,105,-262,12)];
const caudaFioCom=e=>[[644,92],[682,72],[724,62],[748,62],[770+e,62],[814+e,62,'g']];
const caudaCurta=[[632,96],[652,86,'g']];
const acento=[[612,140],[636,172]],pingo=[176,154];
function logo(versao,cor,corAcento,opts={}){
  const e=opts.estica||0;const partes=[curvas(versao==='fio'?sFioCom(e):sCurto),curvas([...miolo,...(versao==='fio'?caudaFioCom(e):caudaCurta)])];
  const T0=mk(K,1,0,0);let [x0,y0,x1,y1]=caixa(partes,T0);
  y0=Math.min(y0,T0(acento[1])[1]);x1=Math.max(x1,T0(acento[1])[0]);const m=W/2+6;
  const T=mk(K,1,-x0+m,-y0+m);const Wd=Math.ceil(x1-x0+2*m),H=Math.ceil(y1-y0+2*m);
  const a=acento.map(T).map(p=>p.map(n=>+n.toFixed(1)).join(' ')),pg=T(pingo);
  const corpo=`<g fill="none" stroke="${cor}" stroke-width="${W}" stroke-linecap="round" stroke-linejoin="round">${partes.map(c=>`<path d="${d(c,T)}"/>`).join('')}<path d="M${a[0]}L${a[1]}" stroke="${corAcento}"/></g><circle cx="${pg[0].toFixed(1)}" cy="${pg[1].toFixed(1)}" r="${(W*0.64).toFixed(1)}" fill="${cor}"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Wd} ${H}" role="img" aria-label="Simbó">${corpo}</svg>\n`;
}
const variantes={'mata-barro':[COR.mata,COR.barro],'mata':[COR.mata,COR.mata],'areia-barro':[COR.areia,COR.barro],'branco-barro':[COR.branco,COR.barro],'branco':[COR.branco,COR.branco],'tinta':[COR.tinta,COR.tinta]};
for(const [n,[c,a]] of Object.entries(variantes)){w(`logo/simbo-${n}.svg`,logo('fio',c,a));w(`logo/simbo-curto-${n}.svg`,logo('curto',c,a));}

// ---------- SÍMBOLO ----------
const SP=[[30,368,'g'],[96,370],[178,348],[246,284],[292,202],[308,142],[290,96],[252,82],[218,102],[210,150],[234,216],[284,282],[316,340],[304,394],[256,426],[198,424],[158,398],[142,370],[140,344,'g']];
const SD=d(curvas(SP),p=>[p[0],p[1]]);
const simbolo=(fundo,traco,ponto,raio=116)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Simbó">${fundo?`<rect width="512" height="512" rx="${raio}" fill="${fundo}"/>`:''}<path d="${SD}" fill="none" stroke="${traco}" stroke-width="52" stroke-linecap="round" stroke-linejoin="round"/><circle cx="402" cy="128" r="38" fill="${ponto}"/></svg>\n`;
w('simbolo/s-mata.svg',simbolo(COR.mata,COR.branco,COR.barro));
w('simbolo/s-areia.svg',simbolo(COR.areia,COR.mata,COR.barro));
w('simbolo/s-barro.svg',simbolo(COR.barro,COR.tinta,COR.areia));
w('simbolo/s-solto.svg',simbolo('',COR.mata,COR.barro));
w('simbolo/s-solto-branco.svg',simbolo('',COR.branco,COR.barro));
w('simbolo/favicon.svg',simbolo(COR.mata,COR.branco,COR.barro));
w('simbolo/s-cheio.svg',simbolo(COR.mata,COR.branco,COR.barro,0)); // sem cantos: para máscaras de app e avatar redondo

// ---------- ÍCONES (grade 24, traço 2.25, pontas redondas; o ponto laranja marca o lugar) ----------
const P='<circle cx="X" cy="Y" r="R" fill="#E9743A" stroke="none"/>';const pt=(x,y,r=1.6)=>P.replace('X',x).replace('Y',y).replace('R',r);
const IC={
 lugar:`<path d="M12 21c-4.200-4.600-6.500-7.900-6.500-11a6.500 6.500 0 0 1 13 0c0 3.100-2.300 6.400-6.500 11z"/>${pt(12,10,2.2)}`,
 buscar:`<circle cx="10.500" cy="10.500" r="6.500"/><path d="M15.500 15.500 20 20"/>`,
 salvar:`<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z"/>`,
 surpresa:`<path d="M11 4c.6 4.600 2.400 6.400 7 7-4.600.6-6.400 2.400-7 7-.6-4.600-2.400-6.400-7-7 4.600-.6 6.400-2.400 7-7z"/>${pt(19,19)}`,
 mapa:`<path d="M3 6.500 9 4l6 2.500L21 4v13.500L15 20l-6-2.500L3 20zM9 4v13.500M15 6.500V20"/>`,
 preco:`<circle cx="12" cy="12" r="9"/><path d="M14.600 9.300c-.5-.8-1.400-1.300-2.600-1.300-1.500 0-2.600.8-2.600 2s1 1.700 2.600 2 2.600.8 2.600 2-1.100 2-2.600 2c-1.200 0-2.100-.5-2.600-1.300M12 6.300V8m0 8v1.700"/>`,
 horario:`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
 metro:`<path d="M7 3h10a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2zM5 10h14M8.500 17 7 21M15.500 17 17 21"/>${pt(9,13.5,1.2)}${pt(15,13.5,1.2)}`,
 bar:`<path d="M5 9h10v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM15 11h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2M5 9c-1.500-2.500 1-4.500 2.800-3.200.7-2.100 3.700-2.100 4.400 0C14 5 15.800 7 15 9"/>`,
 cafe:`<path d="M4 10h12v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 11h1.500a2.500 2.500 0 0 1 0 5H16M8 3c-1 1.500 1 2.500 0 4M12 3c-1 1.500 1 2.500 0 4"/>`,
 restaurante:`<path d="M6 3v6a3 3 0 0 0 6 0V3M9 3v18M17 21V3c2.800 2 2.800 8 0 10.500"/>`,
 parque:`<path d="M12 21v-7M12 14c-4 1-7-1.500-6-4.500C4.500 6.500 7.500 3.500 10.500 5c1.500-2.500 5.500-2 6 1 3 .5 4 4.500 1.500 6-1 2-3.500 2.500-6 2z"/>`,
 cultura:`<rect x="4" y="5" width="16" height="14" rx="2"/><path d="m6.500 16 4-5 3 3.500 2-2 2 2.700"/>${pt(15.5,9,1.4)}`,
 balada:`<path d="M9 18V6l10-2v12"/><circle cx="6.500" cy="18" r="2.500"/><circle cx="16.500" cy="16" r="2.500"/>`,
 feira:`<path d="M4 10l1.500-5h13L20 10M4 10a2.670 2.670 0 0 0 5.330 0 2.670 2.670 0 0 0 5.340 0A2.670 2.670 0 0 0 20 10M6 13.500V20M18 13.500V20M6 17h12"/>`,
 experiencia:`<path d="M4 7h16v3.500a1.500 1.500 0 0 0 0 3V17H4v-3.500a1.500 1.500 0 0 0 0-3z"/><path d="M14.500 9.500v5" stroke-dasharray=".1 3.200"/>`,
 perto:`<path d="M20 4 4 10.500l7 2.500 2.500 7z"/>`,
 compartilhar:`<path d="M12 15V4M8 7.500 12 4l4 3.500M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>`,
 'por-do-sol':`<path d="M3 18h18M6.500 18a5.500 5.500 0 0 1 11 0M12 6v2.500M4.500 10.500l1.800 1.800M19.500 10.500l-1.800 1.800"/>`,
 grupo:`<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.500 2.700-6 6-6s6 2.500 6 6"/><circle cx="17" cy="9" r="2.500"/><path d="M17.500 14c2.200.2 3.500 2 3.500 5"/>`,
};
const icone=(c,cor='currentColor')=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="2.250" stroke-linecap="round" stroke-linejoin="round">${c}</svg>\n`;
for(const [n,c] of Object.entries(IC))w(`icones/${n}.svg`,icone(c,COR.mata));
w('icones/icones.svg',`<svg xmlns="http://www.w3.org/2000/svg">${Object.entries(IC).map(([n,c])=>`<symbol id="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.250" stroke-linecap="round" stroke-linejoin="round">${c}</symbol>`).join('')}</svg>\n`);

// ---------- ILUSTRAÇÕES (240x200; traço 11; todas apoiadas no mesmo fio que atravessa o desenho) ----------
const o=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="DET" stroke="none"/>`;
const IL={
 parques:`<path d="M10 164h220M120 164v-50"/><path d="M120 116c-30 6-54-12-47-36-11-22 12-44 34-34 12-20 44-18 50 6 24 2 32 34 10 46-6 16-29 22-47 18z"/>${o(196,44,11)}`,
 'cafes-padarias':`<path d="M10 164h220M70 98h92v26a40 40 0 0 1-40 40h-12a40 40 0 0 1-40-40zM162 108h8a17 17 0 0 1 0 34h-9"/><path d="M100 76c-11-13 11-19 0-33M130 76c-11-13 11-19 0-33" stroke="DET"/>`,
 bares:`<path d="M10 164h220M76 164V88h78v76M154 102h10a18 18 0 0 1 18 18v8a18 18 0 0 1-18 18h-10"/><path d="M72 88c-13-22 13-37 26-23 8-19 36-17 40 2 17-7 30 12 18 21z"/>${o(102,130,7)}${o(126,112,5.500)}`,
 restaurantes:`<path d="M10 172h220"/><circle cx="120" cy="100" r="46"/>${o(120,100,15)}<path d="M40 44v30a11 11 0 0 0 22 0V44M51 44v104M198 148V44c18 12 18 46 0 60"/>`,
 cultura:`<path d="M10 164h220"/><rect x="58" y="50" width="124" height="96" rx="10"/><path d="m74 132 30-38 22 26 14-14 26 26M100 164v-18M140 164v-18"/>${o(152,80,10)}`,
 'baladas-shows':`<path d="M10 172h220M120 16v40"/><circle cx="120" cy="102" r="46"/><path d="M74 102h92M120 56c-28 22-28 70 0 92M120 56c28 22 28 70 0 92"/>${o(54,52,8)}${o(192,138,6.500)}`,
 'feiras-mercados':`<path d="M10 164h220M52 92l12-38h112l12 38zM52 92a17 17 0 0 0 34 0 17 17 0 0 0 34 0 17 17 0 0 0 34 0 17 17 0 0 0 34 0M66 112v52M174 112v52M66 138h108"/>${o(98,124,8)}${o(121,121,10)}${o(144,125,7)}`,
 experiencias:`<path d="M10 172h220"/><g transform="rotate(-8 120 100)"><path d="M50 62h140v24a14 14 0 0 0 0 28v24H50v-24a14 14 0 0 0 0-28z"/><path d="M150 74v52" stroke-dasharray=".1 17"/>${o(100,100,13)}</g>`,
 lugar:`<path d="M10 172h220M120 172c-32-36-46-58-46-82a46 46 0 0 1 92 0c0 24-14 46-46 82z"/>${o(120,90,15)}`,
};
const ilustra=(c,fundo,traco,det)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200">${fundo?`<rect width="240" height="200" fill="${fundo}"/>`:''}<g fill="none" stroke="${traco}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">${c.replace(/DET/g,det)}</g></svg>\n`;
// (as ilustrações de traço saíram do kit; as figurinhas ficam em figurinhas.js)

module.exports={COR,logo,simbolo,IC,IL,icone,ilustra,OUT};
if(require.main===module)console.log('marca v2: arquivos SVG gerados em',OUT);
