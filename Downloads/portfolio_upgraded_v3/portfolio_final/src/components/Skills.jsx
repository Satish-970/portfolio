import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import ScrollReveal from 'scrollreveal';

const SkillsOrb = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const w = mount.clientWidth || 400;
    const h = mount.clientHeight || 400;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.z = 5;

    const geo = new THREE.IcosahedronGeometry(1.65, 2);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xe8b84b, wireframe: true, transparent: true, opacity: 0.22 });
    const wireMesh = new THREE.Mesh(geo, wireMat);
    scene.add(wireMesh);

    const geo2 = new THREE.IcosahedronGeometry(1.9, 1);
    const wireMat2 = new THREE.MeshBasicMaterial({ color: 0xff9500, wireframe: true, transparent: true, opacity: 0.08 });
    const wireMesh2 = new THREE.Mesh(geo2, wireMat2);
    scene.add(wireMesh2);

    const innerGeo = new THREE.SphereGeometry(1.1, 32, 32);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x1a0f00, emissive: 0xe8b84b, emissiveIntensity: 0.18,
      transparent: true, opacity: 0.55,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    const ptCount = 400;
    const ptPos = new Float32Array(ptCount * 3);
    const ptColors = new Float32Array(ptCount * 3);
    const colA = new THREE.Color('#e8b84b');
    const colB = new THREE.Color('#ff9500');
    for (let i = 0; i < ptCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 1.72 + Math.random() * 0.12;
      ptPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      ptPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      ptPos[i * 3 + 2] = r * Math.cos(phi);
      const c = Math.random() > 0.5 ? colA : colB;
      c.toArray(ptColors, i * 3);
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
    ptGeo.setAttribute('color', new THREE.BufferAttribute(ptColors, 3));
    const ptMat = new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.85 });
    scene.add(new THREE.Points(ptGeo, ptMat));

    const ringGeo = new THREE.TorusGeometry(2.1, 0.025, 8, 80);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xe8b84b, transparent: true, opacity: 0.18 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dLight = new THREE.DirectionalLight(0xe8b84b, 1.8);
    dLight.position.set(5, 5, 5);
    scene.add(dLight);

    let mx = 0, my = 0;
    const onMouseMove = e => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    let frame;
    const clock = new THREE.Clock();
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      wireMesh.rotation.y = t * 0.12 + mx * 0.15;
      wireMesh.rotation.x = t * 0.08 + my * 0.1;
      wireMesh2.rotation.y = -t * 0.07;
      wireMesh2.rotation.z = t * 0.05;
      innerMesh.rotation.y = -t * 0.06;
      ring.rotation.z = t * 0.2;
      ring.rotation.y = t * 0.1;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = mount.clientWidth, nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
};

import pythonIcon     from '../assets/images/skills/python.svg';
import javaIcon       from '../assets/images/skills/java.svg';
import cppIcon        from '../assets/images/skills/cplusplus.svg';
import rIcon          from '../assets/images/skills/r.png';
import jsIcon         from '../assets/images/skills/javascript.svg';
import tsIcon         from '../assets/images/skills/typescript.svg';
import htmlIcon       from '../assets/images/skills/html5.svg';
import cssIcon        from '../assets/images/skills/css3.svg';
import reactIcon      from '../assets/images/skills/react.svg';
import angularIcon    from '../assets/images/skills/angular.svg';
import nodeIcon       from '../assets/images/skills/nodejs.svg';
import springIcon     from '../assets/images/skills/spring.svg';
import mysqlIcon      from '../assets/images/skills/mysql.svg';
import postgresIcon   from '../assets/images/skills/postgresql.svg';
import mongoIcon      from '../assets/images/skills/mongodb.svg';
import hadoopIcon     from '../assets/images/skills/hadoop.svg';
import sparkIcon      from '../assets/images/skills/spark.svg';
import tableauIcon    from '../assets/images/skills/tableau.png';
import gitIcon        from '../assets/images/skills/git.svg';
import dockerIcon     from '../assets/images/skills/docker.svg';
import k8sIcon        from '../assets/images/skills/kubernetes.svg';
import jupyterIcon    from '../assets/images/skills/jupyter.svg';
import postmanIcon    from '../assets/images/skills/postman.svg';
import jiraIcon       from '../assets/images/skills/jira.png';
import googleAdsIcon  from '../assets/images/skills/google-ads.png';
import gaIcon         from '../assets/images/skills/google-analytics.svg';

const skillGroups = [
  {
    label: 'Languages',
    skills: [
      { icon: pythonIcon,   name: 'Python' },
      { icon: javaIcon,     name: 'Java' },
      { icon: cppIcon,      name: 'C / C++' },
      { icon: rIcon,        name: 'R' },
      { icon: jsIcon,       name: 'JavaScript' },
      { icon: tsIcon,       name: 'TypeScript' },
    ],
  },
  {
    label: 'Web & Frameworks',
    skills: [
      { icon: htmlIcon,     name: 'HTML5' },
      { icon: cssIcon,      name: 'CSS3' },
      { icon: reactIcon,    name: 'React.js' },
      { icon: angularIcon,  name: 'Angular' },
      { icon: nodeIcon,     name: 'Node.js' },
      { icon: springIcon,   name: 'Spring' },
    ],
  },
  {
    label: 'Data & Databases',
    skills: [
      { icon: mysqlIcon,    name: 'SQL / MySQL' },
      { icon: postgresIcon, name: 'PostgreSQL' },
      { icon: mongoIcon,    name: 'MongoDB' },
      { icon: hadoopIcon,   name: 'Hadoop / Hive' },
      { icon: sparkIcon,    name: 'Apache Spark' },
      { icon: tableauIcon,  name: 'Tableau' },
    ],
  },
  {
    label: 'Tools & DevOps',
    skills: [
      { icon: gitIcon,      name: 'Git / GitHub' },
      { icon: dockerIcon,   name: 'Docker' },
      { icon: k8sIcon,      name: 'Kubernetes' },
      { icon: jupyterIcon,  name: 'Jupyter' },
      { icon: postmanIcon,  name: 'Postman' },
      { icon: jiraIcon,     name: 'Jira / Agile' },
    ],
  },
  {
    label: 'Analytics & Marketing',
    skills: [
      { icon: googleAdsIcon, name: 'SEO & Google Ads' },
      { icon: gaIcon,        name: 'Google Analytics' },
    ],
  },
];

const Skills = () => {
  useEffect(() => {
    ScrollReveal({ distance: '30px', duration: 900, easing: 'cubic-bezier(0.19,1,0.22,1)', viewFactor: 0.1 })
      .reveal('.skill-group', { origin: 'bottom', interval: 120, delay: 50 });
  }, []);

  return (
    <section className="section__container service__container" id="service">
      {/* 3D orb — background only */}
      <div style={{ position:'absolute', top:0, right:0, width:'420px', height:'420px', pointerEvents:'none', zIndex:0, opacity:0.5 }}>
        <div style={{ position:'absolute', inset:'20%', background:'radial-gradient(circle, rgba(232,184,75,0.08) 0%, transparent 70%)', borderRadius:'50%', filter:'blur(20px)' }} />
        <SkillsOrb />
      </div>

      <div style={{ position:'relative', zIndex:1 }}>
        <div className="section__tag">Technologies</div>
        <h2 className="section__header" style={{ marginBottom:'0.5rem' }}>
          Skills &amp; <span>Tech Stack</span>
        </h2>
        <p className="section__description" style={{ marginBottom:'2.5rem' }}>
          Full-stack development, data engineering, cloud tooling, and digital analytics.
        </p>

        {skillGroups.map(group => (
          <div key={group.label} className="skill-group" style={{ marginBottom:'2rem' }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:'8px',
              fontFamily:'var(--font-mono)', fontSize:'0.7rem', fontWeight:700,
              letterSpacing:'0.12em', textTransform:'uppercase',
              color:'var(--gold)', marginBottom:'1rem',
            }}>
              <span style={{ width:16, height:1, background:'var(--gold)', display:'inline-block' }} />
              {group.label}
            </div>
            <div className="service__grid" style={{ marginTop:0 }}>
              {group.skills.map((s, i) => (
                <div className="service__card" key={i}>
                  <span>
                    <img src={s.icon} alt={s.name} width="36" height="36"
                      style={{ objectFit:'contain', display:'block' }} loading="lazy" />
                  </span>
                  <h4>{s.name}</h4>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
