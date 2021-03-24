import React, {useEffect} from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {fetchFilm} from '../../store/api-actions';
import {Lists} from '../../const';
import {getSimilarFilms} from '../../utils';
import {propFilm} from '../../props-validation';

import MovieCardFull from './movie-card-full/movie-card-full';
import Tabs from './tabs/tabs';
import MoviesList from '../movies-list/movies-list';
import LoadingScreen from '../loading-screen/loading-screen';
import NotFoundScreen from '../not-found-screen/not-found-screen';
import Footer from '../footer/footer';

const MoviePageScreen = ({films, film, id, isLoadFilm, onLoadFilm, isLoadFilmFailed, authorizationStatus}) => {
  useEffect(() => {
    if (!isLoadFilm) {
      onLoadFilm(id);
    }
  }, [isLoadFilm]);

  if (!isLoadFilm && !isLoadFilmFailed) {
    return <LoadingScreen />;
  } if (!isLoadFilm && isLoadFilmFailed) {
    return <NotFoundScreen />;
  }

  const similarFilms = getSimilarFilms(films, film);

  return (
    <>
      <MovieCardFull film={film} id={id} authorizationStatus={authorizationStatus}>
        <Tabs film={film}/>
      </MovieCardFull>

      <div className="page-content">
        <section className="catalog catalog--like-this">
          <h2 className="catalog__title">More like this</h2>
          {similarFilms && <MoviesList films={similarFilms.splice(0, Lists.MAX_SIMILAR)} />}
        </section>

        <Footer />

      </div>
    </>
  );
};

MoviePageScreen.propTypes = {
  films: PropTypes.arrayOf(
      PropTypes.shape(propFilm).isRequired
  ).isRequired,
  film: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  isLoadFilm: PropTypes.bool.isRequired,
  onLoadFilm: PropTypes.func.isRequired,
  isLoadFilmFailed: PropTypes.bool.isRequired,
  authorizationStatus: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    film: state.film,
    isLoadFilm: state.isLoadFilm,
    isLoadFilmFailed: state.isLoadFilmFailed,
    authorizationStatus: state.authorizationStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoadFilm: (id) => dispatch(fetchFilm(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoviePageScreen);
