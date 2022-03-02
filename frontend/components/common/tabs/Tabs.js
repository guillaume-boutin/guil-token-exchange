import {
  Tabs as BaseTabs,
  TabList as BaseTabList,
  Tab as BaseTab,
  TabPanels as BaseTabPanels,
  TabPanel as BaseTabPanel,
} from "@reach/tabs";
import styles from "./Tabs.module.scss";

export const Tabs = (props) => {
  const className = `${props.className ?? ""}`.trim();

  return <BaseTabs className={className}>{props.children}</BaseTabs>;
};

export const TabList = (props) => {
  return (
    <BaseTabList {...props} className={styles.tabList}>
      {props.children}
    </BaseTabList>
  );
};

export const Tab = (props) => {
  return <BaseTab {...props} className={styles.tab} />;
};

export const TabPanels = (props) => {
  return <BaseTabPanels {...props}>{props.children}</BaseTabPanels>;
};

export const TabPanel = (props) => {
  // const className = `${props.className ?? ''}`;

  return <BaseTabPanel {...props}>{props.children}</BaseTabPanel>;
};
