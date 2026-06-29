import { useState, useEffect, useRef, useCallback } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { BookOpen, FileText, Bell, BarChart3, Plus, Trash2, Send, User, GraduationCap, LogOut, Sparkles, CheckCircle, XCircle, Loader2, Megaphone, Lock, Clock, UserCheck, UserX, BookMarked, Edit3, ExternalLink, ChevronDown, ChevronUp, Download, BookText } from "lucide-react";

const DRIVE = "https://drive.google.com/drive/folders/1OL0qtkASaU_sj-VM0T79qXlef07zEseZ?usp=drive_link";
const DEFAULT_TB = [
  {id:"s0",title:"세종학당 한국어 입문 / Sejong Korean Intro",sl:"입문",lv:"beginner",desc:"한국어를 처음 시작하는 학생을 위한 입문 교재\nFor absolute beginners",ko:DRIVE,en:DRIVE},
  {id:"s1",title:"세종학당 한국어 1 / Sejong 1",sl:"1",lv:"beginner",desc:"기초 문법과 어휘를 다지는 1단계\nFoundational grammar & vocabulary",ko:DRIVE,en:DRIVE},
  {id:"s2",title:"세종학당 한국어 2 / Sejong 2",sl:"2",lv:"beginner",desc:"실생활 표현과 회화를 익히는 2단계\nEveryday expressions & conversations",ko:DRIVE,en:""},
  {id:"s3",title:"세종학당 한국어 3A / Sejong 3A",sl:"3A",lv:"intermediate",desc:"중급으로 도약하는 3A 교재\nStepping into intermediate level",ko:DRIVE,en:""},
];
const LV = {beginner:{b:"bg-emerald-100 text-emerald-700",e:"🌱",n:"초급"},intermediate:{b:"bg-amber-100 text-amber-700",e:"⭐",n:"중급"},advanced:{b:"bg-rose-100 text-rose-700",e:"🏆",n:"고급"}};
const TEACHER_PASSWORD = process.env.REACT_APP_TEACHER_PASSWORD || "may2024";

// Firestore helpers
const fget = async (key) => {
  try { const d = await getDoc(doc(db,"data",key)); return d.exists()?d.data().value:null; } catch { return null; }
};
const fset = async (key, val) => {
  try { await setDoc(doc(db,"data",key),{value:val}); } catch(e) { console.error(e); }
};

const normStudents = a => Array.isArray(a)?a.map(s=>typeof s==="string"?{name:s,status:"approved",requestedAt:null}:s):[];
const LvBadge = ({lv}) => { const l=LV[lv]||LV.beginner; return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.b}`}>{l.e} {l.n}</span>; };
const Empty = ({ko,en}) => <div className="bg-white rounded-xl p-8 text-center text-slate-400 border border-dashed border-slate-300"><p>{ko}</p><p className="text-xs italic mt-1">{en}</p></div>;
const SectionTitle = ({ko,en}) => <h2 className="text-lg font-bold text-slate-800 mb-3">{ko} <span className="text-sm text-slate-400 font-normal">/ {en}</span></h2>;

const Hdr = ({user,onLogout,tc}) => (
  <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
    <div className="max-w-2xl mx-auto px-3 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 bg-gradient-to-br ${tc?"from-purple-500 to-pink-600":"from-indigo-500 to-purple-600"} rounded-xl flex items-center justify-center`}><BookOpen className="w-4 h-4 text-white"/></div>
        <div><div className="font-bold text-slate-800 text-sm">May's Korean Class</div><div className="text-xs text-slate-500">{tc?"선생님":"학생"} · {user.name}</div></div>
      </div>
      <button onClick={onLogout} className="text-slate-500 hover:text-slate-700 p-1"><LogOut className="w-4 h-4"/></button>
    </div>
  </div>
);

const Tabs = ({tabs,active,setActive}) => (
  <div className="bg-white border-b border-slate-100 sticky top-[57px] z-10">
    <div className="max-w-2xl mx-auto flex overflow-x-auto">
      {tabs.map(([id,Icon,ko])=>(
        <button key={id} onClick={()=>setActive(id)} className={`flex-1 min-w-0 flex flex-col items-center gap-0.5 py-2 px-1 text-[11px] font-medium border-b-2 transition ${active===id?"border-indigo-500 text-indigo-600":"border-transparent text-slate-500"}`}>
          <Icon className="w-4 h-4"/>{ko}
        </button>
      ))}
    </div>
  </div>
);

const Wrap = ({children}) => <div className="max-w-2xl mx-auto px-3 py-4">{children}</div>;

export default function App() {
  const [view,setView]=useState("loading");
  const [user,setUser]=useState(null);
  const [data,setData]=useState({mat:[],tb:DEFAULT_TB,voc:[],ann:[],stu:[]});

  useEffect(()=>{
    (async()=>{
      const mat=await fget("materials")||[];
      const tb=await fget("textbooks")||DEFAULT_TB;
      const voc=await fget("vocab")||[];
      const ann=await fget("announcements")||[];
      const stuRaw=await fget("students")||[];
      setData({mat,tb,voc,ann,stu:normStudents(stuRaw)});
      setView("login");
    })();
  },[]);

  // Real-time listener for students (for pending approval)
  useEffect(()=>{
    if(view!=="pending") return;
    const unsub = onSnapshot(doc(db,"data","students"),(snap)=>{
      if(snap.exists()){
        const list=normStudents(snap.data().value);
        setData(d=>({...d,stu:list}));
      }
    });
    return ()=>unsub();
  },[view]);

  const save = useCallback(async (key,val)=>{
    const keyMap={mat:"materials",tb:"textbooks",voc:"vocab",ann:"announcements",stu:"students"};
    await fset(keyMap[key],val);
    setData(d=>({...d,[key]:val}));
  },[]);

  const login = async (name,role,code) => {
    if(role==="teacher"){
      if(code!==TEACHER_PASSWORD) return {error:"선생님 코드가 틀렸습니다. / Wrong teacher code."};
      setUser({name,role}); setView("teacher"); return {ok:true};
    }
    const latest=normStudents(await fget("students")||[]);
    const ex=latest.find(s=>s.name===name);
    if(ex){
      if(ex.status==="approved"){setUser({name,role});setView("student");return{ok:true};}
      if(ex.status==="pending"){setUser({name,role});setView("pending");return{ok:true};}
      if(ex.status==="rejected") return{error:"접속이 거절되었습니다. May 선생님께 문의하세요.\nAccess denied. Please contact May."};
    }
    const newStu=[...latest,{name,status:"pending",requestedAt:new Date().toISOString()}];
    await fset("students",newStu);
    setData(d=>({...d,stu:newStu}));
    setUser({name,role}); setView("pending"); return{ok:true};
  };

  const logout=()=>{setUser(null);setView("login");};

  if(view==="loading") return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin"/></div>;
  if(view==="login") return <LoginScreen onLogin={login}/>;
  if(view==="pending") return <PendingScreen user={user} data={data} onApproved={()=>setView("student")} onRejected={()=>{setUser(null);setView("login");}} onCancel={()=>{setUser(null);setView("login");}}/>;
  if(view==="teacher") return <TeacherApp user={user} data={data} save={save} onLogout={logout}/>;
  return <StudentApp user={user} data={data} onLogout={logout}/>;
}

function LoginScreen({onLogin}){
  const [n,setN]=useState("");const [role,setRole]=useState("student");const [code,setCode]=useState("");const [err,setErr]=useState("");const [loading,setLoading]=useState(false);
  const go=async()=>{
    if(!n.trim()){setErr("이름을 입력해주세요. / Enter your name.");return;}
    if(role==="teacher"&&!code.trim()){setErr("코드를 입력해주세요.");return;}
    setLoading(true);setErr("");
    const r=await onLogin(n.trim(),role,code.trim());
    if(r.error)setErr(r.error);
    setLoading(false);
  };
  return(
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <div className="text-center mb-6">
<div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"><BookOpen className="w-7 h-7 text-white"/></div>
            <h1 className="text-2xl font-bold text-slate-800">Korean Class</h1>
            <p className="text-slate-600 text-sm mt-2">✨ 함께하는 한국어 학습 공간 ✨</p>
            <p className="text-xs text-slate-400 italic">A cozy Korean learning space</p>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {[["student","학생","Student",User],["teacher","선생님","Teacher",GraduationCap]].map(([r,ko,en,Icon])=>(
              <button key={r} onClick={()=>setRole(r)} className={`p-3 rounded-xl border-2 transition flex flex-col items-center gap-1 ${role===r?(r==="student"?"border-indigo-500 bg-indigo-50 text-indigo-700":"border-purple-500 bg-purple-50 text-purple-700"):"border-slate-200 text-slate-600"}`}>
                <Icon className="w-5 h-5"/><span className="text-sm font-medium">{ko}</span><span className="text-xs opacity-70">{en}</span>
              </button>
            ))}
          </div>
          <input type="text" value={n} onChange={e=>setN(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="이름 / Your name" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-400 focus:outline-none text-sm"/>
          {role==="student"&&<p className="text-xs text-slate-400 italic">ℹ️ 첫 접속은 May 선생님 승인 필요 / First access needs approval</p>}
          {role==="teacher"&&<input type="password" value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="선생님 코드 / Teacher code" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:outline-none text-sm"/>}
          {err&&<div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2 whitespace-pre-wrap">{err}</div>}
          <button onClick={go} disabled={loading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-3 rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2">
            {loading&&<Loader2 className="w-4 h-4 animate-spin"/>}시작하기 / Start
          </button>
        </div>
      </div>
    </div>
  );
}

function PendingScreen({user,data,onApproved,onRejected,onCancel}){
  const [dots,setDots]=useState("");
  useEffect(()=>{const iv=setInterval(()=>setDots(d=>d.length>=3?"":d+"."),500);return()=>clearInterval(iv);},[]);
  const me=data.stu.find(s=>s.name===user?.name);
  useEffect(()=>{
    if(me?.status==="approved") onApproved();
    if(me?.status==="rejected") onRejected();
  },[me?.status]);
  return(
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">승인 대기 중{dots}</h2>
        <p className="text-sm text-slate-500 italic mb-4">Waiting for May's approval{dots}</p>
        <p className="text-sm text-slate-600 mb-6 bg-amber-50 border border-amber-200 rounded-xl p-3">승인되면 자동으로 입장됩니다.<br/><span className="italic text-xs">You'll enter automatically once approved.</span></p>
        <button onClick={onCancel} className="text-sm text-slate-400 underline">취소 / Cancel</button>
      </div>
    </div>
  );
}

function TeacherApp({user,data,save,onLogout}){
  const [tab,setTab]=useState("students");
  const pending=data.stu.filter(s=>s.status==="pending").length;
  const tabs=[["students",BarChart3,`학생${pending>0?`(${pending})`:""}` ],["mat",FileText,"학습자료"],["tb",BookMarked,"수업교재"],["voc",BookText,"단어장"],["ann",Megaphone,"공지"]];
  return(
    <div className="min-h-screen bg-slate-50">
      <Hdr user={user} onLogout={onLogout} tc/>
      <Tabs tabs={tabs} active={tab} setActive={setTab}/>
      <Wrap>
        {tab==="students"&&<TeacherStudents data={data} save={save}/>}
        {tab==="mat"&&<TeacherMat data={data} save={save}/>}
        {tab==="tb"&&<TeacherTB data={data} save={save}/>}
        {tab==="voc"&&<TeacherVoc data={data} save={save}/>}
        {tab==="ann"&&<TeacherAnn data={data} save={save}/>}
      </Wrap>
    </div>
  );
}

function StudentApp({user,data,onLogout}){
  const [tab,setTab]=useState("ann");
  const tabs=[["ann",Bell,"공지"],["mat",FileText,"학습자료"],["tb",BookMarked,"수업교재"],["voc",BookText,"단어장"],["ai",Sparkles,"AI도우미"]];
  return(
    <div className="min-h-screen bg-slate-50">
      <Hdr user={user} onLogout={onLogout} tc={false}/>
      <Tabs tabs={tabs} active={tab} setActive={setTab}/>
      <Wrap>
        {tab==="ann"&&<StudentAnn ann={data.ann}/>}
        {tab==="mat"&&<StudentMat mat={data.mat}/>}
        {tab==="tb"&&<StudentTB tb={data.tb}/>}
        {tab==="voc"&&<StudentVoc voc={data.voc}/>}
        {tab==="ai"&&<AITutor/>}
      </Wrap>
    </div>
  );
}

function TeacherStudents({data,save}){
  const [del,setDel]=useState(null);
  const stu=data.stu;
  const upd=async(name,status)=>{const u=stu.map(s=>s.name===name?{...s,status}:s);await save("stu",u);};
  const doDelete=async()=>{await save("stu",stu.filter(s=>s.name!==del));setDel(null);};
  const pending=stu.filter(s=>s.status==="pending");
  const approved=stu.filter(s=>s.status==="approved");
  const rejected=stu.filter(s=>s.status==="rejected");
  return(
    <div>
      <SectionTitle ko="학생 관리" en="Students"/>
      {pending.length>0&&<div className="mb-4">
        <div className="flex items-center gap-2 mb-2"><span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">NEW</span><span className="font-bold text-sm text-slate-700">승인 대기 ({pending.length})</span></div>
        {pending.map(s=>(
          <div key={s.name} className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 mb-2">
            <div className="font-bold text-slate-800 mb-2">{s.name}</div>
            <div className="flex gap-2">
              <button onClick={()=>upd(s.name,"approved")} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"><UserCheck className="w-4 h-4"/>승인</button>
              <button onClick={()=>upd(s.name,"rejected")} className="flex-1 bg-white border border-red-300 text-red-600 py-2 rounded-lg text-sm flex items-center justify-center gap-1"><UserX className="w-4 h-4"/>거절</button>
            </div>
          </div>
        ))}
      </div>}
      <div className="mb-3 font-bold text-sm text-slate-700">승인됨 ({approved.length})</div>
      {approved.length===0?<Empty ko="아직 없어요" en="No approved students"/>:approved.map(s=>(
        <div key={s.name} className="bg-white rounded-xl p-3 mb-2 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">{s.name[0]}</div><span className="font-medium text-slate-800">{s.name}</span></div>
          <button onClick={()=>setDel(s.name)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4"/></button>
        </div>
      ))}
      {rejected.length>0&&<><div className="mt-4 mb-2 font-bold text-sm text-slate-500">거절됨 ({rejected.length})</div>
        {rejected.map(s=>(
          <div key={s.name} className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-500">{s.name}</span>
            <div className="flex gap-3"><button onClick={()=>upd(s.name,"approved")} className="text-xs text-green-600">승인으로 변경</button><button onClick={()=>setDel(s.name)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5"/></button></div>
          </div>
        ))}
      </>}
      {del&&<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setDel(null)}>
        <div className="bg-white rounded-2xl p-6 w-full max-w-xs text-center" onClick={e=>e.stopPropagation()}>
          <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3"/>
          <p className="font-bold text-slate-800 mb-1">삭제할까요?</p>
          <p className="text-sm font-bold text-indigo-600 mb-4">{del}</p>
          <div className="flex gap-2"><button onClick={()=>setDel(null)} className="flex-1 bg-slate-100 py-2 rounded-lg text-sm">취소</button><button onClick={doDelete} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm">삭제</button></div>
        </div>
      </div>}
    </div>
  );
}

function TeacherMat({data,save}){
  const mat=data.mat;
  const [form,setForm]=useState(null);
  const [open,setOpen]=useState(null);
  const E={id:null,title:"",content:"",link:""};
  const upd=f=>setForm(p=>({...p,...f}));
  const saveForm=async()=>{
    if(!form.title.trim()||!form.content.trim())return;
    const u=form.id?mat.map(m=>m.id===form.id?{...m,...form}:m):[{id:Date.now()+"",createdAt:new Date().toISOString(),...form},...mat];
    await save("mat",u);setForm(null);
  };
  const del=async id=>{await save("mat",mat.filter(m=>m.id!==id));};
  return(
    <div>
      <div className="flex justify-between items-center mb-3">
        <SectionTitle ko="학습 자료" en="Materials"/>
        {!form&&<button onClick={()=>setForm(E)} className="bg-purple-500 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/>추가</button>}
      </div>
      {form&&<div className="bg-white rounded-xl p-4 mb-3 border-2 border-purple-200 space-y-2">
        <div className="text-xs font-bold text-purple-600">{form.id?"✏️ 수정":"➕ 새 자료"}</div>
        <input placeholder="제목 / Title" value={form.title} onChange={e=>upd({title:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-purple-400 focus:outline-none"/>
        <textarea placeholder="내용 / Content" value={form.content} onChange={e=>upd({content:e.target.value})} rows={5} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-purple-400 focus:outline-none"/>
        <input placeholder="링크 (선택) / Link" value={form.link} onChange={e=>upd({link:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-purple-400 focus:outline-none"/>
        <div className="flex gap-2"><button onClick={saveForm} className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm">저장</button><button onClick={()=>setForm(null)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm">취소</button></div>
      </div>}
      {mat.length===0&&!form?<Empty ko="자료가 없습니다" en="No materials yet"/>:mat.filter(m=>m.id!==form?.id).map(m=>(
        <div key={m.id} className="bg-white rounded-xl mb-2 border border-slate-200">
          <div className="flex items-center px-3 py-3">
            <button onClick={()=>setOpen(open===m.id?null:m.id)} className="flex-1 flex items-center gap-2 text-left min-w-0">
              <span className="font-medium text-slate-800 text-sm truncate">{m.title}</span>
              {open===m.id?<ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0"/>:<ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0"/>}
            </button>
            <div className="flex gap-1 ml-2">
              <button onClick={()=>setForm({id:m.id,title:m.title,content:m.content,link:m.link||""})} className="text-slate-400 hover:text-indigo-500 p-1.5 rounded-lg"><Edit3 className="w-4 h-4"/></button>
              <button onClick={()=>del(m.id)} className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
          {open===m.id&&<div className="px-3 pb-3 border-t border-slate-100 pt-3"><p className="text-sm text-slate-600 whitespace-pre-wrap">{m.content}</p>{m.link&&<a href={m.link} target="_blank" rel="noopener noreferrer" className="text-indigo-500 text-sm mt-2 inline-block">🔗 링크</a>}</div>}
        </div>
      ))}
    </div>
  );
}

function TeacherTB({data,save}){
  const tb=data.tb;
  const E={id:null,title:"",sl:"",lv:"beginner",desc:"",ko:"",en:""};
  const [form,setForm]=useState(null);
  const upd=f=>setForm(p=>({...p,...f}));
  const saveForm=async()=>{
    if(!form.title.trim())return;
    const u=form.id?tb.map(t=>t.id===form.id?{...form}:t):[...tb,{...form,id:"tb"+Date.now()}];
    await save("tb",u);setForm(null);
  };
  const del=async id=>{await save("tb",tb.filter(t=>t.id!==id));};
  return(
    <div>
      <div className="flex justify-between items-center mb-3">
        <SectionTitle ko="수업교재" en="Textbooks"/>
        {!form&&<button onClick={()=>setForm(E)} className="bg-purple-500 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/>추가</button>}
      </div>
      {form&&<div className="bg-white rounded-xl p-4 mb-3 border-2 border-purple-200 space-y-2">
        <div className="text-xs font-bold text-purple-600">{form.id?"✏️ 수정":"➕ 새 교재"}</div>
        <input placeholder="제목 / Title" value={form.title} onChange={e=>upd({title:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-purple-400"/>
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="세종 단계 (입문/1/2...)" value={form.sl} onChange={e=>upd({sl:e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none"/>
          <select value={form.lv} onChange={e=>upd({lv:e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none">
            <option value="beginner">🌱 초급</option><option value="intermediate">⭐ 중급</option><option value="advanced">🏆 고급</option>
          </select>
        </div>
        <textarea placeholder="설명 / Description" value={form.desc} onChange={e=>upd({desc:e.target.value})} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none"/>
        <input placeholder="🇰🇷 한국어판 Google Drive URL" value={form.ko} onChange={e=>upd({ko:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none"/>
        <input placeholder="🇺🇸 English URL (선택)" value={form.en} onChange={e=>upd({en:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none"/>
        <div className="flex gap-2"><button onClick={saveForm} className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm">저장</button><button onClick={()=>setForm(null)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm">취소</button></div>
      </div>}
      {tb.filter(t=>t.id!==form?.id).map(t=>(
        <div key={t.id} className="bg-white rounded-xl p-4 mb-2 border border-slate-200">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 flex-wrap mb-1"><LvBadge lv={t.lv}/>{t.sl&&<span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Sejong {t.sl}</span>}</div>
              <p className="font-bold text-slate-800 text-sm">{t.title}</p>
              {t.desc&&<p className="text-xs text-slate-500 mt-1 whitespace-pre-wrap">{t.desc}</p>}
              <div className="flex gap-3 mt-2">
                {t.ko&&<a href={t.ko} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 flex items-center gap-1">🇰🇷 한국어판<ExternalLink className="w-3 h-3"/></a>}
                {t.en&&<a href={t.en} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 flex items-center gap-1">🇺🇸 English<ExternalLink className="w-3 h-3"/></a>}
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={()=>setForm({id:t.id,title:t.title,sl:t.sl,lv:t.lv,desc:t.desc,ko:t.ko,en:t.en})} className="text-slate-400 hover:text-indigo-500 p-1.5 rounded-lg"><Edit3 className="w-4 h-4"/></button>
              <button onClick={()=>del(t.id)} className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeacherVoc({data,save}){
  const voc=data.voc;
  const [form,setForm]=useState(null);
  const [rows,setRows]=useState([{word:"",meaning:""}]);
  const openAdd=()=>{setForm({id:null,name:""});setRows([{word:"",meaning:""}]);};
  const openEdit=s=>{setForm({id:s.id,name:s.name});setRows([...s.words.map(w=>({...w})),{word:"",meaning:""}]);};
  const updRow=(i,f,v)=>{const r=[...rows];r[i][f]=v;setRows(r);};
  const saveForm=async()=>{
    if(!form.name.trim())return;
    const words=rows.filter(r=>r.word.trim()&&r.meaning.trim());
    if(!words.length)return;
    const entry={id:form.id||Date.now()+"",name:form.name.trim(),words,createdAt:form.id?voc.find(v=>v.id===form.id)?.createdAt:new Date().toISOString()};
    const u=form.id?voc.map(v=>v.id===form.id?entry:v):[entry,...voc];
    await save("voc",u);setForm(null);
  };
  const del=async id=>{await save("voc",voc.filter(v=>v.id!==id));};
  return(
    <div>
      <div className="flex justify-between items-center mb-3">
        <SectionTitle ko="단어장" en="Vocabulary"/>
        {!form&&<button onClick={openAdd} className="bg-purple-500 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/>만들기</button>}
      </div>
      {form&&<div className="bg-white rounded-xl p-4 mb-3 border-2 border-purple-200 space-y-2">
        <div className="text-xs font-bold text-purple-600">{form.id?"✏️ 수정":"➕ 새 단어장"}</div>
        <input placeholder="단어장 이름 / Set name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-purple-400 focus:outline-none font-medium"/>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-[28px_1fr_1fr_28px] bg-slate-50 text-xs text-slate-500 px-2 py-2 gap-1"><span>#</span><span>단어</span><span>뜻 (English)</span><span></span></div>
          {rows.map((r,i)=>(
            <div key={i} className="grid grid-cols-[28px_1fr_1fr_28px] gap-1 px-2 py-1 border-t border-slate-100 items-center">
              <span className="text-xs text-slate-400">{i+1}</span>
              <input value={r.word} onChange={e=>updRow(i,"word",e.target.value)} placeholder="단어" className="px-2 py-1 rounded border border-slate-200 text-sm focus:outline-none focus:border-purple-400"/>
              <input value={r.meaning} onChange={e=>updRow(i,"meaning",e.target.value)} placeholder="meaning" className="px-2 py-1 rounded border border-slate-200 text-sm focus:outline-none focus:border-purple-400"/>
              <button onClick={()=>rows.length>1&&setRows(rows.filter((_,j)=>j!==i))} className="text-slate-300 hover:text-red-400 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5"/></button>
            </div>
          ))}
        </div>
        <button onClick={()=>setRows([...rows,{word:"",meaning:""}])} className="text-purple-600 text-sm hover:underline">+ 단어 추가</button>
        <div className="flex gap-2"><button onClick={saveForm} className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm">저장</button><button onClick={()=>setForm(null)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm">취소</button></div>
      </div>}
      {voc.length===0&&!form?<Empty ko="단어장이 없습니다" en="No vocabulary sets yet"/>:voc.map(s=>(
        <div key={s.id} className="bg-white rounded-xl p-4 mb-2 border border-slate-200 flex justify-between items-center">
          <div><p className="font-bold text-slate-800">{s.name}</p><p className="text-xs text-slate-500">{s.words.length}개 단어</p></div>
          <div className="flex gap-1"><button onClick={()=>openEdit(s)} className="text-slate-400 hover:text-indigo-500 p-1.5 rounded-lg"><Edit3 className="w-4 h-4"/></button><button onClick={()=>del(s.id)} className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg"><Trash2 className="w-4 h-4"/></button></div>
        </div>
      ))}
    </div>
  );
}

function TeacherAnn({data,save}){
  const ann=data.ann;const[text,setText]=useState("");
  const post=async()=>{if(!text.trim())return;await save("ann",[{id:Date.now()+"",text:text.trim(),createdAt:new Date().toISOString()},...ann]);setText("");};
  const del=async id=>{await save("ann",ann.filter(a=>a.id!==id));};
  return(
    <div>
      <SectionTitle ko="공지사항" en="Announcements"/>
      <div className="bg-white rounded-xl p-4 mb-3 border border-slate-200 space-y-2">
        <textarea placeholder="학생들에게 공지할 내용..." value={text} onChange={e=>setText(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-purple-400 focus:outline-none"/>
        <button onClick={post} className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"><Megaphone className="w-4 h-4"/>공지 올리기</button>
      </div>
      {ann.length===0?<Empty ko="아직 공지가 없습니다" en="No announcements yet"/>:ann.map(a=>(
        <div key={a.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-2">
          <div className="flex justify-between gap-2"><p className="text-sm text-slate-700 whitespace-pre-wrap flex-1">{a.text}</p><button onClick={()=>del(a.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button></div>
          <p className="text-xs text-slate-400 mt-2">{new Date(a.createdAt).toLocaleString("ko-KR")}</p>
        </div>
      ))}
    </div>
  );
}

function StudentAnn({ann}){
  return(<div><SectionTitle ko="📢 공지사항" en="Announcements"/>
    {ann.length===0?<Empty ko="공지가 없습니다" en="No announcements yet"/>:ann.map(a=>(
      <div key={a.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-2">
        <p className="text-sm text-slate-700 whitespace-pre-wrap">{a.text}</p>
        <p className="text-xs text-slate-400 mt-2">{new Date(a.createdAt).toLocaleString("ko-KR")}</p>
      </div>
    ))}
  </div>);
}

function StudentMat({mat}){
  const [open,setOpen]=useState(null);
  return(<div><SectionTitle ko="📚 학습 자료" en="Materials"/>
    {mat.length===0?<Empty ko="자료가 없습니다" en="No materials yet"/>:mat.map(m=>(
      <div key={m.id} className="bg-white rounded-xl mb-2 border border-slate-200">
        <button onClick={()=>setOpen(open===m.id?null:m.id)} className="w-full flex items-center justify-between px-4 py-3 text-left">
          <span className="font-medium text-slate-800 text-sm flex-1 min-w-0 truncate">{m.title}</span>
          {open===m.id?<ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0"/>:<ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0"/>}
        </button>
        {open===m.id&&<div className="px-4 pb-4 border-t border-slate-100 pt-3"><p className="text-sm text-slate-600 whitespace-pre-wrap">{m.content}</p>{m.link&&<a href={m.link} target="_blank" rel="noopener noreferrer" className="text-indigo-500 text-sm mt-2 inline-block">🔗 링크</a>}</div>}
      </div>
    ))}
  </div>);
}

function StudentTB({tb}){
  const koUrl=t=>t.ko||t.koreanUrl||"";
  const enUrl=t=>t.en||t.englishUrl||"";
  return(<div><SectionTitle ko="📖 수업교재" en="Textbooks"/>
    <p className="text-xs text-slate-500 mb-3 italic">세종학당 교재를 다운받으세요 / View or download</p>
    {tb.map(t=>(
      <div key={t.id} className="bg-white rounded-xl p-4 mb-3 border border-slate-200">
        <div className="flex gap-2 flex-wrap mb-2"><LvBadge lv={t.lv||t.level}/>{(t.sl||t.sejongLevel)&&<span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Sejong {t.sl||t.sejongLevel}</span>}</div>
        <p className="font-bold text-slate-800 mb-1">{t.title}</p>
        {(t.desc||t.description)&&<p className="text-xs text-slate-500 whitespace-pre-wrap mb-3">{t.desc||t.description}</p>}
        <div className="flex flex-col gap-2">
          {koUrl(t)&&<a href={koUrl(t)} target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl text-sm font-medium text-center flex items-center justify-center gap-2">🇰🇷 한국어판 열기 <ExternalLink className="w-4 h-4"/></a>}
          {enUrl(t)&&<a href={enUrl(t)} target="_blank" rel="noopener noreferrer" className="w-full border-2 border-indigo-300 text-indigo-600 py-3 rounded-xl text-sm font-medium text-center flex items-center justify-center gap-2 bg-white">🇺🇸 English Version <ExternalLink className="w-4 h-4"/></a>}
        </div>
      </div>
    ))}
  </div>);
}

function StudentVoc({voc}){
  const [sel,setSel]=useState(null);const [mode,setMode]=useState(null);
  const [ans,setAns]=useState({});const [checked,setChecked]=useState(false);
  const back=()=>{setSel(null);setMode(null);setAns({});setChecked(false);};
  const printPDF=s=>{
    const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${s.name}</title><style>body{font-family:sans-serif;padding:24px;max-width:600px;margin:auto}h1{font-size:18px;color:#4338ca;border-bottom:2px solid #e0e7ff;padding-bottom:6px;margin-bottom:12px}table{width:100%;border-collapse:collapse}th{background:#f1f5f9;font-size:12px;padding:8px 10px;text-align:left;border:1px solid #e2e8f0}td{padding:8px 10px;border:1px solid #e2e8f0;font-size:13px}tr:nth-child(even){background:#f8fafc}</style></head><body><h1>📖 ${s.name}</h1><p style="font-size:11px;color:#94a3b8;margin-bottom:12px">May's Korean Class · ${new Date().toLocaleDateString("ko-KR")}</p><table><thead><tr><th>#</th><th>단어</th><th>뜻</th></tr></thead><tbody>${s.words.map((w,i)=>`<tr><td>${i+1}</td><td>${w.word}</td><td>${w.meaning}</td></tr>`).join("")}</tbody></table></body></html>`;
    const blob=new Blob([html],{type:"text/html"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`${s.name}.html`;
    document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
  };
  if(!sel)return(<div><SectionTitle ko="📝 단어장" en="Vocabulary"/>
    {voc.length===0?<Empty ko="단어장이 없습니다" en="No vocabulary sets yet"/>:voc.map(s=>(
      <div key={s.id} className="bg-white rounded-xl p-4 mb-3 border border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <div><p className="font-bold text-slate-800">{s.name}</p><p className="text-xs text-slate-500">{s.words.length}개 단어</p></div>
          <button onClick={()=>printPDF(s)} className="text-slate-400 hover:text-indigo-500 p-2 rounded-lg"><Download className="w-4 h-4"/></button>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>{setSel(s);setMode("view");}} className="flex-1 bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-medium">📖 단어장 보기</button>
          <button onClick={()=>{setSel(s);setMode("practice");}} className="flex-1 border-2 border-indigo-200 text-indigo-600 py-2.5 rounded-xl text-sm font-medium">✏️ 연습하기</button>
        </div>
      </div>
    ))}
  </div>);
  if(mode==="view")return(<div>
    <button onClick={back} className="text-slate-500 text-sm mb-3 hover:underline">← 목록으로</button>
    <div className="flex justify-between items-center mb-3">
      <h2 className="font-bold text-slate-800 text-lg">📖 {sel.name}</h2>
      <button onClick={()=>printPDF(sel)} className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-sm"><Download className="w-3.5 h-3.5"/>PDF 출력</button>
    </div>
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm border-collapse">
        <thead><tr className="bg-slate-50 border-b border-slate-200">
          <th className="text-xs text-slate-400 font-medium px-2 py-2 text-left w-8">#</th>
          <th className="text-xs text-slate-500 font-medium px-3 py-2 text-left">단어</th>
          <th className="text-xs text-slate-500 font-medium px-3 py-2 text-left">뜻</th>
        </tr></thead>
        <tbody>{sel.words.map((w,i)=>(
          <tr key={i} className={`border-b border-slate-100 ${i%2===1?"bg-slate-50/50":""}`}>
            <td className="text-xs text-slate-400 px-2 py-2.5">{i+1}</td>
            <td className="font-medium text-slate-800 px-3 py-2.5">{w.word}</td>
            <td className="text-slate-600 px-3 py-2.5">{w.meaning}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  </div>);
  const score=checked?sel.words.filter((w,i)=>ans[i]?.trim().toLowerCase()===w.meaning.trim().toLowerCase()).length:0;
  return(<div>
    <button onClick={back} className="text-slate-500 text-sm mb-3 hover:underline">← 목록으로</button>
    <h2 className="font-bold text-slate-800 text-lg mb-1">✏️ {sel.name}</h2>
    <p className="text-xs text-slate-400 italic mb-3">뜻을 영어로 입력하세요 / Fill in the English meaning</p>
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-4">
      <table className="w-full text-sm border-collapse">
        <thead><tr className="bg-slate-50 border-b border-slate-200">
          <th className="text-xs text-slate-400 font-medium px-2 py-2 text-left w-8">#</th>
          <th className="text-xs text-slate-500 font-medium px-3 py-2 text-left">단어</th>
          <th className="text-xs text-slate-500 font-medium px-3 py-2 text-left">뜻</th>
        </tr></thead>
        <tbody>{sel.words.map((w,i)=>{
          const ua=ans[i]?.trim().toLowerCase()||"";const co=w.meaning.trim().toLowerCase();
          const ok=checked&&ua===co;const bad=checked&&ua!==co;
          return(<tr key={i} className={`border-b border-slate-100 ${ok?"bg-green-50":bad?"bg-red-50":i%2===1?"bg-slate-50/50":""}`}>
            <td className="text-xs text-slate-400 px-2 py-2">{i+1}</td>
            <td className="font-medium text-slate-800 px-3 py-2 whitespace-nowrap">{w.word}</td>
            <td className="px-2 py-1.5">
              <div className="flex items-center gap-1">
                <input value={ans[i]||""} onChange={e=>setAns({...ans,[i]:e.target.value})} disabled={checked} placeholder="meaning..." className={`w-full min-w-0 px-2 py-1 rounded border text-sm focus:outline-none ${ok?"border-green-400 text-green-700":bad?"border-red-300 text-red-700":"border-slate-200 focus:border-indigo-400"}`}/>
                {ok&&<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0"/>}
                {bad&&<XCircle className="w-4 h-4 text-red-400 flex-shrink-0"/>}
              </div>
              {bad&&<p className="text-xs text-green-600 mt-0.5">✓ {w.meaning}</p>}
            </td>
          </tr>);
        })}</tbody>
      </table>
    </div>
    {!checked
      ?<button onClick={()=>setChecked(true)} className="bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium w-full">채점하기 / Check</button>
      :<div className="space-y-2">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center"><span className="font-bold text-indigo-700 text-xl">{score}/{sel.words.length}</span><span className="text-slate-500 text-sm ml-2">정답</span></div>
        <button onClick={()=>{setAns({});setChecked(false);}} className="w-full bg-white border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm">다시 풀기 / Retry</button>
      </div>
    }
  </div>);
}

function AITutor(){
  const [msgs,setMsgs]=useState([{role:"assistant",content:"안녕하세요! 한국어 도우미입니다 😊\nHi! Ask me anything about Korean — in Korean or English!"}]);
  const [inp,setInp]=useState("");const [loading,setLoading]=useState(false);const endRef=useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs]);
  const send=async()=>{
    if(!inp.trim()||loading)return;
    const um={role:"user",content:inp.trim()};const nm=[...msgs,um];setMsgs(nm);setInp("");setLoading(true);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,system:"You are a friendly Korean language tutor for beginners. Always answer bilingually: Korean first, then '---', then English explanation.",messages:nm.map(m=>({role:m.role,content:m.content}))})});
      const d=await r.json();
      setMsgs([...nm,{role:"assistant",content:d.content?.find(c=>c.type==="text")?.text||"다시 시도해주세요."}]);
    }catch{setMsgs([...nm,{role:"assistant",content:"오류가 발생했어요. / Error occurred."}]);}
    finally{setLoading(false);}
  };
  return(<div>
    <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500"/>AI 한국어 도우미</h2>
    <p className="text-xs text-slate-500 mb-3 italic">Ask in Korean or English!</p>
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col" style={{height:"60vh",minHeight:"300px"}}>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {msgs.map((m,i)=><div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}><div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${m.role==="user"?"bg-indigo-500 text-white":"bg-slate-100 text-slate-800"}`}>{m.content}</div></div>)}
        {loading&&<div className="flex justify-start"><div className="bg-slate-100 px-3 py-2 rounded-2xl"><Loader2 className="w-4 h-4 animate-spin text-slate-500"/></div></div>}
        <div ref={endRef}/>
      </div>
      <div className="border-t border-slate-200 p-2 flex gap-2">
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="질문 입력... / Type here..." disabled={loading} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-400 focus:outline-none text-sm"/>
        <button onClick={send} disabled={loading||!inp.trim()} className="bg-indigo-500 text-white px-3 py-2 rounded-lg disabled:opacity-50"><Send className="w-4 h-4"/></button>
      </div>
    </div>
  </div>);
}
