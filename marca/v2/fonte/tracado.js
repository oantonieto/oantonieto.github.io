// Traço manuscrito: pontos -> curvas suaves (Catmull-Rom centrípeta -> Bézier cúbica)
// ponto: [x,y] | [x,y,'c'] canto (retorno do traço) | [x,y,'g'] fantasma (só orienta a tangente)
const A=0.5;
function seg(p0,p1,p2,p3){
  const d=(a,b)=>Math.max(Math.pow(Math.hypot(b[0]-a[0],b[1]-a[1]),A),1e-6);
  const d1=d(p0,p1),d2=d(p1,p2),d3=d(p2,p3);
  const b1=[0,1].map(i=>(d1*d1*p2[i]-d2*d2*p0[i]+(2*d1*d1+3*d1*d2+d2*d2)*p1[i])/(3*d1*(d1+d2)));
  const b2=[0,1].map(i=>(d3*d3*p1[i]-d2*d2*p3[i]+(2*d3*d3+3*d3*d2+d2*d2)*p2[i])/(3*d3*(d3+d2)));
  return [b1,b2,p2];
}
// devolve lista de comandos [{M},{C}] em coordenadas de desenho
function curvas(pts){
  // divide em trechos nos cantos
  const trechos=[];let cur=[];
  for(const p of pts){cur.push(p);if(p[2]==='c'){trechos.push(cur);cur=[[p[0],p[1]]];}}
  if(cur.length>1)trechos.push(cur);
  const out=[];let first=true;
  for(const t of trechos){
    let g0=null,g1=null,q=t.slice();
    if(q[0][2]==='g'){g0=q.shift();}
    if(q[q.length-1][2]==='g'){g1=q.pop();}
    const refl=(a,b)=>[2*a[0]-b[0],2*a[1]-b[1]];
    if(!g0)g0=refl(q[0],q[1]); if(!g1)g1=refl(q[q.length-1],q[q.length-2]);
    const e=[g0,...q,g1];
    if(first){out.push(['M',q[0]]);first=false;}
    for(let i=1;i<e.length-2;i++)out.push(['C',...seg(e[i-1],e[i],e[i+1],e[i+2])]);
  }
  return out;
}
// transforma (y para cima -> SVG), com inclinação k e escala s
function mk(k,s,ox,oy){return p=>[ox+(p[0]+k*p[1])*s, oy-p[1]*s];}
function d(cmds,T,prec=1){
  const f=n=>+n.toFixed(prec);
  return cmds.map(c=>c[0]==='M'?`M${T(c[1]).map(f).join(' ')}`:'C'+c.slice(1).map(p=>T(p).map(f).join(' ')).join(' ')).join('');
}
function caixa(cmdsList,T){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(const cmds of cmdsList)for(const c of cmds)for(const p of c.slice(1)){const q=T(p);x0=Math.min(x0,q[0]);y0=Math.min(y0,q[1]);x1=Math.max(x1,q[0]);y1=Math.max(y1,q[1]);}
  return [x0,y0,x1,y1];}
module.exports={curvas,mk,d,caixa};
