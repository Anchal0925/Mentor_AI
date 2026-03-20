import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <TopNavbar />
      <div className="flex flex-1 overflow-hidden mt-[56px]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto w-full ml-[210px] bg-primary">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
