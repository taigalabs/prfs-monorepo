import { Navbar } from "nextra-theme-docs";
import { Item, PageItem, MenuItem } from "nextra/normalize-pages";

function Navigation(props: NavigationProps) {
  // const headerItems: (PageItem | MenuItem)[] = [
  //   {
  //     kind: "MdxPage",
  //     href: "https://www.prfs.xyz",
  //     name: "prfs",
  //     newWindow: true,
  //     route: "#",
  //     title: "Prfs",
  //     type: "page",
  //   },
  //   {
  //     kind: "MdxPage",
  //     href: "https://github.com/taigalabs/prfs-monorepo",
  //     name: "code",
  //     newWindow: true,
  //     route: "#",
  //     title: "Code",
  //     type: "page",
  //   },
  // ];

  // items last to override the default
  return <Navbar {...props} items={[]} />;
}

export default Navigation;

export interface NavigationProps {
  flatDirectories: Item[];
  items: (PageItem | MenuItem)[];
}
