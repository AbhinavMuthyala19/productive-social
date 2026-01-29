import { Modal } from "../../ui/Modal";
import { X } from "lucide-react";
import "./CommunityLeaveModal.css";
import { Button } from "../../ui/Button";

export const CommunityLeaveModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      className="community-leave-modal"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={false}
    >
      <div className="community-leave-header">
        <h3>Warning</h3>
        <Button variant={"transparent-button"} onClick={onClose}>
        <X className="close-icon" size={20} />
        </Button>
      </div>
      <div className="leave-warning-message">
        <p>
          Are you sure? Leaving this community will reset your streak progress.
          You’ll have to start over if you rejoin.
        </p>
      </div>
      <div className="leave-buttons">
        <Button
          variant={"leave-button"}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Leave
        </Button>
        <Button variant={"cancel-button"} onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
