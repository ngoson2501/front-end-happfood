'use client';


import React, { useEffect } from "react";

import Recipes_1 from "../Recipes/Recipes_1";

import { useRecipeContext } from "@/context/RecipeContext";



const RecipesList = () => {


  const { recipes, loading, error } = useRecipeContext();  // Truy cập context

  console.log('Recipesssssssssss:', recipes);



  if (loading) {
    return(
      <>
      <div className="bg-red-500 flex flex-col gap-[60px] xl:gap-[114px] mt-[50px]  xl:mt-[190px]">
          <p>Loading recipes...</p>
      </div>
      

      </>
    )
  }

  if (error) {
    return <p>Error: {error}</p>;
  }


  return (
    <>
      <div className="flex flex-col gap-[60px] xl:gap-[114px] mt-[50px]  xl:mt-[190px]">
        <div className=" px-[10px] xl:px-0 flex flex-col justify-center font-Inter items-center gap-[20px] lg:gap-[30px]">
          <h1 className=" text-[25px] lg:text-[30px] text-center xl:text-[40px] font-[700]">
            Những công thức nấu ăn tuyệt vời cho bạn
          </h1>
          <p
            className="text-[14px] lg:text-[15px] xl:text-[16px] text-center max-w-[700px] font-light"
            style={{ color: "rgba(0, 0, 0, 60%)" }}
          >
            Đây là tổng hợp những công thức nấu ăn tuyệt vời của những người đầu
            bếp chia sẻ ở khắp mọi nơi. Với sự đa dạng từ những cách chế biến và
            nguyên liệu
          </p>
        </div>
        <div className=" w-full h-fit gap-[10px] lg:gap-[30px] flex flex-wrap xl:gap-[40px] justify-center xl:px-0 lg:justify-start items-center">
        {recipes.map((recipe) => (
          <Recipes_1 key={recipe.id} recipe={recipe} />
        ))}
      </div>
      </div>
    </>
  );
};

export default RecipesList;






// // app/recipes/page.tsx
// import React from 'react';
// import Recipes_1 from '../Recipes/Recipes_1';

// interface IHashtag {
//   value: string;
//   label: string;
//   _id: string;
// }

// interface IRecipe {
//   id: string;
//   name: string;
//   cookTime: string;
//   hashtags: IHashtag[];
//   media?: string; // Base64 string của media
//   user: { _id: string; username: string };
//   views: number;
//   likes: string[];
// }

// const RecipesList = async () => {
//   // Fetch dữ liệu từ API (dữ liệu sẽ được fetch tại server)
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/get_recipes`);
  
//   // Kiểm tra xem API có trả về mảng không
//   const recipesData = await res.json();
  
//   // Nếu recipesData không phải là mảng, gán cho recipes một mảng trống
//   const recipes: IRecipe[] = Array.isArray(recipesData) ? recipesData : [];

//   console.log("check recipes list", recipes)

//   return (
//     <div className="flex flex-col gap-[60px] xl:gap-[114px] mt-[50px] xl:mt-[190px]">
//       <div className="px-[10px] xl:px-0 flex flex-col justify-center font-Inter items-center gap-[20px] lg:gap-[30px]">
//         <h1 className="text-[25px] lg:text-[30px] text-center xl:text-[40px] font-[700]">
//           Những công thức nấu ăn tuyệt vời cho bạn
//         </h1>
//         <p
//           className="text-[14px] lg:text-[15px] xl:text-[16px] text-center max-w-[700px] font-light"
//           style={{ color: 'rgba(0, 0, 0, 60%)' }}
//         >
//           Đây là tổng hợp những công thức nấu ăn tuyệt vời của những người đầu bếp chia sẻ ở khắp mọi nơi.
//         </p>
//       </div>
//       <div className="w-full h-fit gap-[10px] lg:gap-[30px] flex flex-wrap xl:gap-[40px] justify-center xl:px-0 lg:justify-start items-center">
//         {recipes.map((recipe: IRecipe) => (
//           <Recipes_1 key={recipe.id} recipe={recipe} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RecipesList;
