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
                        <div className="average-cost">
                            Cost for Two
                        </div>
                        <div className="fx-b50">
                            {res.averageCostForTwo}
                            <span>{currencySymbol(res.currency)}</span>
                        </div>
                        {/*Rating And Votes*/}
                        <div className="fx-b50" style={{}}>
                           Rating:  {res.ratingText}
                        </div>
                        <div className="fx-b50">
                            Votes:
                            <div className="shineBox">
                            <span>
                               {res.votes}
                            </span>
                        </div>
                        </div>
                    </div>
                </div>
            </li>
        );
}

export default Card;