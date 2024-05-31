import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchOrder() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!query) return;
    navigate(`/order/${query}`);
    setQuery("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder='Search order no.'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='px-4 py-2 text-sm transition-all duration-300 rounded-full w-28 bg-yellow-50 placeholder:text-stone-500 hover:scale-105 focus:outline-none focus:ring focus:ring-yellow-600 focus:ring-offset-2 sm:w-64 sm:focus:scale-105'
      />
    </form>
  );
}

export default SearchOrder;
