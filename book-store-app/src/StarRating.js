import React, { useState } from "react";

async function updateRecord(recordId, updatedData) {
  fetch(`http://localhost:5000/stores/${recordId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "posts",
        id: recordId,
        attributes: updatedData,
      },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

function StarRating(props) {
  const { originalRating, recordId } = props;
  const [rating, setRating] = useState(originalRating);
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? "on" : "off"}
            onClick={() => {
              setRating(index);
              updateRecord(recordId, { rating: index });
            }}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;
