import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    HomeIcon,
    MapIcon,
    BuildingOffice2Icon,
    DevicePhoneMobileIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import './Dashboard.css';

const menuItems = [
    { name: 'Home', path: '/', icon: <HomeIcon className="icon" /> },
    { name: 'Communities', path: '/districts', icon: <MapIcon className="icon" /> },
    { name: 'E-Guruji App', path: '/app', icon: <DevicePhoneMobileIcon className="icon" /> },
];

function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Detect mobile on resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebarOnMobile = () => {
        if (isMobile) setIsSidebarOpen(false);
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'} ${isMobile ? 'mobile' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">E Guruji</div>
                    <div className="sidebar-toggle" onClick={toggleSidebar}>
                        {isSidebarOpen ? <XMarkIcon className="toggle-icon" /> : <Bars3Icon className="toggle-icon" />}
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'active' : ''}`
                            }
                            onClick={closeSidebarOnMobile}
                            end
                            style={{ '--index': index }}
                        >
                            {item.icon}
                            <span className="sidebar-label">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main content */}
            <main className="main-content">
                {(!isSidebarOpen || isMobile) && (
                    <div className="mobile-toggle-button" onClick={toggleSidebar}>
                        <Bars3Icon className="toggle-icon" />
                    </div>
                )}
                <Outlet />
            </main>
        </div>
    );
}

export default Dashboard;