import React from 'react';
import AuthComponent from './AuthComponent';

//Компонент для логина пользователя
function Login({headerHandler, handlerLogin}) {
  //Ниже передадим компоненту не стейт, а просто переменную, чтобы он правильно отрендерил компонент
  //Компонент будет не динамическим, а статистическим и включать по роуту. Его перерисовывать не надо
  return (
    <AuthComponent
      isLogin={true}
      headerHandler={headerHandler}
      handlerSubmit={handlerLogin}
      title={'Вход'}
      buttonTitle={'Войти'}
    />
  );
}

export default Login;
