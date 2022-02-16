import {
  Tabs as BaseTabs,
  TabList as BaseTabList,
  Tab as BaseTab,
  TabPanels as BaseTabPanels,
  TabPanel as BaseTabPanel,
} from "@reach/tabs";
import styled from "styled-components";

const StyledTabs = styled(BaseTabs)`
  [data-reach-tab-list] {
    border-bottom: 1px solid white;
  }

  [data-reach-tab] {
    cursor: pointer;
    color: white;
    padding: 4px;

    &[data-selected] {
      border-bottom: 1px solid #007bff;
    }
  }
`;

export const Tabs = ({ children }) => <StyledTabs>{children}</StyledTabs>;

export const TabList = (props) => (
  <BaseTabList {...props}>{props.children}</BaseTabList>
);

export const Tab = (props) => <BaseTab {...props} />;

export const TabPanels = (props) => (
  <BaseTabPanels {...props}>{props.children}</BaseTabPanels>
);

export const TabPanel = (props) => (
  <BaseTabPanel {...props}>{props.children}</BaseTabPanel>
);
