import React from 'react'
import styles from './styles.css'
import FilterOptions from './FilterOptions'
import PropTypes from 'prop-types'
import {Form, Field} from 'simple-react-form'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import {clean, validate} from '@orion-js/schema'
import isEqual from 'lodash/isEqual'

export default class WithFilter extends React.Component {
  static propTypes = {
    filters: PropTypes.array,
    allowsNoFilter: PropTypes.bool,
    filterByDefault: PropTypes.string,
    parameters: PropTypes.object,
    sizes: PropTypes.object,
    children: PropTypes.func
  }

  state = {}

  componentDidMount() {
    this.setDefaultFilter()
    this.checkFilterOptionsSchema()
  }

  setDefaultFilter() {
    const {allowsNoFilter, filters, filterByDefault} = this.props
    if (filterByDefault) {
      this.setState({filterId: filterByDefault})
      return
    }
    if (allowsNoFilter) return
    if (!filters) return
    if (filters.length !== 1) return
    this.setState({filterId: filters[0]._id})
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.filterId !== prevState.filterId) {
      // eslint-disable-next-line
      this.setState({options: null})
      this.checkFilterOptionsSchema()
    }
    if (prevProps.filterByDefault !== this.props.filterByDefault) {
      this.setState({filterId: this.props.filterByDefault})
    }
    if (!isEqual(this.state.options, prevState.options)) this.checkFilterOptionsSchema()
    if (!isEqual(this.props.parameters, prevProps.parameters)) this.checkFilterOptionsSchema()
  }

  async checkFilterOptionsSchema() {
    if (!this.state.filterId) {
      return this.setState({filterOptionsAreValid: false, optionValidationErrors: null})
    }
    const filter = this.props.filters.find(f => f._id === this.state.filterId)
    if (!filter) {
      return this.setState({filterOptionsAreValid: false, optionValidationErrors: null})
    }

    const cleaned = await clean(filter.schema || {}, {
      ...this.props.parameters,
      ...this.state.options
    })
    try {
      await validate(filter.schema || {}, cleaned)
      this.setState({
        cleanedFilterOptions: cleaned,
        filterOptionsAreValid: true,
        optionValidationErrors: null
      })
    } catch (error) {
      this.setState({
        cleanedFilterOptions: null,
        filterOptionsAreValid: false,
        optionValidationErrors: error.validationErrors
      })
    }
  }

  renderFilterOptions() {
    if (!this.state.filterId) return
    const filter = this.props.filters.find(f => f._id === this.state.filterId)
    if (!filter) return
    return (
      <FilterOptions
        options={this.state.options || {}}
        filter={filter}
        validationErrors={this.state.optionValidationErrors}
        onChange={options => this.setState({options})}
      />
    )
  }

  renderFilterForm() {
    const {filters, allowsNoFilter, sizes} = this.props
    const options = []
    for (const filter of filters) {
      options.push({label: filter.title, value: filter._id})
    }
    const hasOptions = allowsNoFilter ? options.length : options.length > 1
    if (!hasOptions) return
    return (
      <div className={styles.container}>
        <div
          className={`col-xs-${sizes.sizeSmall} col-sm-${sizes.sizeMedium} col-md-${
            sizes.sizeLarge
          }`}>
          <Form state={this.state} onChange={changes => this.setState(changes)}>
            <div className="label">Elige un filtro</div>
            <Field fieldName="filterId" placeholder="Sin filtro" type={Select} options={options} />
          </Form>
        </div>
      </div>
    )
  }

  renderSelectFilter() {
    return <div className={styles.needToSelectFilter}>Debes seleccionar un filtro</div>
  }

  renderChildren() {
    const {allowsNoFilter} = this.props
    if (!this.state.filterId) {
      if (allowsNoFilter) {
        return this.props.children({})
      } else {
        return this.renderSelectFilter()
      }
    }
    if (allowsNoFilter && !this.state.filterId) return this.renderSelectFilter()
    if (!this.state.filterOptionsAreValid) return
    const {filterId, cleanedFilterOptions: filterOptions} = this.state
    return this.props.children({filterId, filterOptions})
  }

  render() {
    return (
      <div>
        {this.renderFilterForm()}
        {this.renderFilterOptions()}
        {this.renderChildren()}
      </div>
    )
  }
}
