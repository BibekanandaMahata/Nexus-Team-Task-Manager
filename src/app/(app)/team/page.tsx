'use client';

import { useState, useEffect, useCallback } from 'react';

interface TeamMember {
  id: string;
  username: string;
  email: string;
  role_id: number;
  created_at: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState<TeamMember[]>([]);
  const [searching, setSearching] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    // Fetch all users visible to the current user (returns a search-like list)
    const res = await fetch('/api/users/search?q=');
    const data = await res.json();
    setMembers(data.users ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Search debounce
  useEffect(() => {
    if (searchQ.length < 1) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setSearching(true);
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQ)}`);
      const data = await res.json();
      setSearchResults(data.users ?? []);
      setSearching(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQ]);

  const displayed = searchQ.length >= 1 ? searchResults : members;

  return (
    <div style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>Team</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
          Browse and find team members across your organization
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px', position: 'relative' }}>
        <input
          id="team-search"
          type="text"
          className="input"
          placeholder="Search by username…"
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          style={{ paddingLeft: '40px' }}
        />
        <span
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
            fontSize: '14px',
            pointerEvents: 'none',
          }}
        >
          ⌕
        </span>
      </div>

      {/* Members Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '10px' }} />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px' }}
        >
          {searching ? (
            <><span className="spinner" style={{ display: 'inline-block', marginRight: '8px' }} />Searching…</>
          ) : searchQ ? (
            `No users found matching "${searchQ}"`
          ) : (
            'No team members found'
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {displayed.map((member) => (
            <div key={member.id} id={`member-card-${member.id}`} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {member.username[0].toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }} className="truncate">
                    {member.username}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }} className="truncate">
                    {member.email}
                  </div>
                </div>
              </div>
              <span className={`badge ${member.role_id === 1 ? 'badge-admin' : 'badge-member'}`}>
                {member.role_id === 1 ? 'Admin' : 'Member'}
              </span>
            </div>
          ))}
        </div>
      )}

      {displayed.length > 0 && (
        <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          Showing {displayed.length} user{displayed.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
