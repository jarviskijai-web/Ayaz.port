import React from 'react';
import './styles/ArchitectButton.css';

interface ArchitectButtonProps {
  onClick?: () => void;
  text: string;
}

const ArchitectButton: React.FC<ArchitectButtonProps> = ({ onClick, text }) => {
  return (
    <button className="architect-btn" onClick={onClick} data-cursor="disable">
      {text}
      <div id="clip">
        <div className="corner" id="leftTop"></div>
        <div className="corner" id="rightTop"></div>
        <div className="corner" id="leftBottom"></div>
        <div className="corner" id="rightBottom"></div>
      </div>
      <span className="arrow" id="leftArrow"></span>
      <span className="arrow" id="rightArrow"></span>
    </button>
  );
};

export default ArchitectButton;
