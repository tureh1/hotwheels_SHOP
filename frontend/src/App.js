import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';

// -------- HOME PAGE -------- 
const HOME = () => {
  const [products, setProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  // -------- fetch to get products from mongo in the backend  -------- 
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8081/index');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleNext = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % products.filter(product => product.category === currentCategory).length);
  };

  const handlePrev = () => {
    setCurrentImageIndex(prevIndex => (prevIndex - 1 + products.filter(product => product.category === currentCategory).length) % products.filter(product => product.category === currentCategory).length);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    setCurrentImageIndex(0);
  };

  return (
    <div>
      <section className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </section>

      <section className="featured-products">
        <h2>Featured Products ({currentCategory || "All"})</h2>
        <div className="product-container">
          {products
            .filter(product => (currentCategory === "" || product.category === currentCategory) && (product.title.toLowerCase().includes(searchTerm.toLowerCase()) || product.category.toLowerCase().includes(searchTerm.toLowerCase())))
            .map(product => (
              <div className="product" key={product.id}>
                <img
                  src={product.image}
                  alt={product.title}
                />
                <div className="product-details">
                  <h3>{product.title}</h3>
                  <p>${product.price}</p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}


const POST = () => {
  const [productInformation, setProductInformation] = useState({
    stateTitle: '',
    statePrice: null,
    stateDescription: '',
    stateCategory: '',
    stateImage: '',
    stateRate: null,
    stateCount: null,
  });

  function resetStateInformation() {
    setProductInformation({
      ...productInformation,
      stateTitle: '',
      statePrice: null,
      stateDescription: '',
      stateCategory: '',
      stateImage: '',
      stateRate: null,
      stateCount: null,
    });
  }

  function handleFieldChangeAdd(field, value) {
    setProductInformation({
      ...productInformation,
      [field]: value
    });
  }

  async function addProduct() {
    if (productInformation.stateTitle !== '' &&
      productInformation.statePrice !== null &&
      productInformation.stateDescription !== '' &&
      productInformation.stateCategory !== '' &&
      productInformation.stateImage !== '' &&
      productInformation.stateRate !== null &&
      productInformation.stateCount !== null) {

      const newProductJSON = JSON.stringify({
        "title": productInformation.stateTitle,
        "price": productInformation.statePrice,
        "description": productInformation.stateDescription,
        "category": productInformation.stateCategory,
        "image": productInformation.stateImage,
        "rating": {
          "rate": productInformation.stateRate,
          "count": productInformation.stateCount
        }
      })

      console.log(newProductJSON);

      await fetch('http://localhost:8081/add_product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: newProductJSON
      })
        .then(response => response.json)
        .then(product => {
          console.log(product);
        })

      resetStateInformation();
      window.location.reload();
    }
  }

  return (
    <div>
      <div id="formInfo">
        <div class="formInfoIndividual">
          <label className= "label" htmlFor="stateTitle">Product Title </label>
          <input
            id="stateTitle"
            type="text"
            size="40"
            style={{ marginTop: '10px', marginLeft: '5px', fontSize: '18px' }}
            value={productInformation.stateTitle}
            onChange={(e) => handleFieldChangeAdd('stateTitle', e.target.value)}
            required
          />
        </div>
        <div class="formInfoIndividual">
          <label className= "label" htmlFor="statePrice">Price of Product </label>
          <input
            id="statePrice"
            type="number"
            style={{ marginLeft: '5px', fontSize: '18px' }}
            value={productInformation.statePrice}
            onChange={(e) => handleFieldChangeAdd('statePrice', e.target.value)}
            required
          />
        </div>
        <div class="formInfoIndividual">
          <label className= "label" htmlFor="stateDescription">Describe the Product </label>
          <input
            id="stateDescription"
            type="text"
            size="100"
            style={{ marginLeft: '5px', fontSize: '18px' }}
            value={productInformation.stateDescription}
            onChange={(e) => handleFieldChangeAdd('stateDescription', e.target.value)}
            required
          />
        </div>
        <div  class="formInfoIndividual">
          <label className= "label" htmlFor="stateCategory">Product's Category </label>
          <input
            id="stateCategory"
            type="text"
            size="30"
            style={{ marginLeft: '5px', fontSize: '18px' }}
            value={productInformation.stateCategory}
            onChange={(e) => handleFieldChangeAdd('stateCategory', e.target.value)}
            required
          />
        </div>
        <div class="formInfoIndividual">
          <label className= "label" htmlFor="stateImage">Image (just insert the filename) </label>
          <input
            id="stateImage"
            type="url"
            size="50"
            style={{ marginLeft: '5px', fontSize: '18px' }}
            value={productInformation.stateImage}
            onChange={(e) => handleFieldChangeAdd('stateImage', e.target.value)}
            required
          />
        </div>
        <div class="formInfoIndividual">
          <label className= "label" htmlFor="stateRate">Product's Rating </label>
          <input
            id="stateRate"
            type="number"
            value={productInformation.stateRate}
            onChange={(e) => handleFieldChangeAdd('stateRate', e.target.value)}
            required
          />
        </div>
        <div class="formInfoIndividual">
          <label className= "label" htmlFor="stateCount">Number of Ratings </label>
          <input
            id="stateCount"
            type="number"
            style={{ marginLeft: '5px', fontSize: '18px' }}
            value={productInformation.stateCount}
            onChange={(e) => handleFieldChangeAdd('stateCount', e.target.value)}
            required
          />
        </div>
        <button className= "add" id="addProduct" onClick={addProduct}>Add Product</button>
      </div>
    </div>
  );
}


const GET = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/index')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="container">
      <div className="products-container">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-picture-container">
              <img className="product-image" src={product.image} alt={product.title} />
            </div>
            <div className="product-details">
              <div className="product-info">
                <h1 className="product-title">{product.title}</h1>
                <h2 className="product-category">Category: {product.category}</h2>
                <p className="product-description">{product.description}</p>
              </div>
              <div className="price-and-rating">
                <h2 className="product-price">${product.price}</h2>
                <h2 className="product-rating">
                  Rating: {product.rating.rate}/5.0 ({product.rating.count})
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PUT_DELETE = () => {
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);
  const [productInformation, setProductInformation] = useState({
    stateTitle: '',
    statePrice: '',
    stateDescription: '',
    stateCategory: '',
    stateImage: '',
    stateRate: 0,
    stateCount: 0,
  });

  useEffect(() => {
    productsForUpdate();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      populateProduct();
    }
  }, [index]);

  async function productsForUpdate() {
    await fetch('http://localhost:8081/index')
      .then(response => response.json())
      .then(index => {
        console.log(index);
        setProducts(index);
        // Initialize index with a random value within the range of products array
        setIndex(Math.floor(Math.random() * index.length));
      });
  }

  function populateProduct() {
    let productDetails = document.getElementById("productDetails");
    productDetails.removeAttribute("hidden");

    let deleteTitle = document.getElementById("deleteTitle");
    deleteTitle.innerText = products[index].title;

    let deleteImage = document.getElementById("deleteImage");
    deleteImage.src = products[index].image;

    let deleteCategory = document.getElementById("deleteCategory");
    deleteCategory.innerText = `Category: ${products[index].category}`;

    let deleteDescription = document.getElementById("deleteDescription");
    deleteDescription.innerText = products[index].description;

    let deletePrice = document.getElementById("deletePrice");
    deletePrice.innerText = `Price: $${products[index].price}`;

    let deleteRating = document.getElementById("deleteRating");
    deleteRating.innerText = `Rating: ${products[index].rating.rate}/5.0 (${products[index].rating.count})`
  }

  function getNextForDelete() {
    if (products.length > 0) {
      if (index === products.length - 1) setIndex(0);
      else setIndex(index + 1);
    }
  }


  async function deleteOneProduct() {
    let deleteConfirmation = "You are about to delete the following product:\n\n" + products[index].title;

    if (window.confirm(deleteConfirmation) === true) {
      console.log("Product to delete: ", products[index].title);

      await fetch('http://localhost:8081/delete_product', {
        method: "DELETE",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ "_id": products[index]._id })
      })
        .then(response => { response.json() })
        .then(deletedProduct => { console.log(deletedProduct) })
        .catch((err) => console.log("Error: " + err));

      if (products.length > 1) {
        setIndex(0);
      }
      window.location.reload();
    }
  }

  async function updateOneProduct() {
    if (productInformation.stateTitle !== '' &&
      productInformation.statePrice !== null &&
      productInformation.stateDescription !== '' &&
      productInformation.stateCategory !== '' &&
      productInformation.stateImage !== '' &&
      productInformation.stateRate !== null &&
      productInformation.stateCount !== null) {

      const updateProductJSON = JSON.stringify({
        "_id": products[index]._id,
        "title": productInformation.stateTitle,
        "price": productInformation.statePrice,
        "description": productInformation.stateDescription,
        "category": productInformation.stateCategory,
        "image": productInformation.stateImage,
        "rating": {
          "rate": productInformation.stateRate,
          "count": productInformation.stateCount
        }
      })

      console.log(updateProductJSON);

      await fetch('http://localhost:8081/change_product', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: updateProductJSON
      })
        .then(response => response.json())
        .then(product => {
          console.log(product);
        })

      window.location.reload();
    }
  }

  // Function to handle changes in input fields for updating product information
  function handleFieldChangeUpdate(field, value) {
    setProductInformation({
      ...productInformation,
      [field]: value
    });
  }

  // Function to select a product for updating
  function selectOneProduct() {
    setProductInformation({
      'stateTitle': products[index].title,
      'statePrice': products[index].price,
      'stateDescription': products[index].description,
      'stateCategory': products[index].category,
      'stateImage': products[index].image,
      'stateRate': products[index].rating.rate,
      'stateCount': products[index].rating.count,
    });
  }

  return (
    <div className="container1">
      <div id="productDetails" className="product-details">
        {/* Display product details */}
        <h1 id="deleteTitle" className="product-title"></h1>
        <img id="deleteImage" className="product-image" alt="Product"></img>
        <h2 id="deleteCategory" className="product-category"></h2>
        <h2 id="deleteDescription" className="product-description"></h2>
        <div id="deletePriceAndRating" className="price-and-rating">
          <h2 id="deletePrice" className="product-price"></h2>
          <h2 id="deleteRating" className="product-rating"></h2>
        </div>
        <p></p>
      </div>
      {/* Button to display the next product for deletion */}
      <button className="button" onClick={getNextForDelete}>Next</button>
      {/* Button to delete the selected product */}
      <button className="button delete-button" onClick={deleteOneProduct}>DELETE</button>
      {/* Form to update product information */}
      <div className="form-container">
        <label htmlFor="stateTitle">Product Title</label>
        <input
          id="stateTitle"
          type="text"
          value={productInformation.stateTitle}
          onChange={(e) => handleFieldChangeUpdate('stateTitle', e.target.value)}
          required
        />
        {/* Other input fields for product information */}
        {/* Here are examples for the other fields */}
        <label htmlFor="statePrice">Price</label>
        <input
          id="statePrice"
          type="number"
          value={productInformation.statePrice}
          onChange={(e) => handleFieldChangeUpdate('statePrice', parseFloat(e.target.value))}
          required
        />
        {/* Repeat this pattern for other fields */}
      </div>
      {/* Button to select a product for updating */}
      <button className="button" onClick={selectOneProduct}>SELECT</button>
      {/* Button to update the selected product */}
      <button className="button update-button" onClick={updateOneProduct}>UPDATE</button>
    </div>
  );
}


const ABOUT = () => {
  return (
    <div className="aboutContainer">
      <div className="aboutHeader">
        <h1 className="aboutTitle">SE/Com S 319 Construction of User Interfaces</h1>
        <h2 className="aboutDate">December 10th, 2023</h2>
      </div>
      <div className="aboutContent">
        <p className="aboutParagraph">
        This is Tu and Ping Final Project for the course SE/COMS319. This was inspired by our Midterm Project and Assignment 3.
          In This Project we are Implementing a database consisting of items from HotWHeel. Which holds items in multiple categories. We can create a new item, delete an item, modifiy an item price and name, display every item as well as search an item through category or title.
        </p>
        <div className="aboutPeople">
          <div className="aboutInfo">
            <img src="https://tureh1.github.io/midtermProject/images/tu.jpg" alt="Tu Reh" className="personImage" />
            <p className="personName">Tu Reh</p>
            <p>Email: tureh@iastate.edu</p>
          </div>
          <div className="aboutInfo">
            <img src="https://tureh1.github.io/midtermProject/images/ping.jpg" alt="Ping Wu" className="personImage" />
            <p className="personName">Ping Wu</p>
            <p>Email: pingwu@iastate.edu</p>
          </div>
          <div className="aboutInfo">
          <img src="https://www.cs.iastate.edu/files/styles/people_thumb/public/people/profilepictures/1517665937421.jpg?itok=15jJS_fr" className="personImage" />
            <p className="personName">Dr. Abraham N. Aldaco Gastelum</p>
            <p>Email: aaldaco@iastate.edu</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const Navigation = () => {
  return (
    <nav className="navBar">
      <Link to="/post" className="navLink otherlink">NEW PRODUCT</Link>
      <Link to="/get" className="navLink otherlink">VIEW SHOP</Link>
      <Link to="/home"><img className="nav-link homelink" src="https://see.fontimg.com/api/renderfont4/BWmR3/eyJyIjoiZHciLCJoIjoyNjYsInciOjIwMDAsImZzIjoxMzMsImZnYyI6IiNFRkU5RTkiLCJiZ2MiOiIjMDAwMDAwIn0/SU5ERVg/volkansitalicpersonaluse-ita.png" height="100" alt="Index" /></Link>
      <Link to="/put-delete" className="navLink otherlink1">UPDATE/DELETE</Link>
      <Link to="/about" className="navLink otherlink1">ABOUT THE TEAM</Link>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <section className="banner">
          <div className="banner-content">
            <h1>Free shipping on all orders $300 USD and over.
              <a href="link"><u>Conditions apply.</u></a>
            </h1>
          </div>
        </section>
        {/* Navigation Bar */}
        <Navigation />

        {/* Routes */}
        <Routes>
          <Route path="/home" element={<HOME />} />
          <Route path="/post" element={<POST />} />
          <Route path="/get" element={<GET />} />
          <Route path="/put-delete" element={<PUT_DELETE />} />
          <Route path="/about" element={<ABOUT />} />
          {/* Define other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;