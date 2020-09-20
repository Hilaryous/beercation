import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import { fetchSearchResults, fetchBreweryByName } from '../helpers/apiCalls'
jest.mock('../helpers/apiCalls.js')

describe('App', () => {
  it('should bring users to the correct views when using the navigation for Home and To Visit', () => {

    render(
      <MemoryRouter>
        < App />
      </MemoryRouter>
    )

    const toVisitLink = screen.getByRole('link', { name: 'TO VISIT' });
    const homeLink = screen.getByRole('link', { name:'HOME' });

    fireEvent.click(toVisitLink);

    const toVisitHeading = screen.getByRole('heading', { name: 'Breweries To Visit'})

    expect(toVisitHeading).toBeInTheDocument(); 

    fireEvent.click(homeLink);

    const homeHeading = screen.getByRole('heading', { name: 'Welcome to Beercation!'});

    expect(homeHeading).toBeInTheDocument();
  });

  it('should bring users to the correct views when using the navigation for Visited, plus the logo and h1', () => {

    render(
      <MemoryRouter>
        < App />
      </MemoryRouter>
    )

    const visitedLink = screen.getByRole('link', { name: 'VISITED' });
    const logoLink = screen.getByAltText('BEERCATION');
    const siteNameLink = screen.getByRole('heading', { name: 'BEERCATION' });

    fireEvent.click(logoLink);

    const homeHeading = screen.getByRole('heading', { name: 'Welcome to Beercation!' }); 

    expect(homeHeading).toBeInTheDocument();

    fireEvent.click(visitedLink);

    const visitedHeading = screen.getByRole('heading', { name: 'Breweries Visited' });

    expect(visitedHeading).toBeInTheDocument();

    fireEvent.click(siteNameLink);

    const homeView = screen.getByRole('heading', { name: 'Welcome to Beercation!' }); 

    expect(homeView).toBeInTheDocument(); 
  });

  it('the To Visit page should have a default message when no breweries have been marked as To Visit', () => {

    render(
      <MemoryRouter>
        < App />
      </MemoryRouter>
    )

    const toVisitLink = screen.getByRole('link', { name: 'TO VISIT' });

    fireEvent.click(toVisitLink);

    const defaultMsg = screen.getByText('You don\'t get have any breweries set as "To Visit" yet! Return to the homepage to search for new breweries and add them to your lists.');

    expect(defaultMsg).toBeInTheDocument();
  });

  it('the Visited page should have a default message when no breweries have been marked as Visited', () => {

    render(
      <MemoryRouter>
        < App />
      </MemoryRouter>
    )

    const visitedLink = screen.getByRole('link', { name: 'VISITED' });

    fireEvent.click(visitedLink);

    const defaultMsg = screen.getByText('You don\'t get have any breweries set as "Visited" yet! Return to the homepage to search for new breweries and add them to your lists.');

    expect(defaultMsg).toBeInTheDocument();
  });

  it('should allow a user to enter a city name in the search bar and see a list of breweries in that city', async () => {

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 1,
        name: 'Denver Brews',
        brewery_type: 'micro',
        street: '1 Lavender Ave',
        city: 'Denver',
        state: 'Colorado',
        postal_code: '12345',
        country: 'United States',
        longitute: '-100',
        latitude: '30',
        phone: '1112223333',
        website_url: 'http://brews.com',
        updated_at: '2020-01-01T21:21:20.283Z'
      },
    ])

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 2,
        name: 'Portland Brews',
        brewery_type: 'brewpub',
        street: '2 Drurey Lane',
        city: 'Portland',
        state: 'Oregon',
        postal_code: '67890',
        country: 'United States',
        longitute: '-50',
        latitude: '40',
        phone: '1384028482',
        website_url: 'http://brews-2.com',
        updated_at: '2017-05-03T21:21:20.283Z'
      }
    ])

    render(
      <MemoryRouter>
        < App />
      </MemoryRouter>
    )

    const searchBar = screen.getByPlaceholderText('Enter a city name');
    const searchBtn = screen.getByRole('button', { name: 'Search'});

    fireEvent.change(searchBar, { target: { value: 'Denver' } });
    fireEvent.click(searchBtn);

    const breweryCard1 = await waitFor(() => screen.getByRole('heading', { name: 'Denver Brews' }));
    const breweryCard2 = screen.getByRole('heading', { name: 'Portland Brews' });

    expect(breweryCard1).toBeInTheDocument();
    expect(breweryCard2).toBeInTheDocument(); 
    expect(searchBar.value).toBe('');
  });

  it('if a user enters a bad search term, they should see an error message', async () => {

    fetchSearchResults.mockResolvedValue([])

    render(
      <MemoryRouter>
        < App />
      </MemoryRouter>
    )

    const searchBar = screen.getByPlaceholderText('Enter a city name');
    const searchBtn = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(searchBar, { target: { value: 'Venus' } });
    fireEvent.click(searchBtn);

    const errorMsg = await waitFor(() => screen.getByText('Sorry, we couldn\'t find any results in Venus.'))

    expect(errorMsg).toBeInTheDocument();
  });

  it('should allow a user to enter a city name in the search bar and then filter the search results', async () => {

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 1,
        name: 'Denver Brews',
        brewery_type: 'micro',
        street: '1 Lavender Ave',
        city: 'Denver',
        state: 'Colorado',
        postal_code: '12345',
        country: 'United States',
        longitute: '-100',
        latitude: '30',
        phone: '1112223333',
        website_url: 'http://brews.com',
        updated_at: '2020-01-01T21:21:20.283Z'
      },
    ])

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 2,
        name: 'Portland Brews',
        brewery_type: 'brewpub',
        street: '2 Drurey Lane',
        city: 'Portland',
        state: 'Oregon',
        postal_code: '67890',
        country: 'United States',
        longitute: '-50',
        latitude: '40',
        phone: '1384028482',
        website_url: 'http://brews-2.com',
        updated_at: '2017-05-03T21:21:20.283Z'
      }
    ])

    render(
      <MemoryRouter>
        < App />
      </MemoryRouter>
    )

    const searchBar = screen.getByPlaceholderText('Enter a city name');
    const searchBtn = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(searchBar, { target: { value: 'Denver' } });
    fireEvent.click(searchBtn);

    const breweryCard1 = await waitFor(() => screen.getByRole('heading', { name: 'Denver Brews' }));
    const breweryCard2 = screen.getByRole('heading', { name: 'Portland Brews' });

    const microCheckbox = screen.getByRole('checkbox', { name: 'Microbrewery' });
    const filterBtn = screen.getByRole('button', { name: 'Filter search' })

    fireEvent.click(microCheckbox);
    fireEvent.click(filterBtn);
    
    expect(breweryCard1).toBeInTheDocument();
    expect(breweryCard2).not.toBeInTheDocument(); 
  });

  it('should allow a user to enter a city name in the search bar, filter results, and then clear the filter', async () => {

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 1,
        name: 'Denver Brews',
        brewery_type: 'micro',
        street: '1 Lavender Ave',
        city: 'Denver',
        state: 'Colorado',
        postal_code: '12345',
        country: 'United States',
        longitute: '-100',
        latitude: '30',
        phone: '1112223333',
        website_url: 'http://brews.com',
        updated_at: '2020-01-01T21:21:20.283Z'
      },
    ])

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 2,
        name: 'Portland Brews',
        brewery_type: 'brewpub',
        street: '2 Drurey Lane',
        city: 'Portland',
        state: 'Oregon',
        postal_code: '67890',
        country: 'United States',
        longitute: '-50',
        latitude: '40',
        phone: '1384028482',
        website_url: 'http://brews-2.com',
        updated_at: '2017-05-03T21:21:20.283Z'
      }
    ])

    render(
      <MemoryRouter>
        < App />
      </MemoryRouter>
    )

    const searchBar = screen.getByPlaceholderText('Enter a city name');
    const searchBtn = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(searchBar, { target: { value: 'Denver' } });
    fireEvent.click(searchBtn);

    const microCheckbox = await waitFor(() => screen.getByRole('checkbox', { name: 'Microbrewery' }));
    const filterBtn = screen.getByRole('button', { name: 'Filter search' })
    const clearFilterBtn = screen.getByRole('button', { name: 'Clear all filters X' })

    fireEvent.click(microCheckbox);
    fireEvent.click(filterBtn);
    fireEvent.click(clearFilterBtn);

    const breweryCard1 = screen.getByRole('heading', { name: 'Denver Brews' });
    const breweryCard2 = screen.getByRole('heading', { name: 'Portland Brews' });

    expect(breweryCard1).toBeInTheDocument();
    expect(breweryCard2).toBeInTheDocument();
  });

  it('if a user searches for breweries, filters, and the filter yields no results, they should see a message indicating that', async () => {

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 1,
        name: 'Denver Brews',
        brewery_type: 'micro',
        street: '1 Lavender Ave',
        city: 'Denver',
        state: 'Colorado',
        postal_code: '12345',
        country: 'United States',
        longitute: '-100',
        latitude: '30',
        phone: '1112223333',
        website_url: 'http://brews.com',
        updated_at: '2020-01-01T21:21:20.283Z'
      },
    ])

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 2,
        name: 'Portland Brews',
        brewery_type: 'brewpub',
        street: '2 Drurey Lane',
        city: 'Portland',
        state: 'Oregon',
        postal_code: '67890',
        country: 'United States',
        longitute: '-50',
        latitude: '40',
        phone: '1384028482',
        website_url: 'http://brews-2.com',
        updated_at: '2017-05-03T21:21:20.283Z'
      }
    ])

    render(
      <MemoryRouter>
        < App />
      </MemoryRouter>
    )

    const searchBar = screen.getByPlaceholderText('Enter a city name');
    const searchBtn = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(searchBar, { target: { value: 'Denver' } });
    fireEvent.click(searchBtn);

    const largeCheckbox = await waitFor(() => screen.getByRole('checkbox', { name: 'Large' }));
    const filterBtn = screen.getByRole('button', { name: 'Filter search' })

    fireEvent.click(largeCheckbox);
    fireEvent.click(filterBtn);

    const message = screen.getByText('Sorry, no results match your filter term(s).')

    expect(message).toBeInTheDocument();
  });

  it('should allow a user to see search results, mark one as "To Visit", and then see the badge for "To Visit" appear', async () => {

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 1,
        name: 'Denver Brews',
        brewery_type: 'micro',
        street: '1 Lavender Ave',
        city: 'Denver',
        state: 'Colorado',
        postal_code: '12345',
        country: 'United States',
        longitute: '-100',
        latitude: '30',
        phone: '1112223333',
        website_url: 'http://brews.com',
        updated_at: '2020-01-01T21:21:20.283Z'
      },
    ])

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 2,
        name: 'Portland Brews',
        brewery_type: 'brewpub',
        street: '2 Drurey Lane',
        city: 'Portland',
        state: 'Oregon',
        postal_code: '67890',
        country: 'United States',
        longitute: '-50',
        latitude: '40',
        phone: '1384028482',
        website_url: 'http://brews-2.com',
        updated_at: '2017-05-03T21:21:20.283Z'
      }
    ])

    fetchBreweryByName.mockResolvedValue([
      {
        id: 1,
        name: 'Denver Brews',
        brewery_type: 'micro',
        street: '1 Lavender Ave',
        city: 'Denver',
        state: 'Colorado',
        postal_code: '12345',
        country: 'United States',
        longitute: '-100',
        latitude: '30',
        phone: '1112223333',
        website_url: 'http://brews.com',
        updated_at: '2020-01-01T21:21:20.283Z'
      },
    ])

    render(
      <MemoryRouter>
        < App />
      </MemoryRouter>
    )

    const searchBar = screen.getByPlaceholderText('Enter a city name');
    const searchBtn = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(searchBar, { target: { value: 'Denver' } });
    fireEvent.click(searchBtn);

    const markAsToVisitBtn1 = await waitFor(() => screen.getByRole('button', { name: 'Mark Denver Brews as To Visit'}));

    fireEvent.click(markAsToVisitBtn1);

    const toVisitBadge = await waitFor(() => screen.getByLabelText('Denver Brews marked as "to visit"'));

    expect(toVisitBadge).toBeInTheDocument(); 
  });

  it('should allow a user to see search results, mark one as "To Visit", and then view it on the "To Visit" page', async () => {

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 1,
        name: 'Denver Brews',
        brewery_type: 'micro',
        street: '1 Lavender Ave',
        city: 'Denver',
        state: 'Colorado',
        postal_code: '12345',
        country: 'United States',
        longitute: '-100',
        latitude: '30',
        phone: '1112223333',
        website_url: 'http://brews.com',
        updated_at: '2020-01-01T21:21:20.283Z'
      },
    ])

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 2,
        name: 'Portland Brews',
        brewery_type: 'brewpub',
        street: '2 Drurey Lane',
        city: 'Portland',
        state: 'Oregon',
        postal_code: '67890',
        country: 'United States',
        longitute: '-50',
        latitude: '40',
        phone: '1384028482',
        website_url: 'http://brews-2.com',
        updated_at: '2017-05-03T21:21:20.283Z'
      }
    ])

    fetchBreweryByName.mockResolvedValue([
      {
        id: 1,
        name: 'Denver Brews',
        brewery_type: 'micro',
        street: '1 Lavender Ave',
        city: 'Denver',
        state: 'Colorado',
        postal_code: '12345',
        country: 'United States',
        longitute: '-100',
        latitude: '30',
        phone: '1112223333',
        website_url: 'http://brews.com',
        updated_at: '2020-01-01T21:21:20.283Z'
      },
    ])

    render(
      <MemoryRouter>
        < App />
      </MemoryRouter>
    )

    const searchBar = screen.getByPlaceholderText('Enter a city name');
    const searchBtn = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(searchBar, { target: { value: 'Denver' } });
    fireEvent.click(searchBtn);

    const markAsToVisitBtn1 = await waitFor(() => screen.getByRole('button', { name: 'Mark Denver Brews as To Visit' }));

    fireEvent.click(markAsToVisitBtn1);

    const toVisitLink = screen.getByRole('link', { name: 'TO VISIT' });

    fireEvent.click(toVisitLink);

    const breweryCard = await waitFor(() => screen.getByRole('heading', { name: 'Denver Brews' }));

    expect(breweryCard).toBeInTheDocument(); 
  });

  it('should allow a user to see search results, mark one as "Visited", and then see the badge for "Visited" appear', async () => {

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 1,
        name: 'Denver Brews',
        brewery_type: 'micro',
        street: '1 Lavender Ave',
        city: 'Denver',
        state: 'Colorado',
        postal_code: '12345',
        country: 'United States',
        longitute: '-100',
        latitude: '30',
        phone: '1112223333',
        website_url: 'http://brews.com',
        updated_at: '2020-01-01T21:21:20.283Z'
      },
    ])

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 2,
        name: 'Portland Brews',
        brewery_type: 'brewpub',
        street: '2 Drurey Lane',
        city: 'Portland',
        state: 'Oregon',
        postal_code: '67890',
        country: 'United States',
        longitute: '-50',
        latitude: '40',
        phone: '1384028482',
        website_url: 'http://brews-2.com',
        updated_at: '2017-05-03T21:21:20.283Z'
      }
    ])

    fetchBreweryByName.mockResolvedValue([
      {
        id: 1,
        name: 'Denver Brews',
        brewery_type: 'micro',
        street: '1 Lavender Ave',
        city: 'Denver',
        state: 'Colorado',
        postal_code: '12345',
        country: 'United States',
        longitute: '-100',
        latitude: '30',
        phone: '1112223333',
        website_url: 'http://brews.com',
        updated_at: '2020-01-01T21:21:20.283Z'
      },
    ])

    render(
      <MemoryRouter>
        < App />
      </MemoryRouter>
    )

    const searchBar = screen.getByPlaceholderText('Enter a city name');
    const searchBtn = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(searchBar, { target: { value: 'Denver' } });
    fireEvent.click(searchBtn);

    const markAsVisitedBtn1 = await waitFor(() => screen.getByRole('button', { name: 'Mark Denver Brews as Visited' }));

    fireEvent.click(markAsVisitedBtn1);

    const visitedBadge = await waitFor(() => screen.getByLabelText('Denver Brews marked as "visited"'));

    expect(visitedBadge).toBeInTheDocument();
  });

  it('should allow a user to see search results, mark one as "Visited", and then view it on the "Visited" page', async () => {

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 1,
        name: 'Denver Brews',
        brewery_type: 'micro',
        street: '1 Lavender Ave',
        city: 'Denver',
        state: 'Colorado',
        postal_code: '12345',
        country: 'United States',
        longitute: '-100',
        latitude: '30',
        phone: '1112223333',
        website_url: 'http://brews.com',
        updated_at: '2020-01-01T21:21:20.283Z'
      },
    ])

    fetchSearchResults.mockResolvedValueOnce([
      {
        id: 2,
        name: 'Portland Brews',
        brewery_type: 'brewpub',
        street: '2 Drurey Lane',
        city: 'Portland',
        state: 'Oregon',
        postal_code: '67890',
        country: 'United States',
        longitute: '-50',
        latitude: '40',
        phone: '1384028482',
        website_url: 'http://brews-2.com',
        updated_at: '2017-05-03T21:21:20.283Z'
      }
    ])

    fetchBreweryByName.mockResolvedValue([
      {
        id: 1,
        name: 'Denver Brews',
        brewery_type: 'micro',
        street: '1 Lavender Ave',
        city: 'Denver',
        state: 'Colorado',
        postal_code: '12345',
        country: 'United States',
        longitute: '-100',
        latitude: '30',
        phone: '1112223333',
        website_url: 'http://brews.com',
        updated_at: '2020-01-01T21:21:20.283Z'
      },
    ])

    render(
      <MemoryRouter>
        < App />
      </MemoryRouter>
    )

    const searchBar = screen.getByPlaceholderText('Enter a city name');
    const searchBtn = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(searchBar, { target: { value: 'Denver' } });
    fireEvent.click(searchBtn);

    const markAsVisitedBtn1 = await waitFor(() => screen.getByRole('button', { name: 'Mark Denver Brews as Visited' }));

    fireEvent.click(markAsVisitedBtn1);

    const visitedLink = screen.getByRole('link', { name: 'VISITED' });

    fireEvent.click(visitedLink);

    const breweryCard = await waitFor(() => screen.getByRole('heading', { name: 'Denver Brews' }));

    expect(breweryCard).toBeInTheDocument();
  });
})