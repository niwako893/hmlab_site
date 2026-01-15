'use client';

import { useState, useEffect } from 'react';

type User = {
    id: number;
    name: string;
};

type Item = {
    id: number;
    name: string;
    stock: number;
    unit: string;
};

export default function Dashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Load initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, itemsRes] = await Promise.all([
                    fetch('/api/users'),
                    fetch('/api/items')
                ]);
                setUsers(await usersRes.json());
                setItems(await itemsRes.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Recover last user
        const lastUser = localStorage.getItem('lastUser');
        if (lastUser) setSelectedUser(lastUser);
    }, []);

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUser(e.target.value);
        localStorage.setItem('lastUser', e.target.value);
    };

    const handleBuy = async (itemId: number) => {
        if (!selectedUser) {
            alert('先に名前を選択してください！');
            return;
        }

        try {
            const res = await fetch('/api/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: selectedUser,
                    item_id: itemId,
                    quantity: 1
                })
            });

            if (res.ok) {
                const data = await res.json();
                // Update local state
                setItems(prev => prev.map(item =>
                    item.id === itemId ? { ...item, stock: data.new_stock } : item
                ));
                alert('購入・使用しました！');
            } else {
                alert('エラーが発生しました');
            }
        } catch (err) {
            console.error(err);
            alert('通信エラー');
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <p>読み込み中...</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>研究室 物品管理</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>名前を選択して商品を選んでください。</p>
                </div>

                <div>
                    <label htmlFor="currentUser">利用者名</label>
                    <select
                        id="currentUser"
                        value={selectedUser}
                        onChange={handleUserChange}
                        style={{ minWidth: '200px' }}
                    >
                        <option value="" disabled>-- 名前を選択 --</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="🔍 商品を検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1.5rem'
            }}>
                {filteredItems.length === 0 && (
                    <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        商品が見つかりません。
                    </p>
                )}

                {filteredItems.map(item => (
                    <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                            <span style={{
                                display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                                backgroundColor: item.stock < 5 ? '#fef2f2' : '#f1f5f9',
                                color: item.stock < 5 ? '#ef4444' : 'var(--text-secondary)'
                            }}>
                                {item.stock} {item.unit}
                            </span>
                        </div>
                        <button className="btn btn-primary" onClick={() => handleBuy(item.id)} style={{ width: '100%' }}>
                            1つ購入・使用
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
