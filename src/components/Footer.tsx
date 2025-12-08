export default function Footer() {
    return (
        <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <p className="text-xs text-gray-400">
                    © {new Date().getFullYear()} Protocolo 99%. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}
