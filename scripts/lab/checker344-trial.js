/* eslint-disable */
// Recipe kept from _incoming/checker-344/trial.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
const {spawnSync}=require("child_process");
const root="C:/Users/dhetc/Claude-Web-Lab-v3-checkpoint-3.3.3/_incoming/wt-seo-d";
const T=[
 {name:"iqos",key:"Philip",from:"IQOS หรือที่คนไทยเรียกกันว่าไอคอส เป็นเครื่องอุ่นยาสูบด้วยความร้อนของ Philip Morris International ไม่ใช้น้ำยา",to:"IQOS ของ Philip Morris International หรือที่คนไทยเรียกกันว่าไอคอส เป็นเครื่องอุ่นยาสูบด้วยความร้อน ไม่ใช้น้ำยา",pages:["/brands/iqos","/about"]},
 {name:"joiway",key:"F4 ที่สลับ",from:"F4 ที่สลับ 2 กลิ่นในเครื่องเดียว",to:"F4 ที่สลับได้สองกลิ่นในเครื่องเดียว",pages:["/brands/joiway","/about"]},
 {name:"salthub",key:"Marbo อยู่ที่ท้ายเว็บ",from:"เว็บทางการ salthub.com เองก็มีโลโก้ Marbo อยู่ที่ท้ายเว็บ",to:"เว็บทางการ salthub.com มีโลโก้ Marbo อยู่ที่ท้ายเว็บ",pages:["/brands/salthub","/about"]},
];
const only=process.argv[2];
for(const t of T){ if(only&&only!==t.name)continue;
 for(const p of t.pages){ for(const w of [390,1440]){
  const js=`(function(){var from=${JSON.stringify(t.from)},to=${JSON.stringify(t.to)},key=${JSON.stringify(t.key)};
   var tw=document.createTreeWalker(document.querySelector("main"),NodeFilter.SHOW_TEXT);var n,hit=null;while(n=tw.nextNode()){if(n.data.indexOf(key)>=0&&n.data.indexOf(from.slice(0,6))>=0||n.data.indexOf(from)>=0){hit=n;break;}}
   if(!hit)return "NOHIT";var ok=hit.data.indexOf(from)>=0;if(ok)hit.data=hit.data.replace(from,to);var best=hit.parentElement;while(best&&best.querySelectorAll("p,div").length>0)best=best.parentElement;
   var p=hit.parentElement;while(p&&!(p.tagName==="P"||(p.parentElement&&p.parentElement.tagName==="MAIN"))&&p.textContent.length<${t.to.length+120})p=p.parentElement;
   var w=document.createTreeWalker(p,NodeFilter.SHOW_TEXT);var lines=[],cur="",curTop=null,m;
   while(m=w.nextNode()){var s=m.data;for(var k=0;k<s.length;k++){var r=document.createRange();r.setStart(m,k);r.setEnd(m,k+1);var rc=r.getClientRects();if(!rc.length){cur+=s[k];continue;}var top=Math.round(rc[0].top);if(curTop===null)curTop=top;if(Math.abs(top-curTop)>6){lines.push(cur);cur="";curTop=top;}cur+=s[k];}}
   lines.push(cur);return (ok?"REPLACED ":"NOFROM ")+lines.map(function(l){return "|"+l.replace(/\u00a0/g,"~")+"|";}).join("");})()`;
  const args=["scripts/shot.js","C:/Users/dhetc/Claude-Web-Lab-v3-checkpoint-3.3.3/_incoming/checker-344/l.png","http://localhost:3412"+p,"--width",String(w),"--wait","3000","--eval",js];
  if(w===1440)args.push("--desktop");
  const r=spawnSync("node",args,{cwd:root,encoding:"utf8"});
  const line=(r.stdout||"").split("\n").find(l=>l.startsWith("eval"))||(r.stdout+r.stderr).slice(0,300);
  console.log(t.name,p,w,line.slice(0,900));
 }}}
