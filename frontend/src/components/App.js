import "../index.css"
import Main from "./Main"
import Footer from "./Footer"
import EditProfilePopup from "./EditProfilePopup"
import EditAvatarPopup from "./EditAvatarPopup"
import AddPlacePopup from "./AddPlacePopup"
import ImagePopup from "./ImagePopup"
import Login from "./Login"
import Register from "./Register"
import InfoTooltip from "./InfoTooltip"
import ProtectedRoute from "./ProtectedRoute"
import doneImage from "../images/done.svg"
import nopeImage from "../images/nope.svg"
import * as Auth from "../utils/auth"
import { useEffect, useState } from "react"
import api from "../utils/api"
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import { Switch, Route, useHistory, Redirect } from "react-router-dom"

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState({})
  const [selectedCard, setSelectedCard] = useState({
    link: '',
    name: '',
    isOpened: false
  })
  const [cards, setCards] = useState([])
  const [waiting, setWaiting] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [infoPic, setInfoPic] = useState(null)
  const [infoText, setInfoText] = useState(null)
  const history = useHistory()

  useEffect(() => {
    tokenCheck()
  }, [])

  const tokenCheck = () => {
    const token = localStorage.getItem('token')
    if (token) {
      Auth.getToken(token).then(res => {
        if (res.email) {
          setUserEmail(res.email)
          setLoggedIn(true)
          history.push('/')
        }
      })
      .catch(err => console.log(err))
    }
  }

  const handleRegister = (email, password) => {
    setWaiting('Регистрация...')
    Auth.register(email, password)
    .then(res => {
      if (res.email) {
        setInfoText('Вы успешно зарегистрировались!')
        setInfoPic(doneImage)
        handleInfoPopup()
        setTimeout(() => {
          handleLogin(email, password);
        }, 500)}
      })
    .catch(err => {console.log(err)
    setInfoText('Что-то пошло не так! Попробуйте ещё раз.')
    setInfoPic(nopeImage)
    handleInfoPopup()})
    .finally(() => {setWaiting(null)})
  }

  const handleLogin = (email, password) => {
    setWaiting('Вход...')
    Auth.login(email, password)
      .then(res => {
        if (res.token) {
          localStorage.setItem('token', res.token)
          setUserEmail(email)
          setLoggedIn(true)
          history.push('/')
        }
      })
      .catch(err => console.log(err))
      .finally(() => {setWaiting(null)})
  }

  const onSignOut = () => {
    localStorage.removeItem('token')
    setLoggedIn(false)
    setUserEmail('')
  }

  useEffect(() => {
    if (loggedIn === true) {
      api.getUserInformation()
      .then(userData => {
        setCurrentUser(userData)
      })
      .catch(err => console.log(err))}
  }, [loggedIn])

  useEffect(() => {
    if (loggedIn === true) {
      api.getInitialCards()
      .then(cardsData => {
          setCards(cardsData)
      })
      .catch(err => console.log(err))}
  }, [loggedIn])

  //Обработчики открытия попапов
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen)
  }
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen)
  }
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen)
  }
  const handleInfoPopup = () => {
    setIsInfoPopupOpen(!isInfoPopupOpen)
  }

  //Обработчик информации о пользователе
  const handleUpdateUser = (userData) => {
    setWaiting('Сохранение...')
    api.editProfile(userData)
      .then((data) => {
      setCurrentUser(data)
      closeAllPopups()
    })
      .catch(err => console.log(err))
      .finally(() => {setWaiting(null)})
  }

  //Обработчик информации об аватаре
  const handleUpdateAvatar = (userAvatar) => {
    setWaiting('Сохранение...')
    api.editAvatar(userAvatar)
      .then((data) => {
      setCurrentUser(data)
      closeAllPopups()
    })
      .catch(err => console.log(err))
      .finally(() => {setWaiting(null)})
  }

  //Обработчик лайков
  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i === currentUser._id)
    api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
    })
    .catch(err => console.log(err))
  }

  //Обработчик удаления карточки
  const handleCardDelete = (card) => {
    api.removeCard(card._id).then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id))
    })
    .catch(err => console.log(err))
  }

  //Обработчик добавления карточки
  const handleAddPlaceSubmit = (newCard) => {
    setWaiting('Добавление...')
    api.addCard(newCard).then((newCard) => {
      setCards([newCard, ...cards])
      closeAllPopups()
    })
      .catch(err => console.log(err))
      .finally(() => {setWaiting(null)})
  }

  //Обработчик клика по карточке
  const handleCardClick = ({link, name, isOpened}) => {
    setSelectedCard({
      link: link,
      name: name,
      isOpened: !isOpened,
    })
  }

  //Закрытие всех попапов
  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsInfoPopupOpen(false)
    setSelectedCard({
      link: '',
      name: '',
      isOpened: false,
    })
  }

  //Закрытие попапа по клику вне формы
  const closePopupByClickOutside = (evt) => {
    if (evt.target.classList.contains('popup_opened')){
      closeAllPopups()
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <Switch>
          <ProtectedRoute exact path="/"
            loggedIn={loggedIn}
            component={Main}
            mailHandler={userEmail}
            onSignOut={onSignOut}
            onHeaderButton= {closeAllPopups}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards} />
          <Route path="/sign-up">
            <Register handleRegister={handleRegister}
            waiting={waiting} />
          </Route>
          <Route path="/sign-in">
            <Login handleLogin={handleLogin}
            waiting={waiting} />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          closePopupByClickOutside={closePopupByClickOutside}
          onUpdateUser={handleUpdateUser}
          waiting={waiting} />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          closePopupByClickOutside={closePopupByClickOutside}
          onUpdateAvatar={handleUpdateAvatar}
          waiting={waiting} />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          closePopupByClickOutside={closePopupByClickOutside}
          onAddPlace={handleAddPlaceSubmit}
          waiting={waiting} />

        <ImagePopup
          onClose={closeAllPopups}
          card={selectedCard}
          closePopupByClickOutside={closePopupByClickOutside} />

        <InfoTooltip
          onClose={closeAllPopups}
          isOpen={isInfoPopupOpen}
          closePopupByClickOutside={closePopupByClickOutside}
          infoPic={infoPic}
          infoText={infoText} />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App
