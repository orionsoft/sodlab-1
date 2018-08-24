import React from 'react'
import PropTypes from 'prop-types'

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export const IntercomAPI = (...args) => {
  if (canUseDOM && window.Intercom) {
    window.Intercom.apply(null, args)
  } else {
    console.warn('Intercom not initialized yet')
  }
}

export default class Intercom extends React.Component {
  static propTypes = {
    intercomId: PropTypes.string.isRequired,
    email: PropTypes.string
  }

  static displayName = 'Intercom'

  componentDidMount() {
    const {intercomId, email, ...otherProps} = this.props
    if (!intercomId || !canUseDOM) {
      return
    }
    if (!window.Intercom) {
      ;(function(w, d, id, s, x) {
        function i() {
          i.c(arguments)
        }
        i.q = []
        i.c = function(args) {
          i.q.push(args)
        }
        w.Intercom = i
        s = d.createElement('script')
        s.async = 1
        s.src = 'https://widget.intercom.io/widget/' + id
        d.head.appendChild(s)
      })(window, document, intercomId)
    }
    window.intercomSettings = {...otherProps, app_id: intercomId, email}
    if (window.Intercom) {
      window.Intercom('boot', otherProps)
    }
  }

  componentDidUpdateProps(prevProps) {
    const {intercomId, email, ...otherProps} = this.props
    if (!canUseDOM) return
    if (intercomId !== prevProps.intercomId || email !== prevProps.email) {
      window.intercomSettings = {...otherProps, app_id: intercomId, email}
      if (window.Intercom) {
        window.Intercom('update', otherProps)
      }
    }
  }

  shouldComponentUpdate() {
    return false
  }

  componentWillUnmount() {
    if (!canUseDOM || !window.Intercom) return false
    window.Intercom('shutdown')
    delete window.Intercom
  }

  render() {
    return false
  }
}
