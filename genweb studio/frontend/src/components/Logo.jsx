import React from "react";
import logoImg from "../assets/logo.png";

export const Logo = ({ className = "w-7 h-7", alt = "GenWeb Studio Logo" }) => {
  return (
    <img
      src={logoImg}
      alt={alt}
      className={`object-contain select-none shrink-0 ${className}`}
      draggable="false"
    />
  );
};

export default Logo;
