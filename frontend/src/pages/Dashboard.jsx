import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import '../App.css';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { FaTrash, FaPencilAlt, FaSearch, FaSignOutAlt, FaPlus, FaTimes, FaBrain, FaTerminal } from 'react-icons/fa';

function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        const activeQuery = searchInput.trim();
        setSearchQuery(activeQuery);

        if (!activeQuery) {
            fetchNotes();
            return;
        }

        setIsSearching(true);
        try {
            const response = await api.get(`/notes/search?query=${activeQuery}`);
            setNotes(response.data);
            toast.success(`Found ${response.data.length} notes`, {
                style: {
                    borderRadius: '0px',
                    background: '#171717',
                    color: '#fff',
                    border: '2px solid #27272a',
                    boxShadow: '4px 4px 0 #27272a'
                }
            });
        } catch (error) {
            console.error(error);
            toast.error("Search failed");
        } finally {
            setIsSearching(false);
        }
    };

    const handleEdit = async (note) => {
        const { value: formValues } = await Swal.fire({
            title: 'Edit Note',
            html: `
                <input id="swal-input1" class="swal2-input" value="${note.title}" placeholder="TITLE">
                <textarea id="swal-input2" class="swal2-textarea" placeholder="CONTENT" style="height: 150px; resize: vertical;">${note.content}</textarea>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#facc15',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'UPDATE',
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ];
            }
        });

        if (formValues) {
            const [newTitle, newContent] = formValues;
            try {
                const response = await api.put(`/notes/${note.id}`, {
                    title: newTitle,
                    content: newContent
                });
                setNotes(notes.map(n => n.id === note.id ? response.data : n));
                toast.success('Note updated!');
            } catch (error) {
                console.error("Update failed", error);
                toast.error('Failed to update note.');
            }
        }
    };

    const fetchNotes = async () => {
        try {
            const response = await api.get('/notes');
            if (Array.isArray(response.data)) {
                setNotes(response.data);
            } else {
                setNotes([]);
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
            if (error.response && error.response.status === 403) {
                navigate('/login');
            }
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!title || !content) return;

        try {
            await api.post('/notes', { title, content });
            setTitle('');
            setContent('');
            fetchNotes();
            toast.success('Note added!');
        } catch (error) {
            toast.error('Failed to save note');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete this note?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#27272a',
            confirmButtonText: 'YES, DELETE',
            cancelButtonText: 'CANCEL'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/notes/${id}`);
                setNotes(notes.filter(note => note.id !== id));
                toast.success('Note deleted');
            } catch (error) {
                console.error("Delete failed", error);
                toast.error('Failed to delete note.');
            }
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            navigate('/login');
        } catch (error) {
            navigate('/login');
        }
    };

    return (
        <div style={{ backgroundColor: '#09090b', minHeight: '100vh', color: '#f4f4f5', fontFamily: 'Inter, sans-serif' }}>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: '#171717',
                        color: '#fff',
                        borderRadius: '0px',
                        border: '2px solid #27272a',
                        boxShadow: '4px 4px 0 #27272a'
                    }
                }}
            />

            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 4rem', borderBottom: '2px solid #27272a', background: '#09090b' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-1px', margin: 0 }}>
                    <FaBrain style={{ color: 'var(--primary)' }} /> Notesmg AI
                </h1>
                <button onClick={handleLogout} style={{ border: '2px solid #27272a', padding: '0.5rem 1.5rem', fontWeight: 700, borderRadius: 0, textTransform: 'uppercase', background: 'transparent', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaSignOutAlt /> LOGOUT
                </button>
            </header>

            <div style={{ padding: '4rem', display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '4rem', alignItems: 'start', maxWidth: '1600px', margin: '0 auto' }}>
                {/* Left Column: Editor */}
                <aside style={{ border: '2px solid #27272a', background: '#121212', padding: '2rem', boxShadow: '-8px 8px 0 #27272a', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                            RAW RECORDING
                        </h2>
                        <input
                            type="text"
                            placeholder="SYS.TITLE"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            style={{ background: '#09090b', border: '2px solid #27272a', color: '#fff', padding: '1rem', fontFamily: 'monospace', borderRadius: 0, outline: 'none', width: '100%', boxSizing: 'border-box' }}
                            required
                        />
                        <textarea
                            placeholder="INPUT DATA..."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            style={{ background: '#09090b', border: '2px solid #27272a', color: '#fff', padding: '1rem', fontFamily: 'monospace', borderRadius: 0, outline: 'none', height: '200px', resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
                            required
                        />
                        <button type="submit" style={{ padding: '1rem', fontWeight: 900, background: 'var(--primary)', color: '#000', border: 'none', boxShadow: '4px 4px 0 #27272a', borderRadius: 0, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                            <FaPlus /> COMMIT BLOCK
                        </button>
                    </form>
                </aside>

                {/* Right Column: List & Search */}
                <main>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                        <div style={{ flex: 1, display: 'flex', background: '#121212', border: '2px solid #27272a', alignItems: 'center', padding: '0.5rem 1rem' }}>
                            <FaSearch style={{ color: '#a1a1aa', marginRight: '1rem' }} />
                            <input
                                type="text"
                                placeholder="QUERY AI EMBEDDINGS (E.G., 'PROJECT IDEAS')..."
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                style={{ flex: 1, border: 'none', background: 'transparent', color: '#fff', fontFamily: 'monospace', outline: 'none', fontSize: '1rem' }}
                            />
                        </div>
                        <button type="submit" disabled={isSearching} style={{ padding: '0 2rem', fontWeight: 900, background: '#27272a', color: '#fff', border: 'none', borderRadius: 0, textTransform: 'uppercase', cursor: 'pointer', boxShadow: '4px 4px 0 var(--primary)' }}>
                            {isSearching ? 'SCANNING...' : 'EXECUTE'}
                        </button>
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchInput('');
                                    setSearchQuery('');
                                    fetchNotes();
                                }}
                                style={{ padding: '0 1.5rem', fontWeight: 900, background: '#ef4444', color: '#000', border: 'none', borderRadius: 0, textTransform: 'uppercase', cursor: 'pointer', boxShadow: '4px 4px 0 #27272a' }}
                            >
                                <FaTimes />
                            </button>
                        )}
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {Array.isArray(notes) && notes.length > 0 ? (
                            (searchQuery ? notes : notes.slice().reverse()).map(note => (
                                <div key={note.id} style={{ border: '2px solid #27272a', background: '#121212', padding: '2rem', position: 'relative', borderLeft: '6px solid var(--primary)', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '4px 4px 0 #000' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', letterSpacing: '-0.5px' }}>
                                            {note.title}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleEdit(note)} style={{ background: '#27272a', border: 'none', color: '#fff', padding: '0.5rem', cursor: 'pointer' }} title="Edit Note">
                                                <FaPencilAlt />
                                            </button>
                                            <button onClick={() => handleDelete(note.id)} style={{ background: '#27272a', border: 'none', color: '#ef4444', padding: '0.5rem', cursor: 'pointer' }} title="Delete Note">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                    <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#a1a1aa' }}>
                                        {note.content}
                                    </p>
                                    <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#52525b', marginTop: '1rem', textTransform: 'uppercase' }}>
                                        &gt; SYS_STAMP: {new Date(note.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', color: '#a1a1aa', marginTop: '2rem', background: '#121212', padding: '4rem', border: '2px solid #27272a', boxShadow: '8px 8px 0 #27272a' }}>
                                <FaTerminal style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5, color: 'var(--primary)' }} />
                                <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-1px' }}>DATABANK EMPTY</h3>
                                <p style={{ fontSize: '1rem', textTransform: 'uppercase', fontFamily: 'monospace' }}>AWAITING INITIAL DATA BLOCK.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;