import { FC } from "react";
interface Props {
  children: React.ReactNode;
}
const Layout: FC<Props> = function ({ children }) {
  return <div>{children}</div>;
};
export default Layout;
