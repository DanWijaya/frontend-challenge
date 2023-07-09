import "./App.css";
import { useEffect, useState } from "react";
import JSONAPIResponseNormalizer from "./JSONAPIResponseNormalizer";
import StarRating from "./StarRating";

function App() {
  useEffect(() => {
    const fetchData = async (resourcesType) => {
      const apiEndpoint = `http://localhost:5000/${resourcesType}`;
      const response = await fetch(apiEndpoint);
      const json = await response.json();
      return JSONAPIResponseNormalizer(json);
    };

    fetchData("stores")
      .then((data) => {
        console.log(data.stores);
        setStores(data.stores);
      })
      .catch((err) => console.error(err));

    fetchData("books")
      .then((data) => {
        setBooks(data.books);
      })
      .catch((err) => console.error(err));

    fetchData("authors")
      .then((data) => setAuthors(data.authors))
      .catch((err) => console.error(err));

    fetchData("countries")
      .then((data) => {
        setCountries(data.countries);
        const countriesCode = Object.values(data.countries)
          .map((country) => country.code)
          .join(",");
        console.log(countriesCode);
        return fetch(`https://restcountries.com/v3.1/alpha?codes=${countriesCode}`);
      })
      .then((result) => {
        return result.json();
      })
      .then((result) => {
        let flags = {};
        result.forEach((country) => (flags[country.cca2] = country.flags.png));
        // console.log(flags);
        setCountriesFlag(flags);
      })
      .catch((err) => console.error(err));
  }, []);

  const [stores, setStores] = useState({});
  const [books, setBooks] = useState({});
  const [authors, setAuthors] = useState({});
  const [countries, setCountries] = useState({});
  const [countriesFlag, setCountriesFlag] = useState({});

  return Object.values(stores).map((store) => {
    let booksInStore = [];
    let top1BookSold = null;
    let top2BookSold = null;

    if ("books" in store) {
      store.books.forEach((element) => {
        booksInStore.push(books[element.id]);
      });

      booksInStore.sort((a, b) => a.copiesSold - b.copiesSold);
      top1BookSold = booksInStore.length > 0 ? booksInStore.pop() : null;
      top2BookSold = booksInStore.length > 0 ? booksInStore.pop() : null;
    }

    let storeEstDate = new Date(store.establishmentDate);
    let storeEstDateString = `${storeEstDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${storeEstDate.getMonth()}-${storeEstDate.getFullYear()}`;
    return (
      <div className="App">
        <div className="box">
          <div>
            <div className="div-storeimage-sm">
              <div className="storeimage-sm">
                <div className="center">
                  <img alt="store" src={store.storeImage} className="thumb" />
                </div>
              </div>
            </div>
            <div className="store-content">
              <div className="storeimage-md">
                <div className="center">
                  <img alt="store" src={store.storeImage} className="thumb" />
                </div>
              </div>
              <div className="bookstore">
                <div className="store-info">
                  <div className="store-name">
                    <span>{store.name}</span>
                  </div>
                  <div className="store-rating">
                    <span>
                      <StarRating originalRating={store.rating} recordId={store.id} />
                    </span>
                  </div>
                </div>
                <table>
                  <tr>
                    <th colspan="2">Best-selling books</th>
                  </tr>
                  {top1BookSold != null ? (
                    <tr>
                      <td>{top1BookSold.name}</td>
                      <td>
                        {authors[top1BookSold.author.id] ? authors[top1BookSold.author.id].fullName : null}
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td>No Data Available</td>
                      <td className="emptycell"></td>
                    </tr>
                  )}
                  {top2BookSold != null ? (
                    <tr>
                      <td>{top2BookSold.name}</td>
                      <td>
                        {authors[top2BookSold.author.id] ? authors[top2BookSold.author.id].fullName : null}
                      </td>
                    </tr>
                  ) : null}
                </table>
              </div>
            </div>
            <div className="store-details">
              <div class="store-date">
                <span>
                  {`${storeEstDateString} - `}
                  <a target="_blank" href={store.website} rel="noreferrer">
                    {store.website}
                  </a>
                </span>
              </div>
              <div className="store-flag">
                {countries[store.countries.id] ? (
                  <img alt="flag" className="flag" src={countriesFlag[countries[store.countries.id].code]} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });
}

export default App;
