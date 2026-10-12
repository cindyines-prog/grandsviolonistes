let weeks=[],w=0,d=0;
const $=id=>document.getElementById(id);
const getJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
let completed=getJSON('violinCompleted',{});
let notes=getJSON('violinNotes',{});
const key=(a,b)=>`${a}:${b}`;
function persist(){localStorage.setItem('violinProgress',JSON.stringify({w,d}));localStorage.setItem('violinCompleted',JSON.stringify(completed));}
function saveNote(){notes[key(w,d)]=$('notesInput').value;localStorage.setItem('violinNotes',JSON.stringify(notes));}
function render(){
 if(!weeks.length)return;
 w=Math.max(0,Math.min(w,weeks.length-1));d=Math.max(0,Math.min(d,weeks[w].days.length-1));
 $('weeknav').replaceChildren();weeks.forEach((x,i)=>{const b=document.createElement('button');b.textContent=`第${i+1}周 · ${x.artist}`;b.className=i===w?'active':'';b.onclick=()=>{saveNote();w=i;d=0;persist();render()};$('weeknav').append(b)});
 const total=weeks.reduce((s,x)=>s+x.days.length,0),done=Object.keys(completed).filter(k=>completed[k]&&weeks[Number(k.split(':')[0])]?.days[Number(k.split(':')[1])]).length;
 $('progressText').textContent=`已完成 ${done} / ${total} 课`;$('progressFill').style.width=(done/total*100)+'%';
 const W=weeks[w];$('weekLabel').textContent=`第 ${w+1} 周`;$('artist').textContent=W.artist;$('intro').textContent=W.intro;
 $('days').replaceChildren();W.days.forEach((x,i)=>{const b=document.createElement('button');b.textContent=`Day ${i+1}${completed[key(w,i)]?' ✓':''}`;b.className=`daybtn ${i===d?'active':''}`;b.onclick=()=>{saveNote();d=i;persist();render()};$('days').append(b)});
 const x=W.days[d];$('daylabel').textContent=`DAY ${d+1} · 今日观察`;$('focus').textContent=x[0];$('piece').textContent=x[1];$('segment').textContent=x[2];
 $('observe').replaceChildren();x[3].forEach(y=>{const li=document.createElement('li');li.textContent=y;$('observe').append(li)});
 $('practice').textContent=x[4];$('quote').textContent=x[5];
 $('search').href='https://www.youtube.com/results?search_query='+encodeURIComponent(W.artist+' '+x[1]);
 $('notesInput').value=notes[key(w,d)]||'';
 document.querySelector('.primary').textContent=completed[key(w,d)]?'已完成 · 前往下一课 →':'完成今天的学习 →';
}
function completeDay(){saveNote();completed[key(w,d)]=true;
 if(d<weeks[w].days.length-1)d++;else if(w<weeks.length-1){w++;d=0}
 persist();render();window.scrollTo({top:0,behavior:'smooth'});
}
function resetProgress(){if(!confirm('确定要清空本设备的完成记录，并返回第一课吗？聆听笔记会保留。'))return;completed={};w=0;d=0;persist();render()}
async function loadLessons(manual=false){
 try{const res=await fetch('lessons.json',{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);const data=await res.json();if(!Array.isArray(data.weeks)||!data.weeks.length)throw Error('课程格式错误');
 const old=weeks.reduce((s,x)=>s+x.days.length,0),now=data.weeks.reduce((s,x)=>s+x.days.length,0);
 weeks=data.weeks;const saved=getJSON('violinProgress',null);if(saved&&Number.isInteger(saved.w)&&Number.isInteger(saved.d)){w=saved.w;d=saved.d;if(!localStorage.getItem('violinPwaMigrated')){if(w>=5)w--;localStorage.setItem('violinPwaMigrated','1');persist()}}
 render();$('contentStatus').textContent=`已收录 ${weeks.length} 位演奏家 · ${now} 课 · 内容版本 ${data.version||'未标注'}`;
 if(manual){$('updateNotice').hidden=false;$('updateNotice').textContent=now>old?`发现 ${now-old} 节新课，已更新。`:'课程已检查，当前是服务器提供的版本。'}
 }catch(e){$('contentStatus').textContent='课程加载失败，请联网重试或刷新页面。';if(manual){$('updateNotice').hidden=false;$('updateNotice').textContent='无法获取新课程，请检查网络。'}console.error(e)}
}
$('notesInput').addEventListener('input',saveNote);
$('refreshContent').onclick=()=>loadLessons(true);
loadLessons();
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(console.error));}
