import React from 'react'
import './Breweries.css'
import propTypes from 'prop-types'
import BreweryCard from '../BreweryCard/BreweryCard'
import FilterForm from '../FilterForm/FilterForm'

const Breweries = ({ searchResults, toggleBreweryToUserList, breweriesToVisit, breweriesVisited, filterSearchResults, filteredSearchResults, filtered, resetFilter }) => {
  let results; 
  filtered ? results = filteredSearchResults : results = searchResults;
  const sortedSearchResults = results.sort((a,b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0)

  const cards = sortedSearchResults.map(brewery => {
    const inBreweriesToVisit = breweriesToVisit.find(item => item.id === brewery.id) || null
    const inBreweriesVisited = breweriesVisited.find(item => item.id === brewery.id) || null

    return (
        <BreweryCard
          key={brewery.id}
          name={brewery.name}
          type={brewery.brewery_type}
          city={brewery.city}
          state={brewery.state}
          toggleBreweryToUserList={toggleBreweryToUserList}
          inBreweriesToVisit={inBreweriesToVisit}
          inBreweriesVisited={inBreweriesVisited}
        />
    )
  })

  return (
    <section className='Breweries'>
      {searchResults.length > 0 &&
        <>
          <section className='results-top-text'>
            <FilterForm 
              searchResults={searchResults}
              filterSearchResults={filterSearchResults}
              resetFilter={resetFilter}
            />
            <h2 className='results-heading'>Search Results</h2>
            <div className='extra-space'></div>
          </section>
          <section className='brewery-cards'>
            {cards.length > 0 ? cards : <p>Sorry, no results match your filter term(s).</p>}
          </section>
        </>
       }
    </section>
  )
}

Breweries.propTypes = {
  searchResults: propTypes.array.isRequired,
  toggleBreweryToUserList: propTypes.func.isRequired,
  breweriesToVisit: propTypes.array.isRequired,
  breweriesVisited: propTypes.array.isRequired,
  filterSearchResults: propTypes.func.isRequired,
  filteredSearchResults: propTypes.array.isRequired,
  filtered: propTypes.bool.isRequired,
  resetFilter: propTypes.func
}


export default Breweries 