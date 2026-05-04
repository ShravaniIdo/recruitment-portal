const Button = ({ children, onClick }) => {
  return (
    <button onClick={onClick} style={{ padding: "10px 15px" }}>
      {children}
    </button>
  );
};

export default Button;