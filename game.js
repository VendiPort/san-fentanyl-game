'use strict';
// SAN FENTANYL — cartoon satire brawler. No dependencies.
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const W=960,H=540,Y0=385,Y1=505;
const keys={},press={};
addEventListener('keydown',e=>{if(!keys[e.code])press[e.code]=1;keys[e.code]=1;if(/^(Space|Arrow)/.test(e.code))e.preventDefault();});
addEventListener('keyup',e=>{keys[e.code]=0;});
const down=(...c)=>c.some(k=>keys[k]),hit=(...c)=>c.some(k=>press[k]);
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),sgn=v=>v<0?-1:1;
const hash=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};
const LV=['SOMA','THE MISSION','THE TENDERLOIN'];
const PAL=[{sky:['#10001f','#3a0a5c'],a:'#ff2bd6',b:'#19f3ff'},{sky:['#1a0620','#5c1a3a'],a:'#ff8a2b',b:'#ff2bd6'},{sky:['#04041f','#1a1a6a'],a:'#a35bff',b:'#19b8ff'}];
let S='title',G=null,tnow=0;

function newGame(){
  G={score:0,un:{hose:false,ng:false,fg:false,torch:false},ng:5,fg:4,wp:1,
     P:{x:200,y:440,z:0,vz:0,f:1,hp:100,max:100,cd:0,anim:0,at:'',inv:0,burn:0,slow:0,boost:0,narc:100,water:100,poopCd:0,hold:null,pcd:0,pt:-1,pn:0,jt:0,jc:0,spray:0,flame:0,hose:0},
     msg:'',msgT:0,flash:0,rings:[]};
  startLevel(0);
}
function msg(s,t=3){G.msg=s;G.msgT=t;}
function startLevel(l){
  const g=G;g.lvl=l;g.t=0;g.zs=[];g.dogs=[];g.hs=[];g.poops=[];g.tents=[];g.bros=[];g.projs=[];g.items=[];g.fx=[];g.txt=[];g.owners=[];g.clouds=[];g.stalls=[];g.att=[];
  g.boss=null;g.heat=0;g.spawnT=3;g.camMax=1e9;g.camMin=0;g.cam=0;g.win=0;g.shake=0;g.phase='walk';g.junk={x:600,y:450,say:'',vis:true,flee:false};
  const P=g.P;P.z=0;P.vz=0;P.burn=0;P.hold=null;P.boost=0;
  g.mayor={x:60,y:470,st:'idle',say:'',sayT:0,back:0,carried:false};
  if(l===0){
    P.x=220;P.y=450;g.worldW=3600;g.carX=420;g.camMax=0;g.phase='tut';g.wave=0;g.clinicX=3000;
    msg('Your car is getting broken into! J punch · K kick · L Narcan spray',6);
    spawnZ(760,430,{});spawnZ(860,480,{});
    [1000,1900,2350].forEach(x=>g.tents.push({x,y:420,out:false}));
    [1500,2200].forEach(x=>g.poops.push({x,y:rnd(Y0+10,Y1-10),fire:0}));
    g.poops.push({x:1100,y:470,fire:0},{x:1700,y:410,fire:0},{x:2600,y:450,fire:0});
    [700,1700,2250].forEach(x=>g.bros.push(mkBro(x)));
  }else if(l===1){
    P.x=300;P.y=450;g.phase='ride';g.worldW=7600;g.sp=420;g.cam=0;g.stall=0;g.attT=2;g.hopped=0;
    for(let x=900;x<7200;x+=rnd(260,430)){g.stalls.push({x,y:rnd(Y0+10,Y1-10),g:Math.floor(rnd(0,GOODS.length)),vendor:Math.random()<.4,dead:false,hopped:false});}
    msg('Chase the junkie! Hop (SPACE) stalls, time J/K/L when attackers lunge. Keep momentum!',6);
    g.un.hose=g.un.hose;
  }else{
    P.x=150;P.y=450;g.worldW=4800;g.phase='walk';g.un.hose=true;g.wp=2;
    msg('TENDERLOIN. Store owners have hoses — grab 2 and hold E. Follow the junkie to the cable car.',6);
    [800,1700,2550].forEach(x=>g.owners.push({x,y:430,say:'',sayT:0,spray:0}));
    [950,1850,2800].forEach(x=>g.tents.push({x,y:420,out:false}));
    for(let i=0;i<7;i++)g.poops.push({x:rnd(500,3300),y:rnd(Y0+10,Y1-10),fire:0});
    [600,1500,2400].forEach(x=>g.bros.push(mkBro(x)));
    g.cableX=3600;
  }
}
const GOODS=[['🪥','TOOTHBRUSHES'],['🧴','SHAMPOO'],['🧼','STOLEN FROM WALGREENS'],['🧻','BULK TP'],['🪒','RAZORS $1'],['🍫','CANDY']];
const BROSAY=['I should move back home','I should move back home...','My Series B!','This is not in the pitch deck'];
const WHINE=["I'll commission a study!","Please don't hit me!","Can we form a task force?","This is NOT my fault!","I want my mommy","Let's circle back…"];
function mkBro(x){return{x,y:rnd(Y0+10,Y1-10),dir:1,say:'',sayT:0,st:0,rescued:false,hc:0,hurt:0};}
function spawnZ(x,y,o){const z=Object.assign({k:'z',x,y,z:0,vx:0,hp:30,max:30,r:14,cd:rnd(1,2),ko:false,t:0,f:-1,kicked:0,hit:0,fire:0,sp:rnd(60,85),thrower:false,scoot:false,dir:-1,hue:rnd(70,130)},o);G.zs.push(z);return z;}
function spawnDog(x,y,big){G.dogs.push({k:'d',x,y,z:0,vx:0,hp:big?35:12,max:big?35:12,r:big?20:12,cd:0,ko:false,t:0,f:-1,kicked:0,hit:0,fire:0,sp:big?big:120,dmg:big?6:3,big:big?1:0});}
function say(o,t,d=2.2){o.say=t;o.sayT=d;}
function ftxt(x,y,s,c='#fff'){G.txt.push({x,y,s,c,t:1.2});}
function addScore(n,x,y,label){G.score=Math.max(0,G.score+n);if(label&&x!==undefined)ftxt(x,y-50,label+(n>0?' +':' ')+n,n>0?'#19f3ff':'#ff2bd6');
  const u=G.un,s=G.score;
  if(!u.hose&&s>=200){u.hose=true;msg('UNLOCKED: Store Owner\'s Hose [2] — hold E',4);}
  if(!u.ng&&s>=500){u.ng=true;msg('UNLOCKED: Narcan Grenades [3] — press E',4);}
  if(!u.fg&&s>=1400){u.fg=true;msg('UNLOCKED: Fentanyl Grenades [5] — press E',4);}
}
const foes=()=>[...G.zs,...G.dogs,...G.hs].filter(f=>!f.ko);
function hurt(d,burn){const P=G.P;if(P.inv>0||G.phase==='dead')return;P.hp-=d;P.inv=.45;G.shake=.2;if(burn)P.burn=Math.max(P.burn,burn);burst(P.x,P.y,40,'#ff2bd6',6);
  if(P.hp<=0){S='over';}}
function burst(x,y,z,c,n){for(let i=0;i<n;i++)G.fx.push({x,y,z,vx:rnd(-90,90),vy:rnd(-30,30),vz:rnd(40,200),life:rnd(.3,.8),c,s:rnd(2,4)});}
function koFoe(f){f.ko=true;f.t=0;f.vx=f.vx||0;
  addScore(f.k==='h'?60:f.k==='d'?30:50,f.x,f.y,f.k==='h'?'DYE OUT':'KO');
  if(f.scoot){G.items.push({k:'scooter',x:f.x,y:f.y});}}
function dmgFoe(f,d,kb,kick){if(f.ko)return;f.hp-=d;if(kb)f.vx=kb;if(d>1){f.hit=.15;}if(kick)f.kicked=.9;if(f.hp<=0)koFoe(f);}
function dmgBoss(d){const b=G.boss;if(!b||b.dead||b.kind==='soma'){if(b&&b.kind==='soma'&&G.t-(G.immT||0)>3){G.immT=G.t;ftxt(b.x,b.y-110,'USE FIRE! (torch)','#ff8a2b');}return;}
  b.hp-=d;b.hit=.1;if(b.hp<=0&&!b.dead){b.dead=true;b.dt=0;addScore(1000,b.x,b.y,'BOSS DOWN');burst(b.x,b.y,50,'#a35bff',40);}}
function inCone(f,len,wy){const P=G.P;return (f.x-P.x)*P.f>-6&&Math.abs(f.x-P.x)<len&&Math.abs(f.y-P.y)<wy;}

// ---------- player ----------
function melee(range,dmg,kb,kick){const P=G.P;
  for(const f of foes())if((f.x-P.x)*P.f>-10&&Math.abs(f.x-P.x)<range+f.r&&Math.abs(f.y-P.y)<34){dmgFoe(f,dmg,P.f*kb,kick);burst(f.x,f.y,35,'#19f3ff',5);}
  for(const b of G.bros)if(!b.rescued&&b.hurt<=0&&(b.x-P.x)*P.f>-10&&Math.abs(b.x-P.x)<range&&Math.abs(b.y-P.y)<34){b.hurt=1;addScore(-50,b.x,b.y,'HIT A TECH BRO');say(b,'OW! I\'m moving home!');}
  const B=G.boss;if(B&&!B.dead&&Math.abs(B.x-P.x)<range+28&&Math.abs(B.y-P.y)<40)dmgBoss(kick?5:3);
}
function startPower(){const P=G.P;P.pt=0;P.pn=0;P.pcd=6;P.cd=.9;P.jc=0;msg('POWER COMBO!',1);}
function powerTick(dt){const P=G.P;if(P.pt<0)return;const o=P.pt;P.pt+=dt;
  const st=[0,.14,.28,.44];
  for(let i=P.pn;i<4;i++){if(P.pt<st[i])break;P.pn=i+1;
    if(i<3){P.anim=.16;P.at='punch';melee(64,12+i*4,150+i*60,false);G.shake=Math.max(G.shake,.12);P.x+=P.f*10;}
    else{P.anim=.4;P.at='punch';G.flash=.4;G.shake=.7;G.rings.push({x:P.x,y:P.y,t:0});
      for(const f of foes())if(Math.abs(f.x-P.x)<170&&Math.abs(f.y-P.y)<70){dmgFoe(f,70,P.f*700,true);burst(f.x,f.y,40,'#ffe14a',10);}
      const B=G.boss;if(B&&!B.dead&&Math.abs(B.x-P.x)<190&&Math.abs(B.y-P.y)<80){dmgBoss(30);burst(B.x,B.y,50,'#ff2bd6',30);}
      burst(P.x,P.y,30,'#19f3ff',40);ftxt(P.x,P.y-100,'POWER LAUNCHER!','#ff2bd6');addScore(50);}}
  if(P.pt>.7)P.pt=-1;}
function updPlayer(dt){
  const P=G.P;P.inv-=dt;P.cd-=dt;P.anim-=dt;P.slow-=dt;P.poopCd-=dt;P.boost-=dt;
  if(P.burn>0){P.burn-=dt;P.hp-=4*dt;if(Math.random()<.5)burst(P.x,P.y,30,'#ff8a2b',1);if(P.hp<=0)S='over';}
  const mx=(down('KeyD','ArrowRight')?1:0)-(down('KeyA','ArrowLeft')?1:0),my=(down('KeyS','ArrowDown')?1:0)-(down('KeyW','ArrowUp')?1:0);
  let sp=175*(P.slow>0?.5:1)*(P.boost>0?1.8:1)*(P.hold?.75:1);
  P.x+=mx*sp*dt;P.y=clamp(P.y+my*sp*.7*dt,Y0,Y1);if(mx)P.f=mx;
  if(hit('Space')&&P.z===0)P.vz=340;
  P.z+=P.vz*dt;P.vz-=900*dt;if(P.z<=0){P.z=0;P.vz=0;}
  P.x=clamp(P.x,G.cam+16,G.cam+W-16);if(G.camMin===G.camMax&&G.camMin>0)P.x=clamp(P.x,G.camMin+16,G.camMin+W-16);
  if(P.boost>0)for(const f of foes())if(Math.abs(f.x-P.x)<30&&Math.abs(f.y-P.y)<30)dmgFoe(f,40,P.f*400,true);
  P.pcd-=dt;P.jt-=dt;
  if(hit('KeyJ')&&P.cd<=0&&P.pt<0){P.cd=.26;P.anim=.18;P.at='punch';melee(52,10,120,false);
    if(P.jt>0)P.jc++;else P.jc=1;P.jt=.4;
    if(P.jc===3){ftxt(P.x,P.y-90,'COMBO! +10','#ffe14a');addScore(10);}
    if(P.jc>=4){P.jc=0;if(P.pcd<=0)startPower();}}
  if(hit('KeyU')&&P.pcd<=0&&P.pt<0)startPower();
  powerTick(dt);
  if(hit('KeyK')&&P.cd<=0){P.cd=.48;P.anim=.26;P.at='kick';melee(74,16,330,true);}
  for(let i=1;i<=5;i++)if(hit('Digit'+i))selWp(i);
  if(hit('KeyQ')){let w=G.wp;for(let k=0;k<5;k++){w=w%5+1;if(wpOk(w)){selWp(w);break;}}}
  // narcan spray
  P.spray=0;
  if(down('KeyL')&&P.narc>0){P.narc-=32*dt;P.spray=1;for(const f of foes())if(inCone(f,115,42))dmgFoe(f,15*dt);const B=G.boss;if(B&&inCone(B,130,50))dmgBoss(3*dt);}
  else P.narc=Math.min(100,P.narc+14*dt);
  // weapon E
  const use=down('KeyE','Enter'),useHit=hit('KeyE','Enter'),wp=G.wp;
  P.flame=0;P.hose=0;
  if(wp===2&&G.un.hose){if(use&&P.water>0){P.hose=1;P.water-=24*dt;const m=G.lvl===2?1.5:1;
      for(const f of foes())if(inCone(f,230,46)){dmgFoe(f,(f.k==='h'?46:20)*m*dt);f.vx=P.f*55;f.wet=.3;}
      const B=G.boss;if(B&&inCone(B,250,55))dmgBoss(5*dt);}
    else P.water=Math.min(100,P.water+(use?0:20)*dt);}
  else P.water=Math.min(100,P.water+20*dt);
  if(wp===4&&G.un.torch&&use){P.flame=1;torchFx(dt);}
  if(useHit&&P.cd<=0){
    if(wp===3&&G.un.ng&&G.ng>0){G.ng--;P.cd=.6;throwP('ngren');}
    if(wp===5&&G.un.fg&&G.fg>0){G.fg--;P.cd=.6;throwP('fgren');}
  }
  if(hit('KeyG'))grab();
  // poop
  if(P.z<6&&P.poopCd<=0)for(const p of G.poops)if(!p.gone&&Math.abs(p.x-P.x)<22&&Math.abs(p.y-P.y)<13){P.poopCd=1.6;P.slow=1.6;addScore(-30,P.x,P.y,'STEPPED IN POOP');burst(P.x,P.y,5,'#5a3a1a',8);}
  // items
  for(const it of G.items)if(!it.got&&Math.abs(it.x-P.x)<34&&Math.abs(it.y-P.y)<34){
    if(it.k==='torch'){it.got=1;G.un.torch=true;G.wp=4;msg('GOT FENTANYL TORCH! [4] hold E — burns ballots, bags, poop!',5);}
    if(it.k==='scooter'){it.got=1;if(G.phase==='scooter'){nextLevel();}else{P.boost=8;msg('Scooter stolen! Ram zombies for 8s',2.5);addScore(40,P.x,P.y,'SCOOTER');}}
  }
  // rescue bros, cable
  for(const b of G.bros)if(!b.rescued&&Math.abs(b.x-P.x)<42&&Math.abs(b.y-P.y)<32){b.rescued=true;b.st=0;addScore(100,b.x,b.y,'TECH BRO RESCUED');say(b,'Thanks! Moving home!',3);}
  if(G.lvl===2&&G.phase==='walk'&&P.x>G.cableX-60){G.phase='cable';G.ct=0;msg('All aboard the cable car — to the NGO tower!',3);}
}
function wpOk(w){const u=G.un;return w===1||(w===2&&u.hose)||(w===3&&u.ng)||(w===4&&u.torch)||(w===5&&u.fg);}
function selWp(w){if(wpOk(w))G.wp=w;}
function throwP(kind){const P=G.P;G.projs.push({o:'p',kind,x:P.x+P.f*20,y:P.y,z:40,vx:P.f*330,vy:0,vz:270,g:700,life:3,fuse:kind==='fgren'?1.1:1.0});}
function grab(){const P=G.P;
  // burning poop first
  let best=null,bd=80;for(const p of G.poops)if(!p.gone&&p.fire>0){const d=Math.abs(p.x-P.x)+Math.abs(p.y-P.y);if(d<bd){bd=d;best=p;}}
  const M=G.mayor,md=Math.abs(M.x-P.x)+Math.abs(M.y-P.y);
  if(P.hold==='mayor'){const B=G.boss;P.hold=null;M.st='thrown';G.projs.push({o:'p',kind:'mayor',x:P.x,y:P.y,z:50,vx:0,vy:0,vz:0,g:600,life:4,fuse:9,tx:B?B.x:P.x+300,ty:B?B.y:P.y});
    const p=G.projs[G.projs.length-1];const T=.9;p.vx=(p.tx-P.x)/T;p.vy=(p.ty-P.y)/T;p.vz=p.g*T/2-50/T;say(M,'NOOOOOO!',2);return;}
  if(best&&bd<=md||best&&!(G.phase==='boss2'&&md<90)){best.gone=true;G.projs.push({o:'p',kind:'poop',x:P.x,y:P.y,z:40,vx:P.f*330,vy:0,vz:270,g:700,life:3,burning:true,fuse:9});msg('Flaming poop away!',1.5);return;}
  if(md<90){if(G.phase==='boss2'&&M.st==='idle'){P.hold='mayor';M.st='held';say(M,'Please no!',2);msg('Press G again to THROW the mayor at the boss!',3);}else{ftxt(M.x,M.y-80,'Save him for the boss!','#ff2bd6');}}
}
function torchFx(dt){const P=G.P;
  for(const f of foes())if(inCone(f,125,44)){dmgFoe(f,26*dt);f.fire=.5;}
  for(const p of G.poops)if(!p.gone&&Math.abs(p.x-P.x)<130&&(p.x-P.x)*P.f>0&&Math.abs(p.y-P.y)<40&&!p.fire){p.fire=30;ftxt(p.x,p.y-20,'POOP ABLAZE','#ff8a2b');}
  for(const p of G.projs)if(p.o==='e'&&!p.dead&&(p.x-P.x)*P.f>-10&&Math.abs(p.x-P.x)<140&&Math.abs(p.y-P.y)<60){
    if(p.kind==='ballot'||p.kind==='pencil'){p.dead=true;burst(p.x,p.y,p.z,'#ff8a2b',8);if(G.boss&&G.boss.kind==='soma'&&G.boss.dt===undefined){G.heat+=3;ftxt(p.x,p.y-30,'BURNED +HEAT','#ff8a2b');}addScore(5);}
    else if(p.kind==='bag'&&!p.burning){p.burning=true;if(G.boss&&G.boss.kind==='soma'){G.heat+=6;ftxt(p.x,p.y-30,'BAG ON FIRE! HEAT↑','#ff8a2b');}addScore(10);}
    else if(p.kind==='needle'||p.kind==='cig'){p.dead=true;burst(p.x,p.y,p.z,'#ff8a2b',4);}
  }
  const B=G.boss;if(B&&B.kind==='final'&&inCone(B,140,50))dmgBoss(9*dt);
  if(Math.random()<.9)G.fx.push({x:P.x+P.f*(20+Math.random()*100),y:P.y,z:35+rnd(-10,10),vx:P.f*rnd(40,100),vy:0,vz:rnd(0,40),life:.35,c:Math.random()<.5?'#ff8a2b':'#ffe14a',s:rnd(3,6)});
}

// ---------- enemies ----------
function updFoe(f,dt){
  const P=G.P;f.hit-=dt;f.kicked-=dt;f.cd-=dt;f.fire-=dt;f.wet-=dt;
  if(Math.abs(f.vx)>5){f.x+=f.vx*dt;f.vx*=Math.pow(.03,dt);}
  if(f.ko){f.t+=dt;return;}
  if(f.kicked>0)for(const p of G.poops)if(!p.gone&&Math.abs(p.x-f.x)<28&&Math.abs(p.y-f.y)<18){p.gone=true;f.hp=0;koFoe(f);addScore(75,f.x,f.y,'SLIPPED ON POOP!');return;}
  const dx=P.x-f.x,dy=P.y-f.y,ad=Math.abs(dx);f.f=sgn(dx);
  if(ad>900&&f.k!=='h')return;
  if(f.k==='z'&&f.scoot){f.x+=f.dir*270*dt;f.y+=clamp(dy,-40,40)*dt*1.5;if(Math.abs(f.x-P.x)>650)f.dir=sgn(P.x-f.x);
    if(ad<34&&Math.abs(dy)<30&&f.cd<=0){hurt(8);f.cd=1.2;}return;}
  if(f.k==='d'){f.x+=f.f*f.sp*dt;f.y+=clamp(dy,-1,1)*f.sp*.6*dt;if(ad<32&&Math.abs(dy)<22&&f.cd<=0){hurt(f.dmg);f.cd=.9;}return;}
  if(f.k==='z'&&f.thrower){let want=ad>270?1:ad<190?-1:0;const away=-f.f;if(want<0&&((away>0&&f.x>G.cam+W-70)||(away<0&&f.x<G.cam+70)))want=0;if(f.x>G.cam+W-30||f.x<G.cam+30)want=1;f.x+=want*f.f*f.sp*dt;f.y+=clamp(dy,-1,1)*30*dt;
    if(f.cd<=0&&ad<430){f.cd=rnd(1.6,2.6);const T=Math.max(.3,ad/300);G.projs.push({o:'e',kind:'needle',x:f.x,y:f.y,z:34,vx:f.f*300,vy:clamp(dy/T,-90,90),vz:0,life:2});}return;}
  // melee
  f.x+=(ad>34?f.f*f.sp*dt:0);f.y+=(Math.abs(dy)>8?sgn(dy)*f.sp*.7*dt:0);
  if(ad<44&&Math.abs(dy)<24&&f.cd<=0){hurt(f.k==='h'?7:6);f.cd=1.1;f.atk=.2;}
}
function updBoss(dt){const B=G.boss,P=G.P;if(!B)return;B.hit-=dt;
  if(B.dead){B.dt+=dt;if(B.kind==='final'&&B.dt>2.5&&S==='play'){S='win';}return;}
  if(B.kind==='soma'){
    if(B.dt!==undefined){B.dt+=dt;if(B.dt>4){B.dead=true;B.dt=0;onSomaDone();}return;}
    B.cd-=dt;B.bt-=dt;B.y=450+Math.sin(G.t*1.1)*30;
    if(B.cd<=0){B.cd=rnd(.9,1.5);const r=Math.random();
      if(r<.35)shoot(B,'cig');else if(r<.8){for(let i=-1;i<=1;i++)shoot(B,Math.random()<.5?'ballot':'pencil',i*35);}else shoot(B,'cig');}
    if(B.bt<=0){B.bt=rnd(3.6,5);lob(B,'bag');}
    if(G.heat>40&&!G.doorFire){G.doorFire=true;msg('The back door catches fire!',2.5);}
    if(G.doorFire)G.heat+=1.4*dt;
    G.heat=Math.min(100,G.heat);
    if(G.heat>=100){B.dt=0;msg('She\'s burning down with the clinic!',3);addScore(500,B.x,B.y,'UNDERBOSS TORCHED');burst(B.x,B.y,40,'#ff8a2b',40);}
  }else{
    B.cd-=dt;B.bt-=dt;B.y=450+Math.sin(G.t*.9)*35;
    if(B.cd<=0){B.cd=rnd(1,1.7);const r=Math.random();if(r<.4)shoot(B,'cig');else{for(let i=-1;i<=1;i++)shoot(B,Math.random()<.5?'ballot':'pencil',i*40);}}
    if(B.bt<=0){B.bt=rnd(3.4,4.6);lob(B,'bag');}
    B.ht-=dt;if(B.ht<=0&&G.hs.filter(h=>!h.ko).length<4){B.ht=rnd(2.2,3.2);spawnH(B.x+30,rnd(Y0+10,Y1-10));}
    for(const c of G.clouds)if(Math.hypot(c.x-B.x,(c.y-B.y)*1.5)<c.r+40)dmgBoss(14*dt);
  }
}
function spawnH(x,y){G.hs.push({k:'h',x,y,z:0,vx:-80,hp:60,max:60,r:14,cd:1,ko:false,t:0,f:-1,kicked:0,hit:0,fire:0,wet:0,sp:rnd(80,110)});}
function shoot(B,kind,dyo=0){const P=G.P,T=Math.max(.4,Math.abs(P.x-B.x)/330);G.projs.push({o:'e',kind,x:B.x-20,y:B.y,z:48,vx:-330,vy:clamp((P.y+dyo-B.y)/T,-150,150),vz:0,life:3});}
function lob(B,kind){const P=G.P,T=1,g=600,z0=60;G.projs.push({o:'e',kind,x:B.x-20,y:B.y,z:z0,vx:(P.x-B.x)/T,vy:(P.y-B.y)/T,vz:g*T/2-z0/T,g,life:3});}
function onSomaDone(){const g=G;g.junk.vis=true;g.junk.flee=true;g.junk.x=g.boss.x-200;g.junk.y=450;g.phase='scooter';g.camMax=g.camMin=g.cam;
  g.items.push({k:'scooter',x:g.P.x+120,y:455});msg('The junkie bolts! Grab the scooter and chase him to the Mission!',6);}
function nextLevel(){if(G.lvl>=2)return;startLevel(G.lvl+1);}

function updProj(p,dt){const P=G.P;p.life-=dt;p.x+=p.vx*dt;p.y+=(p.vy||0)*dt;
  if(p.g){p.vz-=p.g*dt;p.z+=p.vz*dt;}
  if(p.burning&&Math.random()<.8)G.fx.push({x:p.x,y:p.y,z:p.z,vx:0,vy:0,vz:30,life:.3,c:'#ff8a2b',s:4});
  if(p.o==='e'){
    const hz=p.g?Math.abs(p.z-P.z)<46:P.z<48;
    if(!p.dead&&Math.abs(p.x-P.x)<22&&Math.abs(p.y-P.y)<26&&hz){const k=p.kind;
      if(k==='needle')hurt(5);else if(k==='cig')hurt(3,3.5);else if(k==='bag')hurt(8,p.burning?3.5:0);else hurt(4);p.dead=true;}
    if(p.g&&p.z<=0){p.dead=true;burst(p.x,p.y,5,p.burning?'#ff8a2b':'#fff',8);}
  }else{
    const boom=()=>{
      if(p.kind==='ngren'){burst(p.x,p.y,20,'#19f3ff',30);for(const f of foes())if(Math.hypot(f.x-p.x,(f.y-p.y)*1.5)<120)dmgFoe(f,45,sgn(f.x-p.x)*260);const B=G.boss;if(B&&Math.hypot(B.x-p.x,B.y-p.y)<130)dmgBoss(15);G.shake=.25;}
      else if(p.kind==='fgren'){burst(p.x,p.y,20,'#7dff3a',30);G.clouds.push({x:p.x,y:p.y,t:4.5,r:110});for(const f of foes())if(Math.hypot(f.x-p.x,(f.y-p.y)*1.5)<120)dmgFoe(f,35,sgn(f.x-p.x)*200);const B=G.boss;if(B&&Math.hypot(B.x-p.x,B.y-p.y)<130)dmgBoss(25);G.shake=.3;}
      else if(p.kind==='poop'){burst(p.x,p.y,20,'#ff8a2b',30);for(const f of foes())if(Math.hypot(f.x-p.x,(f.y-p.y)*1.5)<100){dmgFoe(f,40,sgn(f.x-p.x)*260);f.fire=1.5;}const B=G.boss;if(B&&Math.hypot(B.x-p.x,B.y-p.y)<110)dmgBoss(30);addScore(25,p.x,p.y,'FLAMING POOP');G.shake=.2;}
      p.dead=true;};
    if(p.kind==='mayor'){const B=G.boss;if(B&&Math.abs(p.x-B.x)<40&&Math.abs(p.y-B.y)<45&&p.z<90){dmgBoss(70);ftxt(B.x,B.y-120,'MAYOR SMASH! -70','#ff2bd6');burst(B.x,B.y,50,'#fff',30);G.shake=.4;p.dead=true;G.mayor.st='idle';G.mayor.x=G.P.x-150;G.mayor.y=B.y;G.mayor.sayT=0;say(G.mayor,'Ow. I resign.',2);}
      else if(p.z<=0){p.dead=true;G.mayor.st='idle';G.mayor.x=p.x;G.mayor.y=p.y;}}
    else if(p.kind==='poop'){let h=false;for(const f of foes())if(Math.abs(f.x-p.x)<26&&Math.abs(f.y-p.y)<28&&p.z<60)h=true;const B=G.boss;if(B&&!B.dead&&Math.abs(B.x-p.x)<40&&Math.abs(B.y-p.y)<45)h=true;if(h||p.z<=0)boom();}
    else{p.fuse-=dt;if(p.z<=0&&p.vz<0)boom();}
  }
  if(p.life<=0)p.dead=true;
}

// ---------- level logic ----------
function update(dt){
  const g=G,P=g.P;g.t+=dt;g.msgT-=dt;g.shake-=dt;g.flash=(g.flash||0)-dt;for(const r of g.rings)r.t+=dt;g.rings=g.rings.filter(r=>r.t<.6);
  for(const t of g.txt)t.t-=dt;g.txt=g.txt.filter(t=>t.t>0);
  for(const f of g.fx){f.x+=f.vx*dt;f.y+=f.vy*dt;f.z+=f.vz*dt;f.vz-=300*dt;f.life-=dt;}g.fx=g.fx.filter(f=>f.life>0&&f.z>-5);
  if(g.phase==='ride'){updRide(dt);return;}
  if(g.phase==='cable'){g.ct+=dt;P.x=g.cableX+g.ct*260;g.cam=Math.max(g.cam,P.x-W*.4);if(g.ct>2.4)startFinal();return;}
  updPlayer(dt);
  // camera
  if(g.phase!=='tut'||true){let c=P.x-W*.42;g.cam=clamp(Math.max(g.cam,c),0,g.camMax);if(g.camMin>g.cam)g.cam=g.camMin;}
  // mayor
  const M=g.mayor;M.sayT-=dt;
  if(M.st==='idle'){if(g.phase==='boss2'){M.x=clamp(M.x,g.cam+30,g.cam+W-200);}else{const tx=P.x-230;M.x+=clamp(tx-M.x,-1,1)*Math.min(Math.abs(tx-M.x),140)*dt*1.2;M.y+=(P.y-M.y)*dt*.8;M.x=Math.max(M.x,g.cam+30);}
    if(M.sayT<=0&&Math.random()<dt*.35)say(M,WHINE[Math.floor(Math.random()*WHINE.length)]);}
  else if(M.st==='held'){M.x=P.x;M.y=P.y+1;}
  // tents
  for(const t of g.tents)if(!t.out&&Math.abs(t.x-P.x)<210){t.out=true;burst(t.x,t.y,30,'#fff',12);
    if(g.lvl===0){spawnDog(t.x,t.y+20,0);ftxt(t.x,t.y-60,'WOOF! (small)','#ff8a2b');}
    else{for(let i=0;i<3;i++)spawnDog(t.x+i*14,t.y+10+i*18,150+i*10);ftxt(t.x,t.y-60,'DOG PACK!','#ff2bd6');}}
  // bros
  for(const b of g.bros){b.hurt-=dt;b.sayT-=dt;
    if(b.rescued){b.x+=-70*dt*(b.x>P.x?-1:1);b.hc+=dt;}
    else{b.st-=dt;if(b.st<=0){b.st=rnd(.8,2);b.dir=Math.random()<.5?-1:1;}b.x+=b.dir*70*dt;b.y=clamp(b.y+Math.sin(g.t*2+b.x)*20*dt,Y0,Y1);
      if(b.sayT<=0&&Math.abs(b.x-P.x)<500&&Math.random()<dt*.4)say(b,BROSAY[Math.floor(Math.random()*BROSAY.length)]);}}
  g.bros=g.bros.filter(b=>b.hc<3);
  // owners
  for(const o of g.owners){o.sayT-=dt;o.spray=0;let best=null,bd=240;for(const z of g.zs.concat(g.dogs))if(!z.ko&&Math.abs(z.y-o.y)<90){const d=Math.abs(z.x-o.x);if(d<bd){bd=d;best=z;}}
    if(best){o.spray=1;o.tx=best.x;o.ty=best.y;dmgFoe(best,22*dt);best.vx=sgn(best.x-o.x)*40;best.wet=.3;if(o.sayT<=0)say(o,'GET OFF MY BLOCK!',1.6);}}
  // foes
  for(const f of foes())updFoe(f,dt);
  for(const f of [...g.zs,...g.dogs,...g.hs])if(f.ko)updFoe(f,dt);
  g.zs=g.zs.filter(f=>!f.ko||f.t<1.3);g.dogs=g.dogs.filter(f=>!f.ko||f.t<1.3);g.hs=g.hs.filter(f=>!f.ko||f.t<1.3);
  for(const p of g.projs)updProj(p,dt);g.projs=g.projs.filter(p=>!p.dead&&p.x>g.cam-120&&p.x<g.cam+W+300);
  for(const c of g.clouds){c.t-=dt;for(const f of foes())if(Math.hypot(f.x-c.x,(f.y-c.y)*1.5)<c.r)dmgFoe(f,22*dt);}g.clouds=g.clouds.filter(c=>c.t>0);
  for(const p of g.poops)if(p.fire>0){p.fire-=dt;if(Math.random()<.5)g.fx.push({x:p.x,y:p.y,z:8,vx:0,vy:0,vz:60,life:.4,c:'#ff8a2b',s:4});}
  updBoss(dt);
  // clamp enemies in boss arenas
  if(g.camMin===g.camMax&&g.camMin>0)for(const f of foes())f.x=clamp(f.x,g.camMin-60,g.camMin+W+40);
  levelLogic(dt);
}
function zcount(){return G.zs.filter(z=>!z.ko).length;}
function levelLogic(dt){const g=G,P=g.P;
  if(g.lvl===0){
    if(g.phase==='tut'){
      if(zcount()===0&&g.dogs.every(d=>d.ko)){if(g.wave===0){g.wave=1;spawnZ(g.cam+W+30,440,{thrower:true});spawnZ(g.cam+W+80,480,{});msg('Zombies throw needles! Dodge or jump. Kick them onto poop for bonus!',4);g.poops.push({x:g.cam+620,y:455,fire:0});}
        else{g.phase='walk';g.camMax=g.clinicX-480;msg('Car\'s trashed. A junkie grabs the loot and runs! CHASE HIM →',5);g.junk.x=P.x+500;}}
    }
    else if(g.phase==='walk'){
      const J=g.junk;J.x=Math.min(P.x+420,g.clinicX+60);J.y=450+Math.sin(g.t*8)*5;
      if(!g.torchDropped&&P.x>1300){g.torchDropped=true;g.items.push({k:'torch',x:J.x-120,y:455});say(J,'Dropped my torch lol',3);msg('The junkie dropped a FENTANYL TORCH — grab it!',4);}
      g.spawnT-=dt;if(g.spawnT<=0&&zcount()<4){g.spawnT=rnd(2.5,4);spawnZ(g.cam+W+40,rnd(Y0,Y1),{thrower:Math.random()<.45,scoot:Math.random()<.12});}
      if(P.x>g.clinicX-g.W_&&false){}
      if(P.x>g.clinicX-300+120&&g.camMax<g.clinicX){}
      if(g.cam>=g.camMax-2&&P.x>g.camMax+300)startSoma();
    }
  }else if(g.lvl===2&&g.phase==='walk'){
    const J=g.junk;J.x=Math.min(P.x+420,g.cableX+40);J.y=450;
    g.spawnT-=dt;if(g.spawnT<=0&&zcount()<5){g.spawnT=rnd(1.8,3);spawnZ(g.cam+W+40,rnd(Y0,Y1),{thrower:Math.random()<.4,scoot:Math.random()<.15});}
  }
  if(g.phase==='boss2'&&g.boss.dead){}
}
function startSoma(){const g=G;g.phase='boss';g.camMin=g.camMax=g.cam;g.zs.forEach(z=>z.ko=true);
  g.boss={kind:'soma',x:g.cam+790,y:450,hp:1,max:1,cd:1.5,bt:3,hit:0,dead:false,hair:['#19b8ff']};g.junk.vis=false;g.un.torch&&selWp(4);
  msg('CLINIC: Blue-haired underboss! Burn her ballots with the torch [4]+E. Set her bags on fire!',6);}
function startFinal(){const g=G,ax=4300,P=g.P;g.phase='boss2';g.camMax=g.camMin=ax;g.cam=ax;P.x=ax+130;P.y=450;P.hold=null;g.zs=[];g.dogs=[];g.hs=[];g.projs=[];g.owners=[];g.tents=[];g.bros=[];g.items=[];g.junk.vis=false;
  g.poops=[];for(let i=0;i<4;i++)g.poops.push({x:ax+rnd(250,600),y:rnd(Y0+10,Y1-10),fire:0});
  g.mayor.x=ax+60;g.mayor.y=470;g.mayor.st='idle';
  g.boss={kind:'final',x:ax+790,y:450,hp:320,max:320,cd:2,bt:3,ht:1,hit:0,dead:false};
  msg('FINAL BOSS! Hose the blue dye out of helpers · torch poop then G to throw · G near the mayor to grab & THROW him at her!',8);}

// ---------- ride level ----------
function updRide(dt){const g=G,P=g.P;
  P.inv-=dt;P.anim-=dt;P.cd-=dt;
  const my=(down('KeyS','ArrowDown')?1:0)-(down('KeyW','ArrowUp')?1:0),mx=(down('KeyD','ArrowRight')?1:0)-(down('KeyA','ArrowLeft')?1:0);
  P.y=clamp(P.y+my*190*dt,Y0,Y1);P.f=1;
  g.sp+=(420-g.sp)*dt*.4+mx*120*dt;g.sp=clamp(g.sp,140,680);
  P.x+=g.sp*dt;g.cam=P.x-300;
  if(hit('Space')&&P.z===0)P.vz=360;P.z+=P.vz*dt;P.vz-=950*dt;if(P.z<=0){P.z=0;P.vz=0;}
  const J=g.junk;J.x=P.x+520-(g.sp-420)*.6+Math.sin(g.t)*20;J.y=clamp(P.y+Math.sin(g.t*1.3)*40,Y0,Y1);
  // stalls
  for(const s of g.stalls)if(!s.dead){const dx=s.x-P.x,dy=s.y-P.y;
    if(Math.abs(dx)<34&&Math.abs(dy)<26){if(P.z>26){if(!s.hopped){s.hopped=true;addScore(20,s.x,s.y,'HOP!');}}else{s.dead=true;if(s.vendor){hurt(10);g.sp=Math.max(150,g.sp-160);ftxt(s.x,s.y-60,'VENDOR SHOVE!','#ff2bd6');}else{g.sp=Math.max(150,g.sp-110);ftxt(s.x,s.y-60,'CRASH!','#ff2bd6');}burst(s.x,s.y,20,'#ff8a2b',12);}}}
  // attackers
  g.attT-=dt;if(g.attT<=0){g.attT=rnd(1.3,2.6);g.att.push({side:Math.random()<.5?-1:1,d:480,y:P.y+rnd(-8,8),dead:false,ko:0});}
  P.pcd-=dt;if(hit('KeyU')&&P.pcd<=0){P.pcd=6;G.flash=.4;G.shake=.6;G.rings.push({x:P.x,y:P.y,t:0});for(const a of g.att)if(!a.dead){a.dead=true;a.ko=.6;a.fly=a.side;}g.sp=Math.min(680,g.sp+80);addScore(60,P.x,P.y,'POWER SHOCKWAVE');}
  const act=hit('KeyJ','KeyK','KeyL');
  if(act&&P.cd<=0){P.cd=.22;P.anim=.2;P.at=hit('KeyK')?'kick':hit('KeyL')?'spray':'punch';
    let did=false;let near=g.att.filter(a=>!a.dead&&a.d<115).sort((a,b)=>a.d-b.d)[0];
    if(near){near.dead=true;near.ko=.6;near.fly=near.side;did=true;g.sp=Math.min(680,g.sp+45);addScore(40,P.x+near.side*60,P.y,near.d<70?'PERFECT':'NICE HIT');}
    for(const s of g.stalls)if(!s.dead&&s.x-P.x>-30&&s.x-P.x<95&&Math.abs(s.y-P.y)<34){s.dead=true;did=true;addScore(25,s.x,s.y,'SMASHED '+GOODS[s.g][1]);burst(s.x,s.y,25,'#19f3ff',14);}
    if(!did){g.sp=Math.max(140,g.sp-14);}}
  for(const a of g.att){if(a.ko>0){a.ko-=dt;a.d+=500*dt;continue;}if(a.dead)continue;a.d-=(a.d>115?270:200)*dt;
    if(a.d<=26){a.dead=true;a.ko=.5;hurt(8);g.sp=Math.max(140,g.sp-130);ftxt(P.x,P.y-70,'KNOCKED! -SPEED','#ff2bd6');}}
  g.att=g.att.filter(a=>a.ko>0||!a.dead);
  if(P.x>7400){P.x=7400;g.phase='x';nextLevel();return;}
  if(g.msgT<=0&&!g.rideDone&&P.x>3500){g.rideDone=1;msg('Halfway! The junkie\'s headed for the Tenderloin…',3);}
}

// ---------- drawing ----------
function glow(t,x,y,c,sz,al='left',b=12){ctx.save();ctx.font='bold '+sz+'px "Courier New",monospace';ctx.textAlign=al;ctx.shadowColor=c;ctx.shadowBlur=b;ctx.fillStyle=c;ctx.fillText(t,x,y);ctx.restore();}
function bar(x,y,w,h,v,c,label){ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(x,y,w,h);ctx.fillStyle=c;ctx.shadowColor=c;ctx.shadowBlur=8;ctx.fillRect(x,y,w*clamp(v,0,1),h);ctx.shadowBlur=0;ctx.strokeStyle=c;ctx.strokeRect(x,y,w,h);if(label){ctx.fillStyle='#fff';ctx.font='10px monospace';ctx.textAlign='left';ctx.fillText(label,x+3,y+h-2);}}
function emoji(e,x,y,sz){ctx.font=sz+'px serif';ctx.textAlign='center';ctx.fillText(e,x,y);}
function person(x,y,z,o){const sy=y-z,s=o.s||1,f=o.f||1;
  ctx.save();ctx.translate(x,sy);ctx.scale(s,s);
  ctx.fillStyle='rgba(0,0,0,.4)';ctx.save();ctx.translate(0,z/s);ctx.beginPath();ctx.ellipse(0,0,16,5,0,0,7);ctx.fill();ctx.restore();
  if(o.rot){ctx.rotate(o.rot*f);ctx.translate(0,-6);}
  const wob=Math.sin((o.ph||0)*10)*(o.walk?4:0);
  if(o.alice){const l1=18+wob*.3,l2=18-wob*.3;
    for(const [lx,lh] of [[-8,l1],[2,l2]])for(let i=0;i<lh;i+=4){ctx.fillStyle=(i/4)%2?'#ffffff':'#19f3ff';ctx.fillRect(lx,-18+i,6,Math.min(4,lh-i));}
    ctx.fillStyle='#ff2bd6';ctx.fillRect(-9,-2,8,2);ctx.fillRect(1,-2,8,2);}
  else{ctx.fillStyle=o.leg||'#222';ctx.fillRect(-8,-18,6,18+wob*.3);ctx.fillRect(2,-18,6,18-wob*.3);}
  ctx.shadowColor=o.glow||'transparent';ctx.shadowBlur=o.glow?10:0;
  if(o.alice){ctx.shadowColor='#19f3ff';ctx.shadowBlur=12;ctx.fillStyle='#6ec6ff';ctx.fillRect(-10,-48,20,20);
    ctx.beginPath();ctx.moveTo(-10,-30);ctx.lineTo(10,-30);ctx.lineTo(15,-14);ctx.lineTo(-15,-14);ctx.fill();
    ctx.fillStyle='#fff';ctx.fillRect(-6,-46,12,10);ctx.beginPath();ctx.moveTo(-7,-32);ctx.lineTo(7,-32);ctx.lineTo(11,-15);ctx.lineTo(-11,-15);ctx.fill();
    ctx.fillStyle='#ff2bd6';ctx.fillRect(-2,-40,4,3);ctx.fillRect(-11,-30,22,2);ctx.shadowBlur=0;}
  else{ctx.fillStyle=o.body;ctx.fillRect(-10,-48,20,32);}ctx.shadowBlur=0;
  ctx.fillStyle=o.skin||'#f2c7a0';ctx.beginPath();ctx.arc(0,-58,11,0,7);ctx.fill();
  if(o.hair){ctx.fillStyle=o.hair;ctx.beginPath();ctx.arc(0,-61,12,Math.PI,0);ctx.fill();ctx.fillRect(-12,-61,5,22);ctx.fillRect(7,-61,5,22);
    if(o.hair2){ctx.fillStyle=o.hair2;ctx.fillRect(-12,-61,3,26);ctx.fillRect(9,-61,3,26);ctx.beginPath();ctx.arc(0,-62,12,Math.PI*1.1,Math.PI*1.5);ctx.fill();}}
  if(o.alice){ctx.fillStyle='#fff';ctx.shadowColor='#19f3ff';ctx.shadowBlur=8;ctx.fillRect(-12,-61,24,3);ctx.shadowBlur=0;
    ctx.fillStyle='#6ec6ff';ctx.shadowColor='#19f3ff';ctx.shadowBlur=8;ctx.fillRect(-12,-64,24,3);
    ctx.beginPath();ctx.moveTo(-f*10,-67);ctx.lineTo(-f*20,-74);ctx.lineTo(-f*20,-60);ctx.fill();ctx.beginPath();ctx.moveTo(-f*10,-67);ctx.lineTo(-f*1,-74);ctx.lineTo(-f*1,-60);ctx.fill();ctx.shadowBlur=0;}
  ctx.fillStyle='#000';ctx.fillRect(f*4-1,-60,2,3);ctx.fillRect(f*-2,-60,2,3);
  if(o.zombie){ctx.fillStyle='#a00';ctx.fillRect(f*2,-54,5,2);}
  ctx.fillStyle=o.skin||'#f2c7a0';
  const ext=(o.atk>0)?26:(o.zombie?18:8);
  ctx.fillRect(f>0?8:-8-ext,-44,ext,6);if(!o.atk||o.atk<=0)ctx.fillRect(f>0?-14:8,-44,6,16);
  if(o.hold)emoji(o.hold,f*14,-62,22);
  ctx.restore();}
function drawBG(){const g=G,pal=PAL[g.lvl],cam=g.cam;
  const gr=ctx.createLinearGradient(0,0,0,Y0);gr.addColorStop(0,pal.sky[0]);gr.addColorStop(1,pal.sky[1]);ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(255,255,255,.6)';for(let i=0;i<40;i++)ctx.fillRect((hash(i)*W*1.3-cam*.05+W*3)%W,hash(i+99)*150,1.5,1.5);
  for(let layer=0;layer<2;layer++){const par=layer?.55:.25,bw=layer?110:80,base=Y0-14;
    const i0=Math.floor(cam*par/bw)-1;
    for(let i=i0;i<i0+Math.ceil(W/bw)+3;i++){const h=(layer?150:110)+hash(i+layer*77)*(layer?190:120),x=i*bw-cam*par;
      ctx.fillStyle=layer?'#0b0618':'#120a2a';ctx.fillRect(x,base-h,bw-6,h+14);
      ctx.strokeStyle=layer?pal.a:pal.b;ctx.globalAlpha=layer?.8:.35;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=layer?8:0;ctx.strokeRect(x+.5,base-h+.5,bw-7,h);ctx.shadowBlur=0;ctx.globalAlpha=1;
      for(let wy=base-h+12;wy<base-14;wy+=18)for(let wx=x+8;wx<x+bw-18;wx+=16)if(hash(i*13+wx*.1+wy)>.55){ctx.fillStyle=hash(wy+i)>.5?pal.b:pal.a;ctx.globalAlpha=layer?.8:.35;ctx.fillRect(wx,wy,8,8);ctx.globalAlpha=1;}
      if(layer&&hash(i+5)>.55){const sg=['RENT $9K','AI BRO','NARCAN','24HR','VC','SOMA?','CASH'][Math.floor(hash(i+9)*7)];glow(sg,x+8,base-h+26+hash(i)*40,hash(i+3)>.5?pal.a:pal.b,16,'left',14);}
    }}
  // ground
  const gg=ctx.createLinearGradient(0,Y0-14,0,H);gg.addColorStop(0,'#16102a');gg.addColorStop(1,'#07030f');ctx.fillStyle=gg;ctx.fillRect(0,Y0-14,W,H);
  ctx.strokeStyle=pal.b;ctx.shadowColor=pal.b;ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(0,Y0-14);ctx.lineTo(W,Y0-14);ctx.stroke();ctx.shadowBlur=0;
  ctx.strokeStyle='rgba(255,43,214,.25)';for(let x=-((cam)%80);x<W;x+=80){ctx.beginPath();ctx.moveTo(x,Y0-14);ctx.lineTo(x-(x-W/2)*.5,H);ctx.stroke();}
}
function wx(x){return x-G.cam;}
function drawProps(){const g=G;
  if(g.lvl===0){const cx=wx(g.carX);if(cx>-200&&cx<W+200){emoji('🚗',cx,Y0+50,80);if(g.phase==='tut'||g.t<20)glow('MY CAR!',cx,Y0-30,'#ff2bd6',16,'center');}
    // clinic
    const x=wx(g.clinicX);if(x>-300&&x<W+300){ctx.fillStyle='#0d0a1f';ctx.fillRect(x-30,Y0-190,400,200);ctx.strokeStyle='#19f3ff';ctx.shadowColor='#19f3ff';ctx.shadowBlur=14;ctx.strokeRect(x-30,Y0-190,400,200);ctx.shadowBlur=0;
      glow('HARM REDUCTION CLINIC ✚',x-20,Y0-160,'#19f3ff',16);glow('FREE STUFF • NO JUDGMENT',x-20,Y0-135,'#ff2bd6',12);
      ctx.fillStyle='#1a1230';ctx.fillRect(x+60,Y0-100,70,110);
      ctx.fillStyle=g.doorFire?'#ff8a2b':'#241a44';ctx.shadowColor='#ff8a2b';ctx.shadowBlur=g.doorFire?20:0;ctx.fillRect(x+280,Y0-100,60,110);ctx.shadowBlur=0;glow('BACK DOOR',x+272,Y0-108,'#fff',9);
      if(g.doorFire)for(let i=0;i<6;i++){emoji('🔥',x+285+i*8,Y0+4-Math.abs(Math.sin(g.t*8+i))*50,26);}
      if(g.boss&&g.boss.dt!==undefined)for(let i=0;i<10;i++)emoji('🔥',x+i*38,Y0-Math.abs(Math.sin(g.t*6+i))*120,34);}}
  if(g.lvl===2){const x=wx(g.cableX);if(x>-200&&x<W+900){ctx.fillStyle='#ff2bd6';ctx.fillRect(x-300,Y0+20,1500,3);ctx.fillRect(x-300,Y0+120,1500,3);
      const cxp=g.phase==='cable'?wx(g.cableX+g.ct*260):x+10;ctx.fillStyle='#6a1b9a';ctx.shadowColor='#ff2bd6';ctx.shadowBlur=14;ctx.fillRect(cxp-10,Y0-60,130,100);ctx.shadowBlur=0;ctx.fillStyle='#19f3ff';for(let i=0;i<3;i++)ctx.fillRect(cxp+i*40,Y0-45,28,30);glow('CABLE CAR → NGO TOWER',cxp-10,Y0-72,'#19f3ff',12);}
    const bx=wx(4300);if(bx>-1000&&bx<W+300){ctx.fillStyle='#0d0a1f';ctx.fillRect(bx+560,Y0-280,420,290);ctx.strokeStyle='#a35bff';ctx.shadowColor='#a35bff';ctx.shadowBlur=18;ctx.strokeRect(bx+560,Y0-280,420,290);ctx.shadowBlur=0;glow('NGO HQ: "HELP" INC.',bx+580,Y0-240,'#a35bff',18);glow('$ DONATE FOR DYE $',bx+580,Y0-215,'#19b8ff',12);ctx.fillStyle='#1a1230';ctx.fillRect(bx+700,Y0-130,90,140);}}
  if(g.phase==='ride'||g.lvl===1){
    for(const s of g.stalls){const x=wx(s.x);if(x<-80||x>W+80)continue;if(s.dead){emoji('💥',x,s.y-5,28);continue;}
      ctx.fillStyle='#2a1a3a';ctx.fillRect(x-30,s.y-22,60,24);ctx.strokeStyle='#ff8a2b';ctx.shadowColor='#ff8a2b';ctx.shadowBlur=8;ctx.strokeRect(x-30,s.y-22,60,24);ctx.shadowBlur=0;
      emoji(GOODS[s.g][0],x-12,s.y-26,22);emoji(GOODS[s.g][0],x+12,s.y-26,22);
      if(s.vendor)person(x,s.y-20,0,{body:'#7a4a2a',hair:'#222',s:.8,f:-1,walk:0,atk:0});
      glow(GOODS[s.g][1],x,s.y+14,'#ffe14a',8,'center',6);}}
}
function drawEnt(){const g=G,P=g.P,L=[];
  for(const t of g.tents)L.push({y:t.y,d:()=>{const x=wx(t.x);emoji(t.out?'🏕️':'⛺',x,t.y+8,60);if(!t.out)glow('(sounds of barking)',x,t.y-50,'#888',9,'center',0);}});
  for(const p of g.poops)if(!p.gone)L.push({y:p.y-5,d:()=>{emoji('💩',wx(p.x),p.y+8,22);if(p.fire>0)emoji('🔥',wx(p.x),p.y-4,26);}});
  for(const it of g.items)if(!it.got)L.push({y:it.y,d:()=>{emoji(it.k==='torch'?'🔦':'🛵',wx(it.x),it.y,it.k==='torch'?30:44);glow(it.k==='torch'?'FENTANYL TORCH':'SCOOTER',wx(it.x),it.y-40+Math.sin(g.t*5)*4,'#ffe14a',10,'center');}});
  for(const o of g.owners)L.push({y:o.y,d:()=>{const x=wx(o.x);person(x,o.y,0,{body:'#2d6a4f',hair:'#ccc',s:1,f:o.spray?sgn(o.tx-o.x):1,hold:'🚿',atk:0});if(o.spray){ctx.strokeStyle='#19f3ff';ctx.lineWidth=4;ctx.shadowColor='#19f3ff';ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(x,o.y-40);ctx.quadraticCurveTo((x+wx(o.tx))/2,o.y-70,wx(o.tx),o.ty-30);ctx.stroke();ctx.lineWidth=1;ctx.shadowBlur=0;}
    if(o.sayT>0)bubble(x,o.y-90,o.say);}});
  for(const b of g.bros)L.push({y:b.y,d:()=>{const x=wx(b.x);ctx.globalAlpha=b.rescued?clamp(1-b.hc/3,0,1):1;person(x,b.y,0,{body:'#e0e0e0',hair:'#6a4a2a',leg:'#445',s:.95,f:b.dir,walk:1,ph:g.t+b.x,glow:'#19f3ff'});emoji('💻',x+b.dir*12,b.y-26,14);ctx.globalAlpha=1;if(b.sayT>0)bubble(x,b.y-85,b.say);}});
  const M=g.mayor;if(g.phase!=='ride'&&M.st!=='thrown')L.push({y:M.y,d:()=>{const x=wx(M.x),sh=M.st==='held'?0:Math.sin(g.t*30)*1.5;if(M.st==='held')return;person(x+sh,M.y,0,{body:'#223',hair:'#aaa',leg:'#112',s:.95,f:1,glow:'#ff2bd6'});emoji('🥺',x+sh,M.y-52,14);ctx.fillStyle='#f00';ctx.fillRect(x+sh-2,M.y-46,4,14);if(M.sayT>0)bubble(x,M.y-90,M.say);}});
  for(const f of [...g.zs,...g.dogs,...g.hs])L.push({y:f.y,d:()=>drawFoe(f)});
  const B=g.boss;if(B)L.push({y:B.y,d:()=>drawBoss(B)});
  if(g.junk.vis&&g.phase!=='ride')L.push({y:g.junk.y,d:()=>{const J=g.junk;const x=wx(J.x);person(x,J.y,0,{body:'#555',hair:'#222',skin:'#9bbf8a',s:1,f:1,walk:1,ph:g.t,zombie:1});if(J.say&&g.t%6<3)bubble(x,J.y-85,J.say);}});
  if(g.phase==='ride'&&g.junk.vis)L.push({y:g.junk.y,d:()=>{const x=wx(g.junk.x);emoji('🛵',x,g.junk.y+4,50);person(x,g.junk.y-10,0,{body:'#555',hair:'#222',skin:'#9bbf8a',s:.8,f:1,zombie:1});glow('JUNKIE',x,g.junk.y-80,'#ff2bd6',12,'center');}});
  for(const a of g.att)L.push({y:a.y,d:()=>{const x=wx(P.x+a.side*a.d)+(a.ko>0?0:0);const win=a.d<115&&!a.dead;
    person(x,a.y,a.ko>0?30:0,{body:'#7a2a2a',hair:'#222',skin:'#9bbf8a',s:1,f:-a.side,zombie:1,atk:win?1:0,rot:a.ko>0?-1.2:0});
    if(!a.dead){glow(win?'HIT!':'!',x,a.y-85,win?'#ffe14a':'#ff2bd6',win?20:14,'center',10);}}});
  L.push({y:P.y+1,d:()=>drawPlayer()});
  L.sort((a,b)=>a.y-b.y);for(const e of L)e.d();
  // projectiles
  for(const p of g.projs){const x=wx(p.x),y=p.y-p.z;
    if(p.kind==='mayor'){person(x,p.y,p.z,{body:'#223',hair:'#aaa',s:.9,f:1,rot:1.6});continue;}
    ctx.save();const em={needle:'💉',cig:'🚬',ballot:'🗳️',pencil:'✏️',bag:'🛍️',ngren:'💊',fgren:'☣️',poop:'💩'}[p.kind];
    if(p.kind==='ngren'||p.kind==='fgren'||p.kind==='poop'||p.kind==='bag'){ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(x,p.y+4,10,4,0,0,7);ctx.fill();}
    ctx.globalAlpha=1;emoji(em,x,y,p.kind==='needle'?18:24);if(p.burning)emoji('🔥',x,y-10,24);ctx.restore();}
  for(const c of g.clouds){ctx.globalAlpha=.25+.1*Math.sin(g.t*6);ctx.fillStyle='#7dff3a';ctx.beginPath();ctx.ellipse(wx(c.x),c.y,c.r,c.r*.5,0,0,7);ctx.fill();ctx.globalAlpha=1;}
  for(const f of g.fx){ctx.fillStyle=f.c;ctx.globalAlpha=clamp(f.life*2,0,1);ctx.fillRect(wx(f.x),f.y-f.z,f.s,f.s);}ctx.globalAlpha=1;
  for(const t of g.txt)glow(t.s,wx(t.x),t.y-(1.2-t.t)*30,t.c,13,'center',6);
}
function bubble(x,y,t){ctx.font='bold 11px monospace';const w=ctx.measureText(t).width+12;ctx.fillStyle='rgba(255,255,255,.92)';ctx.fillRect(x-w/2,y-14,w,18);ctx.fillStyle='#111';ctx.textAlign='center';ctx.fillText(t,x,y-1);}
function drawFoe(f){const g=G,x=wx(f.x);
  if(f.k==='d'){const s=f.big?1.6:.8;ctx.save();ctx.translate(x,f.y);ctx.scale(-f.f*s,s);ctx.globalAlpha=f.ko?clamp(1.3-f.t,0,1):1;ctx.font='34px serif';ctx.textAlign='center';ctx.rotate(f.ko?Math.PI:0);ctx.fillText('🐕',0,0);ctx.restore();ctx.globalAlpha=1;return;}
  if(f.scoot){ctx.globalAlpha=f.ko?clamp(1.3-f.t,0,1):1;emoji('🛵',x,f.y+4,46);}
  if(f.k==='z'){ctx.globalAlpha=f.ko?clamp(1.3-f.t,0,1):1;person(x,f.y,f.scoot?10:0,{body:'hsl('+(f.hue+120)+',30%,25%)',hair:'#2b2b2b',skin:'hsl('+f.hue+',35%,60%)',s:1,f:f.f,walk:1,ph:g.t+f.x,zombie:1,atk:f.cd>0.9?1:0,rot:f.ko?Math.min(1.4,f.t*5):0,glow:f.hit>0?'#fff':null});}
  else{const r=clamp(f.hp/f.max,0,1);ctx.globalAlpha=f.ko?clamp(1.3-f.t,0,1):1;
    person(x,f.y,0,{body:'#2a3a8a',hair:mix('#1e90ff','#cfd8e8',1-r),skin:'#f2c7a0',s:1,f:f.f,walk:1,ph:g.t+f.x,atk:f.cd>0.9?1:0,rot:f.ko?Math.min(1.4,f.t*5):0,glow:f.hit>0?'#fff':null});
    if(!f.ko){bar(x-18,f.y-86,36,5,r,'#1e90ff');}
    if(f.wet>0){ctx.fillStyle='rgba(30,144,255,.6)';for(let i=0;i<4;i++)ctx.fillRect(x+rnd(-12,12),f.y-40+rnd(0,40)+(1-f.hp/f.max)*0,3,6);}}
  ctx.globalAlpha=1;if(f.fire>0)emoji('🔥',x,f.y-30,26);
}
function mix(a,b,t){const p=c=>[1,3,5].map(i=>parseInt(c.substr(i,2),16));const A=p(a),B=p(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')';}
function drawBoss(B){const x=wx(B.x),g=G;ctx.save();
  if(B.hit>0){ctx.shadowColor='#fff';ctx.shadowBlur=20;}
  const fall=B.dead?Math.min(1.5,B.dt*3):0;
  if(B.kind==='soma'){person(x,B.y,0,{body:'#3a2a7a',hair:'#19b8ff',skin:'#f2c7a0',s:1.5,f:-1,walk:0,atk:0,glow:B.dt!==undefined?'#ff8a2b':'#19b8ff',rot:fall});if(B.dt!==undefined&&!B.dead)for(let i=0;i<5;i++)emoji('🔥',x+(i-2)*14,B.y-Math.abs(Math.sin(g.t*8+i))*80,30);
    ctx.restore();if(!B.dead)glow('UNDERBOSS: KAREN-FOR-HIRE',x,B.y-125,'#19b8ff',12,'center');}
  else{person(x,B.y,0,{body:'#5a1a8a',hair:'#19b8ff',hair2:'#a35bff',skin:'#f2c7a0',s:1.7,f:-1,walk:0,glow:'#a35bff',rot:fall});ctx.restore();if(!B.dead)glow('DIRECTRESS OF EVERYTHING',x,B.y-140,'#a35bff',12,'center');}
}
function drawPlayer(){const P=G.P,x=wx(P.x);ctx.save();
  if(P.inv>0&&Math.floor(G.t*20)%2)ctx.globalAlpha=.5;
  const rideY=G.phase==='ride';
  if(rideY||P.boost>0){emoji('🛵',x,P.y+4-P.z,52);}
  person(x,P.y-(rideY||P.boost>0?12:0),P.z,{body:'#6ec6ff',hair:'#0b0b12',hair2:'#2a2a55',alice:1,leg:'#19f3ff',skin:'#f2c7a0',s:1,f:P.f,walk:!rideY&&(down('KeyA','KeyD','KeyW','KeyS','ArrowLeft','ArrowRight','ArrowUp','ArrowDown')),ph:G.t,atk:P.anim,glow:'#19f3ff'});
  if(P.anim>0&&P.at==='kick'){emoji('🦵',x+P.f*30,P.y-28-P.z,22);}
  if(P.spray&&!rideY){ctx.fillStyle='rgba(25,243,255,.35)';ctx.beginPath();ctx.moveTo(x+P.f*14,P.y-38-P.z);ctx.lineTo(x+P.f*125,P.y-65-P.z);ctx.lineTo(x+P.f*125,P.y-10-P.z);ctx.fill();emoji('💨',x+P.f*40,P.y-36-P.z,18);}
  if(P.hose){ctx.strokeStyle='rgba(25,200,255,.8)';ctx.lineWidth=7;ctx.shadowColor='#19f3ff';ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(x+P.f*10,P.y-38);ctx.quadraticCurveTo(x+P.f*120,P.y-60,x+P.f*230,P.y-20);ctx.stroke();ctx.lineWidth=1;}
  if(P.flame){for(let i=0;i<4;i++)emoji('🔥',x+P.f*(25+i*28),P.y-34-Math.sin(G.t*20+i)*6,26+i*3);}
  if(G.wp===4&&G.un.torch&&!P.flame)emoji('🔦',x+P.f*14,P.y-30,16);
  if(P.hold==='mayor'){emoji('🤵',x,P.y-85,26);}
  if(rideY&&G.mayor){emoji('🥺',x-26,P.y-36,16);if(G.t%5<2.2)bubble(x-30,P.y-70,WHINE[Math.floor(G.t/5)%WHINE.length]);}
  ctx.restore();}
function drawHUD(){const g=G,P=g.P;
  glow('SCORE '+g.score,16,28,'#19f3ff',20);glow(LV[g.lvl]+(g.phase==='boss'||g.phase==='boss2'?' — BOSS':''),16,50,'#ff2bd6',13);
  bar(16,60,180,12,P.hp/P.max,'#ff2bd6','HEALTH');bar(16,76,120,8,P.narc/100,'#19f3ff','NARCAN');
  if(g.un.hose)bar(16,88,120,8,P.water/100,'#1e90ff','HOSE');
  {const r=clamp(1-P.pcd/6,0,1);bar(16,100,120,8,r,r>=1?'#ffe14a':'#ff8a2b',r>=1?'POWER [U] READY':'POWER');}
  // weapons
  const W5=[['1','👊','Fists'],['2','🚿','Hose'],['3','💊','N-Gren'],['4','🔦','Torch'],['5','☣️','F-Gren']];
  W5.forEach((w,i)=>{const x=W/2-145+i*58,y=H-58,ok=wpOk(i+1);ctx.fillStyle=g.wp===i+1?'rgba(255,43,214,.5)':'rgba(0,0,0,.55)';ctx.fillRect(x,y,52,50);ctx.strokeStyle=ok?'#19f3ff':'#444';ctx.strokeRect(x,y,52,50);
    ctx.globalAlpha=ok?1:.2;emoji(w[1],x+26,y+30,24);ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.font='10px monospace';ctx.textAlign='left';ctx.fillText(w[0],x+3,y+11);
    if(i===2&&ok)ctx.fillText('x'+g.ng,x+30,y+46);if(i===4&&ok)ctx.fillText('x'+g.fg,x+30,y+46);if(!ok){ctx.fillText(['','200pts','500pts','pickup','1400'][i],x+8,y+46);}});
  if(g.boss&&g.boss.kind==='soma'&&!g.boss.dead)bar(W/2-160,14,320,16,g.heat/100,'#ff8a2b','HEAT '+Math.floor(g.heat)+'%');
  if(g.boss&&g.boss.kind==='final'&&!g.boss.dead)bar(W/2-180,14,360,16,g.boss.hp/g.boss.max,'#a35bff','FINAL BOSS');
  if(g.phase==='ride'){bar(W-200,16,184,12,(g.sp-140)/540,'#ffe14a','MOMENTUM');bar(W-200,34,184,8,P.x/7400,'#19f3ff','DISTANCE');bar(W-200,46,184,0,0,'#000');}
  if(g.msgT>0){ctx.globalAlpha=clamp(g.msgT,0,1);ctx.fillStyle='rgba(0,0,0,.6)';ctx.font='bold 15px monospace';const w=Math.min(W-40,ctx.measureText(g.msg).width+24);ctx.fillRect(W/2-w/2,H-110,w,28);glow(g.msg,W/2,H-91,'#ffe14a',15,'center',8);ctx.globalAlpha=1;}
  if(g.phase==='boss2'&&g.mayor.st==='idle'&&Math.abs(g.mayor.x-P.x)<100)glow('[G] GRAB MAYOR',wx(g.mayor.x),g.mayor.y-100,'#ffe14a',12,'center');
}
function post(){ctx.fillStyle='rgba(0,0,0,.18)';for(let y=0;y<H;y+=3)ctx.fillRect(0,y,W,1);
  const v=ctx.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,H*.95);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.6)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);}
function screen(title,sub,lines,c1,c2){ctx.fillStyle='#05020c';ctx.fillRect(0,0,W,H);
  for(let i=0;i<14;i++){ctx.strokeStyle=i%2?'rgba(255,43,214,.3)':'rgba(25,243,255,.3)';ctx.strokeRect(40+i*8,40+i*8,W-80-i*16,H-80-i*16);}
  glow(title,W/2+3,150,c2,76,'center',30);glow(title,W/2,147,c1,76,'center',30);glow(sub,W/2,195,'#ffe14a',16,'center',8);
  lines.forEach((l,i)=>glow(l,W/2,245+i*24,i%2?'#19f3ff':'#ff2bd6',14,'center',6));
  if(Math.floor(tnow*2)%2)glow('PRESS ENTER / TAP TO START',W/2,H-70,'#fff',18,'center',10);}
function draw(){
  if(S==='title'){screen('SAN FENTANYL','a cartoon satire of a very real city',['WASD / ARROWS move · SPACE jump · Q cycle weapons','J punch (spam J = combo) · U POWER COMBO · K kick · L Narcan spray · E use weapon · 1-5 select · G grab/throw','Knock out drug zombies to unlock the hose, grenades & more','Rescue tech bros. Do NOT step in the poop. Protect (then throw) the Mayor.','SoMa → The Mission → The Tenderloin → The NGO Tower'],'#ff2bd6','#19f3ff');post();return;}
  if(S==='over'){screen('GAME OVER','You are now a San Francisco statistic.',['Score: '+G.score,'Zombies: 1 · You: 0','Press Enter to try again'],'#ff2bd6','#19f3ff');post();return;}
  if(S==='win'){screen('YOU WIN','The NGO tower falls. The mayor… files a complaint.',['Final score: '+G.score,'Tech bros are moving back home anyway.','Press Enter to play again'],'#19f3ff','#ff2bd6');post();return;}
  ctx.save();if(G.shake>0)ctx.translate(rnd(-4,4),rnd(-4,4));
  drawBG();drawProps();drawEnt();for(const r of G.rings){ctx.save();ctx.strokeStyle='rgba(255,43,214,'+(1-r.t/.6)+')';ctx.shadowColor='#19f3ff';ctx.shadowBlur=20;ctx.lineWidth=8;ctx.beginPath();ctx.ellipse(wx(r.x),r.y,r.t*320,r.t*110,0,0,7);ctx.stroke();ctx.restore();}ctx.restore();
  if(G.flash>0){ctx.fillStyle='rgba(120,255,255,'+clamp(G.flash*1.6,0,.6)+')';ctx.fillRect(0,0,W,H);}drawHUD();
  if(G.phase==='cable'){ctx.fillStyle='rgba(0,0,0,'+clamp(G.ct-1.4,0,1)+')';ctx.fillRect(0,0,W,H);}
  post();
}
function frame(ts){const t=ts/1000;let dt=Math.min(.05,t-tnow||0);tnow=t;
  if((S==='title'||S==='over'||S==='win')&&hit('Enter','Space','KeyR')){newGame();S='play';}
  else if(S==='play')update(dt);
  draw();for(const k in press)delete press[k];requestAnimationFrame(frame);}
cv.addEventListener('pointerdown',()=>{if(S!=='play'){newGame();S='play';}});
// touch controls
if('ontouchstart' in window||navigator.maxTouchPoints>0){const tc=document.getElementById('tc');tc.style.display='flex';
  const mk=(par,l,code,cls,css)=>{const b=document.createElement('button');b.textContent=l;b.className=cls||'';if(css)b.style.cssText=css;const on=e=>{e.preventDefault();if(!keys[code])press[code]=1;keys[code]=1;},off=e=>{e.preventDefault();keys[code]=0;};b.addEventListener('touchstart',on,{passive:false});b.addEventListener('touchend',off);b.addEventListener('touchcancel',off);par.appendChild(b);};
  const pad=document.createElement('div'),act=document.createElement('div');pad.id='pad';act.id='act';tc.appendChild(pad);tc.appendChild(act);
  mk(pad,'▲','KeyW','',"grid-area:1/2");mk(pad,'◀','KeyA','',"grid-area:2/1");mk(pad,'▶','KeyD','',"grid-area:2/3");mk(pad,'▼','KeyS','',"grid-area:3/2");
  mk(act,'Q','KeyQ');mk(act,'J','KeyJ');mk(act,'K','KeyK');mk(act,'E','KeyE');mk(act,'L','KeyL');mk(act,'G','KeyG');mk(act,'⤒','Space');mk(act,'POWER','KeyU','pw');}
window.__sf={get G(){return G;},get S(){return S;},set S(v){S=v;},newGame,startLevel,startSoma,startFinal,update,draw,frame,keys,press};
requestAnimationFrame(frame);
