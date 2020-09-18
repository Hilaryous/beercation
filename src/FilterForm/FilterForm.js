import React, { Component } from 'react'
import './FilterForm.css'
import propTypes from 'prop-types'

class FilterForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bar: false, 
      brewpub: false, 
      micro: false,
      large: false,
      regional: false,
      other: false 
    }
  }

  handleInputChange = (event) => {
    const name = event.target.name
    const value = event.target.checked
    this.setState( { [name]: value})
  }

  render() {
    return (
      <section className='FilterForm'>
        <p className='filter-text'>Filter by brewery type:</p>
        <form>
          <section className='row1'>
            <input type='checkbox' id='option1' name='bar' checked={this.state.bar} onChange={this.handleInputChange}/>
            <label htmlFor='option1'>Bar</label>
            <input type='checkbox' id='option2' name='brewpub' checked={this.state.brewpub} onChange={this.handleInputChange}/>
            <label htmlFor='option2'>Brewpub</label>
            <input type='checkbox' id='option3' name='micro' checked={this.state.micro} onChange={this.handleInputChange}/>
            <label htmlFor='option3'>Microbrewery</label>
          </section>
          <section className='row2'>
            <input type='checkbox' id='option4' name='large' checked={this.state.large} onChange={this.handleInputChange}/>
            <label htmlFor='option4'>Large</label>
            <input type='checkbox' id='option5' name='regional' checked={this.state.regional} onChange={this.handleInputChange}/>
            <label htmlFor='option5'>Regional</label>
            <input type='checkbox' id='option6' name='other' checked={this.state.other} onChange={this.handleInputChange}/>
            <label htmlFor='option6'>Other</label>
          </section>
          <button className='filter-btn'>Filter search</button>
        </form>
        </section>
    )
  }
}

FilterForm.propTypes = {
  searchResults: propTypes.array.isRequired
}


export default FilterForm


// bar, brewpub, micro, large, regional, other (planning, contract, proprietor)