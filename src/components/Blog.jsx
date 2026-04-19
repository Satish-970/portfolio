import { useState, useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import portfolioGif from '../assets/images/portfoliogif.gif';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    ScrollReveal({ distance: '40px', duration: 900, easing: 'cubic-bezier(0.19,1,0.22,1)', viewFactor: 0.2 })
      .reveal('.blog__container .section__header', { origin: 'bottom' });

    const fetchPosts = async () => {
      try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://satishportfolio.blogspot.com/feeds/posts/default');
        const data = await response.json();
        if (data.items) {
          const formatted = data.items.map((item, index) => {
            const content = item.content || item.description || '';
            const publishedDate = new Date(item.pubDate).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
            const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
            let image = imgMatch ? imgMatch[1] : (item.thumbnail || portfolioGif);
            if (image) {
              const txt = document.createElement('textarea');
              txt.innerHTML = image;
              image = txt.value;
            }
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const cleanText = tempDiv.textContent || tempDiv.innerText || '';
            const snippet = cleanText.substring(0, 140) + '...';
            const category = item.categories && item.categories.length > 0 ? item.categories[0] : 'Blog';
            return { id: index, title: item.title, image, category, date: publishedDate, description: snippet, link: item.link };
          });
          setPosts(formatted);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="section__container blog__container" id="blog">
      <h2 className="section__header" style={{ textAlign:'center' }}>My <span>Articles</span></h2>
      <p className="section__description" style={{ margin:'0.75rem auto 0', textAlign:'center' }}>
        Thoughts on data science, development, and technology.
      </p>

      <div className="blog__slider-wrapper">
        {posts.length > 0 ? (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="blog-button-prev" style={{ flexShrink: 0 }}><i className="ri-arrow-left-line"></i></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{ 640:{ slidesPerView:1 }, 768:{ slidesPerView:2 }, 1024:{ slidesPerView:3 } }}
                navigation={{ nextEl:'.blog-button-next', prevEl:'.blog-button-prev' }}
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{ delay:5000, disableOnInteraction:false }}
                className="blog__swiper"
              >
                {posts.map(post => (
                  <SwiperSlide key={post.id} className="blog__slide">
                    <div className="blog__image-right">
                      <div className="blog__image-wrapper">
                        <img src={post.image} alt={post.title} />
                        <div className="blog__image-overlay"></div>
                      </div>
                    </div>
                    <div className="blog__content-left">
                      <div className="blog__meta">
                        <span className="blog__category">{post.category}</span>
                        <span className="blog__date">{post.date}</span>
                      </div>
                      <h3 className="blog__title">{post.title}</h3>
                      <p className="blog__description">{post.description}</p>
                      <a href={post.link} target="_blank" rel="noopener noreferrer" className="btn blog__btn">
                        Read Article <i className="ri-arrow-right-line"></i>
                      </a>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="blog-button-next" style={{ flexShrink: 0 }}><i className="ri-arrow-right-line"></i></div>
          </div>
        ) : (
          <div style={{ textAlign:'center', color:'var(--text-muted)', padding:'3rem' }}>
            <i className="ri-loader-4-line" style={{ fontSize:'2rem', display:'block', marginBottom:'1rem', opacity:0.5 }}></i>
            Loading latest articles...
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
