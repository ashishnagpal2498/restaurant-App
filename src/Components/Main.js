import React, {Component} from 'react';
import Papa from 'papaparse'
import Card from './Card'
let searchQuery;
class Main extends Component {
    state = {
        data: [],
        filterData: [],
        cuisines: [],
        filters: {
            search: "",
            cuisines: "",
            rating: "",
        },
        currency: {},
        currencyData: {}
    };

    componentWillMount() {
        this.getCsvData();
        //https://restcountries.eu/rest/v2/all?fields=currencies
    }

    fetchCsv = () => {
        return fetch('/restaurantsList.csv').then(function (response) {
            let reader = response.body.getReader();
            let decoder = new TextDecoder('utf-8');

            return reader.read().then(function (result) {
                return decoder.decode(result.value);
            });
        });
    }

    getData = (result) => {
        let data = [];
        let arr = result.data;
        let cuisines = [];
        let currency = {};
        let headings = arr[0].map((item)=>{
            if(item.includes(" ")){
                return item.split(' ').reduce((acc,val,index) => {
                    let value = val.substr(0,1).toUpperCase() + val.substr(1).toLowerCase();
                    if(index === 1){return acc.toLowerCase() + value;}
                    else return acc + value;
                });
            }
            else{
                return item.toLowerCase();
            }
        })
        for(let i=1;i<arr.length;i++)
        {   let obj = {};
            arr[i].map((item,index) =>{
                obj = {...obj,
                [headings[index]]:item}
                // Unique Cuisines
                if(headings[index] === "cuisines")
                {   if(item.includes(","))
                    {
                        let array = item.split(',');
                            array.map((i)=>{
                                let value = i.trim();
                        if(!cuisines.includes(value)){
                            cuisines.push(value);
                        }
                    })
                    }
                    else{
                        let value = item.trim();
                        if(!cuisines.includes(value))
                        {
                            cuisines.push(value);
                        }
                }
                }
                //Unique Currency
                if(headings[index] === "currency" && !(Object.keys(currency).includes(item.toLowerCase())))
                { // Fetch from currency - add  symbol
                }
            });
            data.push(obj);
        }
        this.setState({data,filterData:data,cuisines},()=>{
            console.log("data ",data);
            console.log('Cuisine',this.state.cuisines)
        });
    }

    getCsvData = async () => {
        let csvData = await this.fetchCsv();

        Papa.parse(csvData, {
            complete: this.getData
        });
    }
    filterData = () => {
        let filterData = JSON.parse(JSON.stringify(this.state.data));
        let filters = this.state.filters;
        if(filters.search)
        {
            filterData = filterData.filter((item) =>
                JSON.stringify(item).toLowerCase().includes(filters.search.toLowerCase()))
            console.log("filterData",filterData)
        }
        this.setState({filterData})
    };

    onChangeHandler = (event) =>{
        let filters = JSON.parse(JSON.stringify(this.state.filters))
        if(event.target.id === "searchBox"){
            //Filter the list -
            clearTimeout(searchQuery);
            searchQuery = setTimeout(this.filterData,700);
            filters[event.target.name] = event.target.value;
        }

        this.setState({filters});
    }

    render() {
        return (
            <div>
                <div className="searchBox">
                    <input type="text" name="search" value={this.state.filters.search} onChange={this.onChangeHandler} id="searchBox"/>
                    <label className="placeholder-label" for="searchBox">Search a restaurant</label>
                </div>
                <select className="cuisine-filter" id="cuisine">
                    <option value="All">All</option>
                    {this.state.cuisines.map((item,index)=> {
                        return <option value={item} key={index}>{item}</option>
                    })}
                </select>
                <div className="filter-dropdown">
                    <ul className="filter-dropdown-menu">
                      <li>jjd</li>
                    </ul>
                </div>
                <ul className="cards">
                    {this.state.filterData.map((restaurant,index)=> {
                        return <Card key={index} res={restaurant} />
                    })}
                </ul>
            </div>
        );
    }
}

export default Main;