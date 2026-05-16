import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface BlogPost {
  title: string;
  image: string;
  category: string;
  date: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section__container blog__container" id="blog">
      <h2 class="section__header">My <span>Articles</span></h2>
      <p class="section__description">Thoughts on data science, development, and technology.</p>

      <div class="blog__slider-wrapper" *ngIf="blogPosts.length; else loadingPosts">
        <button class="blog-button-prev" type="button" aria-label="Previous article" (click)="scrollBlog('prev')">
          <i class="ri-arrow-left-line"></i>
        </button>
        <div class="blog-carousel">
          <div class="blog-track">
            <article class="blog__slide" *ngFor="let post of blogPosts.concat(blogPosts)">
              <div class="blog__image-right">
                <div class="blog__image-wrapper">
                  <img [src]="post.image" [alt]="post.title" />
                  <div class="blog__image-overlay"></div>
                </div>
              </div>
              <div class="blog__content-left">
                <div class="blog__meta"><span class="blog__category">{{ post.category }}</span><span class="blog__date">{{ post.date }}</span></div>
                <h3 class="blog__title">{{ post.title }}</h3>
                <p class="blog__description">{{ post.description }}</p>
                <a [href]="post.link" target="_blank" rel="noopener noreferrer" class="btn blog__btn">Read Article <i class="ri-arrow-right-line"></i></a>
              </div>
            </article>
          </div>
        </div>
        <button class="blog-button-next" type="button" aria-label="Next article" (click)="scrollBlog('next')">
          <i class="ri-arrow-right-line"></i>
        </button>
      </div>
      <ng-template #loadingPosts>
        <div class="blog-loading"><i class="ri-loader-4-line"></i>Loading latest articles...</div>
      </ng-template>
    </section>
  `,
})
export class BlogComponent implements OnInit {
  blogPosts: BlogPost[] = [];

  ngOnInit(): void {
    void this.loadBlogPosts();
  }

  scrollBlog(direction: 'prev' | 'next'): void {
    const track = document.querySelector<HTMLElement>('.blog-carousel');
    if (!track) return;
    const amount = Math.min(track.clientWidth * 0.9, 520);
    track.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' });
  }

  private async loadBlogPosts(): Promise<void> {
    try {
      const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://satishportfolio.blogspot.com/feeds/posts/default');
      const data = (await response.json()) as { items?: Array<Record<string, unknown>> };
      this.blogPosts = (data.items ?? []).slice(0, 6).map((item) => this.formatPost(item));
    } catch {
      this.blogPosts = [];
    }
  }

  private formatPost(item: Record<string, unknown>): BlogPost {
    const content = String(item['content'] ?? item['description'] ?? '');
    const doc = new DOMParser().parseFromString(content, 'text/html');
    const image = doc.querySelector('img')?.getAttribute('src') || String(item['thumbnail'] ?? 'assets/images/portfoliogif.gif');
    const text = doc.body.textContent?.trim().replace(/\s+/g, ' ') || 'Read the full article on the blog.';
    const pubDate = String(item['pubDate'] ?? '');
    const date = pubDate ? new Date(pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Blog';
    const categories = item['categories'] as string[] | undefined;

    return {
      title: String(item['title'] ?? 'Portfolio article'),
      image,
      category: categories?.[0] ?? 'Blog',
      date,
      description: `${text.slice(0, 140)}...`,
      link: String(item['link'] ?? 'https://satishportfolio.blogspot.com/'),
    };
  }
}
