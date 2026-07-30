'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [email, setEmail] = useState('samelgarhy@gmail.com');
  const [tier, setTier] = useState('founding-tester');
  const [paymentId, setPaymentId] = useState('pi_3Tz2wPKNiEqKXkRH1refpwBG');
  const [testerNumber, setTesterNumber] = useState('0001');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [status, setStatus] = useState('');

  async function createLink() {
    setStatus('Creating secure link...');
    const res = await fetch('/api/admin/create-delivery', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-orbit-admin-secret': secret },
      body: JSON.stringify({ email, tier, paymentId, testerNumber }),
    });
    const data = await res.json();
    if (!res.ok) return setStatus(data.error || 'Failed');
    setDownloadUrl(data.downloadUrl);
    setStatus('Secure delivery link created.');
  }

  async function upload(file) {
    if (!file) return;
    setStatus(`Uploading ${file.name}...`);
    const res = await fetch(`/api/admin/upload?filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: { 'x-orbit-admin-secret': secret, 'content-type': file.type || 'application/octet-stream' },
      body: file,
    });
    const data = await res.json();
    setStatus(res.ok ? `Uploaded: ${data.pathname}` : data.error || 'Upload failed');
  }

  return (
    <main className="admin-shell">
      <section className="admin-card">
        <p className="eyebrow">ORBIT OPS</p>
        <h1>Delivery Admin</h1>
        <p>Upload private product files, create a secure customer link, then send it from ORBIT.</p>

        <label>Admin secret<input type="password" value={secret} onChange={e => setSecret(e.target.value)} /></label>

        <div className="upload-grid">
          <label className="upload-box">Upload strategy package<input type="file" onChange={e => upload(e.target.files?.[0])} /></label>
          <label className="upload-box">Upload prompt guide<input type="file" onChange={e => upload(e.target.files?.[0])} /></label>
        </div>

        <label>Customer email<input value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Tier<select value={tier} onChange={e => setTier(e.target.value)}><option value="starter">Starter</option><option value="core">Core</option><option value="founding-tester">Founding Tester</option></select></label>
        <label>Stripe payment ID<input value={paymentId} onChange={e => setPaymentId(e.target.value)} /></label>
        <label>Founding Tester number<input value={testerNumber} onChange={e => setTesterNumber(e.target.value)} /></label>

        <button onClick={createLink}>Create secure delivery link</button>
        {downloadUrl && <div className="result"><a href={downloadUrl}>{downloadUrl}</a><button onClick={() => navigator.clipboard.writeText(downloadUrl)}>Copy link</button></div>}
        <p className="status">{status}</p>
      </section>
    </main>
  );
}
