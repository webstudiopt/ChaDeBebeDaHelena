/* ===== Ajuste aqui ===== */
/* Dados sensíveis vêm de js/config.js (fora do repositório). Veja o README. */
const CFG=window.CONVITE||{};
const WHATS=CFG.whats||"";
const PIX_KEY=CFG.pixKey||"";
const PIX_NAME=CFG.pixName||"";
const ENDERECO=CFG.endereco||"";
const LUGAR=CFG.lugar||"Chácara Só Sossego";
const GIFTS=[
  ["Pacote de fraldas","",90],
  ["Kit bodies","Tamanhos P e M",60],
  ["Macacão","Tamanho P ou M",45],
  ["Manta de algodão","",50],
  ["Toalha com capuz","",40],
  ["Kit higiene","Pente, escova, tesourinha",45],
  ["Lenço umedecido e pomada","",35],
  ["Kit babador","",30],
  ["Meias e luvinhas","",25],
  ["Naninha","",40],
  ["Mordedor","",20],
  ["Banheira","",90],
  ["Trocador portátil","",70],
  ["Presente livre","Qualquer valor, do jeito que puder",0]
];
/* ======================= */

const brl=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0});
const wa=t=>"https://wa.me/"+WHATS+"?text="+encodeURIComponent(t);

if(ENDERECO){
  const e=document.getElementById("endereco");e.innerHTML="";const b=document.createElement("b");b.textContent=LUGAR;e.append(b,document.createElement("br"),ENDERECO);e.classList.remove("muted");
  const a=document.createElement("a");a.className="btn small";a.target="_blank";a.rel="noopener";
  a.href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(ENDERECO);a.textContent="Abrir no mapa";
  document.getElementById("agenda").before(a);
}
document.getElementById("agenda").href="https://calendar.google.com/calendar/render?action=TEMPLATE&text="+
  encodeURIComponent("Chá da Helena")+"&dates=20261114T180000Z/20261114T210000Z&details="+encodeURIComponent("Chá de bebê da Helena")+
  (ENDERECO?"&location="+encodeURIComponent(LUGAR+", "+ENDERECO):"");

/* Confirmação */
const nome=document.getElementById("nome"),qtd=document.getElementById("qtd");
const sim=document.getElementById("sim"),nao=document.getElementById("nao"),hint=document.getElementById("conf-hint");
function upd(){
  const n=nome.value.trim(),q=Math.max(1,+qtd.value||1);
  const ok=!!n;
  [sim,nao].forEach(b=>b.setAttribute("aria-disabled",String(!ok)));
  hint.hidden=ok;
  if(!ok){sim.removeAttribute("href");nao.removeAttribute("href");return}
  sim.href=wa(`Oi! Aqui é ${n}. Confirmo presença no chá da Helena, dia 14/11 às 15h${q>1?`. Vamos em ${q} pessoas`:""} 💚`);
  nao.href=wa(`Oi! Aqui é ${n}. Infelizmente não vou conseguir ir ao chá da Helena, mas desejo tudo de bom 💚`);
}
nome.addEventListener("input",upd);qtd.addEventListener("input",upd);upd();

/* Presentes */
const ul=document.getElementById("gifts"),box=document.getElementById("pixbox");
GIFTS.forEach(([n,d,v])=>{
  const li=document.createElement("li");li.className="gift";
  li.innerHTML=`<b></b><span class="price">${v?brl(v):"Livre"}</span><span class="desc"></span><div class="acts"><button class="btn small pixb" type="button">Mandar Pix</button><a class="btn small take" target="_blank" rel="noopener">Vou levar</a></div>`;
  li.querySelector("b").textContent=n;li.querySelector(".desc").textContent=d;
  li.querySelector(".pixb").addEventListener("click",()=>openPix(n,v));
  const take=li.querySelector(".take");
  const setTake=()=>{const who=nome.value.trim();take.href=wa(`Oi! ${who?`Aqui é ${who}. `:""}Vou levar de presente para a Helena: ${v?n:"um presente surpresa"} 💚`)};
  setTake();nome.addEventListener("input",setTake);
  if(!v){take.textContent="Vou levar outro presente"}
  ul.appendChild(li);
});
function openPix(n,v){
  box.hidden=false;
  document.getElementById("pix-title").textContent=n+(v?" · "+brl(v):"");
  const has=!!PIX_KEY;
  document.getElementById("pix-has").hidden=!has;document.getElementById("pix-none").hidden=has;
  if(has){
    document.getElementById("pix-key").textContent=PIX_KEY;document.getElementById("pix-name").textContent=PIX_NAME?"Em nome de "+PIX_NAME:"";
    const who=nome.value.trim();
    document.getElementById("avisar").href=wa(`Oi! ${who?`Aqui é ${who}. `:""}Enviei o Pix de presente para a Helena: ${n}${v?` (${brl(v)})`:""} 💚`);
  }
  document.getElementById("copiado").textContent="";
  box.scrollIntoView({behavior:"smooth",block:"nearest"});
}
document.getElementById("copiar").addEventListener("click",async()=>{
  const out=document.getElementById("copiado");
  try{await navigator.clipboard.writeText(PIX_KEY);out.textContent="Chave copiada"}
  catch(e){const r=document.createRange();r.selectNodeContents(document.getElementById("pix-key"));const s=getSelection();s.removeAllRanges();s.addRange(r);out.textContent="Chave selecionada, é só copiar"}
});


/* Cena do amanhecer, mais realista: céu dourado com nuvens, sol com brilho, montanhas com névoa e campo florido. Determinística em t (s). */
window.HelenaScene=(function(){
  const stage=document.getElementById("stage"),c=stage.querySelector("canvas"),x=c.getContext("2d");
  const clamp=v=>Math.max(0,Math.min(1,v));
  const ease=v=>{v=clamp(v);return v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2};
  const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
  const lerp=(a,b,k)=>a+(b-a)*k;
  const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
  const mixA=(a,b,k)=>{const A=hex(a),B=hex(b);return A.map((v,i)=>Math.round(lerp(v,B[i],k)))};
  const mix=(a,b,k)=>`rgb(${mixA(a,b,k).join(",")})`;
  const h=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s)};
  let W=0,H=0,dpr=1,clouds=null,meadow=null,grain=null;

  function cv(w,hh){const k=document.createElement("canvas");k.width=Math.ceil(w*dpr);k.height=Math.ceil(hh*dpr);const g=k.getContext("2d");g.setTransform(dpr,0,0,dpr,0,0);return[k,g]}

  /* nuvens: faixas suaves, iluminadas por baixo */
  function makeClouds(){
    const[k,g]=cv(W*1.6,H*.55);
    const bands=[[.10,.9,.55],[.2,1.1,.45],[.31,1.3,.5],[.42,1.0,.4],[.5,.8,.35]];
    let n=0;
    bands.forEach(([yy,sc,al],bi)=>{
      for(let i=0;i<34;i++){n++;
        const cx=h(n+bi*99)*W*1.6,cy=H*.55*yy+(h(n+7)-.5)*H*.035,rw=W*(.1+.22*h(n+3))*sc,rh=H*(.008+.016*h(n+5))*sc;
        const gr=g.createRadialGradient(cx,cy,0,cx,cy,rw);
        const lit=bi>=2;
        gr.addColorStop(0,lit?`rgba(255,226,190,${al})`:`rgba(250,232,222,${al*.9})`);
        gr.addColorStop(.5,lit?`rgba(248,198,160,${al*.45})`:`rgba(240,214,205,${al*.4})`);
        gr.addColorStop(1,"rgba(255,230,200,0)");
        g.save();g.translate(cx,cy);g.scale(1,rh/rw);g.translate(-cx,-cy);g.fillStyle=gr;g.beginPath();g.arc(cx,cy,rw,0,Math.PI*2);g.fill();g.restore();
        /* borda de baixo dourada */
        if(lit&&h(n+11)<.6){g.fillStyle=`rgba(255,214,140,${.25*al})`;g.beginPath();g.ellipse(cx,cy+rh*.55,rw*.7,rh*.35,0,0,Math.PI*2);g.fill()}
      }
    });
    return k;
  }
  /* campo florido em primeiro plano, contra a luz */
  function makeMeadow(){
    const top=H*.66,[k,g]=cv(W,H-top+2);
    const hh=H-top;
    const base=g.createLinearGradient(0,0,0,hh);
    base.addColorStop(0,"#8a7c4a");base.addColorStop(.25,"#6e6339");base.addColorStop(1,"#3f3a24");
    g.fillStyle=base;g.beginPath();g.moveTo(0,hh*.12);
    for(let i=0;i<=30;i++){const u=i/30;g.lineTo(u*W,hh*.12-Math.sin(u*5.3+1)*hh*.025-Math.sin(u*13)*hh*.01)}
    g.lineTo(W,hh+2);g.lineTo(0,hh+2);g.fill();
    /* capim */
    let n=0;
    for(let layer=0;layer<3;layer++){
      const cnt=Math.round(W*(1.1+layer*.7));
      for(let i=0;i<cnt;i++){n++;
        const bx=h(n+1000)*W,by=hh*(.1+layer*.12+h(n+2000)*.25);
        const len=hh*(.08+.14*h(n+3000))*(1.15-layer*.15),lean=(h(n+4000)-.5)*.5;
        const tone=layer===0?["#a3955a","#8f8350"]:layer===1?["#7c7142","#6a6038"]:["#5a5230","#4b452a"];
        g.strokeStyle=tone[n%2];g.lineWidth=.6+layer*.25;g.lineCap="round";
        g.beginPath();g.moveTo(bx,by);g.quadraticCurveTo(bx+lean*len*.3,by-len*.6,bx+lean*len,by-len);g.stroke();
        if(layer===0&&n%3===0){g.strokeStyle="rgba(255,214,140,.55)";g.lineWidth=.6;g.beginPath();g.moveTo(bx+lean*len*.6,by-len*.75);g.lineTo(bx+lean*len,by-len);g.stroke()}
      }
      /* flores do campo */
      const fl=Math.round(W*(.18+layer*.12));
      for(let i=0;i<fl;i++){n++;
        const fx=h(n+5000)*W,fy=hh*(.06+layer*.13+h(n+6000)*.22),r=(1.2+1.8*h(n+7000))*(1+layer*.35);
        const rose=h(n+8000)<.15,cream=h(n+8100)<.3;
        g.strokeStyle="#6b6238";g.lineWidth=.5;g.beginPath();g.moveTo(fx,fy);g.lineTo(fx+(h(n)-.5)*3,fy+r*4);g.stroke();
        for(let j=0;j<5;j++){const a=j/5*Math.PI*2+n;g.fillStyle=rose?"#f2c9c0":cream?"#f6e6c4":"#fffaf0";
          g.beginPath();g.ellipse(fx+Math.cos(a)*r*.6,fy+Math.sin(a)*r*.6,r*.55,r*.35,a,0,Math.PI*2);g.fill()}
        g.fillStyle="#e2b45a";g.beginPath();g.arc(fx,fy,r*.28,0,Math.PI*2);g.fill();
        /* luz de contorno */
        g.fillStyle="rgba(255,236,190,.5)";g.beginPath();g.arc(fx-r*.2,fy-r*.35,r*.3,0,Math.PI*2);g.fill();
      }
    }
    /* flores altas nas laterais, contra o sol */
    [[W*.04,1],[W*.11,1],[W*.9,-1],[W*.96,-1]].forEach(([sx,dir],i)=>{
      const stemH=hh*(.32+.12*h(i+50));
      g.strokeStyle="#4e4629";g.lineWidth=1.1;g.beginPath();g.moveTo(sx,hh);g.quadraticCurveTo(sx+dir*8,hh-stemH*.5,sx+dir*4,hh-stemH);g.stroke();
      for(let j=0;j<4;j++){const ly=hh-stemH*(.25+j*.17);g.fillStyle=j%2?"#5f5631":"#6c6338";g.save();g.translate(sx+dir*(3+j),ly);g.rotate(dir*(j%2?-.9:.9)-(j%2?0:Math.PI));g.beginPath();g.ellipse(9,0,10,3.2,0,0,Math.PI*2);g.fill();g.restore()}
      const fx=sx+dir*4,fy=hh-stemH;
      for(let j=0;j<12;j++){const a=j/12*Math.PI*2,d=4+(j%3)*3;g.fillStyle=j%5===0?"#f3d2c9":"#fffaf0";g.beginPath();g.arc(fx+Math.cos(a)*d,fy+Math.sin(a)*d*.8,2,0,Math.PI*2);g.fill()}
      g.fillStyle="rgba(255,226,160,.7)";g.beginPath();g.arc(fx-1,fy-2,2.4,0,Math.PI*2);g.fill();
    });
    return k;
  }
  function makeGrain(){
    const n=document.createElement("canvas");n.width=n.height=200;const g=n.getContext("2d");const im=g.createImageData(200,200);
    for(let i=0;i<im.data.length;i+=4){const v=120+h(i*.31)*135;im.data[i]=v;im.data[i+1]=v*.96;im.data[i+2]=v*.9;im.data[i+3]=h(i*.17+3)*22}
    g.putImageData(im,0,0);return x.createPattern(n,"repeat");
  }
  function size(){
    const r=stage.getBoundingClientRect();dpr=Math.min(3,window.SCENE_DPR||devicePixelRatio||1);
    W=r.width;H=r.height;c.width=Math.round(W*dpr);c.height=Math.round(H*dpr);x.setTransform(dpr,0,0,dpr,0,0);
    clouds=makeClouds();meadow=makeMeadow();grain=makeGrain();
  }
  function ridge(y0,amp,ph,freq,col,jag){
    x.fillStyle=col;x.beginPath();x.moveTo(0,H);x.lineTo(0,y0);
    for(let i=0;i<=80;i++){const u=i/80;
      const yy=y0-Math.sin(u*Math.PI*freq+ph)*amp-Math.sin(u*Math.PI*freq*2.7+ph*1.7)*amp*.35-(jag?Math.abs(Math.sin(u*61+ph))*amp*.12:0);
      x.lineTo(u*W,yy)}
    x.lineTo(W,H);x.closePath();x.fill();
  }
  function sprig(bx,by,ang,len,t,k,alpha){
    x.save();x.translate(bx,by);x.rotate(ang+Math.sin(t*.55+k)*.02);x.globalAlpha=alpha;
    const L=len;x.strokeStyle="#4f4128";x.lineWidth=1.3;x.lineCap="round";
    x.beginPath();x.moveTo(0,0);x.bezierCurveTo(L*.35,-L*.05,L*.65,-L*.18,L,-L*.12);x.stroke();
    for(let i=1;i<11;i++){
      const u=i/11,px=L*u,py=-L*(.02+.16*u*u)+(i%2?-2:2),side=i%2?-1:1,la=side*(.75+h(k*10+i)*.35),ll=L*(.08+.05*h(k+i));
      x.save();x.translate(px,py);x.rotate(la);
      const lg=x.createLinearGradient(0,-ll*.2,0,ll*.2);lg.addColorStop(0,"#8a8150");lg.addColorStop(1,"#55502d");
      x.fillStyle=lg;x.beginPath();x.ellipse(ll*.6,0,ll*.6,ll*.21,0,0,Math.PI*2);x.fill();
      x.strokeStyle="rgba(255,220,150,.55)";x.lineWidth=.6;x.beginPath();x.ellipse(ll*.6,0,ll*.6,ll*.21,0,Math.PI*1.05,Math.PI*1.95);x.stroke();
      x.restore();
      if(i%3===0||i===10){const fx=px+side*6,fy=py-8;
        for(let j=0;j<5;j++){const a=j/5*Math.PI*2+k;x.fillStyle=(i===6)?"#f3cfc6":"#fffaf1";x.beginPath();x.ellipse(fx+Math.cos(a)*2.8,fy+Math.sin(a)*2.8,2.6,1.7,a,0,Math.PI*2);x.fill()}
        x.fillStyle="#d9a84e";x.beginPath();x.arc(fx,fy,1.2,0,Math.PI*2);x.fill();}
    }
    x.restore();x.globalAlpha=1;
  }
  function star(sx,sy,r,a){
    x.globalAlpha=a;x.fillStyle="#fff3d6";x.beginPath();
    x.moveTo(sx,sy-r);x.quadraticCurveTo(sx,sy,sx+r*.3,sy);x.quadraticCurveTo(sx,sy,sx,sy+r);x.quadraticCurveTo(sx,sy,sx-r*.3,sy);x.quadraticCurveTo(sx,sy,sx,sy-r);x.fill();
    x.beginPath();x.moveTo(sx-r*.7,sy);x.quadraticCurveTo(sx,sy,sx,sy-r*.2);x.quadraticCurveTo(sx,sy,sx+r*.7,sy);x.quadraticCurveTo(sx,sy,sx,sy+r*.2);x.quadraticCurveTo(sx,sy,sx-r*.7,sy);x.fill();x.globalAlpha=1;
  }

  function draw(t){
    if(!W)size();
    const L=ease((t-.3)/6.4),horizon=H*.6;
    const sunY=lerp(H*.7,H*.555,ease((t-.5)/6.6)),sr=W*.085,sx=W/2;

    /* céu */
    const sky=x.createLinearGradient(0,0,0,horizon);
    sky.addColorStop(0,mix("#4d4250","#f4e4d2",L));
    sky.addColorStop(.38,mix("#6d5560","#f7d8b8",L));
    sky.addColorStop(.72,mix("#9a6f62","#f8c690",L));
    sky.addColorStop(1,mix("#c08d6c","#fcd48e",L));
    x.fillStyle=sky;x.fillRect(0,0,W,H);

    /* estrelas antes do dia */
    for(let i=0;i<14;i++){const tw=.5+.5*Math.sin(t*1.7+i*2.3);star(W*(.06+.88*h(i+20)),H*(.03+.2*h(i+40)),1.8+3.2*h(i+60),(.35+.5*tw)*(1-L*.9))}

    /* brilho do sol no céu */
    const bloom=x.createRadialGradient(sx,sunY,sr*.4,sx,sunY,W*(.55+.7*L));
    bloom.addColorStop(0,`rgba(255,236,190,${.55+.4*L})`);bloom.addColorStop(.18,`rgba(255,205,130,${.35+.35*L})`);
    bloom.addColorStop(.5,`rgba(250,180,130,${.12+.18*L})`);bloom.addColorStop(1,"rgba(250,190,150,0)");
    x.fillStyle=bloom;x.fillRect(0,0,W,H);

    /* nuvens, iluminadas */
    x.save();x.globalAlpha=.35+.65*L;x.drawImage(clouds,-((t*3)%(W*.4)),0,W*1.6,H*.55);
    x.globalCompositeOperation="soft-light";x.fillStyle=`rgba(255,190,120,${.4*L})`;x.fillRect(0,0,W,H*.55);x.restore();

    /* raios de luz suaves */
    x.save();x.translate(sx,sunY);x.globalCompositeOperation="screen";
    for(let i=0;i<14;i++){
      const a=-Math.PI/2+(i/13-.5)*2.6+Math.sin(t*.15+i)*.02,w=.025+.03*h(i+9),len=H*(.45+.25*h(i+19));
      const g=x.createLinearGradient(0,0,Math.cos(a)*len,Math.sin(a)*len);
      g.addColorStop(0,`rgba(255,226,170,${(.12+.1*h(i))*L})`);g.addColorStop(1,"rgba(255,226,170,0)");
      x.fillStyle=g;x.beginPath();x.moveTo(0,0);x.lineTo(Math.cos(a-w)*len,Math.sin(a-w)*len);x.lineTo(Math.cos(a+w)*len,Math.sin(a+w)*len);x.closePath();x.fill();
    }
    /* raios finos, discretos */
    x.rotate(t*.01);
    for(let i=0;i<60;i++){const a=i/60*Math.PI*2,len=sr*(1.7+1.6*h(i+3))*(.5+.5*L);
      x.strokeStyle=`rgba(255,215,140,${(.15+.25*h(i+7))*L})`;x.lineWidth=i%4?.5:.9;
      x.beginPath();x.moveTo(Math.cos(a)*sr*1.25,Math.sin(a)*sr*1.25);x.lineTo(Math.cos(a)*len,Math.sin(a)*len);x.stroke()}
    x.restore();

    /* sol */
    const halo=x.createRadialGradient(sx,sunY,sr*.8,sx,sunY,sr*2.4);
    halo.addColorStop(0,`rgba(255,240,200,${.7*L+.2})`);halo.addColorStop(1,"rgba(255,220,160,0)");
    x.fillStyle=halo;x.beginPath();x.arc(sx,sunY,sr*2.4,0,Math.PI*2);x.fill();
    const sg=x.createRadialGradient(sx,sunY,0,sx,sunY,sr);
    sg.addColorStop(0,"#fffefa");sg.addColorStop(.6,"#fff4d6");sg.addColorStop(.9,"#ffe2a2");sg.addColorStop(1,"#f9cf7e");
    x.globalAlpha=.6+.4*L;x.fillStyle=sg;x.beginPath();x.arc(sx,sunY,sr,0,Math.PI*2);x.fill();x.globalAlpha=1;

    /* montanhas com perspectiva atmosférica */
    ridge(horizon-H*.01,H*.03,1.2,2.2,mix("#5e4a52","#e6b39c",L),true);
    ridge(horizon+H*.012,H*.022,3.1,3.0,mix("#4f3f43","#c99a82",L),true);
    /* névoa no vale */
    const mist=x.createLinearGradient(0,horizon-H*.01,0,horizon+H*.07);
    mist.addColorStop(0,"rgba(255,232,200,0)");mist.addColorStop(.5,`rgba(255,228,190,${.25+.4*L})`);mist.addColorStop(1,"rgba(255,232,200,0)");
    x.fillStyle=mist;x.fillRect(0,horizon-H*.01,W,H*.08);
    ridge(horizon+H*.045,H*.02,4.4,2.4,mix("#3d3530","#9c8963",L),false);
    const mist2=x.createLinearGradient(0,horizon+H*.03,0,horizon+H*.09);
    mist2.addColorStop(0,"rgba(255,230,190,0)");mist2.addColorStop(.5,`rgba(255,226,180,${.18+.3*L})`);mist2.addColorStop(1,"rgba(255,230,190,0)");
    x.fillStyle=mist2;x.fillRect(0,horizon+H*.03,W,H*.06);

    /* campo */
    x.drawImage(meadow,0,H*.66,W,H-H*.66+2);
    /* luz do sol rasante no campo */
    const fg=x.createRadialGradient(sx,H*.66,0,sx,H*.66,W*.9);
    fg.addColorStop(0,`rgba(255,214,150,${.32*L})`);fg.addColorStop(1,"rgba(255,214,150,0)");
    x.fillStyle=fg;x.fillRect(0,H*.6,W,H*.4);
    /* sombra para o texto ler bem embaixo */
    const sh=x.createLinearGradient(0,H*.68,0,H);sh.addColorStop(0,"rgba(30,22,12,0)");sh.addColorStop(.35,"rgba(30,22,12,.22)");sh.addColorStop(1,"rgba(30,22,12,.48)");
    x.fillStyle=sh;x.fillRect(0,H*.68,W,H*.32);

    /* ramo no canto de cima */
    sprig(W*1.03,-H*.005,Math.PI-.42,W*.4,t,3,.35+.65*smooth((t-1)/4));

    /* partículas de luz */
    for(let i=0;i<70;i++){
      const sp=5+11*h(i+200),y0=h(i+300)*H*1.1;
      const py=((y0-sp*t)%(H*1.1)+H*1.1)%(H*1.1)-H*.05,px=h(i+400)*W+Math.sin(t*.5+i)*8;
      const tw=.5+.5*Math.sin(t*2.3+i*1.7),a=(.25+.7*tw)*clamp(L*1.6),r=.6+1.6*h(i+500);
      const g=x.createRadialGradient(px,py,0,px,py,r*4.5);
      g.addColorStop(0,`rgba(255,226,160,${a})`);g.addColorStop(.3,`rgba(255,206,120,${a*.5})`);g.addColorStop(1,"rgba(255,206,120,0)");
      x.fillStyle=g;x.beginPath();x.arc(px,py,r*4.5,0,Math.PI*2);x.fill();
    }

    /* grão de filme leve */
    x.save();x.globalCompositeOperation="overlay";x.globalAlpha=.5;x.fillStyle=grain;x.fillRect(0,0,W,H);x.restore();
    /* bordas mais escuras no começo */
    const vg=x.createRadialGradient(W/2,H*.48,W*.3,W/2,H*.5,H*.78);
    vg.addColorStop(0,"rgba(40,26,20,0)");vg.addColorStop(1,`rgba(40,26,20,${.45*(1-L)+.12})`);
    x.fillStyle=vg;x.fillRect(0,0,W,H);
    const veil=.3*(1-smooth(t/2.2));if(veil>0){x.fillStyle=`rgba(30,20,16,${veil})`;x.fillRect(0,0,W,H)}

    /* textos, revelados pela luz */
    stage.querySelectorAll("[data-in]").forEach(el=>{
      const start=+el.dataset.in,dur=+(el.dataset.dur||1.6),p=ease((t-start)/dur);
      el.style.opacity=p;el.style.transform=`translateY(${(1-p)*10}px)`;el.style.filter=p<1?`blur(${(1-p)*7}px)`:"none";
      if(el.classList.contains("name")){
        const glow=Math.sin(Math.PI*clamp((t-start)/(dur*1.6)));
        el.style.letterSpacing=`${lerp(.32,.14,p)}em`;el.style.paddingLeft=`${lerp(.32,.14,p)}em`;
        el.style.textShadow=`0 0 ${16+26*glow}px rgba(255,236,190,${.35+.5*glow})`;
      }
    });
  }
  return {draw,size,END:9.5};
})();

(function(){
  const S=window.HelenaScene,reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let start=performance.now();
  if(reduce)start-=S.END*1000;
  function loop(now){S.draw((now-start)/1000);requestAnimationFrame(loop)}
  new ResizeObserver(()=>S.size()).observe(document.getElementById("stage"));
  document.getElementById("replay").addEventListener("click",()=>{start=performance.now()});
  (document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{start=performance.now()-(reduce?S.END*1000:0)});
  requestAnimationFrame(loop);
})();
