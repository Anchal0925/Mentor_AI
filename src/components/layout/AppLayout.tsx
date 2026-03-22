import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';

export default function AppLayout() {
  return (
    <div className="h-screen w-full flex flex-col bg-primary overflow-hidden">
      {/* Top section: TopNav */}
      <TopNav />
      
      {/* Bottom section: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-primary relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
