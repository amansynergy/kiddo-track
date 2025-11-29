import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ParentDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Parents now use the student dashboard
    navigate("/student", { replace: true });
  }, [navigate]);

  return null;
};

export default ParentDashboard;
