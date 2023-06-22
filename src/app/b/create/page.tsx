"use client";

import { useState } from "react";

const page = () => {
  const [input, setInput] = useState("");

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-wgite w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a Subreadit</h1>
        </div>
        <hr className="bg-zinc-500 h-1px" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
              b/
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
