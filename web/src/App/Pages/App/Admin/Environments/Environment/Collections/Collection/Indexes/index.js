import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'

export default class Indexes extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Section
          title="Indices"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit">
          selector de indices
        </Section>
      </div>
    )
  }
}
