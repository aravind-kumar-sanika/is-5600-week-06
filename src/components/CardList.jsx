// src/components/CardList.jsx

import React, { useState, useEffect } from "react";
import Card from "./Card";
import Button from "./Button";
import Search from "./Search"; // a. Import Search component

const CardList = ({ data }) => {
  const limit = 10;

  // Store what the user typed and the filtered product list
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  // Keep track of which page we're on, and what products are on that page
  const [offset, setOffset] = useState(0);
  const [products, setProducts] = useState(data.slice(0, limit));

  // b. Function to filter data by tag (case-insensitive)
  const filterTags = (input) => {
    setSearchTerm(input);

    // If nothing is typed, show all products
    if (input === "") {
      setFilteredData(data);
      setOffset(0);
      setProducts(data.slice(0, limit));
      return;
    }

    // Filter by tags
    const filtered = data.filter((product) =>
      product.tags.some((tag) =>
        tag.toLowerCase().includes(input.toLowerCase())
      )
    );

    setFilteredData(filtered);
    setOffset(0);
    setProducts(filtered.slice(0, limit));
  };

  // Update products when offset or filteredData changes
  useEffect(() => {
    setProducts(filteredData.slice(offset, offset + limit));
  }, [offset, filteredData]);

  // 2a. Refactor pagination handlers into one function
  const handlePagination = (direction) => {
    if (direction === "previous") {
      setOffset(Math.max(0, offset - limit));
    }
    if (direction === "next") {
      if (offset + limit < filteredData.length) {
        setOffset(offset + limit);
      }
    }
  };

  // 2b. Disable Next button if at end of list
  const nextDisabled = offset + limit >= filteredData.length;

  return (
    <div className="cf pa2">
      {/* a. Place Search component above the cards */}
      <Search handleSearch={filterTags} />

      <div className="mt2 mb2">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <Card key={product.id} {...product} />
          ))
        )}
      </div>

      <div className="flex items-center justify-center pa4">
        <Button
          text="Previous"
          handleClick={() => handlePagination("previous")}
        />
        <Button
          text="Next"
          handleClick={() => handlePagination("next")}
          disabled={nextDisabled}
        />
      </div>
    </div>
  );
};

export default CardList;
