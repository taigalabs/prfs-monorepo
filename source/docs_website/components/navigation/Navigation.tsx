import { Navbar } from "nextra-theme-docs";
// import { useTurboSite } from "./SiteSwitcher";
import { Item, PageItem, MenuItem } from "nextra/normalize-pages";

function Navigation(props: NavigationProps) {
  console.log(1, props);
  // const site = useTurboSite();

  const headerItems: (PageItem | MenuItem)[] = [
    {
      kind: "MdxPage",
      name: "docs",
      route: "/",
      title: "Documentation",
      type: "page",
    },
    {
      kind: "MdxPage",
      href: "https://www.prfs.xyz",
      name: "prfs",
      newWindow: true,
      route: "#",
      title: "Prfs↗",
      type: "page",
    },
    {
      kind: "MdxPage",
      href: "https://github.com/taigalabs/prfs-monorepo",
      name: "code",
      newWindow: true,
      route: "#",
      title: "Code↗",
      type: "page",
    },
  ];

  // items last to override the default
  return <Navbar {...props} items={headerItems} />;
}

export default Navigation;

export interface NavigationProps {
  flatDirectories: Item[];
  items: (PageItem | MenuItem)[];
}
