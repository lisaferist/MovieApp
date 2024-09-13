import './MovieGenres.css'
import React from 'react'
import { Alert, Spin } from 'antd'

import { MovieGenresConsumer } from '../MovieGenresContext'

export default function MovieGenres({ genresIds }) {
  return (
    <MovieGenresConsumer>
      {(genresObj) => {
        const { genresData, genresDataLoading, genresError } = genresObj
        if (genresError) {
          return <Alert type="error" message="error" />
        }
        if (genresDataLoading) {
          return <Spin size="small" />
        }
        if (genresData) {
          const genresNamesArray = genresIds.map(
            (genreId) => genresData.filter((genreObj) => genreObj.id === genreId)[0].name
          )
          const buttons = genresNamesArray.map((genreName) => (
            <button className="movie__genre-button" key={genreName}>
              {genreName}
            </button>
          ))
          return <div className="movie__genres">{buttons}</div>
        }
      }}
    </MovieGenresConsumer>
  )
}
