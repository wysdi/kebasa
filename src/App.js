import './App.css';
import React, { useState, useEffect } from 'react';

let formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)

  const handleChange = (evt) => {
    const kurs = items[0].beli;
    const total = kurs * evt.target.value;
    setTotal(total)
  }

  useEffect(() => {
    fetch("https://wysdi-fastapi.vercel.app/kebasa", {

    })
        .then(res => res.json())
        .then(
            (result) => {
              setIsLoaded(true);
              result.sort((a,b) => b.beli - a.beli)
              setItems(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
        )
  }, [])
  return (
    <div className="App">
      <header>
        <h1>Harga Pangan di Pasar Badung</h1>
      </header>
      <main>
        <article>
          <section>
            <h2></h2>
            <p>Prototype for Scrapping python
            </p>
          </section>
          <section>
            <h2></h2>
            { isLoaded && (
                <table>
                  <thead>

                  <tr>
                      <th>Nama</th>
                      <th>Jenis</th>
                      <th>Harga</th>
                  </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                        <tr>
                            <td>{ item.nama }</td>
                            <td>{ item.jenis }</td>
                            <td>{ item.harga }</td>
                        </tr>
                    ))}
                  </tbody>
                  <tfoot>

                  </tfoot>
                </table>
            )}

          </section>

        </article>
      </main>
    </div>
  );
}

export default App;
