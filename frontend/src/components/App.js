import '../index.css';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import React from 'react';
import { Route, Switch, Redirect, useHistory} from 'react-router-dom';
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ProtectedRoute from './ProtectedRoute';
import Main from './Main';
import Login from './Login';
import Register from './Register';
import InfoToolTip from './InfoTooltip';
import * as auth from '../utils/auth';

function App() {
  //константа для работы с useHistory
  const history = useHistory();
  //Создаём переменные состояния для попапов с помощью хуков
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  //Инициализируем стейт с карточками
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = React.useState(false);
  const [isSuccessRegister, setIsSuccessRegister] = React.useState(false);
  // Стейт для проверки авторизации
  const [isUserAuth, setIsUserAuth] = React.useState(false);




  //При монтировании компонента вызовется этот хук
  //В нём произведём запрос на сервер, чтобы получить новые данные
  React.useEffect(() => {
    if (isUserAuth) {
    //Производим запрос на сервер
    Promise.all([
      //Передаём Массив промисов, которые необходимо выполнить
      //Ответ будет в массиве данных, по порядку написания промисов
      //Но не по порядку их выполнения
      api.getUserInformation(),
      api.getInitialCards()
    ])
        .then(([userData, cardsList])=>{
          //Попадаем сюда, только когда оба промиса будут выполнены
          //Устанавливаем полученные данные пользователя
          setCurrentUser(userData.data);
          //Передаём карточки в стейт cards
          setCards(cardsList.data.reverse());
        })
        .catch((err)=>{
          console.log(err);
        })
    }
  }, [isUserAuth]);

  //Проверяем есть ли токен в хранилище (делаем 1 раз при монтировании)
  React.useEffect(() => {
    tokenCheck();
  }, []);


  //Обработчик постановки и удаления лайков
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => toString(i._id)  === toString(currentUser._id));
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard.data : c));
      })
      .catch(err => console.log(err));
  }

  //Обработчик удаления карточки
  const handleCardDelete = (card) => {
    api.removeCard(card._id).then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id))
    })
      .catch(err => console.log(err))
  }


  //Колбеки открытия поппов редактирования Аватара, профиля и добавления нового места
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  //Колбек для закрытия попапов
  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsRegisterPopupOpen(false);
    setSelectedCard(null);
  }

  //Колбек установки карточки для фул-вью попапа
  const handleCardClick = (card) => {
    setSelectedCard(card);
  }

  //Обработчик обновления данных пользователя
  const handleUpdateUser = (userName, userAbout) => {
    api.editProfile(userName, userAbout)
      .then(userData => {
        //Высталяем локально новые данные
        setCurrentUser(userData.data);
        //Закрываем попап
        closeAllPopups();
    })
      .catch((err)=>{
        console.log(err);
    });
  }

  //Обработчик обновления аватары
  const handleUpdateAvatar = (avatar) => {
    api.editAvatar(avatar)
      .then(userData => {
        setCurrentUser(userData.data);
        closeAllPopups();
      })
      .catch((err)=>{
        console.log(err);
    });
  }

  //Обработчик добавления карточки
  const handleAddPlace = (place, link) => {
    api.addCard(place, link)
      .then(newCard => {
        setCards([newCard.data, ...cards]);
        closeAllPopups();
      })
      .catch((err)=>{
        console.log(err);
      });
  }

  //Обработчики функциональных кнопок в header
  const headerButtonHandlerSignIn = () => {
    history.push('/sign-up')
  }

  const headerButtonHandlerSignUp = () => {
    history.push('/sign-in')
  }

  const headerButtonHandlerMain = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    //Зануляем email при выходе
    history.push('/sign-in');
  }

  //Функция проверки токена в локальном хранилище
  const tokenCheck = () => {
    //Получаем токен из локального хранилища
    const jwt = localStorage.getItem('jwt');
    //Если токен есть, то надо залогиниться
    if (jwt) {
      auth.checkToken(jwt).then((res) => {
        if (res.data.email) {
          setEmail(res.data.email);
          setLoggedIn(true);
          // выставляем стейт авторизации
          setIsUserAuth(true);
          history.push('/');
        }
      })
        .catch((err)=>{
        console.log(err);
      });
    }
  }

  //Обработчик для залогинивания
  const handleLogin = (password, email) => {
    auth.authorize(password, email)
      .then(data => {
        //Проверяем, что в ответе есть токен
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setLoggedIn(true);
          setEmail(email);
          history.push('/');
          // Выставляем стейт, чтобы отрендерить страницу
          setIsUserAuth(true);
        }
      })
      .catch(err => console.log(err));
  }


  //Обработчик регистрации
  const handleRegister = (password, email) => {
    auth.register(password, email)
      .then((data) => {
          //Здесь должны показать попап
          //Проверяем есть ли в ответе эмейл
          if (data.data.email) {
            //Выставляем стейты для попапа
            setIsSuccessRegister(true);
            setIsRegisterPopupOpen(true);
          }
          //Отправляем на страницу входа
          history.push('/sign-in')
        })
      .catch(err => {
        console.log(err)
        //Если делать несколько регистраций подряд, то может быть неверное состояние стейта
        //Поэтому принудительно выставляем его в false
        setIsSuccessRegister(false);
        setIsRegisterPopupOpen(true);
      });
  }

  //Возвращаем разметку всей страницы
  //Предварительно оборачваем все компоненты в провайдер контекста
  //Чтобы во всех них был доступен контекст
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <div className="page">
          <Switch>
            <Route path="/sign-up">
              <Register
                headerHandler={headerButtonHandlerSignUp}
                handlerRegister={handleRegister}
              />
            </Route>
            <Route path="/sign-in">
              <Login
                headerHandler={headerButtonHandlerSignIn}
                handlerLogin={handleLogin}
              />
            </Route>
            <ProtectedRoute exact path="/"
              loggedIn={loggedIn}
              component={Main}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              cards={cards} onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              headerHandler={headerButtonHandlerMain}
              email={email}
            />
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlace}
          />
          <PopupWithForm
            name='delete'
            title='Вы уверены?'
            onClose={closeAllPopups}
            buttonText={'Да'}
          />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
          />
          <InfoToolTip
            isOpen={isRegisterPopupOpen}
            onClose={closeAllPopups}
            isSucces={isSuccessRegister}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
