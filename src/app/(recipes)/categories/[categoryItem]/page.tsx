"use client";

import { useSearchParams } from "next/navigation";
import Recipes_4 from "@/components/Recipes/Recipes_4";
import useRecipesByCategory from "../../../../../hooks/useRecipesByCategory";

const CategoryPage = () => {
  const searchParams = useSearchParams(); // Lấy search params từ URL
  const rawTitle = decodeURIComponent(searchParams.get("title") || ""); // Lấy title

  const { recipes, loading, error } = useRecipesByCategory(rawTitle);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-red-500">CÓ LỖI: {error}</div>;
  }

  return (
    <>
      <div className="w-full h-fit flex gap-[20px] flex-col">
        <h2 className="font-[600] text-[25px] lg:text-[45px] text-center">
          {rawTitle || "Danh mục không có tiêu đề"}
        </h2>
        <div className="px-[10px] w-full h-fit gap-[10px] lg:gap-[30px] flex xl:gap-[40px] justify-center lg:justify-between items-start">
          {recipes.length > 0 ? (
            <div className="flex flex-wrap gap-[20px] lg:gap-[40px] justify-center">
              {recipes.map((recipe, index) => (
                <Recipes_4 key={index} recipe={recipe} />
              ))}
            </div>
          ) : (
            <p>Không tìm thấy công thức nào cho danh mục này.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
