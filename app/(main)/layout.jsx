import Provider from "@/components/Provider";
export const metadata = {
  title: "title",
  description: "some desc",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <Provider>



        {children}
      </Provider>
    </body>
  </html>
);

export default RootLayout;
