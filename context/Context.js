import { createContext } from "react";
import { Web3Store } from "../stores";
import { OrdersStore } from "../stores/OrdersStore";
import { BalancesStore } from "../stores/BalancesStore";
import { EventsStore } from "../stores/EventsStore";

const web3Store = new Web3Store();
const ordersStore = new OrdersStore();
const balancesStore = new BalancesStore();
const eventsStore = new EventsStore();

export const Context = createContext({
  web3Store,
  ordersStore,
  balancesStore,
  eventsStore,
});
