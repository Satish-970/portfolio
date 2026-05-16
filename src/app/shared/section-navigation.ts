export function scrollToSection(id: string): void {
  const nextPath = `/${id}`;
  if (window.location.pathname !== nextPath) {
    history.pushState(null, '', nextPath);
  }

  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
