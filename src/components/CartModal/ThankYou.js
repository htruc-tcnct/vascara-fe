import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(6); // Thời gian đếm ngược

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Sau 6 giây, điều hướng về trang chủ
    if (countdown === 0) {
      clearInterval(timer);
      navigate("/");
    }

    return () => clearInterval(timer); // Xóa interval khi component bị hủy
  }, [countdown, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h3>Cảm ơn bạn đã đặt hàng!</h3>
      <p>Tự động điều hướng về trang chủ sau {countdown} giây...</p>
      <button onClick={() => navigate("/")}>Trở về trang chủ ngay</button>
    </div>
  );
};

export default ThankYouPage;
