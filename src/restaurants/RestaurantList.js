import React from 'react';
import {getAllRestaurants} from './service'

class RestaurantList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurant: [],
            initialRestaurant: [],
            currentPage: 1,
            perPage: 10,
            searchString: 10,
            selectedFilter: [],
            subFilters: [],
            sort: {
                column: null,
                direction: 'desc',
            },
        };
        this.onPageChange = this.onPageChange.bind(this);
        this.searchRestaurant = this.searchRestaurant.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.openSubFilter = this.openSubFilter.bind(this);
        this.setSearchString = this.setSearchString.bind(this);
        this.onSort         = this.onSort.bind(this);
    }
    onPageChange(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }
    setSearchString(event) {
        this.setState({
            searchString: event.target.value.toUpperCase()
        });
    }
    applyFilter = (type) => (e) => {
        const {initialRestaurant} = this.state;
        
        if(type === 'all')
            this.setState({subFilters:[]})
        
        const filterData = initialRestaurant.filter(row =>{
                if(row.state === type){
                    return row;
                }
                if(row.genre === type){
                    return row;
                }
         })
        if(filterData && filterData.length > 0){
            this.setState({restaurant:filterData})
        } 
    }
    openSubFilter = (type) => (e) => {
        console.log('type',type);
        const {initialRestaurant} = this.state;
        let subData = []
        initialRestaurant.map((obj,key) => {
            if(type === 'state')
                if(!subData.includes(obj.state))
                    subData.push(obj.state)
            if(type === 'genre')
                if(!subData.includes(obj.genre))
                    subData.push(obj.genre)    
        })
        this.setState({subFilters:subData})
        console.log('subData>',subData);
                
    }

    searchRestaurant(event) {
        const {restaurant,searchString,initialRestaurant} = this.state; 
        let results = [];
        if(searchString && searchString.length > 0){
            results = restaurant.filter(row => {
                if(row.name.toUpperCase().indexOf(searchString)!=-1) {
                    return row;
                }
                if(row.city.toUpperCase().indexOf(searchString)!=-1) {
                    return row;
                }
                if(row.genre.toUpperCase().indexOf(searchString)!=-1) {
                    return row;
                }
            })
            this.setState({restaurant:results})
        } else {
            this.setState({restaurant:initialRestaurant})
        } 
        
    }
    getData() {
        getAllRestaurants().then(response => {
            if(response.data && response.data.length > 0 ){
                this.setState({restaurant:response.data,initialRestaurant:response.data})
            }
        })
    }

    componentDidMount() {
        this.getData();
    }

    onSort = (column) => (e) => {
        console.log('column',column);
        const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const sortedData = this.state.restaurant.sort((a, b) => {
            if (column === 'name') {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
            }
        });
        if (direction === 'desc') {
            sortedData.reverse();
        }
    
        this.setState({
            restaurant: sortedData,
            sort: {
                column,
                direction,
            }
        });
    }    
    render() {
       const {restaurant,currentPage, perPage,sort,subFilters} = this.state;
       const indexOfLastRestaurant = currentPage * perPage;
       const indexOfFirstRestaurant = indexOfLastRestaurant - perPage;
       const currentRestaurant = restaurant.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
        
        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(restaurant.length / perPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    style={{cursor:'pointer',color: currentPage == number ? 'blue' :'' }}
                    key={number}
                    id={number}
                    onClick={this.onPageChange}
                >
                {number}
                </li>
            );
        });
        return (
            <div>
                <div style={{float:'left',width:"100%"}}>
                    <div style={{float:'left',marginRight:5}}>
                        <input type="text" onChange={this.setSearchString} />
                    </div>
                    <div style={{float:'left'}}>
                        <button onClick={this.searchRestaurant}>Search</button>
                    </div>
                </div>
                <h5>Filters</h5>
                <div style={{float:'left',width:"100%"}}>
                    <div style={{float:'left',marginRight:3}}>
                        <button onClick={this.applyFilter('all')}>All</button>
                    </div>
                    <div style={{float:'left',marginRight:3}}>
                        <button onClick={this.openSubFilter('state')}>State</button>
                    </div>
                    <div style={{float:'left'}}>
                        <button  value="genre" onClick={this.openSubFilter('genre')}>Genre</button>
                    </div>
                </div>
                <div style={{float:'left',width:"100%"}}>
                    {subFilters.map(key => {
                        return(
                            <div style={{float:'left',marginRight:3}}>
                                <button onClick={this.applyFilter(key)}>{key}</button>
                            </div>
                        )
                    })}
                    
                </div>

                {currentRestaurant && currentRestaurant.length > 0 ? 
                <div>
                    <div>
                    <table>
                        <thead>
                            <tr align="left">
                                <th onClick={this.onSort('name')} style={{cursor:'pointer',backgroundColor:sort.column === 'name' ? "#53e0b6" : ""}}>Name</th>
                                <th onClick={this.onSort('city')} style={{cursor:'pointer',backgroundColor:sort.column === 'city' ? "#53e0b6" : ""}}>City</th>
                                <th onClick={this.onSort('state')} style={{cursor:'pointer',backgroundColor:sort.column === 'state' ? "#53e0b6" : ""}}>State</th>
                                <th>Phone Number</th>
                                <th onClick={this.onSort('genre')} style={{cursor:'pointer',backgroundColor:sort.column === 'genre' ? "#53e0b6" : ""}}>Genres</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRestaurant.map((value,index) => {
                            return(
                                <tr align="left" key={index} data-item={value}>
                                    <td data-title="Name">{value.name}</td>
                                    <td>{value.city}</td>
                                    <td>{value.state}</td>
                                    <td>{value.telephone}</td>
                                    <td>{value.genre}</td>
                                </tr>
                            )     
                            })}
                            
                        </tbody>    
                    </table>
                    </div>
                    <div>
                        <ul>
                            {this.renderRestaurants}
                        </ul>
                        <ul id="page-numbers">
                            {renderPageNumbers}
                        </ul>
                    </div>
                </div>  
                : <h2>No results found.</h2>  }
            </div>
        )
    }
}

export default RestaurantList;