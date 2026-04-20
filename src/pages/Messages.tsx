import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Image as ImageIcon, 
  MessageSquare, 
  User, 
  Loader2, 
  CheckCheck,
  MoreVertical,
  Paperclip
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { cn } from '../lib/utils';
import { mockCars } from '../data/mockCars';

export default function Messages() {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const navigate = useNavigate();
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Listen for user's chats
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Handle initial chat selection from navigation state
  useEffect(() => {
    if (location.state?.openChatId && chats.length > 0) {
      const chat = chats.find(c => c.id === location.state.openChatId);
      if (chat) {
        setActiveChat(chat);
        // Clear state to prevent re-selection on every render/update
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, chats, navigate]);

  // Listen for active chat messages
  useEffect(() => {
    if (!activeChat) return;

    const q = query(
      collection(db, 'chats', activeChat.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return unsubscribe;
  }, [activeChat]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const text = newMessage;
    setNewMessage('');

    await addDoc(collection(db, 'chats', activeChat.id, 'messages'), {
      senderId: user?.uid,
      text,
      createdAt: serverTimestamp()
    });

    await setDoc(doc(db, 'chats', activeChat.id), { 
      lastMessage: text,
      updatedAt: serverTimestamp() 
    }, { merge: true });
  };

  if (!user) return <div className="p-20 text-center">Please sign in to view messages.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 h-[calc(100vh-160px)]">
      <div className="glass rounded-[2rem] h-full overflow-hidden flex shadow-2xl">
        {/* Sidebar */}
        <div className="w-full md:w-80 border-r border-black/5 flex flex-col">
          <div className="p-6 border-b border-black/5">
            <h1 className="text-2xl font-display font-bold">Conversations</h1>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-neutral-600" /></div>
            ) : chats.length === 0 ? (
              <div className="p-10 text-center text-neutral-500">No chats yet</div>
            ) : (
              chats.map(chat => {
                const car = mockCars.find(c => c.id === chat.carId);
                return (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={cn(
                      "w-full p-4 flex items-center gap-4 transition-all border-b border-black/5 text-left",
                      activeChat?.id === chat.id ? "bg-black/5 border-l-4 border-l-brand" : "hover:bg-black/5"
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/5 shrink-0">
                      <img src={car?.images[0]} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold truncate">{car?.make} {car?.model}</h4>
                      <p className="text-xs text-neutral-400 truncate">{chat.lastMessage}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-black/[0.02]">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-black/5 flex items-center justify-between glass-dark z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center text-brand overflow-hidden">
                    {mockCars.find(c => c.id === activeChat.carId)?.images[0] ? (
                      <img src={mockCars.find(c => c.id === activeChat.carId)?.images[0]} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold">
                      {(() => {
                        const car = mockCars.find(c => c.id === activeChat.carId);
                        return car ? `${car.make} ${car.model}` : "Chat";
                      })()}
                    </h3>
                    <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">
                      {activeChat.participants.find((p: string) => p !== user?.uid) === mockCars.find(c => c.id === activeChat.carId)?.sellerId ? "Contacting Seller" : "Buyer Inquiry"}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-black/5 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => {
                  const isMe = msg.senderId === user.uid;
                  return (
                    <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[70%] p-4 rounded-2xl",
                        isMe ? "bg-brand text-white rounded-tr-none shadow-lg shadow-brand/10" : "glass rounded-tl-none"
                      )}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <div className={cn("flex items-center gap-1 mt-1 justify-end", isMe ? "text-white/60" : "text-neutral-500")}>
                          <span className="text-[10px] uppercase font-bold">
                            {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                          </span>
                          {isMe && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 glass-dark border-t border-black/5">
                <form onSubmit={sendMessage} className="flex items-center gap-4">
                  <button type="button" className="p-3 hover:bg-black/5 rounded-xl text-neutral-400 transition-all">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-3 hover:bg-black/5 rounded-xl text-neutral-400 transition-all">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-black/5 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-brand transition-colors text-neutral-900 placeholder:text-neutral-500"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button 
                    disabled={!newMessage.trim()}
                    className="w-12 h-12 bg-brand text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 space-y-4">
              <div className="w-20 h-20 bg-black/5 rounded-3xl flex items-center justify-center text-neutral-400">
                <MessageSquare className="w-10 h-10" />
              </div>
              <p className="font-display font-medium text-lg">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
