import './MovieApp.css'

import React, { Component } from 'react'
import { Pagination } from 'antd'

import MovieApiService from '../../MovieApiService'
import MovieList from '../MovieList'
import FilterTabs from '../FilterTabs'
import SearchBar from '../SearchBar'

export default class MovieApp extends Component {
  state = {
    query: 'return',
    page: 1,
    movieData: null,
    dataLoading: true,
    error: false,
    errorMessage: null,
    filterTabs: [
      {
        label: 'Search',
        isActive: true,
      },
      {
        label: 'Rated',
        isActive: false,
      },
    ],
  }

  movieService = new MovieApiService()

  componentDidMount() {
    const { query } = this.state
    this.updateMovies(query)
  }

  onError = (err) => {
    this.setState({
      error: true,
      dataLoading: false,
      errorMessage: err.message,
    })
  }

  onFilterTab = (e) => {
    const filterTab = e.target
    const { filterTabs } = this.state
    const activeFilterTab = filterTabs.filter((tab) => tab.isActive === true)[0]
    if (filterTab.textContent === 'Search' && activeFilterTab.label !== 'Search') {
      this.setState({
        filterTabs: [
          {
            label: 'Search',
            isActive: true,
          },
          {
            label: 'Rated',
            isActive: false,
          },
        ],
      })
    } else if (filterTab.textContent === 'Rated' && activeFilterTab.label !== 'Rated') {
      this.setState({
        filterTabs: [
          {
            label: 'Search',
            isActive: false,
          },
          {
            label: 'Rated',
            isActive: true,
          },
        ],
      })
    }
  }

  paginationOnChanged = (page) => {
    const { query } = this.state
    this.updateMovies(query, page)
  }

  searchMovie = (e) => {
    const query = e.target.value
    if (query.length !== 0) {
      this.updateMovies(query)
    }
  }

  updateMovies(query, page = 1) {
    this.movieService
      .searchMoviesByQuery(query, page)
      .then((apiData) => {
        this.setState({ movieData: apiData, query, page })
      })
      .then(() => {
        this.setState({ dataLoading: false })
      })
      .catch((err) => {
        this.onError(err)
      })
  }

  render() {
    const { movieData, dataLoading, error, errorMessage, filterTabs, page } = this.state
    return (
      <div className="movie-app">
        <div className="movie-app__body">
          <FilterTabs onFilterTab={this.onFilterTab} filterTabs={filterTabs} />
          <SearchBar searchMovie={this.searchMovie} />
          <MovieList movieData={movieData} dataLoading={dataLoading} error={error} errorMessage={errorMessage} />
          <Pagination
            defaultCurrent={1}
            current={page}
            defaultPageSize="1"
            hideOnSinglePage="true"
            total={this.movieService.totalPages}
            onChange={this.paginationOnChanged}
            align="center"
          />
        </div>
      </div>
    )
  }
}
