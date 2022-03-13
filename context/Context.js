import { createContext } from "react";
import { Web3Store } from "../stores";
import { OrdersStore } from "../stores/OrdersStore";
import { BalancesStore } from "../stores/BalancesStore";

const web3Store = new Web3Store();
const ordersStore = new OrdersStore();
const balancesStore = new BalancesStore();

export const Context = createContext({ web3Store, ordersStore, balancesStore });

// export const ContextProvider = ({ children }) => (
//   <Context.Provider
//     value={{
//       web3Store: new Web3Store(),
//     }}
//   >
//     {children}
//   </Context.Provider>
// );
//
// export const ContextConsumer = ({ children }) => (
//   <Context.Consumer>
//     {(context) =>
//       observer(({ web3Store }) => children({ web3Store: context.web3Store }))
//     }
//   </Context.Consumer>
// );
//
// export const connect = (mapContextToProps, Component) => <Component />;
