export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
            <span className="font-display font-bold text-white text-xs">P</span>
          </div>
          <span className="font-display font-bold text-gray-900 text-sm">PryroDigital</span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6">
          {['How It Works', 'Pricing', 'About'].map((label) => (
            <a key={label} href="#"
              className="text-sm text-gray-500 hover:text-primary transition-colors font-medium">
              {label}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} PryroDigital. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
