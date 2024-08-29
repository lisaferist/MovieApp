import './Movie.css'
import { parseISO, format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { Spin } from 'antd'
import React from 'react'

export default function Movie({ id, dataLoading, error, errorMessage, ...movieProps }) {
  const content = !(dataLoading || error) ? <MovieFragment {...movieProps} /> : null
  const spin = dataLoading ? (
    <div className="movie__loading">
      <Spin size="large" />
    </div>
  ) : null
  return (
    <li className="movie-list__movie movie" id={id}>
      {content}
      {spin}
    </li>
  )
}

function MovieFragment({ title, releaseDate, genres, overview, voteAverage, imageSrc }) {
  function editOverview(text) {
    if (text && text.length !== 0) {
      if (text.length > 250) {
        let newText = text.substring(0, 250)
        newText = `${newText.replace(/\s+\S*$/, '')}...`
        return newText
      }
      return text
    }
    return <span className="movie__empty-overview">The overview is empty :(</span>
  }
  function editDate(date) {
    if (date && date.length !== 0) {
      return format(parseISO(releaseDate), 'LLLL d, yyyy', { locale: enGB })
    }
    return 'The release date is not known'
  }

  return (
    <>
      <img src={imageSrc} alt={`poster for '${title}'`} className="movie__image" />
      <div className="movie__info">
        <div className="movie__header">
          <h3 className="movie__title">{title}</h3>
          <p className="movie__vote-average">{voteAverage}</p>
        </div>
        <p className="movie__date">{editDate(releaseDate)}</p>
        <div className="movie__genres">
          <button className="movie__genre-button">drama {genres}</button>
          <button className="movie__genre-button">comedy {genres}</button>
        </div>
        <p className="movie__overview">{editOverview(overview)}</p>
      </div>
    </>
  )
}
