import Provider from "../../components/Provider";
import { Metadata } from "next";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Script from "next/script";

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

export const metadata = {
  title: "home page",
  description: "some desc",
};

const RootLayout = ({ children }) => (
  <html lang="en" data-bs-theme="dark">
    <body>
      <Provider>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-qKXV1j0HvMUeCBQ+QVp7JcfGl760yU08IQ+GpUo5hlbpg51QRiuqHAJz8+BrxE/N"
          crossOrigin="anonymous"
        />
        <Script
          id="sup"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "document.head.appendChild(document.createElement('script')).src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/css/bootstrap.min.css'",
          }}
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"
          integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4"
          crossOrigin="anonymous"
        />

        <div className="mh-100">
          <NavBar />
          <main className="mb-4">{children}</main>
          <Footer />
        </div>
      </Provider>
    </body>
  </html>
);

export default RootLayout;
