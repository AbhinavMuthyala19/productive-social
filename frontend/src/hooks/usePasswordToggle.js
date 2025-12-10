import { useState } from "react";
import openEyeIcon from "../assets/icons/openeye.svg";
import closedEyeIcon from "../assets/icons/closedeye.svg";

export const usePasswordToggle = () => {
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible(prev => !prev);

  return {
    type: visible ? "text" : "password",
    icon: visible ? openEyeIcon : closedEyeIcon,
    toggle
  };
};
