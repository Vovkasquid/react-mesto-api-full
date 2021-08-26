import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({isOpen, onClose, onAddPlace}) {
  //Объявляем стейты для управляемых инпутов
  const [place, setPlace] = React.useState('');
  const [link, setLink] = React.useState('');

  //Обработчики управляемого импута
  function onPlaceChange(event) {
    setPlace(event.target.value);
  }

  function onLinkChange(event) {
    setLink(event.target.value);
  }

  //Объявляем константу для пропсов PopupWithForm
  const addPlacePopupChildren = (
    <>
      <input type="text" name="editPlaceName" id="place-input" className="edit-form__info-input edit-form__info-input_type_place" placeholder="Название"  required minLength="2" maxLength="30"  value={place || ''} onChange={onPlaceChange}/>
      <span className="edit-form__error-text place-input-error"></span>
      <input type="url" name="editLinkPlace" id="url-input" className="edit-form__info-input edit-form__info-input_type_link" placeholder="Ссылка на картинку"  required  value={link || ''} onChange={onLinkChange}/>
      <span className="edit-form__error-text url-input-error"></span>
    </>
  );

  //Обработчик сабмита
  function handleSubmit(event) {
    // Запрещаем браузеру переходить по адресу формы
    event.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onAddPlace(place, link);
    //Очищаем поля
    setPlace('');
    setLink('');
  }

  //Выставляем правильные данные при закрытии попапа
  const onCloseHandler = () => {
    setPlace('');
    setLink('');
    onClose();
  }

  return (
    <PopupWithForm name='place' title='Новое место' isOpen={isOpen} onClose={onCloseHandler} buttonText={'Сохранить'} onSubmit={handleSubmit}>
      {addPlacePopupChildren}
    </PopupWithForm>
  );
}

export default AddPlacePopup;
