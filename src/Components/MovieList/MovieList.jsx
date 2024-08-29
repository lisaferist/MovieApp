import './MovieList.css'
import { Alert } from 'antd'
import React from 'react'

import Movie from '../Movie'

export default function MovieList({ movieData, dataLoading, error, errorMessage }) {
  let movies = []
  if (error) {
    return error ? (
      <div className="error">
        <Alert
          type="error"
          message={`Произошла ошибка при загрузке данных. Попробуйте отправить запрос повторно или измените текст запроса.
          Ошибка: ${errorMessage}`}
        />
      </div>
    ) : null
  }
  if (dataLoading) {
    for (let i = 0; i < 20; i++) {
      movies.push(<Movie key={i} dataLoading={dataLoading} error={error} errorMessage={errorMessage} />)
    }
  } else {
    movies = movieData.map((movie) => {
      const { id, ...movieProps } = movie
      return <Movie {...movieProps} id={id} key={id} />
    })
  }
  return <ul className="movie-list">{movies}</ul>
}
