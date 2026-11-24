import React, { useEffect, useState } from 'react';
import { MessageCircle, Send, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AdminInbox({ db, session }) {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data, error } = await db.from('chat_conversations').select('*')
      .order('last_message_at', { ascending: false });
    if (error) setNotice(error.message);
    else {
      setConversations(data || []);
      if (active) setActive((data || []).find(c => c.id === active.id) || null);
    }
  };

  useEffect(() => {
    load();
    const channel = db.channel('admin-chat-inbox')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_conversations' }, load)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, load)
      .subscribe();
    return () => db.removeChannel(channel);
  }, []);

  useEffect(() => {
    if (!active) { setMessages([]); return; }
    let alive = true;
    const fetchMessages = async () => {
      const { data, error } = await db.from('chat_messages').select('*')
        .eq('conversation_id', active.id).order('created_at', { ascending: true });
      if (error) setNotice(error.message);
      else if (alive) setMessages(data || []);
    };
    fetchMessages();
    const channel = db.channel('admin-chat-' + active.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: 'conversation_id=eq.' + active.id },
        payload => setMessages(current => current.some(m => m.id === payload.new.id) ? current : [...current, payload.new]))
      .subscribe();
    return () => { alive = false; db.removeChannel(channel); };
  }, [active?.id]);

  const send = async e => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !active || !session || busy) return;
    setBusy(true); setNotice('');
    const { error } = await db.from('chat_messages').insert({
      conversation_id: active.id, sender_id: session.user.id, sender_role: 'admin', body
    });
    if (error) setNotice(error.message);
    else { await db.from('chat_conversations').update({ last_message_at: new Date().toISOString() }).eq('id', active.id); setDraft(''); await load(); }
    setBusy(false);
  };

  const resolve = async () => {
    if (!active) return;
    const { error } = await db.from('chat_conversations').update({ status: active.status === 'resolved' ? 'open' : 'resolved' }).eq('id', active.id);
    if (error) setNotice(error.message);
    else { setActive(v => ({ ...v, status: v.status === 'resolved' ? 'open' : 'resolved' })); await load(); }
  };

  return <section className="admin-chat-inbox">
    <div className="admin-chat-title"><div><h3><MessageCircle size={17}/> Live chat inbox</h3><p>Reply to visitors from the website in real time.</p></div><button className="outline" onClick={load}><RefreshCw size={14}/> Refresh</button></div>
    <div className="admin-chat-layout">
      <div className="admin-chat-list">
        {conversations.map(c => <button key={c.id} className={'admin-chat-thread ' + (active?.id === c.id ? 'active' : '')} onClick={() => setActive(c)}>
          <b>{c.visitor_name || 'Website visitor'}</b><small>{new Date(c.last_message_at).toLocaleString()}</small><span>{c.status === 'resolved' ? 'Resolved' : 'Open'}</span>
        </button>)}
        {!conversations.length && <div className="admin-chat-empty">No visitor conversations yet.</div>}
      </div>
      <div className="admin-chat-room">
        {active ? <>
          <div className="admin-chat-room-head"><div><b>{active.visitor_name || 'Website visitor'}</b><small>{active.status === 'resolved' ? 'Resolved conversation' : 'Conversation open'}</small></div><button className="outline" onClick={resolve}><CheckCircle2 size={14}/>{active.status === 'resolved' ? 'Reopen' : 'Resolve'}</button></div>
          <div className="admin-chat-room-messages">{messages.map(m => <div key={m.id} className={'admin-chat-message ' + (m.sender_role === 'admin' ? 'sent' : '')}><span>{m.body}</span><small>{m.sender_role === 'admin' ? 'Veltrix team' : 'Visitor'} · {new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</small></div>)}</div>
          <form className="admin-chat-reply" onSubmit={send}><input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Write your reply…" maxLength={2000}/><button className="dark" disabled={busy || !draft.trim()}><Send size={15}/> Send</button></form>
        </> : <div className="admin-chat-empty">Select a conversation to read and reply.</div>}
      </div>
    </div>
    {notice && <p className="notice">{notice}</p>}
  </section>;
}
