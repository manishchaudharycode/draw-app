"use client";

export function Authpage({ isSignin }: { isSignin: boolean }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-2 m-2 bg-neutral-200  rounded">
        <div>
          <input
            className="text-neutral-900 border-1"
            type="text"
            placeholder="Email"
          />
        </div>
        <div>
          <input
            className="text-neutral-900 mt-5 border-1"
            type="password"
            placeholder="password"
          />
        </div>
        <button className="text-neutral-800 mt-5 h-10 w-20 bg-neutral-500 ml-15 border-2">
          Submit
        </button>
      </div>
    </div>
  );
}
