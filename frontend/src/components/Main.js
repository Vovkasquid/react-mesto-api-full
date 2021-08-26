import React from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Header from './Header';
import Footer from './Footer';

function Main({onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards, onCardLike, onCardDelete, headerHandler, email}) {
  //Подписываемся на контекст
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <>
      <Header
        loggedIn={true}
        textButton={'Выйти'}
        userEmail={email}
        headerHandler={headerHandler}
      />
      <main className="content">
        <section className="profile">
          <div className="profile__person">
            <div className="profile__avatar" style={{ backgroundImage: `url(${currentUser.avatar})`}} >
              <div className="profile__overlay" onClick={onEditAvatar}></div>
            </div>
            <div className="profile__info">
              <div className="profile__name-container">
                <h1 className="profile__name">{currentUser.name}</h1>
                <button aria-label="Редактировать профиль" type="button" className="profile__edit-button" onClick={onEditProfile}></button>
              </div>
              <p className="profile__description">{currentUser.about}</p>
            </div>
          </div>
          <button aria-label="Добавить новое фото" type="button" className="profile__new-photo-button" onClick={onAddPlace}></button>
        </section>

        <section className="content-gallery">
          <ul className="content-gallery__cards">
            {cards.map((card) => {
              return (
                <Card card={card} key={card._id} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete}/>
              );
            })}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Main;
