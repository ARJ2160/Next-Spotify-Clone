import React from 'react';
import { getProviders, signIn } from 'next-auth/react';
import Image from 'next/image';

const Login = ({ providers }: any) => {
  return (
    <div className='bg-black flex items-center justify-center flex-col h-screen w-full'>
      <img
        className='w-52 mb-5'
        src='https://links.papareact.com/9xl'
        alt='Spotify'
      />
      {Object.values(providers).map((provider: any) => (
        <div key={1}>
          <button
            className='bg-[#18D860] rounded-full text-white p-5'
            onClick={() => signIn(provider.id, { callbackUrl: '/' })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Login;

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
};
