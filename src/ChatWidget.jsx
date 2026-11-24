import React, { useEffect, useState } from 'react';
import { MessageCircle, X, Send, LoaderCircle } from 'lucide-react';

export default function ChatWidget({ db, admin }) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || admin) return;
    if (!db) {
      setError('Live chat is temporarily unavailable. Please use the enquiry form below.');
      return;
    }
    let alive = true;
    (async () => {
      setError('');
      let { data: { session: current }, error: sessionError } = await db.auth.getSession();
      if (sessionError) { setError(sessionError.message); return; }
      if (current && !current.user.is_anonymous) {
        setError('Please open the website in a private visitor session to start a chat.');
        return;
      }
      if (!current) {
        const { data, error: authError } = await db.auth.signInAnonymously();
        if (authError) {
          setError(authError.message.includes('anonymous') || authError.message.includes('disabled')
            ? 'Visitor chat is not enabled yet. Please contact the website administrator.'
            : authError.message);
          return;
        }
        current = data.session;
      }
      if (!alive || !current) return;
      setSession(current);
      const { data: existing, error: findError } = await db
        .from('chat_conversations').select('*').eq('owner_id', current.user.id)
        .eq('status', 'open').order('last_message_at', { ascending: false }).limit(1);
      if (findError) { setError(findError.message); return; }
      let active = existing?.[0];
      if (!active) {
        const { data, error: createError } = await db.from('chat_conversations')
          .insert({ owner_id: current.user.id, visitor_name: 'Website visitor' })
          .select().single();
        if (createError) { setError(createError.message); return; }
        active = data;
      }
      if (alive) setConversation(active);
    })();
    return () => { alive = false; };
  }, [open, db, admin]);

  useEffect(() => {
    if (!conversation || !session || !db) return;
    let alive = true;
    const load = async () => {
      const { data, error: loadError } = await db.from('chat_messages').select('*')
        .eq('conversation_id', conversation.id).order('created_at', { ascending: true });
      if (loadError) setError(loadError.message);
      else if (alive) setMessages(data || []);
    };
    load();
    const channel = db.channel('visitor-chat-' + conversation.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: 'conversation_id=eq.' + conversation.id },
        payload => setMessages(current => current.some(m => m.id === payload.new.id) ? current : [...current, payload.new]))
      .subscribe();
    return () => { alive = false; db.removeChannel(channel); };
  }, [conversation?.id, session?.user?.id, db]);

  const send = async e => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !conversation || !session || busy || !db) return;
    setBusy(true); setError('');
    const { error: sendError } = await db.from('chat_messages').insert({
      conversation_id: conversation.id, sender_id: session.user.id, sender_role: 'visitor', body
    });
    if (sendError) setError(sendError.message);
    else {
      await db.from('chat_conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conversation.id);
      setDraft('');
    }
    setBusy(false);
  };

  if (admin) return null;
  return <div className="vel-chat">
    {open && <section className="vel-chat-panel" aria-label="Chat with Veltrix">
      <header><div><b>Talk to Veltrix</b><small>We usually reply as soon as possible</small></div><button onClick={() => setOpen(false)} aria-label="Close chat"><X size={18}/></button></header>
      {!db ? <div className="vel-chat-loading">{error}</div> :
        !conversation ? <div className="vel-chat-loading"><LoaderCircle size={18}/>{error || 'Connecting securely…'}</div> :
        <><div className="vel-chat-messages">
          {!messages.length && <div className="vel-chat-welcome">Hi there! 👋 Tell us what you need for your SAT teaching platform.</div>}
          {messages.map(m => <div className={'vel-chat-bubble ' + (m.sender_role === 'visitor' ? 'mine' : '')} key={m.id}>{m.body}<small>{new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</small></div>)}
        </div>
        <form onSubmit={send}><input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Write a message…" maxLength={2000}/><button disabled={busy || !draft.trim()} aria-label="Send message"><Send size={17}/></button></form></>}
      {error && db && <p className="vel-chat-error">{error}</p>}
    </section>}
    <button className="vel-chat-launch" onClick={() => setOpen(v => !v)} aria-label={open ? 'Close chat' : 'Open live chat'}>
      {open ? <X size={21}/> : <><MessageCircle size={20}/> <span>Chat with us</span></>}
    </button>
  </div>;
}
