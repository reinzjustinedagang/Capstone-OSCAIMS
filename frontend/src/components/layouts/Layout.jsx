import React from "react";
import Sidebar from "./Sidebar"; // Ensure paths are correct
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
<<<<<<< HEAD
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
=======
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
>>>>>>> master
      </div>
    </div>
  );
};

export default Layout;
