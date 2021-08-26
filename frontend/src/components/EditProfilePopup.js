import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup({isOpen, onClose, onUpdateUser}) {
  //Переменные состояния для управляемых инпутов
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  //Подписываемся на контекст
  const currentUser = React.useContext(CurrentUserContext);

  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  //Обработчики введённых данных
  function onChangeName(event) {
    setName(event.target.value);
  }

  function onChangeDescription(event) {
    setDescription(event.target.value);
  }

  //Обработчик сабмита
  function handleSubmit(event) {
    // Запрещаем браузеру переходить по адресу формы
    event.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser(name, description);
  }

  //Константа с наполнением компонента
  const editProfilePopupChildren = (
    <>
      <input type="text" name="editProfileName" id="name-input" className="edit-form__info-input edit-form__info-input_type_name" placeholder="Имя"  required minLength="2" maxLength="40" value={name || ''} onChange={onChangeName}/>
      <span className="edit-form__error-text name-input-error"></span>
      <input type="text" name="editProfileDescription" id="description-input" className="edit-form__info-input edit-form__info-input_type_description" placeholder="Описание"  required minLength="2" maxLength="200" value={description || ''} onChange={onChangeDescription}/>
      <span className="edit-form__error-text description-input-error"></span>
    </>
  );

  return (
    <PopupWithForm name='profile' title='Редактировать профиль' isOpen={isOpen} onClose={onClose} buttonText={'Сохранить'} onSubmit={handleSubmit}>
      {editProfilePopupChildren}
    </PopupWithForm>
  );
}

export default EditProfilePopup;
