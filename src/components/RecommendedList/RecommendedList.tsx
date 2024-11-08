import Recipes_2 from "../Recipes/Recipes_2";

const RecommendedList = () => {
  return (
    <>
      <div className=" flex flex-col mt-[80px] lg:mt-[100px] xl:mt-[180px] gap-[30px] lg:gap-[50px] xl:gap-[90px]">
        <div className="  px-[10px] xl:px-0 font-Inter flex flex-col xl:flex-row justify-center items-center  gap-[20px] lg:gap-[30px] xl:gap-[50px]">
          <p className="text-center xl:text-left text-[25px] lg:text-[30px] xl:text-[50px] w-[100%] font-[600] " style={{ lineHeight: "1.2" }}>
            Try this delicious recipe to make your day
          </p>
          <p style={{ color: "rgba(0, 0, 0, 60%)" }} className="text-center xl:text-left text-[14px] lg:text-[15px] xl:text-[16px] w-[100%] font-[300]">
            Try this delicious recipe to make your day. Whether you are cooking
            for yourself, your family, or friends, this dish is sure to bring
            joy and satisfaction to everyone at the table.
          </p>
        </div>
        <div className=" w-full h-fit flex flex-wrap gap-[10px] lg:gap-[30px] xl:gap-[40px] justify-center  items-center">
          <Recipes_2></Recipes_2>
          <Recipes_2></Recipes_2>
          <Recipes_2></Recipes_2>
          <Recipes_2></Recipes_2>
          <Recipes_2></Recipes_2>
          <Recipes_2></Recipes_2>
          <Recipes_2></Recipes_2>
          <Recipes_2></Recipes_2>
          <Recipes_2></Recipes_2>
          <Recipes_2></Recipes_2>
        </div>
      </div>
    </>
  );
};

export default RecommendedList;
