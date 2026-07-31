import { list } from '@vercel/blob';
import { verifyDownloadToken } from '../../lib/token';

export const dynamic = 'force-dynamic';

function niceName(pathname) {
  const name = pathname.split('/').pop() || pathname;
  return decodeURIComponent(name).replaceAll('_', ' ').replace(/\(1\)/g, '').trim();
}

export default async function DownloadPage({ searchParams }) {
  const params = await searchParams;
  const token = params?.token;

  if (!token) {
    return <main className="home-shell"><section className="hero-card"><p className="eyebrow">ORBIT DELIVERY</p><h1>Missing download link</h1><p>Please use the secure link sent with your purchase.</p></section></main>;
  }

  try {
    const customer = await verifyDownloadToken(token);
    const result = await list({ prefix: 'products/', access: 'private', limit: 100 });
    const files = result.blobs.filter(blob => !blob.pathname.endsWith('/'));

    return (
      <main className="home-shell">
        <section className="hero-card delivery-card">
          <p className="eyebrow">ORBIT SECURE DELIVERY</p>
          <h1>Welcome to ORBIT</h1>
          <p>Your <strong>{String(customer.tier).replaceAll('-', ' ')}</strong> files are ready. This secure link expires automatically.</p>
          {customer.testerNumber && <div className="counter"><strong>Founding Tester #{customer.testerNumber}</strong></div>}
          <div className="download-list">
            {files.length ? files.map(file => (
              <a className="primary-link download-item" key={file.pathname} href={`/api/download?token=${encodeURIComponent(token)}&pathname=${encodeURIComponent(file.pathname)}`}>
                Download {niceName(file.pathname)}
              </a>
            )) : <p>No product files are available yet. Please contact ORBIT support.</p>}
          </div>
          <p className="small">Purchased for {customer.email}. Do not share this private link.</p>
        </section>
      </main>
    );
  } catch {
    return <main className="home-shell"><section className="hero-card"><p className="eyebrow">ORBIT DELIVERY</p><h1>Link expired or invalid</h1><p>Please request a fresh delivery link from ORBIT support.</p></section></main>;
  }
}
