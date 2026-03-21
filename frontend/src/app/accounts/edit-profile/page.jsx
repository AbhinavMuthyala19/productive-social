import { useContext, useEffect, useState } from "react";
import { Navbar } from "../../../components/layout/Navbar";
import { PageContainer } from "../../../components/layout/PageContainer";
import { PageHeader } from "../../../components/layout/PageHeader";
import { EditProfilePage } from "../../../components/profile/EditProfilePage";
import { AuthContext } from "../../../context/AuthContext";
import { updateProfile, updateProfileImage } from "../../../lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const EditProfile = () => {
  const { user, fetchUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
    profilePic: "",
    profileFile: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
        profilePic: user.profilePicture,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      username: form.username.trim(),
      bio: form.bio.trim(),
    };
    try {
      setLoading(true);
      const res = await updateProfile(payload);
      toast.success(res.data?.message || "Profile Updated...");
      await fetchUser();
      navigate("/profile");
    } catch {
      toast.error("Update Profile failed... Try again");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // preview
    const preview = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      profilePic: preview,
    }));

    // upload immediately (Instagram style)
    try {
      const formData = new FormData();
      formData.append("file", file);

      await updateProfileImage(formData); // 👈 separate API

      await fetchUser(); // refresh global user
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error("Failed to update profile picture");
    }
  };

  const isChanged =
    form.name !== user?.name ||
    form.username !== user?.username ||
    form.bio !== user?.bio;

  if (loading) return;

  return (
    <PageContainer>
      <Navbar />
      <PageHeader title={"Edit Profile"} />
      <div className="main">
        <EditProfilePage
          form={form}
          onChange={handleChange}
          onSubmit={handleEditProfile}
          loading={loading}
          isChanged={isChanged}
          onImageChange={handleImageChange}
        />
      </div>
    </PageContainer>
  );
};
