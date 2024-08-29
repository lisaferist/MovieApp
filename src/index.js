import React from 'react'
import ReactDOM from 'react-dom/client'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Offline, Online } from 'react-detect-offline'
import { Alert } from 'antd'

import MovieApp from './Components/MovieApp'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <>
    <Online>
      <MovieApp />
    </Online>
    <Offline>
      <div className="error">
        <Alert
          type="error"
          message="К сожалению, без интернета мы не можем показать вам фильмы. Да, даже про котиков :("
        />
      </div>
    </Offline>
  </>
)
