import { ThemeSwitcher } from "../components/SwitchThemes";

export default function Home() {
    return (
        <div className="min-h-screen bg-background-default text-text-default transition-colors duration-300">
            <header className="bg-primary p-4 text-white shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Birdfeather</h1>
                    <ThemeSwitcher />
                </div>
            </header>

            
        </div>
    )
}