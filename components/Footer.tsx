import { Wrench, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl text-orange-500 mb-2">
            <Wrench className="w-5 h-5" />
            SkillConnect
          </div>
          <p className="text-sm text-gray-400">
            Local skills. Local jobs. Local money.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Chatsworth, Durban · Expanding across KZN
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/find-worker" className="hover:text-orange-400 transition-colors">Request a Worker</a></li>
            <li><a href="/workers" className="hover:text-orange-400 transition-colors">Browse Workers</a></li>
            <li><a href="/register" className="hover:text-orange-400 transition-colors">Register as Worker</a></li>
            <li><a href="/admin" className="hover:text-orange-400 transition-colors">Admin Dashboard</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Contact</h3>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-orange-500" />
            <span>+27 67 946 7770</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            WhatsApp or call us to get started.
          </p>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} SkillConnect · Building local economies, one ward at a time.
      </div>
    </footer>
  );
}
