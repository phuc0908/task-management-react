import { Search, LayoutDashboard } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';

export const Navbar = () => {
  const { searchQuery, setSearchQuery } = useTaskStore();

  return (
    <nav className="top-navbar">
      <a href="#" className="app-logo">
        <LayoutDashboard size={20} />
        Task Board
      </a>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search
            size={14}
            color="rgba(255,255,255,0.7)"
            style={{ position: 'absolute', left: 8, pointerEvents: 'none' }}
          />
          <input
            className="search-bar"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 28 }}
          />
        </div>
      </div>
    </nav>
  );
};
