class Api {

  constructor({baseUrl, headers}) {
  this._baseUrl = baseUrl;
  this._headers = headers;
  }

  //Метод для проверки ответа
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    //Если условие не выполнено, то делаем промис с ошибкой
    return Promise.reject(`Ошибка: ${res.status}`);
  }
  getUserInformation() {
    //Получаем Промис с данными от сервера
    return fetch(`${this._baseUrl}/users/me`,{
      method: 'GET',
      headers: this._headers
    })
      .then(this._checkResponse);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._checkResponse);
  }

  editProfile(userName, userAbout) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: userName,
        about: userAbout
      })
    })
      .then(this._checkResponse);
  }

  editAvatar(userAvatar) {
    return fetch(`${this._baseUrl}/users/me/avatar `, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: userAvatar
      })
    })
      .then(this._checkResponse);
  }

  addCard(placeName, pictureLink) {
    return fetch(`${this._baseUrl}/cards `, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: placeName,
        link: pictureLink
      })
    })
      .then(this._checkResponse);
  }

  removeCard(cardID) {
    return fetch(`${this._baseUrl}/cards/${cardID}`, {
      method: 'DELETE',
      headers: this._headers
    })
      .then(this._checkResponse);
  }

  addLike(cardID) {
    return fetch(`${this._baseUrl}/cards/likes/${cardID}`, {
      method: 'PUT',
      headers: this._headers
    })
      .then(this._checkResponse);
  }

  removeLike(cardID) {
    return fetch(`${this._baseUrl}/cards/likes/${cardID}`, {
      method: 'DELETE',
      headers: this._headers
    })
      .then(this._checkResponse);
  }

  changeLikeCardStatus(cardID, isLiked) {
    //Либо ставим лайк, либо снимаем его
    return isLiked ? this.addLike(cardID) : this.removeLike(cardID) ;
  }
}

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-23',
  headers: {
    authorization: '07ccc369-ef7d-4b71-a2f4-33043b0ad800',
    'Content-Type': 'application/json'
  }
});

export default api;
