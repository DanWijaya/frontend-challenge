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
    .catch((error) => {
      console.error(error);
    });
}

function StarRating(props) {
  const { originalRating, recordId } = props;
  const [rating, setRating] = useState(originalRating);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [hover, setHover] = useState(0);

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

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
              updateRecord(recordId, { rating: index }).then((result) => {
                setShowSnackbar(true);
              });
            }}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}

      {showSnackbar && (
        <div className="snackbar">
          Thank you for your rating!
          <button className="snackbar-close" onClick={handleSnackbarClose}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default StarRating;
