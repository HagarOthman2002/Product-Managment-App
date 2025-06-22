
import { useNavigate } from "react-router-dom";

import ProfileInfo from "../Cards/profileInfo";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";

const Navbar = ({userInfo}) => {
  const [searchQuery, setSearhQuery] = useState("");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear()
    navigate("/login");
  };

  const handleSearch = () => {};
  const onClearSearch = () => {
    setSearhQuery("");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 sm:gap-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Products</h2>
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearhQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo  userInfo={userInfo} onLogOut={onLogout} />
    </div>
  );
};

export default Navbar;
