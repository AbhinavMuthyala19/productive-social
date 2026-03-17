import { useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/Button";
import googleIcon from "../../assets/icons/googleiconsvg.svg";
import "./GoogleSignButton.css";
import "./Auth.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";

export const GoogleSignButton = () => {
  const googleBtnRef = useRef(null);
  const [ready, setReady] = useState(false);
  const { googleLogin } = useContext(AuthContext);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google) {
        clearInterval(interval);

        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: 300,
        });
      }
    });

    setReady(true);

    return () => clearInterval(interval);
  }, []);

  const handleCredentialResponse = async (response) => {
    console.log("GOOGLE RESPONSE:", response);

    const token = response.credential;
    console.log("TOKEN",token)

    try {
      await googleLogin(token);
      console.log("SSO SUCCESS");
      toast.success("Logged in with Google");
    } catch (err) {
      console.log("SSO ERROR:", err);
      toast.error("Google login failed");
    }
  };

  const handleCustomClick = () => {
    if (!googleBtnRef.current) {
      toast.error("Google not ready");
      return;
    }

    const googleButton = googleBtnRef.current.querySelector("div[role=button]");

    if (googleButton) {
      googleButton.click();
    } else {
      toast.error("Google button not ready");
    }
  };

  return (
    <div className="button-container">
      <div ref={googleBtnRef} style={{ display: "none" }} />

      <Button
        disabled={!ready}
        className="sso-button"
        onClick={handleCustomClick}
      >
        <img src={googleIcon} alt="Google icon" />
        Sign in with Google
      </Button>
    </div>
  );
};
