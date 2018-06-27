import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import {withRouter} from 'react-router'
import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'
import {Form, Field} from 'simple-react-form'
import autobind from 'autobind-decorator'
import Rule from './Rule'
import cloneDeep from 'lodash/cloneDeep'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import {isValid, clean} from '@orion-js/schema'

const fragment = gql`
  fragment editFilterConditions on Filter {
    _id
    name
    environmentId
    conditions {
      rules {
        fieldName
        operatorId
        type
        fixed
        parameterName
        editableLabel
        operatorInputOptions
      }
    }
    collection {
      _id
      name
      fields {
        name
        label
        type
        fieldType {
          _id
          allowedOperatorsIds
        }
      }
    }
  }
`

@withMessage
@withGraphQL(gql`
  query editFilterQuery($filterId: ID) {
    mutationParams: params(name: "updateFilterConditions", mutation: true) {
      params
    }
    operators {
      _id
      name
      inputType
      fieldType {
        _id
        name
        optionsParams
      }
    }
    filter(filterId: $filterId) {
      ...editFilterConditions
    }
  }
  ${fragment}
`)
@withRouter
@withMutation(gql`
  mutation updateFilterConditions($filterId: ID, $conditions: [UpdateFilterConditionInput]) {
    updateFilterConditions(filterId: $filterId, conditions: $conditions) {
      ...editFilterConditions
    }
  }
  ${fragment}
`)
export default class Conditions extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    filter: PropTypes.object,
    operators: PropTypes.array,
    mutationParams: PropTypes.object
  }

  state = {}

  async componentDidMount() {
    const conditions = cloneDeep(this.props.filter.conditions || [])
    this.setState({
      filterId: this.props.filter._id,
      conditions: await this.mapConditions(conditions)
    })
  }

  @autobind
  async submit({filterId, conditions}) {
    try {
      const mutationSchema = this.props.mutationParams.params
      const parameters = await clean(mutationSchema, {
        filterId,
        conditions
      })
      await this.props.updateFilterConditions(parameters)
      this.props.showMessage('Los campos fueron guardados')
    } catch (error) {
      this.props.showMessage(error)
    }
  }

  safeGetRule(conditions, conditionIndex, ruleIndex) {
    if (!conditions) return
    if (!conditions[conditionIndex]) return
    if (!conditions[conditionIndex].rules) return
    if (!conditions[conditionIndex].rules[ruleIndex]) return
    return conditions[conditionIndex].rules[ruleIndex]
  }

  cleanRule(rule) {
    delete rule.fixed
    delete rule.parameterName
    delete rule.editableLabel
    delete rule.operatorInputOptions
  }

  getOperator(operatorId) {
    return this.props.operators.find(operator => operator._id === operatorId)
  }

  async mapRules(rules, conditionIndex) {
    const promises = rules.map(async (rule, ruleIndex) => {
      const previousRule = this.safeGetRule(this.state.conditions, conditionIndex, ruleIndex)
      if (previousRule) {
        if (previousRule.type !== rule.type) this.cleanRule(rule)
        if (previousRule.fieldName !== rule.fieldName) {
          delete rule.operatorId
          this.cleanRule(rule)
        }
        if (previousRule.operatorId !== rule.operatorId) this.cleanRule(rule)
      }
      const operator = this.getOperator(rule.operatorId)
      return {
        ...rule,
        isValid:
          operator &&
          (await isValid(operator.fieldType.optionsParams, rule.operatorInputOptions || {}))
      }
    })
    return await Promise.all(promises)
  }

  async mapConditions(conditions) {
    const promises = conditions.map(async (condition, conditionIndex) => ({
      rules: await this.mapRules(condition.rules || [], conditionIndex)
    }))
    return await Promise.all(promises)
  }

  @autobind
  async onChange({conditions}) {
    this.setState({conditions: await this.mapConditions(conditions)})
  }

  @autobind
  renderRule(rule, index) {
    return (
      <Rule
        rule={rule || {}}
        index={index}
        operators={this.props.operators}
        collection={this.props.filter.collection}
      />
    )
  }

  render() {
    return (
      <div className={styles.container}>
        <Section
          title="Las condiciones"
          description="Para que un documento se incluya en el resultado del filtro, debe cumplir todas las reglas de al menos un grupo de condiciones">
          <Form
            mutation="updateFilterConditions"
            ref="form"
            onSubmit={this.submit}
            onChange={this.onChange}
            state={this.state}>
            <div className="label">Condiciones</div>

            <Field draggable={false} fieldName="conditions" type={ArrayComponent}>
              <div className="label">Que se cumplan las siguientes reglas</div>
              <Field
                fieldName="rules"
                draggable={false}
                type={ArrayComponent}
                renderItem={this.renderRule}
              />
            </Field>
          </Form>
          <br />
          <Button onClick={() => this.refs.form.submit()} primary>
            Guardar condiciones
          </Button>
        </Section>
      </div>
    )
  }
}
