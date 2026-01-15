'use client';

import { useState } from 'react';

export default function Register() {
    const [userName, setUserName] = useState('');

    const [itemName, setItemName] = useState('');
    const [itemStock, setItemStock] = useState(0);
    const [itemUnit, setItemUnit] = useState('個');

    const handleUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({ name: userName }),
        });
        if (res.ok) {
            alert('ユーザーを追加しました！');
            setUserName('');
        } else {
            alert('エラーが発生しました');
        }
    };

    const handleItemSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/items', {
            method: 'POST',
            body: JSON.stringify({ name: itemName, stock: itemStock, unit: itemUnit }),
        });
        if (res.ok) {
            alert('商品を追加しました！');
            setItemName('');
            setItemStock(0);
        } else {
            alert('エラーが発生しました');
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>登録画面</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* User Form */}
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>新規ユーザー登録</h2>
                    <form onSubmit={handleUserSubmit}>
                        <div className="form-group">
                            <label>名前</label>
                            <input
                                type="text"
                                required
                                placeholder="例: 大菅"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">ユーザーを追加</button>
                    </form>
                </div>

                {/* Item Form */}
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>新規商品登録</h2>
                    <form onSubmit={handleItemSubmit}>
                        <div className="form-group">
                            <label>商品名</label>
                            <input
                                type="text"
                                required
                                placeholder="例: コーヒー豆"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>初期在庫数</label>
                            <input
                                type="number"
                                min="0"
                                value={itemStock}
                                onChange={(e) => setItemStock(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="form-group">
                            <label>単位</label>
                            <input
                                type="text"
                                placeholder="例: 個, kg"
                                value={itemUnit}
                                onChange={(e) => setItemUnit(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">商品を追加</button>
                    </form>
                </div>

            </div>
        </div>
    );
}
