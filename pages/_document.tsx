import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet='utf-8' />
          <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
          <meta itemProp='name' content='Spotify Clone' />
          <meta name='author' content='ARJ' />
          <meta name='language' content='en-us' />
          <meta property='og:type' content='website' />
          <meta
            property='og:url'
            content='https://next-spotify-clone-xi.vercel.app'
          />
          <meta property='og:site_name' content='Spotify Clone' />
          <meta property='og:title' content='Spotify Clone' />
          <meta
            property='og:image'
            content='https://ik.imagekit.io/36athv2v82c8/Screenshot_2022-06-12_191653_y8VfSkZqt.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655041634146'
          />
          <meta
            property='og:image:url'
            content='https://ik.imagekit.io/36athv2v82c8/Screenshot_2022-06-12_191653_y8VfSkZqt.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655041634146'
          />
          
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
