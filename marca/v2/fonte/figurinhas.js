// Figurinhas da marca: formas chapadas, carinha e contorno branco de adesivo. Uso: node marca/v2/fonte/figurinhas.js
const fs=require('fs'),path=require('path');
const OUT=path.resolve(__dirname,'..'),RAIZ=path.resolve(OUT,'../..');
const M='#1E4D3B',B='#E9743A',B2='#F2925F',P='#FBE9D7',A='#F3ECE1',T='#17231E',W='#FFFFFF';
const n=v=>+v.toFixed(1);
// --- peças ---
const rosto=(x,y,s=1,cor=T,tipo='sorriso')=>{
  const olhos=tipo==='feliz'?`<path d="M${n(x-19*s)} ${n(y-4*s)}q${n(6*s)} ${n(-9*s)} ${n(12*s)} 0M${n(x+7*s)} ${n(y-4*s)}q${n(6*s)} ${n(-9*s)} ${n(12*s)} 0" fill="none" stroke="${cor}" stroke-width="${n(5*s)}" stroke-linecap="round"/>`
    :`<circle cx="${n(x-13*s)}" cy="${n(y-6*s)}" r="${n(4.8*s)}" fill="${cor}"/><circle cx="${n(x+13*s)}" cy="${n(y-6*s)}" r="${n(4.8*s)}" fill="${cor}"/>`;
  const boca=tipo==='riso'?`<path d="M${n(x-24*s)} ${n(y+6*s)}h${n(48*s)}a${n(24*s)} ${n(24*s)} 0 0 1 ${n(-48*s)} 0z" fill="${cor}"/><rect x="${n(x-17*s)}" y="${n(y+6*s)}" width="${n(34*s)}" height="${n(8*s)}" rx="2" fill="${W}"/>`
    :`<path d="M${n(x-13*s)} ${n(y+7*s)}q${n(13*s)} ${n(14*s)} ${n(26*s)} 0" fill="none" stroke="${cor}" stroke-width="${n(5*s)}" stroke-linecap="round"/>`;
  return olhos+boca;};
const brilho=(x,y,r,cor)=>`<path d="M${x} ${y-r}q${n(r*.18)} ${n(r*.82)} ${r} ${r}q${n(-r*.82)} ${n(r*.18)} ${-r} ${r}q${n(-r*.18)} ${n(-r*.82)} ${-r} ${-r}q${n(r*.82)} ${n(-r*.18)} ${r} ${-r}z" fill="${cor}"/>`;
// --- formatos de selo (devolvem o SVG da forma numa cor; o contorno branco usa a mesma forma) ---
const F={
 circulo:c=>`<circle cx="120" cy="120" r="100"/>`,
 arco:c=>`<path d="M40 204V110a80 80 0 0 1 160 0v94a16 16 0 0 1-16 16H56a16 16 0 0 1-16-16z"/>`,
 quadrado:c=>`<rect x="24" y="24" width="192" height="192" rx="46"/>`,
 flor:c=>`<circle cx="120" cy="120" r="80"/>`+Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return `<circle cx="${n(120+70*Math.cos(a))}" cy="${n(120+70*Math.sin(a))}" r="35"/>`;}).join(''),
 estrela:c=>`<path d="M${Array.from({length:28},(_,i)=>{const a=i*Math.PI/14-Math.PI/2,r=i%2?88:102;return `${n(120+r*Math.cos(a))} ${n(120+r*Math.sin(a))}`;}).join('L')}z"/>`,
 pilula:c=>`<rect x="14" y="62" width="212" height="116" rx="58"/>`,
};
const adesivo=(forma,cor,miolo,gira=0)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><g${gira?` transform="rotate(${gira} 120 120)"`:''}><g fill="${W}" stroke="${W}" stroke-width="14" stroke-linejoin="round">${F[forma]()}</g><g fill="${cor}"${forma==='estrela'?` stroke="${cor}" stroke-width="6" stroke-linejoin="round"`:''}>${F[forma]()}</g>${miolo}</g></svg>\n`;
const FIG={
 lugar:['circulo',M,`<path d="M120 206c-40-44-58-72-58-100a58 58 0 0 1 116 0c0 28-18 56-58 100z" fill="${B}"/><circle cx="120" cy="104" r="35" fill="${W}"/>${rosto(120,105,.95)}${brilho(50,150,11,A)}${brilho(192,160,8,A)}`],
 parques:['arco',P,`<rect x="109" y="150" width="22" height="56" rx="9" fill="${B}"/><g fill="${M}"><circle cx="120" cy="94" r="46"/><circle cx="83" cy="122" r="32"/><circle cx="157" cy="122" r="32"/><circle cx="120" cy="130" r="34"/></g>${rosto(120,110,1,A,'feliz')}<circle cx="172" cy="62" r="11" fill="${B}"/>`],
 'cafes-padarias':['flor',B,`<ellipse cx="116" cy="180" rx="60" ry="10" fill="${T}"/><path d="M160 114h6a15 15 0 0 1 0 30h-8" fill="none" stroke="${W}" stroke-width="11" stroke-linecap="round"/><path d="M72 104h88v26a40 40 0 0 1-40 40h-8a40 40 0 0 1-40-40z" fill="${W}"/>${rosto(116,132,.95)}<path d="M100 88c-9-11 9-17 0-29M132 88c-9-11 9-17 0-29" fill="none" stroke="${W}" stroke-width="8" stroke-linecap="round"/>`],
 bares:['quadrado',M,`<path d="M154 114h10a16 16 0 0 1 16 16v18a16 16 0 0 1-16 16h-10" fill="none" stroke="${A}" stroke-width="12" stroke-linecap="round"/><rect x="70" y="92" width="86" height="102" rx="14" fill="${B2}"/><g fill="${W}"><circle cx="78" cy="92" r="17"/><circle cx="102" cy="82" r="21"/><circle cx="130" cy="84" r="19"/><circle cx="150" cy="94" r="15"/><rect x="64" y="90" width="98" height="17" rx="8"/><rect x="136" y="98" width="13" height="26" rx="6.500"/></g>${rosto(110,152,.95)}`],
 restaurantes:['circulo',M,`<circle cx="120" cy="120" r="88" fill="${P}"/><circle cx="120" cy="120" r="48" fill="${W}"/><circle cx="120" cy="120" r="36" fill="none" stroke="${B2}" stroke-width="6"/>${rosto(120,121,.9,T,'feliz')}<g fill="none" stroke="${M}" stroke-width="9" stroke-linecap="round"><path d="M46 80v20a9 9 0 0 0 18 0V80M55 80v84"/><path d="M186 164V80c13 9 13 38 0 50" fill="${M}" stroke-linejoin="round"/></g>`],
 cultura:['quadrado',B2,`<path d="M120 46 94 74M120 46l26 28" fill="none" stroke="${T}" stroke-width="5" stroke-linecap="round"/><circle cx="120" cy="46" r="7" fill="${T}"/><rect x="58" y="72" width="124" height="108" rx="12" fill="${M}"/><rect x="71" y="85" width="98" height="82" rx="5" fill="${P}"/><path d="M71 167v-12l22-18 20 14 22-22 34 28v10z" fill="${M}"/><circle cx="118" cy="116" r="19" fill="${B}"/>${rosto(118,117,.5)}`,-5],
 'baladas-shows':['estrela',T,`<path d="M120 28v44" stroke="${A}" stroke-width="6" stroke-linecap="round"/><circle cx="120" cy="126" r="56" fill="${A}"/><path d="M120 70c-32 24-32 88 0 112M120 70c32 24 32 88 0 112M70 100h100M70 152h100" fill="none" stroke="${M}" stroke-width="4" opacity=".28"/><g fill="${T}"><rect x="84" y="106" width="32" height="22" rx="10"/><rect x="124" y="106" width="32" height="22" rx="10"/><rect x="110" y="110" width="20" height="6"/></g><path d="M104 144q16 15 32 0" fill="none" stroke="${T}" stroke-width="5" stroke-linecap="round"/>${brilho(54,70,12,B)}${brilho(188,176,10,B)}${brilho(186,62,6,B)}`],
 'feiras-mercados':['arco',M,`<path d="M120 86V70" stroke="${A}" stroke-width="7" stroke-linecap="round"/><path d="M122 84c4-22 26-30 44-24-4 20-24 30-44 24z" fill="${A}"/><circle cx="120" cy="140" r="58" fill="${B}"/>${rosto(120,132,1.1,T,'riso')}`],
 experiencias:['pilula',M,`<path d="M50 88h140v18a14 14 0 0 0 0 28v18H50v-18a14 14 0 0 0 0-28z" fill="${B}"/><path d="M146 96v48" stroke="${M}" stroke-width="4" stroke-dasharray="1 9" stroke-linecap="round"/>${rosto(100,121,.85)}${brilho(166,120,9,A)}`,-9],
};
const w=(f,s)=>fs.writeFileSync(path.join(OUT,f),s);
fs.mkdirSync(path.join(OUT,'figurinhas'),{recursive:true});
for(const [nome,[f,c,m,g]] of Object.entries(FIG))w(`figurinhas/${nome}.svg`,adesivo(f,c,m,g||0));
module.exports={FIG,adesivo};
if(require.main===module)console.log('figurinhas geradas em',path.join(OUT,'figurinhas'));
