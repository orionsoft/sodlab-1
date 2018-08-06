import React from 'react'
import PropTypes from 'prop-types'

const TextSection = props => (
  <div className={props.containerStyle}>
    <span className={props.textStyle}>
      {props.text ? props.text() : props.staticText}
    </span>
  </div>
)

TextSection.propTypes = {
  containerStyle: PropTypes.string,
  textStyle: PropTypes.string,
  text: PropTypes.func,
  staticText: PropTypes.string
}

export default TextSection
