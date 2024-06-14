import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-slate-800 text-white">
      <div className="mycontainer flex justify-between items-center px-4 py-5 h-11">
        <div className="logo font-bold text-2xl">
          <span className="text-green-500">&lt;</span>
          Pass
          <span className="text-green-500">OP/&gt;</span>
        </div>

        <button className="text-white bg-green-700 hover:bg-green-600 rounded-md my-5 flex justify-between items-center ring-white ring-1">
          <img src="/github.png" alt="github" className="invert w-8 p-1" />
          <span className="font-bold px-2">Github</span>
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
