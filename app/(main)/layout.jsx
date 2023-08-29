import Provider from "../../components/Provider";
import { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

export const metadata = {
  title: "home page",
  description: "some desc",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <Provider>{children}</Provider>
    </body>
  </html>
);

export default RootLayout;
