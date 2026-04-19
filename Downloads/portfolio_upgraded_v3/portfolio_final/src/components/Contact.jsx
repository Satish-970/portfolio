import { useState, useEffect, useRef } from 'react';
import ScrollReveal from 'scrollreveal';

const Contact = () => {
  const [status, setStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    ScrollReveal({ distance: '40px', duration: 900, easing: 'cubic-bezier(0.19,1,0.22,1)', viewFactor: 0.2 })
      .reveal('.contact__content', { origin: 'bottom', delay: 100 });
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const message = form.message.value;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!emailRegex.test(email)) {
      setStatus('error'); setErrorMsg('Please enter a valid email address!');
      setTimeout(() => setStatus(''), 3500); return;
    }
    if (message.length < 10) {
      setStatus('error'); setErrorMsg('Message must be at least 10 characters!');
      setTimeout(() => setStatus(''), 3500); return;
    }
    setStatus('loading');
    try {
      const res = await fetch('https://formspree.io/f/mvgkywqy', {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' },
      });
      if (res.ok) { form.reset(); setStatus('success'); setTimeout(() => setStatus(''), 5000); }
      else throw new Error();
    } catch {
      setStatus('error'); setErrorMsg('Failed to send. Please try again!');
      setTimeout(() => setStatus(''), 3500);
    }
  };

  const infoItems = [
    { icon: 'ri-mail-line',     label: 'Email',    value: 'satishpakalapati65@gmail.com', href: 'mailto:satishpakalapati65@gmail.com' },
    { icon: 'ri-github-line',   label: 'GitHub',   value: 'github.com/Satish-970',        href: 'https://github.com/Satish-970' },
    { icon: 'ri-linkedin-line', label: 'LinkedIn', value: 'satishpakalapati',             href: 'https://www.linkedin.com/in/satishpakalapati/' },
  ];

  return (
    <section className="section__container contact__container" id="contact">
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div className="section__tag" style={{ display: 'inline-flex' }}>Contact</div>
      </div>
      <h2 className="section__header" style={{ textAlign: 'center' }}>
        Let's <span>Connect</span>
      </h2>
      <p className="section__description" style={{ margin: '0.75rem auto 0', textAlign: 'center' }}>
        Have a project in mind or just want to chat? I'm always open to new opportunities.
      </p>

      <div className="contact__content">
        {/* Info column */}
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Get in Touch
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Whether you have a data challenge, a web project, or just want to connect — my inbox is always open.
            </p>
          </div>
          <div className="contact__info-items">
            {infoItems.map(({ icon, label, value, href }) => (
              <div className="contact__info-item" key={label}
                style={{ cursor: href ? 'pointer' : 'default' }}
                onClick={() => href && window.open(href, '_blank')}
              >
                <div className="contact__info-icon"><i className={icon}></i></div>
                <div>
                  <div className="contact__info-label">{label}</div>
                  <div className="contact__info-value">{value}</div>
                </div>
                {href && (
                  <i className="ri-external-link-line" style={{ marginLeft: 'auto', color: 'var(--text-dim)', fontSize: '0.9rem' }}></i>
                )}
              </div>
            ))}
          </div>

          {/* Availability badge */}
          <div style={{
            marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', background: 'rgba(100,220,100,0.08)',
            border: '1px solid rgba(100,220,100,0.25)', borderRadius: '100px',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '0.8rem', color: '#4ade80', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              Available for opportunities
            </span>
          </div>
        </div>

        {/* Form column */}
        <div className="contact__form__wrapper">
          <h2 className="section__header" style={{ fontSize: '1.6rem' }}>
            Send a <span>Message</span>
          </h2>
          <form className="contact__form" ref={formRef} onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
            <div className="input__row">
              <input name="name"  type="text"  placeholder="Your Name"    required />
              <input name="email" type="email" placeholder="Your Email"   required />
            </div>
            <input name="subject" type="text" placeholder="Subject" />
            <textarea name="message" rows="5" placeholder="Your message..." required></textarea>

            {status === 'success' && (
              <div className="contact__submit-status success">
                <i className="ri-checkbox-circle-line" style={{ marginRight: '8px' }}></i>
                Message sent! I'll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="contact__submit-status error">
                <i className="ri-error-warning-line" style={{ marginRight: '8px' }}></i>
                {errorMsg}
              </div>
            )}

            <button type="submit" className="btn" disabled={status === 'loading'}
              style={{ alignSelf: 'flex-start', opacity: status === 'loading' ? 0.7 : 1 }}>
              {status === 'loading'
                ? <><i className="ri-loader-4-line" style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }}></i>Sending…</>
                : <><i className="ri-send-plane-line" style={{ marginRight: '8px' }}></i>Send Message</>
              }
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 8px #4ade80} 50%{opacity:0.6;box-shadow:0 0 16px #4ade80} }
        @keyframes spin  { to{transform:rotate(360deg)} }
      `}</style>
    </section>
  );
};

export default Contact;
