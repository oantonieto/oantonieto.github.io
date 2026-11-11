// Figurinhas da marca: formas chapadas, um rosto pequeno e contorno branco de adesivo que acompanha o desenho.
// Uso: node marca/v2/fonte/figurinhas.js
const fs=require('fs'),path=require('path');
const OUT=path.resolve(__dirname,'..');
const M='#1E4D3B',M2='#2A6350',B='#E9743A',B2='#F2925F',P='#FBE9D7',A='#F3ECE1',T='#17231E',W='#FFFFFF';
const n=v=>+(+v).toFixed(1);
// Cada elemento: [tag, atributos, opções]. opções.d = detalhe interno (não entra no contorno branco).
const p=(d,fill,o={})=>['path',{d,fill},o];
const l=(d,stroke,sw,o={})=>['path',{d,fill:'none',stroke,'stroke-width':sw,'stroke-linecap':'round','stroke-linejoin':'round',...(o.dash?{'stroke-dasharray':o.dash}:{}),...(o.op?{opacity:o.op}:{})},o];
const c=(cx,cy,r,fill,o={})=>['circle',{cx,cy,r,fill,...(o.op?{opacity:o.op}:{})},o];
const e=(cx,cy,rx,ry,fill,o={})=>['ellipse',{cx,cy,rx,ry,fill,...(o.rot?{transform:`rotate(${o.rot} ${cx} ${cy})`}:{})},o];
const r=(x,y,width,height,rx,fill,o={})=>['rect',{x,y,width,height,rx,fill,...(o.rot?{transform:`rotate(${o.rot} ${x+width/2} ${y+height/2})`}:{})},o];
const g=(tf,itens)=>['g',{transform:tf},{itens}];
// Rosto: pequeno e junto, para ter jeito de personagem e não de emoji.
function rosto(x,y,{s=1,cor=T,boca='sorriso',olho='ponto',bochecha=null}={}){
  const D={d:1},o=[];
  if(bochecha){o.push(c(n(x-17*s),n(y+6*s),n(4.6*s),bochecha,D),c(n(x+17*s),n(y+6*s),n(4.6*s),bochecha,D));}
  o.push(c(n(x-8*s),y,n(3.4*s),cor,D));
  if(olho==='pisca')o.push(l(`M${n(x+4*s)} ${n(y+1*s)}q${n(4*s)} ${n(-5*s)} ${n(8*s)} 0`,cor,n(3.2*s),D));else o.push(c(n(x+8*s),y,n(3.4*s),cor,D));
  if(boca==='aberta')o.push(p(`M${n(x-6.5*s)} ${n(y+7*s)}h${n(13*s)}a${n(6.5*s)} ${n(6.5*s)} 0 0 1 ${n(-13*s)} 0z`,cor,D));
  else if(boca==='o')o.push(c(x,n(y+10*s),n(3.6*s),cor,D));
  else o.push(l(`M${n(x-6*s)} ${n(y+7.5*s)}q${n(6*s)} ${n(6.5*s)} ${n(12*s)} 0`,cor,n(3.4*s),D));
  return o;
}
const arco=(cor)=>p('M44 206V112a76 76 0 0 1 152 0v94a14 14 0 0 1-14 14H58a14 14 0 0 1-14-14z',cor);
const flor=(cor,cx=120,cy=124,R=64,rr=33,q=8)=>[c(cx,cy,R+8,cor),...Array.from({length:q},(_,i)=>{const a=i*2*Math.PI/q;return c(n(cx+R*Math.cos(a)),n(cy+R*Math.sin(a)),rr,cor);})];
const estrela=(cor,cx=120,cy=124,R=100,r2=86,q=14)=>p('M'+Array.from({length:q*2},(_,i)=>{const a=i*Math.PI/q-Math.PI/2,rr=i%2?r2:R;return `${n(cx+rr*Math.cos(a))} ${n(cy+rr*Math.sin(a))}`;}).join('L')+'z',cor,{sj:1});

const FIG={
 // o alfinete inclinado, saindo do selo, no fim de um caminho pontilhado
 lugar:[c(120,138,84,M),l('M44 150c12 34 46 52 78 48',A,6,{dash:'.1 13',d:1}),e(126,202,30,7,M2,{d:1}),
  g('rotate(8 120 206)',[p('M120 206c-41-45-60-75-60-104a60 60 0 0 1 120 0c0 29-19 59-60 104z',B),l('M76 96a46 46 0 0 1 20-34',B2,7,{d:1}),c(120,102,33,W,{d:1}),...rosto(120,102,{s:1.25,bochecha:B2})])],
 // árvore florida num morrinho, com o sol atrás
 parques:[arco(P),c(72,86,17,B,{d:1}),p('M44 184c28-13 58-12 76-4s52 7 76-3v29a14 14 0 0 1-14 14H58a14 14 0 0 1-14-14z',M2,{d:1}),
  r(112,134,19,64,7,B),l('M122 162l22-17',B,8),c(126,86,44,M),c(94,110,30,M),c(162,104,33,M),c(130,116,30,M),
  e(106,68,15,9,M2,{rot:-32,d:1}),c(156,74,5,B,{d:1}),c(92,124,4.500,B,{d:1}),c(176,112,4,B,{d:1}),...rosto(128,100,{s:1.2,cor:A})],
 // pingado no copo americano com pão na chapa
 'cafes-padarias':[...flor(B),l('M108 72c-8-10 8-16 0-28M132 72c-8-10 8-16 0-28',W,7),
  p('M86 84h68l-8 98a8 8 0 0 1-8 7h-36a8 8 0 0 1-8-7z',W),p('M88.600 112h62.800l-5.700 70a8 8 0 0 1-8 7h-36a8 8 0 0 1-8-7z',T,{d:1}),p('M88 104h64l-.7 12H88.700z',P,{d:1}),
  l('M106 122l2 60M134 122l-2 60',W,3,{op:.16,d:1}),...rosto(120,146,{s:1.2,cor:A,boca:'o'}),
  g('rotate(-16 70 178)',[e(70,178,36,21,P),l('M56 170l6 14M70 168l6 14M84 170l5 12',B2,5,{d:1})])],
 // chope com colarinho escorrendo, em cima da bolacha
 bares:[r(30,46,180,172,44,M,{rot:-4}),e(118,198,54,10,A),p('M80 74h80l-10 116a8 8 0 0 1-8 7h-44a8 8 0 0 1-8-7z',B2),l('M97 100l5 68',W,6,{op:.45,d:1}),
  c(88,72,16,W),c(110,58,21,W),c(137,60,18,W),c(156,74,14,W),r(76,68,88,18,9,W),r(147,76,12,32,6,W),
  c(106,178,3.400,W,{op:.6,d:1}),c(134,170,2.800,W,{op:.6,d:1}),...rosto(120,136,{s:1.25,boca:'aberta',bochecha:B})],
 // prato feito: feijão, couve e um ovo por cima
 restaurantes:[c(116,126,94,M),c(112,128,72,W,{d:1}),c(112,128,58,'none',{d:1}),l('M112 70a58 58 0 0 1 0 116a58 58 0 0 1 0-116',P,4,{d:1}),
  c(134,146,24,T,{d:1}),c(114,158,17,T,{d:1}),c(148,126,15,T,{d:1}),c(80,140,19,M2,{d:1}),c(92,158,13,M2,{d:1}),c(72,122,12,M2,{d:1}),
  c(108,104,27,P,{d:1}),c(88,98,15,P,{d:1}),c(130,96,17,P,{d:1}),c(112,122,17,P,{d:1}),c(108,104,19,B,{d:1}),...rosto(108,103,{s:.9}),
  g('rotate(9 208 130)',[l('M198 76v22a10 10 0 0 0 20 0V76M208 76v104',B,8)])],
 // o vão do MASP, com gente pequena embaixo
 cultura:[r(28,38,184,176,42,P,{rot:3}),l('M52 188h136',M,6,{d:1}),r(58,104,124,44,7,M),l('M83 109v34M108 109v34M132 109v34M157 109v34',M2,3,{d:1}),
  l('M46 188V92a10 10 0 0 1 10-10h128a10 10 0 0 1 10 10v96',B,15),...rosto(120,124,{s:1.15,cor:A}),
  c(94,168,5,T,{d:1}),l('M94 176v9',T,5,{d:1}),c(142,170,4.500,T,{d:1}),l('M142 177v8',T,4.500,{d:1})],
 // globo de espelhos girando
 'baladas-shows':[estrela(T),l('M120 20v48',A,5),c(120,128,58,A),
  ...[[98,82,P],[118,80,B2],[138,84,P],[74,104,B2],[152,106,P],[72,146,P],[154,148,B2],[96,166,B2],[118,170,P],[140,164,W]].map(([x,y,f])=>r(x-8,y-8,16,16,4,f,{d:1})),
  ...rosto(120,126,{s:1.4,boca:'aberta',bochecha:B2}),l('M36 92l15 9M30 130h17M204 92l-15 9M210 130h-17',B,7,{d:1})],
 // pastel de feira mordido com caldo de cana
 'feiras-mercados':[arco(M),p('M150 94h42l-6 84a6 6 0 0 1-6 5h-22a6 6 0 0 1-6-5z',W),p('M151.400 114h39l-4.400 64a6 6 0 0 1-6 5h-22a6 6 0 0 1-6-5z',P,{d:1}),l('M172 104l13-50',B,7),
  g('rotate(-9 114 152)',[r(58,116,116,76,15,B2),l('M70 130v48M162 130v48',B,5,{dash:'.1 9.500',d:1}),l('M74 180h84',B,5,{dash:'.1 9.500',d:1}),
   c(62,118,15,M,{d:1}),c(79,113,8,M,{d:1}),c(58,136,7,M,{d:1}),...rosto(118,152,{s:1.35,bochecha:B})])],
 // ingresso com o canhoto destacando
 experiencias:[r(18,72,204,104,52,M,{rot:-8}),g('rotate(-8 120 124)',[p('M48 92h98v62H48v-17a14 14 0 0 0 0-28z',B),...rosto(98,121,{s:1.25,olho:'pisca'}),
   g('rotate(9 154 154)',[p('M154 92h42v17a14 14 0 0 0 0 28v17h-42z',B2),c(176,123,6.500,M,{d:1})])])],
 // dado de cara piscando: o "Me Surpreenda"
 surpresa:[estrela(B,120,122,98,84,12),g('rotate(-10 120 122)',[r(70,72,100,100,24,W),c(94,96,7,T,{d:1}),c(146,96,7,T,{d:1}),c(94,148,7,T,{d:1}),c(146,148,7,T,{d:1}),...rosto(120,119,{s:1.3,olho:'pisca',bochecha:B2})])],
};
const attrs=a=>Object.entries(a).map(([k,v])=>` ${k}="${v}"`).join('');
function desenha(itens,contorno){
  return itens.map(([tag,a,o])=>{
    if(tag==='g')return `<g${attrs(a)}>${desenha(o.itens,contorno)}</g>`;
    if(contorno){ if(o.d)return ''; const b={...a};delete b.opacity;delete b['stroke-dasharray'];
      const sw=(+a['stroke-width']||0)+15; if(b.fill!=='none')b.fill=W; return `<${tag}${attrs({...b,stroke:W,'stroke-width':sw,'stroke-linejoin':'round','stroke-linecap':'round'})}/>`; }
    const b={...a}; if(o.sj){b.stroke=a.fill;b['stroke-width']=6;b['stroke-linejoin']='round';}
    return `<${tag}${attrs(b)}/>`;
  }).join('');
}
const adesivo=itens=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">${desenha(itens,true)}${desenha(itens,false)}</svg>\n`;
fs.mkdirSync(path.join(OUT,'figurinhas'),{recursive:true});
for(const [nome,itens] of Object.entries(FIG))fs.writeFileSync(path.join(OUT,'figurinhas',nome+'.svg'),adesivo(itens));
module.exports={FIG,adesivo};
if(require.main===module)console.log('figurinhas geradas em',path.join(OUT,'figurinhas'));
