import React from 'react'
import PropTypes from 'prop-types'
import Button from 'orionsoft-parts/lib/components/Button'
import styles from './styles.css'

export default class Device extends React.Component {
  static propTypes = {
    device: PropTypes.string,
    fingerprintImgSrc: PropTypes.string,
    headerText: PropTypes.string,
    onClick: PropTypes.func,
    showButton: PropTypes.bool
  }

  renderFingerprintImg = () => {
    return (
      <img
        id="fingerprintImage"
        alt=""
        src={this.props.fingerprintImgSrc}
        className={styles.fingerprintImg}
      />
    )
  }

  renderSignatureImg = () => {
    return <div id="signatureImageBox" className={styles.signatureImgContainer} />
  }

  render() {
    return (
      <div className={styles.deviceContainer}>
        <div className={styles.deviceHeader}>
          <span className={styles.headerText}>{this.props.headerText}</span>
        </div>
        <div className={styles.deviceImageContainer}>
          {this.props.device === 'fingerprint'
            ? this.renderFingerprintImg()
            : this.renderSignatureImg()}
        </div>
        <div className={styles.deviceButtonContainer}>
          {this.props.showButton ? (
            <Button
              linkButton={false}
              label={this.props.label}
              primary={true}
              danger={false}
              big={false}
              onClick={this.props.onClick}
              disabled={this.props.disabled}
            />
          ) : null}
        </div>
      </div>
    )
  }
}
