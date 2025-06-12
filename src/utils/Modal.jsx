export const Modal = ({ modalMessage, setShowModal }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#0c6291",
          padding: "2rem",
          borderRadius: "12px",
          minWidth: "300px",
          textAlign: "center",
        }}
      >
        <p>{modalMessage}</p>
        <button onClick={() => setShowModal(false)}>Close</button>
      </div>
    </div>
  );
};
