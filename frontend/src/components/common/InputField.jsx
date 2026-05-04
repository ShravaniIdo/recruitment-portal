const InputField = ({ placeholder, ...props }) => {
  return (
    <input
      placeholder={placeholder}
      style={{ padding: "10px", marginBottom: "10px", width: "100%" }}
      {...props}
    />
  );
};

export default InputField;