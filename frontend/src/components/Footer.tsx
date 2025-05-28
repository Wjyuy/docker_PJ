import React from 'react';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-content">
      <span>© 2025 GemSup. All rights reserved.
      <br></br> Context Toggle Design: <a href="https://sirius7.tistory.com/143" target="_blank" rel="noopener noreferrer">Sirius7 Tistory</a></span>
      <span className="footer-links">
        <a href="https://github.com/Wjyuy/docker_PJ/" target="_blank" rel="noopener noreferrer">GitHub</a>
        <span> | </span>
        <a href="#">이용약관</a>
        <span> | </span>
        <a href="#">개인정보처리방침</a>
      </span>
    </div>
  </footer>
);

export default Footer;
