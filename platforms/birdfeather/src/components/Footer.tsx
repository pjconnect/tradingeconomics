export default function Footer(){
    return (
        <footer className="h-[200px] flex items-center justify-center bg-primary p-4 text-center">
            <p className="text-sm text-text-default">
                &copy; {new Date().getFullYear()} Birdfeather. A Trade Economics API Wrapper
            </p>
        </footer>
    )
}