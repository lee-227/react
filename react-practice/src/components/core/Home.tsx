import { useSelector } from "react-redux";
import Layout from "./Layout";

function Home() {
  let state = useSelector((state: any) => state.router);
  console.log(state);

  return <Layout>Home</Layout>;
}
export default Home;
