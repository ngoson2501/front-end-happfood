"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { FaHeart } from "react-icons/fa";
import { useUser } from "@/context/User-provider";
import useIncreaseView from "../../../hooks/useIncreaseView";
import { Modal, Button, message } from "antd";

interface RecipeProps {
  recipe: {
    id: string;
    name: string;
    cookTime: string;
    media?: string;
    hashtags: { value: string; label: string; _id: string }[];
    user: { _id: string; username: string };
    views: number;
    likes: string[];
  };
}

const Recipes_5: React.FC<RecipeProps> = ({ recipe }) => {
  // console.log("check recipe>>>>>",recipe.hashtags)

  // State để theo dõi màu sắc của biểu tượng trái tim
  const [liked, setLiked] = useState(false);
  const router = useRouter(); // Sử dụng hook useRouter
  const infoUser = useUser();
  const { increaseView } = useIncreaseView();

  useEffect(() => {
    // Kiểm tra xem recipe và recipe.likes có phải là mảng hợp lệ không
    if (infoUser && Array.isArray(recipe?.likes)) {
      // Kiểm tra nếu likes có chứa ID người dùng
      if (recipe.likes.includes(infoUser.id)) {
        setLiked(true); // Nếu ID người dùng có trong mảng likes thì setLiked là true
      } else {
        setLiked(false); // Nếu không có thì setLiked là false
      }
    }
  }, [infoUser, recipe?.likes]); // Thực hiện khi infoUser hoặc recipe.likes thay đổi

  const sendLikeToServer = async (isLiked: boolean) => {
    console.log(">>>>>>>>>>>>>>>>", { user: recipe.id }); // In ra userId thay vì toàn bộ đối tượng

    try {
      const response = await fetch(
        `/api/recipes/recipe/like_recipe/${recipe.id}`,
        {
          method: isLiked ? "POST" : "DELETE", // POST khi like, DELETE khi unlike
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: infoUser?.id }), // Chỉ truyền userId
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error response:", errorBody);
      }
    } catch (error) {
      console.error("Error while sending like/unlike:", error);
    }
  };

  const formatCookTime = (cookTime: string | undefined) => {
    if (!cookTime || typeof cookTime !== "string") {
      return "N/A"; // Hoặc giá trị mặc định bạn muốn hiển thị
    }

    // Tách giờ và phút từ chuỗi
    const [hours, minutes] = cookTime.split(":").map(Number);

    // Tạo định dạng hiển thị
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const NavigateEditRecipe = async () => {
    
    router.push(`/edit_recipe/${recipe.id}`); // Điều hướng đến detailed_recipes với id
  };

  const handleNavigate = async () => {
    await increaseView(recipe.id); // Gửi yêu cầu tăng view
    router.push(`/detailed_recipes/${recipe.id}`); // Điều hướng đến detailed_recipes với id
  };





  // const handleDeleteRecipe = async () => {
  //   // Hiển thị thông báo xác nhận trước khi thực hiện hành động xóa với tên của công thức
  //   const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xoá công thức: "${recipe.name}" ?`);
    
  //   // Nếu người dùng nhấn Cancel, không làm gì và thoát khỏi hàm
  //   if (!confirmDelete) return;
  
  //   try {
  //     // Gửi yêu cầu DELETE đến API
  //     const response = await fetch(`/api/recipes/recipe/delete_recipe/${recipe.id}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  
  //     // Kiểm tra phản hồi từ server
  //     if (response.ok) {
  //       // Nếu xóa thành công, hiển thị thông báo và điều hướng về danh sách công thức
  //       alert(`Recipe "${recipe.name}" deleted successfully!`);
  //       router.push("/recipes"); // Điều hướng về danh sách công thức sau khi xóa
  //     } else {
  //       // Nếu có lỗi khi xóa, lấy thông báo lỗi từ phản hồi
  //       const errorBody = await response.json();
  //       console.error("Delete failed:", errorBody);
  //       alert("Failed to delete recipe.");
  //     }
  //   } catch (error) {
  //     // Xử lý lỗi khi gọi API
  //     console.error("Error while deleting recipe:", error);
  //     alert("An error occurred while deleting the recipe.");
  //   }
  // };


  const handleDeleteRecipe = async () => {
    // Hiển thị Modal xác nhận xóa với tên công thức
    Modal.confirm({
      title: (
        <span>
          {`Bạn có chắc chắn muốn xoá công thức: `}<br />
          <span
            className="text-red-500 font-bold text-lg md:text-xl lg:text-2xl xl:text-[20px] "  // Sử dụng lớp Tailwind với responsive design
          >
            {recipe.name}
          </span>
          
        </span>
      ),
      onOk: async () => {
        try {
          const response = await fetch(`/api/recipes/recipe/delete_recipe/${recipe.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
  
          if (response.ok) {
            message.success(`Recipe "${recipe.name}" deleted successfully!`);
            // router.push("/recipes"); // Điều hướng về danh sách công thức sau khi xóa
          } else {
            const errorBody = await response.json();
            console.error("Delete failed:", errorBody);
            message.error("Failed to delete recipe.");
          }
        } catch (error) {
          console.error("Error while deleting recipe:", error);
          message.error("An error occurred while deleting the recipe.");
        }
      },
      onCancel: () => {
        console.log("Delete canceled");
      },
      okText: "Delete",
      cancelText: "Cancel",
    });
  };
  


  const handleHeartClick = async () => {
    const previousState = liked;
    setLiked(!liked); // Cập nhật trạng thái liked

    try {
      await sendLikeToServer(!previousState); // Gửi yêu cầu thích hoặc bỏ thích
    } catch (error) {
      console.error("Error during like action:", error);
      setLiked(previousState); // Khôi phục trạng thái trước khi có lỗi
    }
  };

  return (
    <section
      className="bg-[#E7FAFE] lg:bg-gradient-to-b lg:from-white lg:to-[#E7FAFE] group w-[180px] lg:w-[380px] lg:h-[460px] h-[270px] px-[10px] py-[10px] lg:px-[20px] lg:py-[20px] rounded-[10px] sm:rounded-[20px] cursor-pointer flex flex-col justify-between hover:shadow-lg"
      // onClick={handleNavigate} // Gán sự kiện điều hướng
    >
      <div className="w-full h-[130px] lg:h-[230px] relative overflow-hidden rounded-[8px] sm:rounded-[15px] lg:rounded-[20px]">
        <Image
          className="w-full h-full object-cover object-center absolute inset-0 transition-transform duration-500 ease-in-out transform group-hover:scale-110"
          src={recipe?.media || "/images/default_image.png"}
          alt={recipe?.name}
          width={180}
          height={130}
          onClick={handleNavigate}
        />
        <div className="absolute z-10 w-[40px] h-[40px] lg:w-[60px] lg:h-[60px] right-0 flex justify-center items-center">
          {/* <div className="bg-white w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] rounded-full flex gap-1 justify-center items-center">
            <FaHeart className="text-[#DBE2E5] text-[17px] lg:text-[22px]" />
          </div> */}
          <div
            className="bg-white w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] rounded-full flex gap-1 justify-center items-center cursor-pointer"
            onClick={handleHeartClick} // Gán sự kiện click
          >
            {/* Áp dụng màu đỏ nếu đã được click, màu xám nếu chưa */}
            <FaHeart
              className={`${
                liked ? "text-red-500" : "text-[#DBE2E5]"
              } text-[17px] lg:text-[22px]`}
            />
          </div>
        </div>
      </div>
      <p
        className="font-Inter font-[600] text-[16px] lg:text-[25px] line-clamp-2 truncate whitespace-normal text-clip overflow-hidden"
        style={{ lineHeight: "1.4" }}
      >
        {recipe?.name}
      </p>

      <div className=" flex  lg:gap-[25px]">
        <div className=" w-[50%] lg:w-[30%] gap-1 py-[5px] lg:gap-2 lg:py-[7px] flex  items-center rounded-full">
          <Image
            className="lg:w-[25px] lg:h-[25px]"
            src="/icon/Timer.svg"
            alt="Timer"
            width={16}
            height={16}
          />
          <p
            className="text-[12px] lg:text-[15px]"
            style={{ color: "rgba(0, 0, 0, 60%)" }}
          >
            {formatCookTime(recipe?.cookTime)}
          </p>
        </div>

        <div className=" w-[50%] lg:w-[70%] gap-1 py-[5px] lg:gap-2 lg:py-[7px] flex  items-center rounded-full">
          <Image
            className="lg:w-[25px] lg:h-[25px]"
            src="/icon/ForkKnife.svg"
            alt="ForkKnife"
            width={16}
            height={16}
          />
          <p
            className="text-[12px] lg:text-[15px] line-clamp-1 truncate whitespace-normal text-clip overflow-hidden"
            style={{ color: "rgba(0, 0, 0, 60%)" }}
          >
            {recipe?.hashtags.map((hashtag, index) => (
              <span key={hashtag.label} className="px-[3px]">
                <span className="underline ">{hashtag.label}</span>
                {/* Kiểm tra nếu không phải phần tử cuối cùng thì thêm dấu phẩy */}
                {index < recipe?.hashtags.length - 1 && (
                  <span className="text-red-500">{","}</span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Buttons Section */}
        <div className="flex gap-4 justify-between mt-2">
            
            <button
            className="bg-[#6FCFE2] w-[50%] text-white text-sm lg:text-base py-1 px-3 rounded hover:bg-[#3FACC1] transition"
            onClick={NavigateEditRecipe}
            >
            Edit
            </button>
            <button
            className=" text-[#FF6666] w-[50%] text-sm lg:text-base py-1 px-3 rounded hover:bg-[#FF6666] hover:text-white border border-[#FF6666] transition"
            
            onClick={handleDeleteRecipe}
            >
            Delete
            </button>
        </div>
    </section>
  );
};

export default Recipes_5;
