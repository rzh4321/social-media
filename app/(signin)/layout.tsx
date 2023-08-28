
export const metadata = {
  title: "sign in page",
  description: "some desc",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      {children}
    </body>
  </html>
);

export default RootLayout;
