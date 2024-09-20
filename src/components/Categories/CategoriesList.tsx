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
import Link from "next/link";
import Category from "./Category";

interface CategoryData {
  title: string;
  coverImage: string;
  color: string;
  href: string
}

const CategoriesList = () => {
  const listCategories: CategoryData[] = [
    { title: "Breakfast", coverImage: "Breakfast.svg", color: "#f2f3ee", href: "/categories" },
    { title: "Vegan", coverImage: "Vegan.svg", color: "#f2f9ec", href: "/categories" },
    { title: "Meat", coverImage: "Meat.svg", color: "#fbe9e8", href: "/categories" },
    { title: "Dessert", coverImage: "Dessert.svg", color: "#fef5e6", href: "/categories" },
    { title: "Lunch", coverImage: "Lunch.svg", color: "#f3f3f3", href: "/categories" },
    { title: "Chocolate", coverImage: "Chocolate.svg", color: "#f3f3f3", href: "/categories" },
    { title: "Chicken", coverImage: "chicken.png", color: "#ffebd4",href: "/categories" },
    { title: "IceCream", coverImage: "iceCream.png", color: "#ffd7ca",href: "/categories" }
  ];

  return (
    <div className="flex flex-col gap-[50px] mt-[50px]  xl:mt-[160px]">
      <div className="px-[10px] xl:px-0 flex font-Inter justify-between items-center">
        <h1 className="font-[600] text-[25px] lg:text-[45px]">Categories</h1>
        <span className="bg-[#E7FAFE] text-[13px] lg:text-[16px] font-[550] rounded-[10px] lg:rounded-[20px] px-[15px] py-[10px] lg:px-[30px] lg:py-[20px]">
            <Link href="/categories">View All Categories</Link>
        </span>
      </div>
      <div className=" w-full h-fit flex flex-wrap   justify-center  items-center gap-[20px] lg:gap-[40px]">
        {listCategories.map((category, index) => (
          <Category
            key={index}
            title={category.title}
            coverImage={category.coverImage}
            color={category.color}
            href={category.href}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
