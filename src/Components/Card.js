import React from 'react';

const Card = ({res}) => {
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
        return (
            <li className="card-item">
                <div className="card-body">
                    <div className="card-img">
                        <img src={`/assets${displayImage(res.cuisines)}`} alt="card image"/>
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
                            Average Cost for Two
                        </div>
                        <div className="average-cost">
                            {res.averageCostForTwo}
                            <span>$</span>
                        </div>
                        {/*Rating And Votes*/}
                        <div className="rating" style={{}}>
                            {res.ratingText}
                        </div>
                        <div className="shineBox">
                            <span>
                                {res.votes}
                            </span>
                        </div>
                    </div>
                </div>
            </li>
        );
}

export default Card;