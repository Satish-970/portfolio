import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'remixicon/fonts/remixicon.css'
import 'swiper/css'
import 'swiper/css/pagination'

// Apply saved theme (default: dark) before React mounts to prevent flash
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
document.body.setAttribute('data-theme', savedTheme);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
