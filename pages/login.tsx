import React from 'react';
import { getProviders, signIn } from 'next-auth/react';
import Image from 'next/image';

const Login = ({ providers }: any) => {
  return (
    <div className='bg-black flex items-center justify-center flex-col h-screen w-full'>
      <div
        style={{
          width: '15rem',
          height: '15rem',
          marginBottom: '1.25rem',
          position: 'relative',
        }}
      >
        <Image
          src='https://links.papareact.com/9xl'
          alt='Spotify'
          layout='fill'
          objectFit='contain'
        />
      </div>
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
