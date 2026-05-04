import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      
      <div>
        <h2 className="text-2xl font-bold text-slate-700">
          Recruitment Admin Portal
        </h2>
      </div>

      <div className="relative">
        <img
          src="https://i.pravatar.cc/40"
          alt="admin"
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-700"
        />

        {open && (
          <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg p-4 z-50">
            <h3 className="font-semibold text-lg">Admin User</h3>
            <p className="text-sm text-gray-500">admin@ibs.com</p>
            <p className="text-sm text-gray-500 mb-3">HR Manager</p>

            <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}