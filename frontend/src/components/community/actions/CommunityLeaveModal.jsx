import { Modal } from "../../ui/Modal";
import "./CommunityLeaveModal.css";
import { Button } from "../../ui/Button";
import { ModalHeader } from "../../ui/ModalHeader";

export const CommunityLeaveModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      className="community-leave-modal"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={false}
    >
      <ModalHeader title={"Warning"} onClose={onClose} />
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
