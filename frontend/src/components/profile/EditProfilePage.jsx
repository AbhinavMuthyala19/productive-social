import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import "./Profile.css";
import { Loader } from "lucide-react";
import { Avatar } from "../ui/Avatar";

export const EditProfilePage = ({
  form,
  onChange,
  onSubmit,
  loading,
  isChanged,
  onImageChange,
}) => {
  return (
    <>
      <div className="edit-profile-picture">
        <Avatar
          className={"edit-profile-avatar"}
          src={form.profilePic}
          alt={form.username}
        />
        <input
          type="file"
          accept="image/*"
          id="profile-upload"
          style={{ display: "none" }}
          onChange={onImageChange}
        />
        <Button
          variant="edit-profile-pic-button"
          onClick={() => document.getElementById("profile-upload").click()}
        >
          Change Photo
        </Button>
      </div>
      <form onSubmit={onSubmit} className="edit-profile-form">
        <div className="edit-profile-form-input">
          <label htmlFor="name">Name</label>
          <Input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={onChange}
          />
        </div>
        <div className="edit-profile-form-input">
          <label htmlFor="username">Username</label>
          <Input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={onChange}
          />
        </div>
        <div className="edit-profile-form-input">
          <label htmlFor="bio">Bio</label>
          <Input
            name="bio"
            placeholder="Bio"
            value={form.bio}
            onChange={onChange}
          />
        </div>
        <Button
          type="submit"
          className="update-profile-button"
          disabled={loading || !isChanged}
        >
          {loading ? (
            <Loader className="spinner-icon" size={20} />
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </>
  );
};
