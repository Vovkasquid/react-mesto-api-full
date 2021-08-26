import React from "react";

function PopupWithForm({name, title, isOpen, onClose, children, buttonText, onSubmit}) {
  // В children автоматически вставится код
  // Который будет указан между тегами компонента в App
  return (
    <div className={`${isOpen && `popup_status_active`} popup edit-form edit-form_type_${name}`}>
      <form name={name + "EditForm"} className="edit-form__form-container" onSubmit={onSubmit}>
        <h2 className="edit-form__form-description">{title}</h2>
        {children}
        <button aria-label={buttonText} type="submit" className={`edit-form__submit-button edit-form__submit-button_type_${name}`}>{buttonText}</button>
        <button aria-label="Закрыть" type="button" className={`popup__close-btn edit-form__close-button edit-form__close-button_type_${name}`} onClick={onClose}></button>
      </form>
    </div>
  );
}

export default PopupWithForm;
