// import Category from "./Category"

// interface Category {
//     title: string;
//     coverImage: string;
//   }

// const CategoriesList = () =>{

//     const listCategories = [
//         {
//           title: "Breakfast",
//           coverImage: "Breakfast.svg",
//         },
//         {
//             title: "Vegan",
//             coverImage: "Vegan.svg"
//         },
//         {
//             title: "Meat",
//             coverImage: "Meat.svg"
//         },
//         {
//             title: "Dessert",
//             coverImage: "Dessert.svg"
//         },
//         {
//             title: "Lunch",
//             coverImage: "Lunch.svg"
//         },
//         {
//             title: "Chocolate",
//             coverImage: "Chocolate.svg"
//         },
//       ];
//     return(
//         <>
//             <div className=" w-full h-[500px]">
//                 <Category></Category>
//             </div>
//         </>
//     )
// }

// export default CategoriesList

import React from "react";
import Category from "./Category";

interface CategoryData {
  title: string;
  coverImage: string;
  color: string;
}

const CategoriesList = () => {
  const listCategories: CategoryData[] = [
    { title: "Breakfast", coverImage: "Breakfast.svg", color: "#f2f3ee" },
    { title: "Vegan", coverImage: "Vegan.svg", color: "#f2f9ec" },
    { title: "Meat", coverImage: "Meat.svg", color: "#fbe9e8" },
    { title: "Dessert", coverImage: "Dessert.svg", color: "#fef5e6" },
    { title: "Lunch", coverImage: "Lunch.svg", color: "#f3f3f3" },
    { title: "Chocolate", coverImage: "Chocolate.svg", color: "#f3f3f3" },
    { title: "Chicken", coverImage: "chicken.png", color: "#ffebd4" },
    { title: "Ice Cream", coverImage: "iceCream.png", color: "#ffd7ca" }
  ];

  return (
    <div className="flex flex-col gap-[50px]  mt-[160px]">
      <div className="flex font-Inter justify-between items-center">
        <h1 className="font-[600] text-[45px]">Categories</h1>
        <span className="bg-[#E7FAFE] font-[550] rounded-[20px] px-[30px] py-[20px]">
            <p>View All Categories</p>
        </span>
      </div>
      <div className="w-full h-[500px] flex flex-wrap justify-center items-center gap-[40px]">
        {listCategories.map((category, index) => (
          <Category
            key={index}
            title={category.title}
            coverImage={category.coverImage}
            color={category.color}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;