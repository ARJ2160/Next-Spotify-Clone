import type { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { Center, Player, Sidebar } from '../components/index';
import { useRouter } from 'next/router';
import Library from './library';
import Hero from './hero';

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Spotify Clone</title>
      </Head>
      <div className='bg-black h-screen overflow-hidden'>
        <main className='flex'>
          <Sidebar />
          {router.pathname === '/' && <Center />}
          {router.pathname === '/library' && <Library />}
          {router.pathname === '/hero' && <Hero />}
        </main>
        <Player />
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
