import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import UserName from "../features/user/UserName";

function Header() {
  return (
    <header className='flex justify-between px-4 py-3 uppercase bg-yellow-500 border-b border-stone-200 sm:px-6'>
      <Link to='/' className='self-center tracking-widest'>
        Fast React Pizza Co.
      </Link>
      <SearchOrder />
      <UserName />
    </header>
  );
}

export default Header;
