import './globals.css';
import Link from 'next/link';

export const metadata = {
    title: '研究室 物品管理',
    description: 'Lab Inventory System',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja">
            <body>
                <div style={{ display: 'flex', minHeight: '100vh' }}>
                    {/* Sidebar */}
                    <nav style={{
                        width: '250px',
                        backgroundColor: 'var(--sidebar-bg)',
                        borderRight: '1px solid var(--border-color)',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'fixed',
                        height: '100vh'
                    }}>
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: 700 }}>
                                🧪 LabStock
                            </h2>
                        </div>
                        <ul style={{ listStyle: 'none' }}>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link href="/" style={{
                                    display: 'block',
                                    padding: '12px 16px',
                                    color: 'var(--text-secondary)',
                                    borderRadius: '8px',
                                    fontWeight: 500
                                }}>
                                    ダッシュボード
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" style={{
                                    display: 'block',
                                    padding: '12px 16px',
                                    color: 'var(--text-secondary)',
                                    borderRadius: '8px',
                                    fontWeight: 500
                                }}>
                                    登録画面
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Main Content */}
                    <main style={{
                        marginLeft: '250px',
                        flex: 1,
                        padding: '3rem',
                        maxWidth: '1200px'
                    }}>
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
