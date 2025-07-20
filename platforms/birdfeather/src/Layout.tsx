import type { ReactNode } from 'react';
import Logo from './components/Logo';
import MenuBar from './components/MenuBar';
import Footer from './components/Footer';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="bg-background-default text-text-default transition-colors duration-300">
            <div className="min-h-screen">
                <header className="bg-primary shadow-lg">
                    <div className="container p-4 mx-auto flex justify-between items-center">
                        <Logo />
                        <MenuBar />
                    </div>
                </header>
                <main className="container mx-auto p-4">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;