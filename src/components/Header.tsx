import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <img className="logo"
        src={`${process.env.PUBLIC_URL}/logo_dark_192.png`}
        alt="RaptVideo Logo"
      />
      <div className='full-title'>
        <p className="border-text">VIDEO INTELLIGENCE</p>
        <div className="title">
            <img className="bar"
                src={`${process.env.PUBLIC_URL}/vertical_bar.png`}
                alt="RaptVideo Logo"
            />
            <p>Rapt<br />Video</p>
        </div>
        <p className="border-text">ESTD 2024</p>
      </div>
    </header>
  );
}

export default Header;
