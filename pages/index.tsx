import type { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import Head from 'next/head'
import { useRemastersQuery } from '../generated/graphql'
import discoverStyles from '../styles/Discover.module.css'
import { createUrqlClient } from '../utils/createUrqlClient'

const Discover: NextPage = () => {
  const [{data}] = useRemastersQuery();
  return ( 
    <div className={discoverStyles['discover-page-root']}> 
      <Head>
        <title>Remaster</title>
      </Head>
      {!data ? null : data.remasters.map((r) => <div key={r._id}>{r.name}</div>)}
    </div>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Discover);



// import type { NextPage } from 'next'
// import Head from 'next/head'
// import discoverStyles from '../styles/Discover.module.css'

// const Discover: NextPage = () => {
//   return ( 
//     <div className={discoverStyles['discover-page-root']}> 
//       <Head>
//         <title>remaster</title>
//       </Head>
//       hello
//     </div>
//   )
// }

// export default Discover
