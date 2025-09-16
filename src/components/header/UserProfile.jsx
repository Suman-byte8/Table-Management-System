import React from "react";
import { Link } from "react-router-dom";

const UserProfile = () => {
  return (
    <Link to="/admin-profile" className="flex items-center gap-3">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvrgM0j7ZmtVDGmmjD45_gMNYxHXgz90P3RCRFcaFaILk_p4ULa5OPpbhvVTagg9tyjovWo-qQp0fO396L-nAlLkBLHK2h5OCz0sLXYzApFHSJkUoW35WT2zu-FPMduEg_NeO9w_hZkroM7H3iSEbIAbyBVxQorFerQFoaNg6VDpHT1CX4cA5kxwX5fmNE_IJ5pveUozRTA1eS26f69QpIC0Ba84Y3dYbpWxfZUyLc4-4Ql1pwBEks8Fum95_4mojripBfJst_xNQ"
        alt="John Doe"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold text-gray-900">John Doe</p>
        <p className="text-sm text-gray-500">Administrator</p>
      </div>
    </Link>
  );
};

export default UserProfile;