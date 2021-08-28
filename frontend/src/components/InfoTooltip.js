import closeButton from "../images/Close_Icon.svg"

function InfoTooltip({ isOpen, closePopupByClickOutside, onClose, infoPic, infoText }) {
  return (
    <div className={`popup popup_info ${isOpen ? "popup_opened" : ""}`}
    onMouseUp={closePopupByClickOutside}>
      <div className="popup__content popup__content_info">
      <button type="button"
        className="popup__close-button popup__close-button_type_info"
        aria-label="закрыть"
        onClick={onClose}
      >
        <img className="popup__close-button-img"
          src={closeButton}
          alt="закрыть"
        />
      </button>
      <img className="popup__result-img"
        src={infoPic}
        alt="закрыть"
      />
      <h2 className="popup__result-text">{infoText}</h2>
      </div>
    </div>
    )
}

export default InfoTooltip