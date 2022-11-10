import React, { useState } from "react";
import BasePopover from "../Popovers/BasePopover";
import MembersPopover from "../Popovers/MembersPopover/MembersPopover";
import "./Members.scss";

const Members = ({ card, dispatch }) => {
  const [membersPopoverToggle, setMembersPopoverToggle] = useState(false);

  return (
    <div className="members">
      <p>Members</p>
      <div className="members-content">
        {card.members.map((m, index) => (
          <div key={index} className="userbox">{m.name[0].toUpperCase()}</div>
        ))}
        <div
          className="userbox add-member"
          onClick={() => setMembersPopoverToggle(true)}
        >
          +
        </div>
        <BasePopover
          title="Members"
          content={<MembersPopover card={card} dispatch={dispatch}/>}
          popoverToggle={membersPopoverToggle}
          setPopoverToggle={setMembersPopoverToggle}
        />
      </div>
    </div>
  );
};

export default Members;
