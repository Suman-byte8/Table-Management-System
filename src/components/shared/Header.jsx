import React from "react";

const Header = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4f2f0] px-10 py-4 bg-white">
      <div className="flex items-center gap-4 text-[#181411]">
        <div className="size-6 text-[var(--primary-500)]">
          {/* You can replace this SVG with a React Icon if needed */}
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm4.5-5c-1.38 0-2.5-1.12-2.5-2.5S11.12 7.5 12.5 7.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM16 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#181411]">
          TableBooker
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white text-zinc-600 transition-colors duration-200 hover:bg-zinc-100">
          <FiBell className="text-2xl" />
        </button>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCI-ON-Zi1kbwhpA6e8uPo0QgAzENvqGuMvstoqruxHJujuQGa1dIT1cKMlNFHbwtoDIHWb5jkhe_sHI3y0Gxp4U4RwHhvrCl_5_UNdVSh1bFKf8EPCqDKTvQBKJ1TqJ6IWmf4Q9B2xaBy_F1CFP-E28gdNRFWg6BxBQBnet5FZjku16VgHPyyLtLH_UwH_yINg369Dfdud8pxzQQm_lmQJ5TPV_ZqHhqLV7eqjl8_73TxTK8lphWqx-GDqVk3AvS_D8vLvX7MEbEk")',
          }}
        ></div>
      </div>
    </header>
  );
};

export default Header;
