import { useNavigate } from "react-router-dom";

const NotFoundView = () => {
  const naviagte = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <p style={{ color: "red", fontSize: "50px", fontWeight: "bold" }}>
          404 Page Not Found
        </p>
        <button onClick={() => naviagte("/home")} style={{ cursor: "pointer" }}>
          Go To HomePage
        </button>
      </div>
    </div>
  );
};

export default NotFoundView;
