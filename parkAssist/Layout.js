
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MapPin, Bell, Settings, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeProvider, useTheme } from './components/providers/ThemeContext.js';

function AppLayout({ children }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navigationItems = [
    { title: "Map", url: createPageUrl("ParkingMap"), icon: MapPin, id: "map" },
    { title: "Alerts", url: createPageUrl("Notifications"), icon: Bell, id: "alerts" },
    { title: "Settings", url: createPageUrl("Settings"), icon: Settings, id: "settings" },
  ];

  return (
    <>
      <style jsx>{`
        :root {
          --bg-primary: #FFFFFF;
          --bg-secondary: #F8F9FA;
          --bg-card: #FFFFFF;
          --text-primary: #1F2937;
          --text-secondary: #6B7280;
          --border-color: #E5E7EB;
          --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        
        .dark {
          --bg-primary: #111827;
          --bg-secondary: #1F2937;
          --bg-card: #374151;
          --text-primary: #F9FAFB;
          --text-secondary: #D1D5DB;
          --border-color: #4B5563;
          --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3);
        }
      `}</style>
      
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        {/* Header */}
        <header 
          className="sticky top-0 z-50 border-b backdrop-blur-md"
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow)'
          }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">UMBC Parking</h1>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Live Campus Parking
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full transition-all duration-300 hover:scale-105"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-20">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav 
          className="fixed bottom-0 left-0 right-0 border-t backdrop-blur-md"
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div className="grid grid-cols-3 h-16">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                to={item.url}
                className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                  location.pathname === item.url 
                    ? 'text-amber-500 scale-105' 
                    : 'hover:scale-105'
                }`}
                style={{ color: location.pathname === item.url ? '#F59E0B' : 'var(--text-secondary)' }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.title}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}

export default function Layout({ children }) {
  return (
    <ThemeProvider>
      <AppLayout>{children}</AppLayout>
    </ThemeProvider>
  );
}
