import {
  Tabs as BaseTabs,
  TabList as BaseTabList,
  Tab as BaseTab,
  TabPanels as BaseTabPanels,
  TabPanel as BaseTabPanel,
} from "@reach/tabs";
import styles from "./Tabs.module.scss";

export const Tabs = ({ children }) => <BaseTabs>{children}</BaseTabs>;

export const TabList = (props) => (
  <BaseTabList {...props} className={styles.tabList}>
    {props.children}
  </BaseTabList>
);

export const Tab = (props) => <BaseTab {...props} className={styles.tab} />;

export const TabPanels = (props) => (
  <BaseTabPanels {...props}>{props.children}</BaseTabPanels>
);

export const TabPanel = (props) => (
  <BaseTabPanel {...props}>{props.children}</BaseTabPanel>
);
