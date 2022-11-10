import React, { useEffect, useRef } from "react";
import { CloseButton } from "react-bootstrap";
import "./BasePopover.scss";

const BasePopover = ({
  title,
  content,
  popoverToggle,
  setPopoverToggle,
  basePopoverFlag,
  responsiveClass
}) => {
  const popoverRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (popoverRef.current && !popoverRef.current.contains(event.target)) ||
        ((event.target.className === "btn-add-new-checklist" ||
          event.target.className === "btn-add-new-date" ||
          event.target.className === "btn-remove-date") &&
          !basePopoverFlag)
      ) {
        setPopoverToggle(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [setPopoverToggle, basePopoverFlag]);

  if (!popoverToggle) return null;

  return (
    <div id="popover" ref={popoverRef} className={`popover-container ${responsiveClass}`}>
      <p className="title">{title}</p>
      <CloseButton onMouseDown={() => setPopoverToggle(false)} />
      {content}
    </div>
  );
};

export default BasePopover;
