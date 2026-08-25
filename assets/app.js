/* ISC Study Mate — single-page app, no build step, no network needed. */
(function(){
'use strict';
var S = window.SM.subjects;
var ORDER = ['physics','chemistry','maths','biology','english'];
var LS = 'iscmate.v1';
var state = load();

function load(){
  var d = {done:{}, cls:12, theme:'', last:null, exam:''};
  try{ var r = localStorage.getItem(LS); if(r) d = Object.assign(d, JSON.parse(r)); }catch(e){}
  return d;
}
function save(){ try{ localStorage.setItem(LS, JSON.stringify(state)); }catch(e){} }
function $(s,r){ return (r||document).querySelector(s); }
function $$(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

/* ---------- flat index for search ---------- */
var INDEX = [];
function buildIndex(){
  ORDER.forEach(function(sk){
    var sub = S[sk]; if(!sub) return;
    Object.keys(sub.classes).forEach(function(cl){
      sub.classes[cl].chapters.forEach(function(ch){
        var base = {sub:sk, subName:sub.name, icon:sub.icon, colour:sub.colour, cls:cl, ch:ch.id, chName:ch.name};
        (ch.topics||[]).forEach(function(t){
          INDEX.push(Object.assign({kind:'Syllabus topic', title:t, text:'', tab:0}, base));
        });
        (ch.concepts||[]).forEach(function(c){
          INDEX.push(Object.assign({kind:'Concept', title:c.t, text:c.d, tab:1}, base));
        });
        (ch.formulas||[]).forEach(function(f){
          INDEX.push(Object.assign({kind:'Formula / key fact', title:f.f, text:f.m, tab:2}, base));
        });
        (ch.questions||[]).forEach(function(q){
          INDEX.push(Object.assign({kind:q.marks+'-mark question', title:q.q, text:q.a, tab:3}, base));
        });
        (ch.mistakes||[]).forEach(function(m){
          INDEX.push(Object.assign({kind:'Common mistake', title:m, text:'', tab:4}, base));
        });
        INDEX.push(Object.assign({kind:'Chapter', title:ch.name, text:(ch.topics||[]).join('. '), tab:0}, base));
      });
    });
  });
}

var STOP = {'the':1,'a':1,'an':1,'of':1,'in':1,'is':1,'are':1,'to':1,'and':1,'for':1,'what':1,'how':1,
  'why':1,'i':1,'me':1,'my':1,'explain':1,'define':1,'tell':1,'about':1,'can':1,'you':1,'do':1,'does':1,
  'with':1,'on':1,'it':1,'that':1,'this':1,'from':1,'be':1,'was':1,'were':1,'give':1,'show':1,'please':1};

function search(q, filterSub, filterCls){
  var terms = q.toLowerCase().replace(/[^a-z0-9\s\-']/g,' ').split(/\s+/)
    .filter(function(t){ return t.length>1 && !STOP[t]; });
  if(!terms.length) return [];
  var out = [];
  for(var i=0;i<INDEX.length;i++){
    var it = INDEX[i];
    if(filterSub && it.sub!==filterSub) continue;
    if(filterCls && String(it.cls)!==String(filterCls)) continue;
    var T = it.title.toLowerCase(), X = it.text.toLowerCase(), C = it.chName.toLowerCase();
    var sc = 0, matched = 0;
    for(var j=0;j<terms.length;j++){
      var t = terms[j], hit = 0;
      if(T.indexOf(t)>-1){ hit = 1; sc += T.indexOf(t)===0 ? 14 : 10; }
      if(C.indexOf(t)>-1){ hit = 1; sc += 7; }
      if(X.indexOf(t)>-1){ hit = 1; sc += 3; }
      if(hit) matched++;
    }
    if(!matched) continue;
    sc *= (matched/terms.length);                 // reward covering the whole query
    if(matched===terms.length) sc *= 1.6;
    if(it.kind.indexOf('question')>-1) sc *= 1.25; // answers are what she usually wants
    if(it.kind==='Concept') sc *= 1.2;
    if(it.kind==='Chapter') sc *= 1.1;
    out.push({it:it, sc:sc});
  }
  out.sort(function(a,b){ return b.sc-a.sc; });
  return out.slice(0,40).map(function(o){ return o.it; });
}

function hl(s, q){
  var terms = q.toLowerCase().replace(/[^a-z0-9\s\-']/g,' ').split(/\s+/)
    .filter(function(t){return t.length>2 && !STOP[t];});
  var h = esc(s);
  terms.forEach(function(t){
    h = h.replace(new RegExp('('+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>');
  });
  return h;
}

/* ---------- progress ---------- */
function allChapters(cls){
  var a = [];
  ORDER.forEach(function(sk){
    var c = S[sk] && S[sk].classes[cls];
    if(c) c.chapters.forEach(function(ch){ a.push({sub:sk, ch:ch}); });
  });
  return a;
}
function pct(sk, cls){
  var c = S[sk] && S[sk].classes[cls]; if(!c || !c.chapters.length) return 0;
  var d = c.chapters.filter(function(ch){ return state.done[ch.id]; }).length;
  return Math.round(d/c.chapters.length*100);
}
function toggleDone(id){
  if(state.done[id]) delete state.done[id]; else state.done[id] = Date.now();
  save();
}

/* ---------- routing ---------- */
var view = 'home', curSub = null, curCh = null, curTab = 0, askFilter = '';

function go(v, opts){
  view = v; opts = opts || {};
  if(opts.sub!==undefined) curSub = opts.sub;
  if(opts.ch!==undefined) curCh = opts.ch;
  if(opts.tab!==undefined) curTab = opts.tab;
  $$('.nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v===v); });
  $$('.view').forEach(function(x){ x.classList.remove('on'); });
  var el = $('#v-'+v); if(el) el.classList.add('on');
  window.scrollTo(0,0);
  render();
}

/* ---------- renderers ---------- */
function render(){
  if(view==='home') renderHome();
  else if(view==='course') renderCourse();
  else if(view==='chapter') renderChapter();
  else if(view==='ask') renderAsk();
  else if(view==='revise') renderRevise();
  else if(view==='plan') renderPlan();
}

function clsToggleHTML(){
  return '<div class="chips" id="clschips">'
    + [11,12].map(function(c){
        return '<button class="chip '+(state.cls==c?'on':'')+'" data-cls="'+c+'">Class '+c+'</button>';
      }).join('')
    + '</div>';
}

function renderHome(){
  var cls = state.cls;
  var chs = allChapters(cls);
  var done = chs.filter(function(x){ return state.done[x.ch.id]; }).length;
  var days = daysToExam();
  var h = '';

  h += '<div class="searchwrap"><span class="mag">🔍</span>'
     + '<input id="homeq" placeholder="Ask anything — a topic, a doubt, a formula…" autocomplete="off">'
     + '<kbd>/</kbd></div>';
  h += '<div class="chips">'
     + ['Gauss theorem','double fertilisation','Nernst equation','integration by parts','Macbeth banquet scene','SN1 vs SN2']
       .map(function(s){ return '<button class="chip qs" data-q="'+esc(s)+'">'+esc(s)+'</button>'; }).join('')
     + '</div>';

  h += '<div class="sec-title">Your progress</div>';
  h += '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">'
     + stat(done+' / '+chs.length, 'chapters marked done')
     + stat(Math.round(done/Math.max(chs.length,1)*100)+'%', 'ISC Class '+cls+' covered')
     + stat(String(INDEX.filter(function(i){return i.kind.indexOf('question')>-1;}).length), 'model answers inside')
     + stat(days===null ? '—' : String(days), days===null ? 'set your exam date in Plan' : 'days to your exam')
     + '</div>';

  h += '<div class="sec-title">Subjects</div>' + clsToggleHTML();
  h += '<div class="grid" style="margin-top:13px">';
  ORDER.forEach(function(sk){
    var s = S[sk]; if(!s || !s.classes[cls]) return;
    var p = pct(sk, cls), n = s.classes[cls].chapters.length;
    h += '<button class="subj" data-sub="'+sk+'">'
       + '<div class="ic" style="background:'+s.colour+'22;color:'+s.colour+'">'+s.icon+'</div>'
       + '<h3>'+esc(s.name)+'</h3>'
       + '<div class="dim">'+n+' chapters · code '+s.code+'</div>'
       + '<div class="bar"><i style="width:'+p+'%;background:'+s.colour+'"></i></div>'
       + '<div class="dim" style="margin-top:6px">'+p+'% done</div>'
       + '</button>';
  });
  h += '</div>';

  if(state.last){
    var L = findChapter(state.last.sub, state.last.ch);
    if(L) h += '<div class="sec-title">Pick up where you left off</div>'
      + '<button class="ch" data-open="'+L.sub+'|'+L.ch.id+'">'
      + '<div class="num">'+L.ch.unit+'</div><div class="body"><h4>'+esc(L.ch.name)+'</h4>'
      + '<div class="dim">'+esc(S[L.sub].name)+' · Class '+L.cls+'</div></div></button>';
  }

  h += '<div class="foot">Built for the ISC (CISCE) syllabus, Classes XI &amp; XII. '
     + 'Everything works offline once the page has loaded — your progress is saved in this browser only.</div>';
  $('#v-home').innerHTML = h;

  $('#homeq').addEventListener('keydown', function(e){
    if(e.key==='Enter' && this.value.trim()){ askQ(this.value.trim()); }
  });
  $$('.qs').forEach(function(b){ b.onclick = function(){ askQ(b.dataset.q); }; });
  $$('#v-home .subj').forEach(function(b){ b.onclick = function(){ go('course',{sub:b.dataset.sub}); }; });
  $$('#clschips .chip').forEach(function(b){ b.onclick = function(){ state.cls = +b.dataset.cls; save(); render(); }; });
  var lastBtn = $('#v-home [data-open]');
  if(lastBtn) lastBtn.onclick = function(){ var p = lastBtn.dataset.open.split('|'); go('chapter',{sub:p[0],ch:p[1],tab:0}); };
}
function stat(b,s){ return '<div class="stat"><b>'+esc(b)+'</b><span>'+esc(s)+'</span></div>'; }

function findChapter(sk, id){
  var s = S[sk]; if(!s) return null;
  var r = null;
  Object.keys(s.classes).forEach(function(cl){
    s.classes[cl].chapters.forEach(function(ch){ if(ch.id===id) r = {sub:sk, cls:cl, ch:ch}; });
  });
  return r;
}

function renderCourse(){
  var cls = state.cls, h = '';
  h += '<div class="chips" style="margin-bottom:14px">'
     + '<button class="chip '+(!curSub?'on':'')+'" data-sub="">All subjects</button>'
     + ORDER.filter(function(k){return S[k];}).map(function(k){
         return '<button class="chip '+(curSub===k?'on':'')+'" data-sub="'+k+'">'+S[k].icon+' '+esc(S[k].name)+'</button>';
       }).join('') + '</div>';
  h += clsToggleHTML();

  var subs = curSub ? [curSub] : ORDER;
  subs.forEach(function(sk){
    var s = S[sk]; if(!s || !s.classes[cls]) return;
    var cc = s.classes[cls];
    h += '<div class="sec-title">'+s.icon+' '+esc(s.name)+' — Class '+cls+'</div>';
    h += '<div class="note" style="margin-bottom:13px">'+esc(s.pattern)+'</div>';
    h += '<div class="chlist">';
    cc.chapters.forEach(function(ch){
      var d = !!state.done[ch.id];
      h += '<div class="ch" style="cursor:default">'
         + '<div class="num">'+ch.unit+'</div>'
         + '<button class="body" data-open="'+sk+'|'+ch.id+'" style="background:none;border:0;text-align:left;padding:0">'
         +   '<h4>'+esc(ch.name)+'</h4>'
         +   '<div class="dim">'+(ch.topics||[]).length+' topics · '+(ch.questions||[]).length+' model answers'
         +   (ch.marks && ch.marks!=='—' ? ' · '+esc(ch.marks) : '')+'</div>'
         + '</button>'
         + '<button class="tick '+(d?'on':'')+'" data-tick="'+ch.id+'" title="Mark as done">✓</button>'
         + '</div>';
    });
    h += '</div>';
  });
  $('#v-course').innerHTML = h;
  $$('#v-course .chips .chip[data-sub]').forEach(function(b){
    b.onclick = function(){ curSub = b.dataset.sub || null; render(); };
  });
  $$('#v-course #clschips .chip').forEach(function(b){
    b.onclick = function(){ state.cls = +b.dataset.cls; save(); render(); };
  });
  $$('#v-course [data-open]').forEach(function(b){
    b.onclick = function(){ var p = b.dataset.open.split('|'); go('chapter',{sub:p[0],ch:p[1],tab:0}); };
  });
  $$('#v-course [data-tick]').forEach(function(b){
    b.onclick = function(){ toggleDone(b.dataset.tick); b.classList.toggle('on'); };
  });
}

function renderChapter(){
  var L = findChapter(curSub, curCh);
  if(!L){ go('course'); return; }
  state.last = {sub:curSub, ch:curCh}; save();
  var ch = L.ch, s = S[curSub], d = !!state.done[ch.id];
  var h = '<button class="back" id="bk">← '+esc(s.name)+' · Class '+L.cls+'</button>';
  h += '<div class="chead"><h2>'+esc(ch.name)+'</h2><div class="row">'
     + '<span class="pill acc">Unit '+ch.unit+'</span>'
     + (ch.marks && ch.marks!=='—' ? '<span class="pill">'+esc(ch.marks)+'</span>' : '')
     + '<span class="pill">'+(ch.questions||[]).length+' model answers</span>'
     + '<button class="pill" id="mk" style="cursor:pointer;'+(d?'background:var(--good);color:#fff;border-color:transparent':'')+'">'
     + (d?'✓ Done':'Mark as done')+'</button>'
     + '</div></div>';

  var tabs = [
    ['Syllabus', (ch.topics||[]).length],
    ['Key concepts', (ch.concepts||[]).length],
    ['Formulas &amp; facts', (ch.formulas||[]).length],
    ['Q&amp;A', (ch.questions||[]).length],
    ['Watch out', (ch.mistakes||[]).length]
  ];
  h += '<div class="tabs">' + tabs.map(function(t,i){
      return '<button class="'+(curTab===i?'on':'')+'" data-t="'+i+'">'+t[0]+(t[1]?' <span class="dim">'+t[1]+'</span>':'')+'</button>';
    }).join('') + '</div>';

  h += '<div class="tabpane '+(curTab===0?'on':'')+'"><div class="card pad"><ul class="topics">'
     + (ch.topics||[]).map(function(t){ return '<li>'+esc(t)+'</li>'; }).join('')
     + '</ul></div></div>';

  h += '<div class="tabpane '+(curTab===1?'on':'')+'"><div class="card pad">'
     + ((ch.concepts||[]).length ? (ch.concepts||[]).map(function(c){
         return '<div class="concept"><b>'+esc(c.t)+'</b><p>'+esc(c.d)+'</p></div>'; }).join('')
       : emptyMsg('No concept notes for this chapter yet.'))
     + '</div></div>';

  h += '<div class="tabpane '+(curTab===2?'on':'')+'"><div class="card pad">'
     + ((ch.formulas||[]).length ? (ch.formulas||[]).map(function(f){
         return '<div class="fml"><code>'+esc(f.f)+'</code><span>'+esc(f.m)+'</span></div>'; }).join('')
       : emptyMsg('No formula sheet for this chapter.'))
     + '</div></div>';

  h += '<div class="tabpane '+(curTab===3?'on':'')+'">'
     + ((ch.questions||[]).length ? (ch.questions||[]).map(function(q){
         return '<details class="qa"><summary><span class="mk">'+q.marks+'</span><span>'+esc(q.q)+'</span></summary>'
              + '<div class="ans">'+esc(q.a)+'</div></details>'; }).join('')
       : '<div class="card pad">'+emptyMsg('No model answers here yet.')+'</div>')
     + '</div>';

  h += '<div class="tabpane '+(curTab===4?'on':'')+'"><div class="card pad"><ul class="miss">'
     + (ch.mistakes||[]).map(function(m){ return '<li>'+esc(m)+'</li>'; }).join('')
     + '</ul></div></div>';

  $('#v-chapter').innerHTML = h;
  $('#bk').onclick = function(){ go('course',{sub:curSub}); };
  $('#mk').onclick = function(){ toggleDone(ch.id); render(); };
  $$('#v-chapter .tabs button').forEach(function(b){
    b.onclick = function(){ curTab = +b.dataset.t; render(); };
  });
}
function emptyMsg(t){ return '<div class="dim" style="padding:8px 0">'+esc(t)+'</div>'; }

function askQ(q){
  go('ask');
  var box = $('#askq'); box.value = q; doAsk();
}
function renderAsk(){
  if($('#askq')) { doAsk(); return; }
  var h = '<div class="searchwrap"><span class="mag">🔍</span>'
    + '<input id="askq" placeholder="Type a question, a topic or a formula…" autocomplete="off"><kbd>/</kbd></div>'
    + '<div class="chips" id="askfilt">'
    + '<button class="chip on" data-f="">Everything</button>'
    + ORDER.filter(function(k){return S[k];}).map(function(k){
        return '<button class="chip" data-f="'+k+'">'+S[k].icon+' '+esc(S[k].name)+'</button>'; }).join('')
    + '</div><div id="askres" style="margin-top:18px"></div>';
  $('#v-ask').innerHTML = h;
  var box = $('#askq');
  box.addEventListener('input', doAsk);
  $$('#askfilt .chip').forEach(function(b){
    b.onclick = function(){
      askFilter = b.dataset.f;
      $$('#askfilt .chip').forEach(function(x){ x.classList.toggle('on', x===b); });
      doAsk();
    };
  });
  setTimeout(function(){ box.focus(); }, 30);
  doAsk();
}
function doAsk(){
  var q = $('#askq').value.trim(), out = $('#askres');
  if(q.length < 2){
    out.innerHTML = '<div class="empty"><div class="big">💡</div>'
      + '<div>Ask in your own words — "why is the sky blue", "derive lens maker formula", '
      + '"what is 3n endosperm", "Lady Macbeth character".</div></div>';
    return;
  }
  var res = search(q, askFilter, null);
  if(!res.length){
    out.innerHTML = '<div class="empty"><div class="big">🤔</div><div>Nothing matched "'+esc(q)+'".<br>'
      + 'Try fewer or simpler words — or a keyword from the chapter name.</div></div>';
    return;
  }
  out.innerHTML = '<div class="dim" style="margin-bottom:11px">'+res.length+' result'+(res.length>1?'s':'')+'</div>'
    + res.map(function(it, i){
      var body = it.text ? '<p>'+hl(trim(it.text, 400), q)+'</p>' : '';
      return '<div class="hit">'
        + '<div class="crumb"><span>'+it.icon+'</span><span>'+esc(it.subName)+'</span>·<span>Class '+it.cls+'</span>·'
        + '<span>'+esc(it.chName)+'</span><span class="pill">'+esc(it.kind)+'</span></div>'
        + '<h4>'+hl(it.title, q)+'</h4>'+body
        + '<button class="go" data-i="'+i+'">Open chapter →</button></div>';
    }).join('');
  $$('#askres .go').forEach(function(b){
    b.onclick = function(){
      var it = res[+b.dataset.i];
      state.cls = +it.cls; save();
      go('chapter', {sub:it.sub, ch:it.ch, tab:it.tab});
    };
  });
}
function trim(s,n){ return s.length>n ? s.slice(0,n).replace(/\s\S*$/,'')+'…' : s; }

/* ---------- flashcards ---------- */
var deck = [], di = 0, flipped = false;
function buildDeck(){
  deck = INDEX.filter(function(i){
    return (i.kind==='Concept' || i.kind==='Formula / key fact')
      && String(i.cls)===String(state.cls)
      && (!curSub || i.sub===curSub) && i.text;
  });
  for(var i=deck.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=deck[i];deck[i]=deck[j];deck[j]=t; }
  di = 0; flipped = false;
}
function renderRevise(){
  var h = '<div class="chips" style="margin-bottom:12px">'
    + '<button class="chip '+(!curSub?'on':'')+'" data-r="">All subjects</button>'
    + ORDER.filter(function(k){return S[k];}).map(function(k){
        return '<button class="chip '+(curSub===k?'on':'')+'" data-r="'+k+'">'+S[k].icon+' '+esc(S[k].name)+'</button>'; }).join('')
    + '</div>' + clsToggleHTML();
  if(!deck.length) buildDeck();
  if(!deck.length){ $('#v-revise').innerHTML = h + '<div class="empty">No cards for this selection.</div>'; wireRevise(); return; }
  var c = deck[di % deck.length];
  h += '<div style="margin-top:16px" class="fcard" id="fc">'
     + '<div class="q">'+esc(c.title)+'</div>'
     + (flipped ? '<div class="a">'+esc(c.text)+'</div>'
                : '<div class="hint">tap the card to reveal</div>')
     + (flipped ? '<div class="hint">'+esc(c.subName)+' · '+esc(c.chName)+'</div>' : '')
     + '</div>';
  h += '<div class="row" style="margin-top:14px;justify-content:space-between">'
     + '<span class="dim">Card '+((di%deck.length)+1)+' of '+deck.length+'</span>'
     + '<div class="row"><button class="chip" id="shuf">↻ Shuffle</button>'
     + '<button class="chip" id="nx">Next →</button></div></div>';
  $('#v-revise').innerHTML = h;
  wireRevise();
  var fc = $('#fc'); if(fc) fc.onclick = function(){ flipped = !flipped; renderRevise(); };
  var nx = $('#nx'); if(nx) nx.onclick = function(){ di++; flipped = false; renderRevise(); };
  var sh = $('#shuf'); if(sh) sh.onclick = function(){ buildDeck(); renderRevise(); };
}
function wireRevise(){
  $$('#v-revise .chip[data-r]').forEach(function(b){
    b.onclick = function(){ curSub = b.dataset.r || null; buildDeck(); renderRevise(); };
  });
  $$('#v-revise #clschips .chip').forEach(function(b){
    b.onclick = function(){ state.cls = +b.dataset.cls; save(); buildDeck(); renderRevise(); };
  });
}

/* ---------- planner ---------- */
function daysToExam(){
  if(!state.exam) return null;
  var d = Math.ceil((new Date(state.exam+'T00:00:00') - new Date())/86400000);
  return isNaN(d) ? null : d;
}
function renderPlan(){
  var cls = state.cls, chs = allChapters(cls);
  var pend = chs.filter(function(x){ return !state.done[x.ch.id]; });
  var days = daysToExam();
  var h = '<div class="card pad" style="margin-bottom:18px">'
    + '<div class="sec-title" style="margin-top:0">Exam date</div>'
    + '<div class="row"><input type="date" id="exd" value="'+esc(state.exam||'')+'" '
    + 'style="padding:9px 12px;border-radius:9px;border:1px solid var(--line);background:var(--panel-2);color:var(--ink)">'
    + (days!==null ? '<span class="pill acc">'+days+' days to go</span>' : '<span class="dim">Set it to get a revision plan</span>')
    + '</div></div>';

  h += clsToggleHTML();
  h += '<div class="sec-title">What is left — Class '+cls+'</div>';
  if(!pend.length){
    h += '<div class="empty"><div class="big">🎉</div><div>Every chapter is marked done. Time to revise with flashcards and past papers.</div></div>';
  } else if(days===null){
    h += '<div class="note">'+pend.length+' chapters still to cover. Add your exam date above and this becomes a week-by-week plan.</div>';
  } else if(days<=0){
    h += '<div class="note">Exam day is here or past. Use Revise for a fast last pass.</div>';
  } else {
    var perWeek = Math.max(1, Math.ceil(pend.length / Math.max(1, Math.floor(days/7))));
    h += '<div class="note" style="margin-bottom:14px">'+pend.length+' chapters in '+days+' days — about <b>'
       + perWeek+' chapters a week</b>. The plan below rotates subjects so nothing is left to the end.</div>';
    var mixed = [];                       // interleave subjects rather than block them
    var bySub = {};
    pend.forEach(function(x){ (bySub[x.sub] = bySub[x.sub] || []).push(x); });
    var keys = Object.keys(bySub), more = true;
    while(more){ more = false;
      keys.forEach(function(k){ if(bySub[k].length){ mixed.push(bySub[k].shift()); more = true; } });
    }
    h += '<div class="card" style="overflow-x:auto"><table class="plan"><tr><th>Week</th><th>Chapters</th></tr>';
    for(var w=0; w*perWeek < mixed.length; w++){
      var slice = mixed.slice(w*perWeek, (w+1)*perWeek);
      var dt = new Date(); dt.setDate(dt.getDate() + w*7);
      h += '<tr><td style="white-space:nowrap"><b>Week '+(w+1)+'</b><br><span class="dim">from '
         + dt.toLocaleDateString('en-IN',{day:'numeric',month:'short'})+'</span></td><td>'
         + slice.map(function(x){
             return '<div style="margin-bottom:4px">'+S[x.sub].icon+' <b>'+esc(x.ch.name)+'</b> '
                  + '<span class="dim">'+esc(S[x.sub].name)+'</span></div>'; }).join('')
         + '</td></tr>';
    }
    h += '</table></div>';
  }
  h += '<div class="foot">Marking a chapter done anywhere in the app updates this plan automatically.</div>';
  $('#v-plan').innerHTML = h;
  $('#exd').onchange = function(){ state.exam = this.value; save(); render(); };
  $$('#v-plan #clschips .chip').forEach(function(b){
    b.onclick = function(){ state.cls = +b.dataset.cls; save(); render(); };
  });
}

/* ---------- theme ---------- */
function isDark(){
  var c = document.documentElement.getAttribute('data-theme');
  return c ? c==='dark' : window.matchMedia('(prefers-color-scheme:dark)').matches;
}
function applyTheme(){
  if(state.theme) document.documentElement.setAttribute('data-theme', state.theme);
  else document.documentElement.removeAttribute('data-theme');
  var b = $('#themeBtn'); if(b) b.textContent = isDark() ? '\u2600' : '\u263D';
}

/* ---------- boot ---------- */
function boot(){
  buildIndex();
  applyTheme();
  $$('.nav button').forEach(function(b){
    b.onclick = function(){ if(b.dataset.v==='revise') buildDeck(); go(b.dataset.v); };
  });
  $('#themeBtn').onclick = function(){
    state.theme = isDark() ? 'light' : 'dark'; save(); applyTheme();
  };
  document.addEventListener('keydown', function(e){
    if(e.key==='/' && !/input|textarea/i.test(e.target.tagName)){
      e.preventDefault();
      if(view==='home'){ $('#homeq').focus(); } else { go('ask'); }
    }
    if(e.key==='Escape' && view==='chapter') go('course',{sub:curSub});
    if(view==='revise'){
      if(e.key===' '){ e.preventDefault(); flipped = !flipped; renderRevise(); }
      if(e.key==='ArrowRight'){ di++; flipped=false; renderRevise(); }
    }
  });
  go('home');
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
