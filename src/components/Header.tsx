import Image from 'next/image';
import React from 'react';

const Header = () => (
  <header style={{ width: '100%', padding: '24px 0', background: '#fff', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Image src="/logo.png" alt="Crayon Logo" width={100} height={40} style={{ objectFit: 'contain' }} />
  </header>
);

export default Header; 