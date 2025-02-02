import { Link, useNavigate } from "react-router-dom";

function LinkButton({ children, to }) {
  const navigate = useNavigate();
  const linkButtonStyle = "text-blue-500 hover:text-blue-700 hover:underline";

  if (to === "-1")
    return (
      <button onClick={() => navigate(-1)} className={linkButtonStyle}>
        {children}
      </button>
    );

  return (
    <Link to={to} className={linkButtonStyle}>
      {children}
    </Link>
  );
}

export default LinkButton;
