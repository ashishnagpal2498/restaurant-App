import React, {Component} from 'react';
import Papa from 'papaparse'
import Card from './Card'
import TwoSideSlider from "./Slider";
let searchQuery;
class Main extends Component {
    constructor() {
        super();
        this.state = {
            loader:true,
            data: [],
            filterData: [],
            cuisines: [],
            filters: {
                search: "",
                cuisines: "all",
                rating: "all",
                currency: "all",
                averageCost: {minVal: 0,maxVal: 400}
            },
            currency: {},
            currencyData: [],
            averageCost:{},
            sliderValue: true
        };
        this.rating = [1, 2, 3, 4];
    }

    componentWillMount() {
        this.fetchCurrency();
        this.readCSV();

    }

    fetchCurrency = async () => {
        const currencyData = await fetch('https://restcountries.eu/rest/v2/all?fields=currencies').then(response => response.json())
            .catch(err => err);
        if(!currencyData.error)
        {
            this.setState({currencyData})
        }
    };
    fetchCsv = () => {
        return fetch('/restaurantsList.csv').then(function (response) {
            let reader = response.body.getReader();
            let decoder = new TextDecoder('utf-8');

            return reader.read().then(function (result) {
                return decoder.decode(result.value);
            });
        });
    };
    readCSV = async () => {
        let csvData = await this.fetchCsv();

        Papa.parse(csvData, {
            complete: this.processData
        });
    };

    processData = (result) => {
        let data = [],
            arr = result.data,
            cuisines = [],
            currency = {},
            averageCost = {},
            currencyData = this.state.currencyData,
            headings = arr[0].map((item)=>{
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
        });
        for(let i=1;i<arr.length;i++)
        {   let obj = {};
            if(arr[i].length > 1) {
                arr[i].map((item, index) => {
                    obj = {
                        ...obj,
                        [headings[index]]: item
                    }
                    // Unique Cuisines
                    if (headings[index] === "cuisines") {
                        if (item.includes(",")) {
                            let array = item.split(',');
                            array.map((i) => {
                                let value = i.trim();
                                if (!cuisines.includes(value)) {
                                    cuisines.push(value);
                                }
                            })
                        } else {
                            let value = item.trim();
                            if (!cuisines.includes(value)&& value.length > 1) {
                                cuisines.push(value);
                            }
                        }
                    }
                    //Unique Currency
                    if (headings[index] === "currency" && currencyData.length > 0 ) { // Fetch from currency - add  symbol
                        // Symbol - given - if not given then -
                        let c = item.split('(')[0].trim().toLowerCase();
                        if(!(Object.keys(currency).includes(c))) {
                            for (let obj of currencyData) {
                                if (obj.currencies[0].name.trim().toLowerCase().includes(c)) {
                                    currency = {
                                        ...currency,
                                        [c]: obj.currencies[0].symbol
                                    };
                                    break;
                                }
                            }
                        }
                        // Min and max value for particular currency -
                        if(!Object.keys(averageCost).includes(c))
                        {
                            let costObj = {
                                minVal: arr[i][index-1],
                                maxVal: arr[i][index-1]
                            };
                            averageCost = {
                                ...averageCost,
                                [c] : costObj
                            }
                        }
                        else{
                            averageCost[c].minVal = Math.min(arr[i][index-1],averageCost[c].minVal);
                            averageCost[c].maxVal = Math.max(arr[i][index-1],averageCost[c].maxVal);
                        }
                    }
                });
                data.push(obj);
            }
        }
        this.setState({data,filterData:data,cuisines,loader:false,currency,averageCost});
    };

    filterOnSearch = () => {
        let filterData = JSON.parse(JSON.stringify(this.state.filterData));
        let filters = this.state.filters;
        if(filters.search)
        {
            filterData = filterData.filter((item) =>
                JSON.stringify(item).toLowerCase().includes(filters.search.toLowerCase()))
        }
        this.setState({filterData,loader:false})
    };
    setLoader = () => {
        this.setState({
            loader:true
        },()=> console.log('loaderSet'))

    }
    sliderChange = async (minVal,maxVal) => {
        let filterData = await this.onChangeHandler().then(data=>data);
        let currency = this.state.filters.currency.toLowerCase();
        let filters = JSON.parse(JSON.stringify(this.state.filters))
        filterData = filterData.filter(item => item.currency.trim().toLowerCase().split('(')[0].includes(currency)
            && item.averageCostForTwo >= minVal && item.averageCostForTwo <= maxVal)
        filters.averageCost.minVal = minVal;
        filters.averageCost.maxVal = maxVal;
        this.setState({
            filterData,
            loader:false,
            filters
        })
    }
    onChangeHandler = (event={
        target:{id:"",name:""}
    }) =>{
        console.log('event',event)
        let filters = JSON.parse(JSON.stringify(this.state.filters))
        let filterData = JSON.parse(JSON.stringify(this.state.data));
        filters[event.target.name] = event.target.value;
        this.setState({loader:true});
        if(event.target.id === "search" || this.state.filters.search){
            //Filter the list -
            clearTimeout(searchQuery);
            searchQuery = setTimeout(this.filterOnSearch,800);
        }
        if((event.target.id === "cuisines" && filters.cuisines !== "all") || filters.cuisines !== "all" ) {
            console.log(event.target.value,"CUISINE");
            // event.target. value - new search value - vo search karke and
            // filter. cuisine , then - value initially not set , then -
            filterData = filterData.filter(item => item.cuisines.toLowerCase().includes(filters.cuisines.toLowerCase()));
        }
        if((event.target.name === "currency" && filters.currency !== "all") || filters.currency !== "all")
        {   filters.averageCost = this.state.averageCost[filters.currency];
            filterData = filterData.filter(item => item.currency.toLowerCase().includes(filters.currency.toLowerCase()));
        }
        if((event.target.name === "rating" && filters.rating !=="all") || filters.rating !== "all")
        {
            filterData = filterData.filter(item => item.aggregateRating >= filters.rating)
        }
        if(filters.currency !== "all" && this.state.averageCost[filters.currency] !== filters.averageCost)
        {   console.log('Average cost ',this.state.averageCost[this.state.filters.currency],"filter- avg cost",filters.averageCost )
            let averageCost= this.state.filters.averageCost;
            filterData = filterData.filter(item => item.currency.trim().toLowerCase().includes(filters.currency.toLowerCase())
                && item.averageCostForTwo >= averageCost.minVal && item.averageCostForTwo <= averageCost.maxVal)
        }
        console.log(event.target.id,"value",event.target.value);
        //If search value exist then loader will get false in that only
      return new Promise((resolve,reject)=>{
          this.setState({
              filters,
              filterData,
              loader:filters.search.length>0 || !event.target.name,
              sliderValue: filters.currency === "all"
          },() => {
              resolve(this.state.filterData);
          });

      })
    };
    viewList = (event) => {
        let outerDiv = event.target.parentNode;
        let clickedDiv = event.target;
        let inputId;
        if(outerDiv.classList.value.includes("filter")) {
            let listItem = outerDiv.childNodes[1];
            listItem.classList.toggle('displayList')
        }
        else if(clickedDiv.hasAttribute('data-value')){
           let filters = JSON.parse(JSON.stringify(this.state.filters))
            let attributeValue = clickedDiv.getAttribute('data-value');
            outerDiv.parentNode.childNodes[0].childNodes[0].textContent = attributeValue;
            outerDiv.parentNode.childNodes[1].classList.remove('displayList');
            inputId = outerDiv.parentElement.parentElement.getAttribute('id');
            filters[inputId] = attributeValue;
            this.setState({filters}, ()=> {
                // Dispatch Event or call the function
                // let event = new Event('input', { bubbles: true });
                // console.log('Value ----- ',outerDiv.parentNode.childNodes[1])
                // outerDiv.parentNode.childNodes[1].dispatchEvent(event);
                // 3. Changing the value of input box does not trigger onChange function of input -
                this.onChangeHandler({target: {name:inputId,id:inputId,value:attributeValue}})
            })
        }
    }
    render() {
        return (
            <div>
                <div className="searchBox">
                    <input type="text" name="search" placeholder=" " value={this.state.filters.search} onChange={this.onChangeHandler} id="search"/>
                    <label className="placeholder-label" htmlFor="search">Search a restaurant</label>
                </div>
                <h3>Filter By: </h3>
                <div className="filter-div">
                <div className="filter-wrapper" id="cuisines">
                    <label htmlFor={"cuisines"}>Cuisines</label>
                    <div className="filter" onClick={this.viewList}>
                        <div className="filter-value-wrapper" >
                            <span className="filter-value">All</span>
                            <span className="filter-icon"><i className="fa fa-chevron-down"/></span>
                        </div>
                        {/*<input className="filter-input" value={this.state.filters.cuisines} id="cuisines" onChange={this.onChangeHandler} name="cuisines" />*/}
                        <ul className="optionList">
                            <li data-value="all">All</li>
                            {this.state.cuisines.map((item,index)=> {
                                return <li data-value={item} key={index}>{item}</li>
                            })}
                        </ul>
                    </div>
                {/*    <select className="filter" value={this.state.filters.cuisines} onChange={this.onChangeHandler} id="cuisines" name="cuisines">*/}
                {/*    <option value="all">All</option>*/}
                {/*    {this.state.cuisines.map((item,index)=> {*/}
                {/*        return <option value={item} key={index}>{item}</option>*/}
                {/*    })}*/}
                {/*</select>*/}
                </div>
                    <div className="filter-wrapper" id="rating">
                        <label htmlFor={"rating"}>Rating</label>
                        <div className="filter" onClick={this.viewList}>
                            <div className="filter-value-wrapper" >
                                <span className="filter-value">All</span>
                                <span className="filter-icon"><i className="fa fa-chevron-down"/> </span>
                            </div>
                            {/*<input className="filter-input" value={this.state.filters.cuisines} id="cuisines" onChange={this.onChangeHandler} name="cuisines" />*/}
                            <ul className="optionList">
                                <li data-value="all">All</li>
                                {this.rating.map((item,index)=> {
                                    return <li data-value={item} key={index}>{item}</li>
                                })}
                            </ul>
                        </div>
                {/*<select value={this.state.filters.rating} onChange={this.onChangeHandler} className="filter" id="rating" name="rating">*/}
                {/*    <option value="all">None</option>*/}
                {/*    {this.rating.map((item,index) =>*/}
                {/*        (<option value={item} key={index}>{"> "+item}</option> )) }*/}
                {/*</select>*/}
                    </div>
                    <div className="filter-wrapper fx-b40">
                        <label htmlFor={"currency"}>Currency</label>
                        <div className="checkBoxDiv">
                            <label className="radioBox">None
                                <input type="radio" value="all" onChange={this.onChangeHandler}  name="currency" />
                                <span className="checkmark"/>
                            </label>
                            {Object.keys(this.state.currency).map((item,index) =>
                                (   <React.Fragment key={index}>
                                        <label className="radioBox">{item}
                                            <input type="radio" onChange={this.onChangeHandler} value={item} name="currency" />
                                            <span className="checkmark"/>
                                        </label>
                                    </React.Fragment>
                                    ))
                            }
                        </div>
                    </div>
                    <div className="filter-wrapper fx-b30">
                        <label htmlFor={"averageCost"}>Cost For Two</label>
                        <TwoSideSlider className={"filter"} setLoader={this.setLoader} domain={this.state.averageCost[this.state.filters.currency]} sliderChange={this.sliderChange} disabled={this.state.sliderValue}  />
                    </div>
                </div>
                <div className="outer">
                    {this.state.loader ?
                        <div className="loader"> </div>
                        :
                        <ul className="cards">
                            {this.state.filterData.map((restaurant, index) => {
                                return <Card key={index} currency={this.state.currency} res={restaurant}/>
                            })}
                        </ul>
                    }
                </div>
            </div>
        );
    }
}

export default Main;