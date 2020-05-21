import React from 'react';

const Card = ({res,currency}) => {
    const images = ["asian","seafood","american","fastfood","brazilian","dessert","tea"]
    const displayImage = (value) => {
        if(!value) return "/default.jpg";
       const cuisineVal = value.toLowerCase();
      if(value.includes(','))
      {
          let v = images.find(item => cuisineVal.includes(item))
          return v ? `/${v}.jpg` : "/default.jpg"
      }
      else{
          return images.includes(cuisineVal) ? `/${cuisineVal}.jpg` : "/default.jpg";
      }
    };
    const currencySymbol = (field) => {
        let currencyKey = Object.keys(currency).find(item => field.toLowerCase().includes(item));
        return currencyKey ? currency[currencyKey] : "$"
    };
    const textColor = (value) => {
        if(value.includes(" ")){
           return "blue"
        }
        else if(value.toLowerCase().includes("white")){
            return "black"
        }
        else return value.toLowerCase();
    }

        return (
            <li className="card-item">
                <div className="card-body">
                    <div className="card-img">
                        <img src={`/assets${displayImage(res.cuisines)}`} alt={'card'+res.cuisines}/>
                    </div>
                    <div className="card-details">
                        <h3 className="card-heading">
                            {res.restaurantName}
                        </h3>
                        <div className="shineBox">
                            <span>
                                {res.aggregateRating}
                                <span></span>
                            </span>
                        </div>
                        <div className="cuisines">
                            {res.cuisines}
                        </div>
                        {/*Average Cost */}
                        <div className="fx-b100 d-flex">
                        <div className="fx-b50">
                            <div className="average-cost">
                                Cost for Two
                                <span className="ml-10">{res.averageCostForTwo}  </span>
                                <span>{currencySymbol(res.currency)}</span>
                            </div>
                        </div>
                        <div className="fx-b50 availabitity-icons">
                            <a title="Table Available"> <i className="fa fa-utensils" style={{color: res.hasTableBooking === "Yes" ? "green": "red"}}/></a>
                            <a title="Delivery Available"><i className="fa fa-motorcycle"  style={{color: res.hasOnlineDelivery === "Yes" ? "green": "red"}}/></a>
                        </div>
                        </div>
                        {/*Rating And Votes*/}
                        <div className="fx-b100 d-flex">
                        <div className="fx-b50" >
                            Review:  <span className="ml-10" style={{color: textColor(res.ratingColor)}}>{res.ratingText}</span>
                        </div>
                        <div className="fx-b50" style={{textAlign:"end"}}>
                            Votes:
                            <div className="shineBox ml-10 fx-b100">
                            <span>
                               {res.votes}
                            </span>
                        </div>
                        </div>
                        </div>
                    </div>
                </div>
            </li>
        );
}

export default Card;