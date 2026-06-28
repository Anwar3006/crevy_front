import type React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  // NOTE: previously this was `w-screen h-screen` with no overflow handling,
  // which clips any content taller than the viewport — this is what broke
  // scrolling on /register-interest (a long multi-section form). `h-screen`
  // fixes the section's height regardless of content length, so anything
  // beyond the viewport was simply cut off, independent of Lenis.
  //
  // `min-h-screen` lets the section grow to fit its content instead of
  // clamping it, and `overflow-y-auto` ensures native scroll works even
  // before Lenis (or on routes where Lenis is disabled) takes over.
  return (
    <section className="w-screen min-h-screen overflow-y-auto">
      {children}
    </section>
  );
};

export default AuthLayout;
