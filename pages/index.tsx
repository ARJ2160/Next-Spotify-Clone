import type { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Center from '../components/Center';
import Player from '../components/Player';
import Sidebar from '../components/Sidebar';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Spotify Clone</title>
      </Head>
      <div className='bg-black h-screen overflow-hidden'>
        <main className='flex'>
          <Sidebar />
          <Center />
        </main>
        <div className='sticky bottom-0'>
          <Player />
        </div>
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
};
