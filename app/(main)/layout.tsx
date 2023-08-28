import { Provider } from "@components/Provider";

export const metadata = {
  title: "title",
  description: "some desc",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      <Provider></Provider>
    </body>
  </html>
);

export default RootLayout;
