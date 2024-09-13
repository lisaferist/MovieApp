export default class MovieApiService {
  options = {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NGMwMjQ3Mjc3NjFkNmMxZjg5YTRlYTMxOTBkM2FkMCIsIm5iZiI6MTcyMzMwNzE3Mi4wNjc0MzUsInN1YiI6IjY2YjUwMDA0ZmZkMDU3MmRiYjI3ZjJiNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iDJ65TK49FOj1Iv8PzcBWLgnfw4Gw0wPbjr536E9dB4',
    },
  }

  totalPages = 1

  totalRatedPages = 1

  guestSessionId = null

  async searchMoviesByQuery(query, page = 1) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}`
    const res = await fetch(url, { method: 'GET', ...this.options })
    if (!res.ok) {
      throw new Error(`Could not fetch ${url} received: ${res.status}`)
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
      genresIds: resObj['genre_ids'],
      overview: resObj.overview,
      voteAverage: resObj['vote_average'],
      imageSrc: `https://image.tmdb.org/t/p/original${resObj['poster_path']}`,
    }))
  }

  async getGenresList() {
    const url = 'https://api.themoviedb.org/3/genre/movie/list'
    const res = await fetch(url, { method: 'GET', ...this.options })
    if (!res.ok) {
      throw new Error(`Could not fetch ${url} received: ${res.status}`)
    }
    const body = await res.json()
    return body.genres
  }

  async createGuestSession() {
    const url = 'https://api.themoviedb.org/3/authentication/guest_session/new'
    const res = await fetch(url, { method: 'GET', ...this.options })
    if (!res.ok) {
      throw new Error(`Could not create guest session received: ${res.status}`)
    }
    const body = await res.json()
    if (body.success !== true) {
      throw new Error('Could not create guest session received, try again')
    }
    this.guestSessionId = body['guest_session_id']
    return body
  }

  async addRating(movieId, rating) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${this.guestSessionId}`
    const optionsBody = JSON.stringify({ value: rating })
    const options = {
      method: 'POST',
      ...this.options,
      body: optionsBody,
    }
    const res = await fetch(url, options)
    if (!res.ok) {
      const body = await res.json()
      throw new Error(`Could not rate the movie: ${res.status}: ${body['status_message']}`)
    }
    const body = await res.json()
    return body['status_message']
  }

  async getRatedMovies(page) {
    const url = `https://api.themoviedb.org/3/guest_session/${this.guestSessionId}/rated/movies?language=en-US&page=${page}&sort_by=created_at.asc`
    const res = await fetch(url, { method: 'GET', ...this.options })
    if (!res.ok) {
      throw new Error(`Could not fetch rated movies received: ${res.status}`)
    }
    const body = await res.json()
    this.totalRatedPages = body['total_pages'] > 100 ? 100 : body['total_pages']
    const resArray = body['results']
    if (resArray.length === 0 || !resArray) {
      throw new Error('You dont have any rated movies')
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
      genresIds: resObj['genre_ids'],
      overview: resObj.overview,
      voteAverage: resObj['vote_average'],
      imageSrc: `https://image.tmdb.org/t/p/original${resObj['poster_path']}`,
    }))
  }

  addGuestSessionId(guestSessionId) {
    this.guestSessionId = guestSessionId
  }
}
