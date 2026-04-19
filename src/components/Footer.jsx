const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="section__container footer__container">
        <div className="footer__col">
          <h5>Satish Pakalapati</h5>
          <p>
            A dedicated Data Analyst with excellent data visualization skills and strong hands-on
            experience in Java, Python, SQL, and machine learning.
          </p>
          <div className="footer__socials">
            <a href="mailto:satishpakalapati65@gmail.com" title="Email"><i className="ri-mail-fill"></i></a>
            <a href="https://github.com/Satish-970" target="_blank" rel="noopener noreferrer" title="GitHub"><i className="ri-github-fill"></i></a>
            <a href="https://www.linkedin.com/in/satishpakalapati/" target="_blank" rel="noopener noreferrer" title="LinkedIn"><i className="ri-linkedin-fill"></i></a>
            <a href="https://x.com/satishpakalap22" target="_blank" rel="noopener noreferrer" title="Twitter/X"><i className="ri-twitter-x-fill"></i></a>
          </div>
        </div>

        <div className="footer__col">
          <div className="footer__links">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#project">Projects</a>
            <a href="#service">Skills</a>
          </div>
          <div className="footer__links" style={{ marginTop: '2rem' }}>
            <h4>Support</h4>
            <a href="mailto:satishpakalapati65@gmail.com">Contact Me</a>
            <a href="https://satishportfolio.blogspot.com/" target="_blank" rel="noopener noreferrer">My Blog</a>
            <a href="/Resume.pdf" target="_blank" rel="noopener noreferrer">Download CV</a>
          </div>
        </div>
      </div>

      {/* Gradient divider */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(232,184,75,0.3), transparent)' }} />

      <div className="footer__bar">
        © {year} Satish Pakalapati —&nbsp;
        Built with <span style={{ color: 'var(--gold)' }}>React</span> &amp;&nbsp;
        <span style={{ color: 'var(--gold)' }}>Three.js</span>.&nbsp;
        All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
