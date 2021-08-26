import React from 'react';
import AuthComponent from './AuthComponent';
import {Link} from 'react-router-dom';

//Компонент для логина пользователя
function Register({headerHandler, handlerRegister}) {
  //Ниже передадим компоненту не стейт, а просто переменную, чтобы он правильно отрендерил компонент
  //Компонент будет не динамическим, а статистическим и включать по роуту. Его перерисовывать не надо
  return (
    <AuthComponent
      isLogin={false}
      headerHandler={headerHandler}
      handlerSubmit={handlerRegister}
      title={'Регистрация'}
      buttonTitle={'Зарегестрироваться'}
    >
      {<p className='auth__answer-text'>Уже зарегистрированы? <Link to='/sign-in' className='auth__link'>Войти</Link></p>}
    </AuthComponent>
  );
}

export default Register;
