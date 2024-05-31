import { Link } from "react-router-dom";

function Button({ children, disabled, to, type, onClick }) {
  const buttonStyle =
    "text-sm font-semibold tracking-wide uppercase bg-yellow-500 rounded-full inline-block text-stone-800 hover:bg-yellow-400 focus:bg-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2 disabled:cursor-not-allowed ";

  const styles = {
    primary: buttonStyle + "px-4 py-3 sm:px-6 sm:py-4",
    small: buttonStyle + "px-4 text-xs py-2 md:px-5 md:py-2.5",
    secondary:
      "text-sm border-stone-300 border-2 px-4 py-2.5 sm:px-6 sm:py-4 font-semibold tracking-wide uppercase rounded-full inline-block text-stone-400 hover:bg-stone-300 hover:text-stone-500 focus:bg-stone-300 focus:outline-none focus:ring focus:ring-stone-300 focus:ring-offset-2 disabled:cursor-not-allowed ",
    round: buttonStyle + "px-2.5 py-1 md:px-3.5 md:py-2 text-sm",
  };

  if (to)
    return (
      <Link className={styles[type]} to={to}>
        {children}
      </Link>
    );

  if (onClick)
    return (
      <button onClick={onClick} disabled={disabled} className={styles[type]}>
        {children}
      </button>
    );

  return (
    <button disabled={disabled} className={styles[type]}>
      {children}
    </button>
  );
}

export default Button;
