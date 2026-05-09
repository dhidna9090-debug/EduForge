import React, { useState } from 'react';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Register = ({ onLogin }) => {
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // 1. Validation: ID kam se kam 8 character ki honi chahiye
    if (userId.length < 8) {
      alert("User ID kam se kam 8 characters ki honi chahiye!");
      return;
    }

    setLoading(true);
    try {
      // 2. Database mein check karo ki ID pehle se toh nahi hai
      const userRef = doc(db, "users", userId.toLowerCase()); // ID ko hamesha lowercase me save karna achha hota hai
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        // Agar file mil gayi
        alert("Ye User ID pehle se kisi ne le rakhi hai. Kripya koi dusri ID chunein!");
      } else {
        // 3. Agar available hai, toh ID ke naam se nayi file bana do (Custom ID)
        await setDoc(userRef, {
          fullName: fullName,
          userId: userId.toLowerCase(),
          xp: 0,
          todayMinutes: 0,
          streak: 0,
          lastDate: new Date().toDateString(),
          joinDate: new Date().toDateString()
        });
        
        alert("Boom! Account Successfully Created! 🔥");
        
        // App ko batane ke liye ki user login ho gaya hai
        localStorage.setItem("eduforge_user", userId.toLowerCase());
        onLogin(userId.toLowerCase()); // User ko seedha dashboard par bhej do
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Kuch gadbad ho gayi!");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Join EduForge</h2>
        
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Pura Naam</label>
            <input 
              type="text" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Dhiraj Kumar"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Unique User ID (Min 8 chars)</label>
            <input 
              type="text" 
              required
              value={userId}
              onChange={(e) => setUserId(e.target.value.replace(/\s/g, ''))} // Spaces allow nahi karenge
              className="w-full p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. dhiraj_coder007"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-bold transition-all"
          >
            {loading ? "Checking ID..." : "Start Learning 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;