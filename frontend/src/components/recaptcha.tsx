import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

const recaptchaKey = process.env.RECAPTCHA_KEY || "";

const ReCaptchaCustom = ({ onChange }: { onChange: any }) => {
  if (!recaptchaKey) return null;
  return <ReCAPTCHA sitekey={recaptchaKey} onChange={onChange} />;
};

export default ReCaptchaCustom;
