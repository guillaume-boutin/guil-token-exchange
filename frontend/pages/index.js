import Head from "next/head";
import { App } from "../components/app";

export default function Home() {
  return (
    <>
      <Head>
        <title>Guil Token Exchange</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <App />
    </>
  );
}
