import Navbar from "./Navbar/Navbar";

const contentStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

function Layout(props) {
  return (
    <>
      <Navbar />
      <div className="Content" style={contentStyle}>
        {props.children}
      </div>
    </>
  );
}

export const getLayout = (page) => <Layout>{page}</Layout>;

export default Layout;
