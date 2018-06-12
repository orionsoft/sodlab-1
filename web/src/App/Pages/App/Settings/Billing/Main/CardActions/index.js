import React from 'react'
import styles from './styles.css'
import IconButton from 'orionsoft-parts/lib/components/IconButton'
import DeleteIcon from 'react-icons/lib/md/delete'
import DefaultIcon from 'react-icons/lib/md/star'
import NotDefaultIcon from 'react-icons/lib/md/star-border'
import PropTypes from 'prop-types'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'

@withMutation(gql`
  mutation deleteCard($cardId: String) {
    deleteCard(cardId: $cardId) {
      _id
      cards {
        id
        isDefault
      }
    }
  }
`)
@withMutation(gql`
  mutation setDefaultCard($cardId: String) {
    setDefaultCard(cardId: $cardId) {
      _id
      cards {
        id
        isDefault
      }
    }
  }
`)
@withMessage
export default class CardActions extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    card: PropTypes.object,
    deleteCard: PropTypes.func,
    defaultCard: PropTypes.func
  }

  state = {}

  @autobind
  async deleteCard() {
    this.setState({loading: true})
    try {
      await this.props.deleteCard({
        cardId: this.props.card.id
      })
      this.props.showMessage('La tarjeta fue desvinculada de tu cuenta')
    } catch (error) {
      this.props.showMessage(error)
    }
    this.setState({loading: false})
  }

  @autobind
  async setDefaultCard() {
    this.setState({loading: true})
    try {
      await this.props.setDefaultCard({
        cardId: this.props.card.id
      })
      this.props.showMessage('La tarjeta marcada se usará desde ahora')
    } catch (error) {
      this.props.showMessage(error)
    }
    this.setState({loading: false})
  }

  render() {
    const {card} = this.props
    return (
      <div className={styles.icons}>
        <IconButton
          size={20}
          loading={this.state.loading}
          style={{marginRight: 5}}
          disabled={card.isDefault}
          icon={card.isDefault ? DefaultIcon : NotDefaultIcon}
          tooltip={card.isDefault ? 'Los cobros se realizarán a esta tarjeta' : 'Usar esta tarjeta'}
          onPress={this.setDefaultCard}
        />
        <IconButton
          size={20}
          loading={this.state.loading}
          icon={DeleteIcon}
          tooltip="Borrar tarjeta"
          onPress={this.deleteCard}
        />
      </div>
    )
  }
}
