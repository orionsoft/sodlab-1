import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Icon from 'App/components/Icon'
import {Link} from 'react-router-dom'

export default class Card extends React.Component {
  static propTypes = {
    link: PropTypes.object
  }

  renderCard(link) {
    return (
      <Link to={link.path}>
        <div className={styles.header} style={{color: link.textColor}}>
          {link.icon && (
            <div className={styles.icon}>
              <Icon icon={link.icon} />
            </div>
          )}
          <div className={styles.title}>{link.title}</div>
        </div>
      </Link>
    )
  }

  render() {
    const {link} = this.props
    return (
      <div className={styles.container} style={{backgroundColor: link.backgroundColor}}>
        {this.renderCard(link)}
      </div>
    )
  }
}
