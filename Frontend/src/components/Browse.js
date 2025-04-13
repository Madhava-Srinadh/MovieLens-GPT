import React, { useState } from "react";
import Header from "./Header";
import MainContainer from "./MainContainer";

const Browse = () => {
  const [showMyList, setShowMyList] = useState(false);

  return (
    <div>
      <Header setShowMyList={setShowMyList} showMyList={showMyList} />
      <MainContainer showMyList={showMyList} />
    </div>
  );
};

export default Browse;
