export default class MovieApiService {
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NGMwMjQ3Mjc3NjFkNmMxZjg5YTRlYTMxOTBkM2FkMCIsIm5iZiI6MTcyMzMwNzE3Mi4wNjc0MzUsInN1YiI6IjY2YjUwMDA0ZmZkMDU3MmRiYjI3ZjJiNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iDJ65TK49FOj1Iv8PzcBWLgnfw4Gw0wPbjr536E9dB4',
    },
  }

  totalPages = 1

  async searchMoviesByQuery(query, page = 20) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}`
    const res = await fetch(url, this.options)
    if (!res.ok) {
      throw new Error(`Could not fetch ${url} received ${res.status}`)
    }
    const body = await res.json()
    this.totalPages = body['total_pages'] > 100 ? 100 : body['total_pages']
    const resArray = body['results']
    if (resArray.length === 0 || !resArray) {
      throw new Error('Incorrect query')
    }
    const moviesWithoutPoster = resArray.filter((resObj) => !resObj['poster_path'])
    const moviesWithPoster = resArray.filter((resObj) => resObj['poster_path'])
    moviesWithoutPoster.forEach((movie) => {
      moviesWithPoster.push(movie)
    })
    return moviesWithPoster.map((resObj) => ({
      id: resObj.id,
      title: resObj.title,
      releaseDate: resObj['release_date'],
      genres: resObj.genres,
      overview: resObj.overview,
      voteAverage: resObj['vote_average'],
      imageSrc: `https://image.tmdb.org/t/p/original${resObj['poster_path']}`,
    }))
  }
}
