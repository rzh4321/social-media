import Provider from "../../components/Provider";
import Footer from "../../components/Footer";
import "../../styles/Home.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../../config/authOptions";
import { redirect } from 'next/navigation'

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

export const metadata = {
  title: "Retiform",
  description: "Sign in page",
};

const RootLayout = async ({ children }) => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/home')
  }
  return (
  <html lang="en" data-bs-theme="dark">
    <body class="wrapper">
      <Provider>
        {children}
        <Footer />
      </Provider>
    </body>
  </html>
  )
};

export default RootLayout;
