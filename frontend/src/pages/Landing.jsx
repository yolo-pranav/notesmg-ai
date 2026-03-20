import { useNavigate } from 'react-router-dom';
import { FaBrain, FaTerminal, FaDatabase, FaBolt } from 'react-icons/fa';
import '../App.css';

function Landing() {
    const navigate = useNavigate();

    return (
        <div style={{ backgroundColor: '#09090b', minHeight: '100vh', color: '#f4f4f5', fontFamily: 'Inter, sans-serif' }}>
            {/* Brutalist Top Nav */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '2rem 4rem', borderBottom: '2px solid #27272a' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem', textTransform: 'uppercase', letterSpacing: '-1px' }}>
                    <FaBrain style={{ color: 'var(--primary)' }} /> Notesmg AI
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => navigate('/auth?mode=login')} className="btn btn-outline" style={{ border: '2px solid #27272a', padding: '0.75rem 2rem', fontWeight: 700, borderRadius: 0, textTransform: 'uppercase' }}>
                        SYSTEM LOGIN
                    </button>
                    <button onClick={() => navigate('/auth?mode=register')} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontWeight: 700, background: 'var(--primary)', color: '#000', border: 'none', boxShadow: '4px 4px 0 #27272a', borderRadius: 0, textTransform: 'uppercase' }}>
                        INITIALIZE
                    </button>
                </div>
            </nav>

            {/* Brutalist Hero Section */}
            <main style={{ padding: '6rem 4rem', display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '4rem', alignItems: 'center', maxWidth: '1600px', margin: '0 auto' }}>
                <div>
                    <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#27272a', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem', color: '#fff' }}>
                        V 2.0.4  //  NEURAL ENGINE ACTIVE
                    </div>
                    <h1 style={{ fontSize: 'min(6vw, 5rem)', fontWeight: 900, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-2px', marginBottom: '2rem', color: '#fff' }}>
                        RAW THOUGHT. <br />
                        <span style={{ color: 'var(--primary)', textShadow: 'none' }}>PURE CAPTURE.</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#a1a1aa', maxWidth: '650px', marginBottom: '3rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1.5rem', lineHeight: 1.6 }}>
                        The anti-bloat, pro-neural workspace. A hyper-minimalist text engine powered by local offline AI embeddings. No glowing widgets. No distractions. Just pure semantic intelligence.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <button onClick={() => navigate('/auth?mode=register')} className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1.25rem 3rem', textTransform: 'uppercase', fontWeight: 900, boxShadow: '8px 8px 0 #27272a', border: 'none', background: 'var(--primary)', color: '#000', borderRadius: 0, cursor: 'pointer' }}>
                            BOOT SEQUENCE [ENTER]
                        </button>
                    </div>
                </div>

                {/* Brutalist Right Asset */}
                <div style={{ border: '2px solid #27272a', background: '#121212', padding: '3rem', position: 'relative', boxShadow: '-15px 15px 0 #27272a' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, background: '#27272a', padding: '0.25rem 1rem', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace', color: '#fff' }}>sys.stats</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: 'monospace', fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', color: '#a1a1aa', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><FaTerminal style={{ color: 'var(--primary)', minWidth: '16px' }}/> <span>&gt; CONNECTING TO LOCAL DB... [OK]</span></li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><FaDatabase style={{ color: '#fff', minWidth: '16px' }}/> <span>&gt; LOADING POSTGRES ARRAYS... [OK]</span></li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><FaBrain style={{ color: '#ec4899', minWidth: '16px' }}/> <span>&gt; XENOVA/MINILM ALGORITHM... [READY]</span></li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><FaBolt style={{ color: 'var(--primary)', minWidth: '16px' }}/> <span style={{ color: '#fff' }}>&gt; AWAITING USER INPUT...</span></li>
                    </ul>
                </div>
            </main>

            {/* Brutalist Footer Features */}
            <section style={{ padding: '4rem', background: '#121212', borderTop: '2px solid #27272a', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ border: '2px solid #27272a', padding: '3rem', background: '#09090b', boxShadow: '6px 6px 0 var(--primary)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ textTransform: 'uppercase', fontWeight: 900, fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>OFFLINE EMBEDDINGS</h3>
                    <p style={{ color: '#a1a1aa', lineHeight: 1.6, margin: 0 }}>Local native AI tensor generation via WebAssembly. Absolute privacy, extreme speed, zero third-party API dependencies.</p>
                </div>
                <div style={{ border: '2px solid #27272a', padding: '3rem', background: '#09090b', boxShadow: '6px 6px 0 #ec4899', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ textTransform: 'uppercase', fontWeight: 900, fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>SEMANTIC SEARCH</h3>
                    <p style={{ color: '#a1a1aa', lineHeight: 1.6, margin: 0 }}>Our core engine doesn't just scan for your words; it mathematically understands your raw intent to triangulate any idea.</p>
                </div>
                <div style={{ border: '2px solid #27272a', padding: '3rem', background: '#09090b', boxShadow: '6px 6px 0 #fff', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ textTransform: 'uppercase', fontWeight: 900, fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>BRUTAL MINIMALISM</h3>
                    <p style={{ color: '#a1a1aa', lineHeight: 1.6, margin: 0 }}>No wasted pixels, no glowing shadows, no visual clutter whatsoever. A stark environment designed strictly for output.</p>
                </div>
            </section>
        </div>
    );
}

export default Landing;
