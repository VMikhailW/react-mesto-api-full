import PopupWithForm from "./PopupWithForm"
import {useState} from "react"


function AddPlacePopup ({isOpen, onClose, closePopupByClickOutside, onAddPlace, waiting}) {
  const [name, setName] = useState('')
  const [link, setLink] = useState('')

  function handleNameChange(e) {
    setName(e.target.value)
  }
  function handleLinkChange(e) {
    setLink(e.target.value)
  }
  function handleSubmit(e) {
    e.preventDefault()
    onAddPlace({
      name,
      link,
    })
    setName('')
    setLink('')
  }

  return (
    <PopupWithForm
    name="new-picture"
    title="Новое место"
    isOpen={isOpen}
    onClose={onClose}
    closePopupByClickOutside={closePopupByClickOutside}
    buttonText={waiting || 'Добавить'}
    handleSubmit={handleSubmit}
    >
        <input className="popup__input-field popup__input-field_type_pic-title"
        required
        placeholder="Название"
        type="text"
        name="picture-title"
        minLength="2"
        maxLength="40"
        onChange={handleNameChange}
        value={name}
        />
        <input
        className="popup__input-field popup__input-field_type_pic-link"
        required
        placeholder="Ссылка на изорбажение"
        type="url"
        name="picture-url"
        minLength="2"
        maxLength="200"
        onChange={handleLinkChange}
        value={link}
        />
    </PopupWithForm>
  )
}

export default AddPlacePopup
